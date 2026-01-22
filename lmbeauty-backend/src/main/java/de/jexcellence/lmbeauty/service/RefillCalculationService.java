package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.database.repository.AppointmentRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRefillRepository;
import de.jexcellence.lmbeauty.dto.refill.RefillEligibilityResponse;
import de.jexcellence.lmbeauty.dto.refill.RefillOptionDto;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service for calculating refill eligibility based on customer appointment history.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RefillCalculationService {

    private final AppointmentRepository appointmentRepository;
    private final TreatmentRefillRepository treatmentRefillRepository;
    private final TreatmentService treatmentService;

    private static final Set<EAppointmentStatus> COMPLETED_STATUSES = Set.of(EAppointmentStatus.COMPLETED);

    /**
     * Calculate refill eligibility for a customer and treatment.
     */
    public RefillEligibilityResponse calculateRefillEligibility(Long customerId, Long treatmentId) {
        log.debug("Calculating refill eligibility for customer {} and treatment {}", customerId, treatmentId);

        // Get treatment to check if it supports refills
        Treatment treatment = treatmentService.findById(treatmentId);
        if (!treatment.supportsRefills()) {
            log.debug("Treatment {} does not support refills", treatmentId);
            return RefillEligibilityResponse.builder()
                    .isEligible(false)
                    .message("Diese Behandlung unterstützt keine Refills")
                    .build();
        }

        // Find last completed appointment for this treatment type
        Optional<Appointment> lastAppointment = findLastCompletedAppointmentForTreatment(customerId, treatmentId);
        
        if (lastAppointment.isEmpty()) {
            log.debug("No completed appointments found for customer {} and treatment {}", customerId, treatmentId);
            return RefillEligibilityResponse.noHistory();
        }

        // Calculate weeks since last appointment
        LocalDateTime lastAppointmentDate = lastAppointment.get().getCompletedAt() != null 
            ? lastAppointment.get().getCompletedAt()
            : lastAppointment.get().getScheduledAt();
            
        long weeksSince = ChronoUnit.WEEKS.between(lastAppointmentDate.toLocalDate(), LocalDateTime.now().toLocalDate());
        int weeksSinceInt = Math.toIntExact(weeksSince);

        log.debug("Last appointment was {} weeks ago", weeksSinceInt);

        // Get available refill options for this timeframe
        List<TreatmentRefill> applicableRefills = treatmentRefillRepository
                .findApplicableRefillsForWeeks(treatmentId, weeksSinceInt);

        if (applicableRefills.isEmpty()) {
            log.debug("No applicable refills found for {} weeks", weeksSinceInt);
            return RefillEligibilityResponse.noEligibleRefills(weeksSinceInt, lastAppointmentDate);
        }

        // Convert to DTOs
        List<RefillOptionDto> refillOptions = applicableRefills.stream()
                .map(RefillOptionDto::fromEntity)
                .toList();

        // Find recommended option (best/lowest threshold)
        Optional<TreatmentRefill> bestRefill = treatmentRefillRepository
                .findBestRefillForWeeks(treatmentId, weeksSinceInt);
        
        RefillOptionDto recommendedOption = bestRefill
                .map(refill -> RefillOptionDto.fromEntity(refill, true))
                .orElse(null);

        log.debug("Found {} applicable refill options, recommended: {}", 
                 refillOptions.size(), recommendedOption != null ? recommendedOption.getDescription() : "none");

        return RefillEligibilityResponse.eligible(weeksSinceInt, refillOptions, recommendedOption, lastAppointmentDate);
    }

    /**
     * Calculate refill eligibility for a customer and treatment category.
     * Useful when customer wants to book any treatment in a category.
     */
    public RefillEligibilityResponse calculateRefillEligibilityForCategory(Long customerId, String treatmentCategory) {
        log.debug("Calculating refill eligibility for customer {} and category {}", customerId, treatmentCategory);

        // Find last completed appointment for any treatment in this category
        Optional<Appointment> lastAppointment = findLastCompletedAppointmentForCategory(customerId, treatmentCategory);
        
        if (lastAppointment.isEmpty()) {
            return RefillEligibilityResponse.noHistory();
        }

        // Use the specific treatment from the last appointment
        return calculateRefillEligibility(customerId, lastAppointment.get().getTreatment().getId());
    }

    /**
     * Check if a customer is eligible for any refill in a given timeframe.
     */
    public boolean isEligibleForRefill(Long customerId, Long treatmentId, int maxWeeks) {
        RefillEligibilityResponse eligibility = calculateRefillEligibility(customerId, treatmentId);
        
        return eligibility.isEligible() && 
               eligibility.getWeeksSinceLastAppointment() != null &&
               eligibility.getWeeksSinceLastAppointment() <= maxWeeks;
    }

    /**
     * Get the best refill option for a customer and treatment.
     */
    public Optional<RefillOptionDto> getBestRefillOption(Long customerId, Long treatmentId) {
        RefillEligibilityResponse eligibility = calculateRefillEligibility(customerId, treatmentId);
        return Optional.ofNullable(eligibility.getRecommendedOption());
    }

    /**
     * Find the last completed appointment for a specific treatment.
     */
    private Optional<Appointment> findLastCompletedAppointmentForTreatment(Long customerId, Long treatmentId) {
        return appointmentRepository.findByCustomerIdAndStatusIn(customerId, COMPLETED_STATUSES)
                .stream()
                .filter(appointment -> appointment.getTreatment().getId().equals(treatmentId))
                .findFirst(); // Already sorted by scheduledAt desc
    }

    /**
     * Find the last completed appointment for any treatment in a category.
     */
    private Optional<Appointment> findLastCompletedAppointmentForCategory(Long customerId, String treatmentCategory) {
        return appointmentRepository.findByCustomerIdAndStatusIn(customerId, COMPLETED_STATUSES)
                .stream()
                .filter(appointment -> appointment.getTreatment().getCategory().name().equalsIgnoreCase(treatmentCategory))
                .findFirst(); // Already sorted by scheduledAt desc
    }

    /**
     * Calculate weeks between two dates.
     */
    private int calculateWeeksBetween(LocalDateTime from, LocalDateTime to) {
        long weeks = ChronoUnit.WEEKS.between(from.toLocalDate(), to.toLocalDate());
        return Math.toIntExact(weeks);
    }

    /**
     * Get all available refill options for a treatment (regardless of customer history).
     */
    public List<RefillOptionDto> getAllRefillOptionsForTreatment(Long treatmentId) {
        List<TreatmentRefill> refills = treatmentRefillRepository.findByTreatmentIdAndActiveTrue(treatmentId);
        return refills.stream()
                .map(RefillOptionDto::fromEntity)
                .toList();
    }

    /**
     * Check if a treatment supports refills.
     */
    public boolean treatmentSupportsRefills(Long treatmentId) {
        Treatment treatment = treatmentService.findById(treatmentId);
        return treatment.supportsRefills();
    }
}
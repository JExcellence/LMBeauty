package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.config.BookingProperties;
import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.AppointmentRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRepository;
import de.jexcellence.lmbeauty.database.repository.UserRepository;
import de.jexcellence.lmbeauty.dto.booking.AppointmentActionRequest;
import de.jexcellence.lmbeauty.dto.booking.AppointmentResponse;
import de.jexcellence.lmbeauty.dto.booking.BookAppointmentRequest;
import de.jexcellence.lmbeauty.dto.booking.TreatmentHistoryResponse;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private static final Set<EAppointmentStatus> BLOCKING_STATUSES = Set.of(
        EAppointmentStatus.PENDING,
        EAppointmentStatus.CONFIRMED
    );

    private final AppointmentRepository appointmentRepository;
    private final TreatmentRepository treatmentRepository;
    private final UserRepository userRepository;
    private final TimeSlotService timeSlotService;
    private final LoyaltyService loyaltyService;
    private final BookingProperties bookingProperties;

    @Transactional
    public AppointmentResponse bookAppointment(Long customerId, BookAppointmentRequest request) {
        User customer = userRepository.findById(customerId);
        if (customer == null) {
            throw new IllegalArgumentException("Customer not found");
        }

        Treatment treatment = treatmentRepository.findById(request.treatmentId());
        if (treatment == null || !treatment.isActive()) {
            throw new IllegalArgumentException("Treatment not found or inactive");
        }

        // Validate slot is available
        var slotsResponse = timeSlotService.getAvailableSlots(
            request.treatmentId(), request.scheduledAt().toLocalDate());
        boolean slotAvailable = slotsResponse.slots().stream()
            .anyMatch(s -> s.startTime().equals(request.scheduledAt()) && s.available());

        if (!slotAvailable) {
            throw new IllegalStateException("Selected time slot is not available");
        }

        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setTreatment(treatment);
        appointment.setScheduledAt(request.scheduledAt());
        appointment.setDurationMinutes(treatment.getDurationMinutes());
        appointment.setStatus(EAppointmentStatus.PENDING);
        appointment.setCustomerNotes(request.customerNotes());

        Appointment saved = appointmentRepository.create(appointment);
        return toAppointmentResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getCustomerAppointments(Long customerId) {
        return appointmentRepository.findByCustomerIdOrderByScheduledAtDesc(customerId).stream()
            .map(this::toAppointmentResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public TreatmentHistoryResponse getCustomerHistory(Long customerId) {
        var completedStatuses = Set.of(EAppointmentStatus.COMPLETED);
        var allAppointments = appointmentRepository.findByCustomerIdOrderByScheduledAtDesc(customerId);
        var completedAppointments = appointmentRepository.findByCustomerIdAndStatusIn(customerId, completedStatuses);

        return new TreatmentHistoryResponse(
            allAppointments.size(),
            completedAppointments.size(),
            allAppointments.stream().map(this::toAppointmentResponse).toList()
        );
    }

    @Transactional
    public void cancelAppointment(Long appointmentId, Long customerId) {
        Appointment appointment = appointmentRepository.findById(appointmentId);
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment not found");
        }

        if (!appointment.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("Not authorized to cancel this appointment");
        }

        if (appointment.getStatus() != EAppointmentStatus.PENDING && 
            appointment.getStatus() != EAppointmentStatus.CONFIRMED) {
            throw new IllegalStateException("Cannot cancel appointment with status: " + appointment.getStatus());
        }

        // Check cancellation deadline
        if (appointment.getScheduledAt().minusHours(bookingProperties.getCancellationDeadlineHours()).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cancellation deadline has passed");
        }

        appointment.setStatus(EAppointmentStatus.CANCELLED);
        appointment.setCancelledAt(LocalDateTime.now());
        appointmentRepository.update(appointment);
    }

    // Owner methods

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll(0, Integer.MAX_VALUE).stream()
            .map(this::toAppointmentResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPendingAppointments() {
        return appointmentRepository.findByStatusOrderByScheduledAtAsc(EAppointmentStatus.PENDING).stream()
            .map(this::toAppointmentResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getSchedule(LocalDateTime from, LocalDateTime to) {
        return appointmentRepository.findByScheduledAtBetweenAndStatusIn(from, to, BLOCKING_STATUSES).stream()
            .map(this::toAppointmentResponse)
            .toList();
    }

    @Transactional
    public AppointmentResponse confirmAppointment(Long appointmentId, AppointmentActionRequest request) {
        Appointment appointment = getAppointmentOrThrow(appointmentId);
        validateStatusTransition(appointment.getStatus(), EAppointmentStatus.CONFIRMED);

        appointment.setStatus(EAppointmentStatus.CONFIRMED);
        appointment.setConfirmedAt(LocalDateTime.now());
        if (request != null && request.ownerNotes() != null) {
            appointment.setOwnerNotes(request.ownerNotes());
        }

        return toAppointmentResponse(appointmentRepository.update(appointment));
    }

    @Transactional
    public AppointmentResponse rejectAppointment(Long appointmentId, AppointmentActionRequest request) {
        Appointment appointment = getAppointmentOrThrow(appointmentId);
        validateStatusTransition(appointment.getStatus(), EAppointmentStatus.REJECTED);

        appointment.setStatus(EAppointmentStatus.REJECTED);
        if (request != null) {
            appointment.setRejectionReason(request.reason());
            appointment.setOwnerNotes(request.ownerNotes());
        }

        return toAppointmentResponse(appointmentRepository.update(appointment));
    }

    @Transactional
    public AppointmentResponse completeAppointment(Long appointmentId, AppointmentActionRequest request) {
        Appointment appointment = getAppointmentOrThrow(appointmentId);
        validateStatusTransition(appointment.getStatus(), EAppointmentStatus.COMPLETED);

        appointment.setStatus(EAppointmentStatus.COMPLETED);
        appointment.setCompletedAt(LocalDateTime.now());
        if (request != null && request.ownerNotes() != null) {
            appointment.setOwnerNotes(request.ownerNotes());
        }

        Appointment updated = appointmentRepository.update(appointment);

        // Automatically add loyalty stamp on completion
        try {
            loyaltyService.addStamp(appointmentId);
            log.info("Loyalty stamp added for appointment {}", appointmentId);
        } catch (Exception e) {
            log.warn("Failed to add loyalty stamp for appointment {}: {}", appointmentId, e.getMessage());
        }

        return toAppointmentResponse(updated);
    }

    @Transactional
    public AppointmentResponse markNoShow(Long appointmentId, AppointmentActionRequest request) {
        Appointment appointment = getAppointmentOrThrow(appointmentId);
        validateStatusTransition(appointment.getStatus(), EAppointmentStatus.NO_SHOW);

        appointment.setStatus(EAppointmentStatus.NO_SHOW);
        if (request != null && request.ownerNotes() != null) {
            appointment.setOwnerNotes(request.ownerNotes());
        }

        return toAppointmentResponse(appointmentRepository.update(appointment));
    }

    private Appointment getAppointmentOrThrow(Long id) {
        Appointment appointment = appointmentRepository.findById(id);
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment not found");
        }
        return appointment;
    }

    private void validateStatusTransition(EAppointmentStatus from, EAppointmentStatus to) {
        boolean valid = switch (to) {
            case CONFIRMED -> from == EAppointmentStatus.PENDING;
            case REJECTED -> from == EAppointmentStatus.PENDING;
            case CANCELLED -> from == EAppointmentStatus.PENDING || from == EAppointmentStatus.CONFIRMED;
            case COMPLETED -> from == EAppointmentStatus.CONFIRMED;
            case NO_SHOW -> from == EAppointmentStatus.CONFIRMED;
            default -> false;
        };

        if (!valid) {
            throw new IllegalStateException("Invalid status transition from " + from + " to " + to);
        }
    }

    /**
     * Converts an Appointment to AppointmentResponse, safely accessing all required data.
     * This avoids LazyInitializationException by directly building the response from entity data.
     */
    private AppointmentResponse toAppointmentResponse(Appointment appointment) {
        // Build CustomerSummary directly from the customer entity
        User customer = appointment.getCustomer();
        String customerFullName = buildFullName(customer.getFirstName(), customer.getLastName());
        de.jexcellence.lmbeauty.dto.booking.CustomerSummary customerSummary = new de.jexcellence.lmbeauty.dto.booking.CustomerSummary(
            customer.getId(),
            customerFullName,
            customer.getEmail(),
            customer.getPhone(),
            0,
            0,
            null,
            0
        );

        // Build TreatmentResponse directly from the treatment entity
        Treatment treatment = appointment.getTreatment();
        de.jexcellence.lmbeauty.dto.booking.TreatmentResponse treatmentResponse = new de.jexcellence.lmbeauty.dto.booking.TreatmentResponse(
            treatment.getId(),
            treatment.getName(),
            treatment.getSlug(),
            treatment.getDescription(),
            treatment.getCategory(),
            treatment.getDurationMinutes(),
            treatment.getPrice(),
            treatment.getImageUrl(),
            treatment.isActive(),
            treatment.getSortOrder(),
            treatment.getVersionNumber()
        );

        return new AppointmentResponse(
            appointment.getId(),
            customerSummary,
            treatmentResponse,
            appointment.getScheduledAt(),
            appointment.getDurationMinutes(),
            appointment.getStatus(),
            appointment.getCustomerNotes(),
            appointment.getOwnerNotes(),
            appointment.getRejectionReason(),
            appointment.getConfirmedAt(),
            appointment.getCancelledAt(),
            appointment.getCompletedAt(),
            appointment.getCreatedAt()
        );
    }

    private String buildFullName(String firstName, String lastName) {
        if (firstName == null && lastName == null) return null;
        if (firstName == null) return lastName;
        if (lastName == null) return firstName;
        return firstName + " " + lastName;
    }
}

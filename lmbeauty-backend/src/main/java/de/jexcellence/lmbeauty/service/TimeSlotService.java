package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.config.BookingProperties;
import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.database.entity.BlockedPeriod;
import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.WeeklyAvailability;
import de.jexcellence.lmbeauty.database.repository.AppointmentRepository;
import de.jexcellence.lmbeauty.database.repository.BlockedPeriodRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRepository;
import de.jexcellence.lmbeauty.database.repository.WeeklyAvailabilityRepository;
import de.jexcellence.lmbeauty.dto.booking.AvailableSlotsResponse;
import de.jexcellence.lmbeauty.dto.booking.TimeSlotResponse;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private static final Set<EAppointmentStatus> BLOCKING_STATUSES = Set.of(
        EAppointmentStatus.PENDING,
        EAppointmentStatus.CONFIRMED
    );

    private final TreatmentRepository treatmentRepository;
    private final WeeklyAvailabilityRepository weeklyAvailabilityRepository;
    private final BlockedPeriodRepository blockedPeriodRepository;
    private final AppointmentRepository appointmentRepository;
    private final BookingProperties bookingProperties;

    @Transactional(readOnly = true)
    public AvailableSlotsResponse getAvailableSlots(Long treatmentId, LocalDate date) {
        Treatment treatment = treatmentRepository.findById(treatmentId);
        if (treatment == null || !treatment.isActive()) {
            throw new IllegalArgumentException("Treatment not found or inactive");
        }

        List<TimeSlotResponse> slots = calculateAvailableSlots(treatment, date);
        return new AvailableSlotsResponse(date, treatmentId, slots);
    }

    @Transactional(readOnly = true)
    public List<AvailableSlotsResponse> getAvailableSlotsRange(Long treatmentId, LocalDate from, LocalDate to) {
        Treatment treatment = treatmentRepository.findById(treatmentId);
        if (treatment == null || !treatment.isActive()) {
            throw new IllegalArgumentException("Treatment not found or inactive");
        }

        List<AvailableSlotsResponse> result = new ArrayList<>();
        LocalDate current = from;
        while (!current.isAfter(to)) {
            List<TimeSlotResponse> slots = calculateAvailableSlots(treatment, current);
            result.add(new AvailableSlotsResponse(current, treatmentId, slots));
            current = current.plusDays(1);
        }
        return result;
    }

    private List<TimeSlotResponse> calculateAvailableSlots(Treatment treatment, LocalDate date) {
        List<TimeSlotResponse> slots = new ArrayList<>();
        int durationMinutes = treatment.getDurationMinutes();

        // Get availability windows for this day of week
        List<WeeklyAvailability> availabilities = weeklyAvailabilityRepository
            .findByDayOfWeekAndActiveTrue(date.getDayOfWeek());

        if (availabilities.isEmpty()) {
            return slots;
        }

        // Get blocked periods for this date
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
        List<BlockedPeriod> blockedPeriods = blockedPeriodRepository.findOverlapping(dayStart, dayEnd);

        // Get existing appointments for this date
        List<Appointment> existingAppointments = appointmentRepository
            .findByScheduledAtBetweenAndStatusIn(dayStart, dayEnd, BLOCKING_STATUSES);

        // Generate slots for each availability window
        for (WeeklyAvailability availability : availabilities) {
            LocalTime slotStart = availability.getStartTime();
            LocalTime windowEnd = availability.getEndTime();

            while (slotStart.plusMinutes(durationMinutes).compareTo(windowEnd) <= 0) {
                LocalDateTime slotStartDateTime = date.atTime(slotStart);
                LocalDateTime slotEndDateTime = slotStartDateTime.plusMinutes(durationMinutes);

                boolean available = isSlotAvailable(slotStartDateTime, slotEndDateTime, 
                    blockedPeriods, existingAppointments);

                slots.add(new TimeSlotResponse(slotStartDateTime, slotEndDateTime, available));
                slotStart = slotStart.plusMinutes(bookingProperties.getSlotIncrementMinutes());
            }
        }

        return slots;
    }

    private boolean isSlotAvailable(LocalDateTime slotStart, LocalDateTime slotEnd,
                                    List<BlockedPeriod> blockedPeriods,
                                    List<Appointment> existingAppointments) {
        // Check if slot is in the past
        if (slotStart.isBefore(LocalDateTime.now())) {
            return false;
        }

        // Check blocked periods
        for (BlockedPeriod bp : blockedPeriods) {
            if (slotStart.isBefore(bp.getEndDateTime()) && slotEnd.isAfter(bp.getStartDateTime())) {
                return false;
            }
        }

        // Check existing appointments
        for (Appointment apt : existingAppointments) {
            LocalDateTime aptEnd = apt.getScheduledAt().plusMinutes(apt.getDurationMinutes());
            if (slotStart.isBefore(aptEnd) && slotEnd.isAfter(apt.getScheduledAt())) {
                return false;
            }
        }

        return true;
    }
}

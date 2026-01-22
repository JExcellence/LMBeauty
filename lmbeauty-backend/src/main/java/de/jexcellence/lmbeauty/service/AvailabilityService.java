package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.database.entity.BlockedPeriod;
import de.jexcellence.lmbeauty.database.entity.SpecificDateAvailability;
import de.jexcellence.lmbeauty.database.entity.WeeklyAvailability;
import de.jexcellence.lmbeauty.database.repository.BlockedPeriodRepository;
import de.jexcellence.lmbeauty.database.repository.SpecificDateAvailabilityRepository;
import de.jexcellence.lmbeauty.database.repository.WeeklyAvailabilityRepository;
import de.jexcellence.lmbeauty.dto.booking.BlockedPeriodRequest;
import de.jexcellence.lmbeauty.dto.booking.SpecificDateAvailabilityRequest;
import de.jexcellence.lmbeauty.dto.booking.WeeklyAvailabilityRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final WeeklyAvailabilityRepository weeklyAvailabilityRepository;
    private final SpecificDateAvailabilityRepository specificDateAvailabilityRepository;
    private final BlockedPeriodRepository blockedPeriodRepository;

    // Weekly Availability Methods

    @Transactional(readOnly = true)
    public List<WeeklyAvailability> getAllWeeklyAvailability() {
        return weeklyAvailabilityRepository.findAll(0, Integer.MAX_VALUE);
    }

    @Transactional(readOnly = true)
    public List<WeeklyAvailability> getActiveWeeklyAvailability() {
        return weeklyAvailabilityRepository.findByActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<WeeklyAvailability> getAvailabilityForDay(DayOfWeek dayOfWeek) {
        return weeklyAvailabilityRepository.findByDayOfWeekAndActiveTrue(dayOfWeek);
    }

    @Transactional
    public WeeklyAvailability createWeeklyAvailability(WeeklyAvailabilityRequest request) {
        validateNoOverlap(request.dayOfWeek(), request.startTime(), request.endTime(), null);

        WeeklyAvailability availability = new WeeklyAvailability();
        availability.setDayOfWeek(request.dayOfWeek());
        availability.setStartTime(request.startTime());
        availability.setEndTime(request.endTime());
        availability.setActive(request.active() != null ? request.active() : true);

        return weeklyAvailabilityRepository.create(availability);
    }

    @Transactional
    public List<WeeklyAvailability> replaceAvailabilityForDay(DayOfWeek dayOfWeek, List<WeeklyAvailabilityRequest> requests) {
        // Delete all existing availability for this day
        List<WeeklyAvailability> existing = weeklyAvailabilityRepository.findByDayOfWeek(dayOfWeek);
        for (WeeklyAvailability wa : existing) {
            weeklyAvailabilityRepository.delete(wa.getId());
        }

        // Validate no overlaps within the new requests
        for (int i = 0; i < requests.size(); i++) {
            WeeklyAvailabilityRequest req1 = requests.get(i);
            for (int j = i + 1; j < requests.size(); j++) {
                WeeklyAvailabilityRequest req2 = requests.get(j);
                if (req1.startTime().isBefore(req2.endTime()) && req1.endTime().isAfter(req2.startTime())) {
                    throw new IllegalArgumentException("Time slots overlap with each other");
                }
            }
        }

        // Create new availability slots
        return requests.stream()
            .map(request -> {
                WeeklyAvailability availability = new WeeklyAvailability();
                availability.setDayOfWeek(dayOfWeek);
                availability.setStartTime(request.startTime());
                availability.setEndTime(request.endTime());
                availability.setActive(request.active() != null ? request.active() : true);
                return weeklyAvailabilityRepository.create(availability);
            })
            .toList();
    }

    @Transactional
    public WeeklyAvailability updateWeeklyAvailability(Long id, WeeklyAvailabilityRequest request) {
        WeeklyAvailability availability = weeklyAvailabilityRepository.findById(id);
        if (availability == null) {
            throw new IllegalArgumentException("Weekly availability not found with ID: " + id);
        }

        DayOfWeek dayOfWeek = request.dayOfWeek() != null ? request.dayOfWeek() : availability.getDayOfWeek();
        var startTime = request.startTime() != null ? request.startTime() : availability.getStartTime();
        var endTime = request.endTime() != null ? request.endTime() : availability.getEndTime();

        validateNoOverlap(dayOfWeek, startTime, endTime, id);

        availability.setDayOfWeek(dayOfWeek);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        if (request.active() != null) availability.setActive(request.active());

        return weeklyAvailabilityRepository.update(availability);
    }

    @Transactional
    public void deleteWeeklyAvailability(Long id) {
        WeeklyAvailability availability = weeklyAvailabilityRepository.findById(id);
        if (availability == null) {
            throw new IllegalArgumentException("Weekly availability not found with ID: " + id);
        }
        weeklyAvailabilityRepository.delete(id);
    }

    private void validateNoOverlap(DayOfWeek dayOfWeek, java.time.LocalTime startTime, 
                                   java.time.LocalTime endTime, Long excludeId) {
        List<WeeklyAvailability> existing = weeklyAvailabilityRepository.findByDayOfWeekAndActiveTrue(dayOfWeek);
        for (WeeklyAvailability wa : existing) {
            if (excludeId != null && wa.getId().equals(excludeId)) continue;
            if (startTime.isBefore(wa.getEndTime()) && endTime.isAfter(wa.getStartTime())) {
                throw new IllegalArgumentException("Availability window overlaps with existing window");
            }
        }
    }

    // Blocked Period Methods

    @Transactional(readOnly = true)
    public List<BlockedPeriod> getAllBlockedPeriods() {
        return blockedPeriodRepository.findAll(0, Integer.MAX_VALUE);
    }

    @Transactional(readOnly = true)
    public List<BlockedPeriod> getBlockedPeriodsInRange(LocalDateTime start, LocalDateTime end) {
        return blockedPeriodRepository.findOverlapping(start, end);
    }

    @Transactional
    public BlockedPeriod createBlockedPeriod(BlockedPeriodRequest request) {
        BlockedPeriod blockedPeriod = new BlockedPeriod();
        blockedPeriod.setStartDateTime(request.startDateTime());
        blockedPeriod.setEndDateTime(request.endDateTime());
        blockedPeriod.setReason(request.reason());

        return blockedPeriodRepository.create(blockedPeriod);
    }

    @Transactional
    public void deleteBlockedPeriod(Long id) {
        BlockedPeriod blockedPeriod = blockedPeriodRepository.findById(id);
        if (blockedPeriod == null) {
            throw new IllegalArgumentException("Blocked period not found with ID: " + id);
        }
        blockedPeriodRepository.delete(id);
    }

    // Specific Date Availability Methods

    @Transactional(readOnly = true)
    public List<SpecificDateAvailability> getAllSpecificDateAvailability() {
        return specificDateAvailabilityRepository.findAll(0, Integer.MAX_VALUE);
    }

    @Transactional(readOnly = true)
    public List<SpecificDateAvailability> getSpecificDateAvailability(LocalDate date) {
        return specificDateAvailabilityRepository.findByDateAndActiveTrue(date);
    }

    @Transactional
    public List<SpecificDateAvailability> replaceAvailabilityForDate(LocalDate date, List<SpecificDateAvailabilityRequest> requests) {
        // Delete all existing availability for this date
        List<SpecificDateAvailability> existing = specificDateAvailabilityRepository.findByDate(date);
        for (SpecificDateAvailability sda : existing) {
            specificDateAvailabilityRepository.delete(sda.getId());
        }

        // Validate no overlaps within the new requests
        for (int i = 0; i < requests.size(); i++) {
            SpecificDateAvailabilityRequest req1 = requests.get(i);
            for (int j = i + 1; j < requests.size(); j++) {
                SpecificDateAvailabilityRequest req2 = requests.get(j);
                if (req1.startTime().isBefore(req2.endTime()) && req1.endTime().isAfter(req2.startTime())) {
                    throw new IllegalArgumentException("Time slots overlap with each other");
                }
            }
        }

        // Create new availability slots
        return requests.stream()
            .map(request -> {
                SpecificDateAvailability availability = new SpecificDateAvailability();
                availability.setDate(date);
                availability.setStartTime(request.startTime());
                availability.setEndTime(request.endTime());
                availability.setActive(request.active() != null ? request.active() : true);
                availability.setReason(request.reason());
                return specificDateAvailabilityRepository.create(availability);
            })
            .toList();
    }

    @Transactional
    public SpecificDateAvailability createSpecificDateAvailability(SpecificDateAvailabilityRequest request) {
        validateNoOverlapForDate(request.date(), request.startTime(), request.endTime(), null);

        SpecificDateAvailability availability = new SpecificDateAvailability();
        availability.setDate(request.date());
        availability.setStartTime(request.startTime());
        availability.setEndTime(request.endTime());
        availability.setActive(request.active() != null ? request.active() : true);
        availability.setReason(request.reason());

        return specificDateAvailabilityRepository.create(availability);
    }

    @Transactional
    public SpecificDateAvailability updateSpecificDateAvailability(Long id, SpecificDateAvailabilityRequest request) {
        SpecificDateAvailability availability = specificDateAvailabilityRepository.findById(id);
        if (availability == null) {
            throw new IllegalArgumentException("Specific date availability not found with ID: " + id);
        }

        LocalDate date = request.date() != null ? request.date() : availability.getDate();
        var startTime = request.startTime() != null ? request.startTime() : availability.getStartTime();
        var endTime = request.endTime() != null ? request.endTime() : availability.getEndTime();

        validateNoOverlapForDate(date, startTime, endTime, id);

        availability.setDate(date);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        if (request.active() != null) availability.setActive(request.active());
        if (request.reason() != null) availability.setReason(request.reason());

        return specificDateAvailabilityRepository.update(availability);
    }

    @Transactional
    public void deleteSpecificDateAvailability(Long id) {
        SpecificDateAvailability availability = specificDateAvailabilityRepository.findById(id);
        if (availability == null) {
            throw new IllegalArgumentException("Specific date availability not found with ID: " + id);
        }
        specificDateAvailabilityRepository.delete(id);
    }

    private void validateNoOverlapForDate(LocalDate date, java.time.LocalTime startTime, 
                                         java.time.LocalTime endTime, Long excludeId) {
        List<SpecificDateAvailability> existing = specificDateAvailabilityRepository.findByDateAndActiveTrue(date);
        for (SpecificDateAvailability sda : existing) {
            if (excludeId != null && sda.getId().equals(excludeId)) continue;
            if (startTime.isBefore(sda.getEndTime()) && endTime.isAfter(sda.getStartTime())) {
                throw new IllegalArgumentException("Availability window overlaps with existing window for this date");
            }
        }
    }
}

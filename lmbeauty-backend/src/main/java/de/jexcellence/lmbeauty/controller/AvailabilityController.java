package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.database.entity.BlockedPeriod;
import de.jexcellence.lmbeauty.database.entity.SpecificDateAvailability;
import de.jexcellence.lmbeauty.database.entity.WeeklyAvailability;
import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.booking.BlockedPeriodRequest;
import de.jexcellence.lmbeauty.dto.booking.SpecificDateAvailabilityRequest;
import de.jexcellence.lmbeauty.dto.booking.WeeklyAvailabilityRequest;
import de.jexcellence.lmbeauty.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    // Weekly Availability Endpoints

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<List<WeeklyAvailability>>> getWeeklyAvailability() {
        List<WeeklyAvailability> availability = availabilityService.getAllWeeklyAvailability();
        return ResponseEntity.ok(ApiResponse.success(availability));
    }

    @PostMapping("/weekly")
    public ResponseEntity<ApiResponse<WeeklyAvailability>> createWeeklyAvailability(
            @Valid @RequestBody WeeklyAvailabilityRequest request) {
        WeeklyAvailability availability = availabilityService.createWeeklyAvailability(request);
        return ResponseEntity.ok(ApiResponse.success(availability));
    }

    @PutMapping("/weekly/{id}")
    public ResponseEntity<ApiResponse<WeeklyAvailability>> updateWeeklyAvailability(
            @PathVariable Long id,
            @Valid @RequestBody WeeklyAvailabilityRequest request) {
        WeeklyAvailability availability = availabilityService.updateWeeklyAvailability(id, request);
        return ResponseEntity.ok(ApiResponse.success(availability));
    }

    @DeleteMapping("/weekly/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWeeklyAvailability(@PathVariable Long id) {
        availabilityService.deleteWeeklyAvailability(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/weekly/day/{dayOfWeek}")
    public ResponseEntity<ApiResponse<List<WeeklyAvailability>>> replaceAvailabilityForDay(
            @PathVariable String dayOfWeek,
            @Valid @RequestBody List<WeeklyAvailabilityRequest> requests) {
        DayOfWeek day = DayOfWeek.valueOf(dayOfWeek.toUpperCase());
        List<WeeklyAvailability> availability = availabilityService.replaceAvailabilityForDay(day, requests);
        return ResponseEntity.ok(ApiResponse.success(availability));
    }

    // Blocked Period Endpoints

    @GetMapping("/blocked")
    public ResponseEntity<ApiResponse<List<BlockedPeriod>>> getBlockedPeriods() {
        List<BlockedPeriod> blockedPeriods = availabilityService.getAllBlockedPeriods();
        return ResponseEntity.ok(ApiResponse.success(blockedPeriods));
    }

    @PostMapping("/blocked")
    public ResponseEntity<ApiResponse<BlockedPeriod>> createBlockedPeriod(
            @Valid @RequestBody BlockedPeriodRequest request) {
        BlockedPeriod blockedPeriod = availabilityService.createBlockedPeriod(request);
        return ResponseEntity.ok(ApiResponse.success(blockedPeriod));
    }

    @DeleteMapping("/blocked/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlockedPeriod(@PathVariable Long id) {
        availabilityService.deleteBlockedPeriod(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Specific Date Availability Endpoints
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<SpecificDateAvailability>>> getSpecificDateAvailability(
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<SpecificDateAvailability> availability = availabilityService.getSpecificDateAvailability(localDate);
        return ResponseEntity.ok(ApiResponse.success(availability));
    }

    @PutMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<SpecificDateAvailability>>> updateSpecificDateAvailability(
            @PathVariable String date,
            @Valid @RequestBody Map<String, Object> request) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            
            // Extract slots from the request
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> slotsData = (List<Map<String, Object>>) request.get("slots");
            
            if (slotsData == null || slotsData.isEmpty()) {
                // If no slots provided, clear all availability for this date
                availabilityService.replaceAvailabilityForDate(localDate, List.of());
                return ResponseEntity.ok(ApiResponse.success(List.of()));
            }
            
            // Convert slots to SpecificDateAvailabilityRequest objects
            List<SpecificDateAvailabilityRequest> requests = slotsData.stream()
                .map(slot -> new SpecificDateAvailabilityRequest(
                    localDate,
                    java.time.LocalTime.parse((String) slot.get("startTime")),
                    java.time.LocalTime.parse((String) slot.get("endTime")),
                    (Boolean) slot.getOrDefault("active", true),
                    (String) slot.get("reason")
                ))
                .toList();
            
            List<SpecificDateAvailability> availability = availabilityService.replaceAvailabilityForDate(localDate, requests);
            return ResponseEntity.ok(ApiResponse.success(availability));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update specific date availability: " + e.getMessage()));
        }
    }

    @PostMapping("/date")
    public ResponseEntity<ApiResponse<SpecificDateAvailability>> createSpecificDateAvailability(
            @Valid @RequestBody SpecificDateAvailabilityRequest request) {
        SpecificDateAvailability availability = availabilityService.createSpecificDateAvailability(request);
        return ResponseEntity.ok(ApiResponse.success(availability));
    }

    @DeleteMapping("/date/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSpecificDateAvailability(@PathVariable Long id) {
        availabilityService.deleteSpecificDateAvailability(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

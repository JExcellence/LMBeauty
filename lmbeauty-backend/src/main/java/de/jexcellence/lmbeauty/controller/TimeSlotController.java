package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.booking.AvailableSlotsResponse;
import de.jexcellence.lmbeauty.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @GetMapping
    public ResponseEntity<ApiResponse<AvailableSlotsResponse>> getAvailableSlots(
            @RequestParam Long treatmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        AvailableSlotsResponse slots = timeSlotService.getAvailableSlots(treatmentId, date);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<AvailableSlotsResponse>>> getAvailableSlotsRange(
            @RequestParam Long treatmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<AvailableSlotsResponse> slots = timeSlotService.getAvailableSlotsRange(treatmentId, from, to);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }
}

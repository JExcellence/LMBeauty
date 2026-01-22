package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.booking.AppointmentActionRequest;
import de.jexcellence.lmbeauty.dto.booking.AppointmentResponse;
import de.jexcellence.lmbeauty.dto.booking.BookAppointmentRequest;
import de.jexcellence.lmbeauty.dto.booking.TreatmentHistoryResponse;
import de.jexcellence.lmbeauty.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Customer endpoints

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BookAppointmentRequest request) {
        AppointmentResponse appointment = appointmentService.bookAppointment(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getMyAppointments(
            @AuthenticationPrincipal User user) {
        List<AppointmentResponse> appointments = appointmentService.getCustomerAppointments(user.getId());
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/my/history")
    public ResponseEntity<ApiResponse<TreatmentHistoryResponse>> getMyHistory(
            @AuthenticationPrincipal User user) {
        TreatmentHistoryResponse history = appointmentService.getCustomerHistory(user.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        appointmentService.cancelAppointment(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Owner endpoints

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getPendingAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getPendingAppointments();
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/schedule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getSchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        List<AppointmentResponse> appointments = appointmentService.getSchedule(from, to);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> confirmAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) AppointmentActionRequest request) {
        AppointmentResponse appointment = appointmentService.confirmAppointment(id, request);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> rejectAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) AppointmentActionRequest request) {
        AppointmentResponse appointment = appointmentService.rejectAppointment(id, request);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> completeAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) AppointmentActionRequest request) {
        AppointmentResponse appointment = appointmentService.completeAppointment(id, request);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    @PostMapping("/{id}/no-show")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> markNoShow(
            @PathVariable Long id,
            @RequestBody(required = false) AppointmentActionRequest request) {
        AppointmentResponse appointment = appointmentService.markNoShow(id, request);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }
}

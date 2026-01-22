package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.booking.*;
import de.jexcellence.lmbeauty.service.AdminService;
import de.jexcellence.lmbeauty.service.AvailabilityService;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final AvailabilityService availabilityService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getDashboard() {
        try {
            DashboardMetricsResponse metrics = adminService.getDashboardMetrics();
            return ResponseEntity.ok(ApiResponse.success(metrics));
        } catch (Exception e) {
            log.error("Failed to fetch dashboard metrics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Fehler beim Laden der Dashboard-Daten"));
        }
    }

    @GetMapping("/appointments/today")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getTodayAppointments() {
        try {
            List<AppointmentResponse> appointments = adminService.getTodayAppointments();
            return ResponseEntity.ok(ApiResponse.success(appointments));
        } catch (Exception e) {
            log.error("Failed to fetch today's appointments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Fehler beim Laden der heutigen Termine"));
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) EAppointmentStatus status) {
        try {
            List<AppointmentResponse> appointments = adminService.getAppointmentsByDateRange(from, to, status);
            return ResponseEntity.ok(ApiResponse.success(appointments));
        } catch (Exception e) {
            log.error("Failed to fetch appointments for date range {} to {}", from, to, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Fehler beim Laden der Termine"));
        }
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<CustomerSummary>>> getCustomers(
            @RequestParam(required = false) String search) {
        try {
            List<CustomerSummary> customers = adminService.getCustomers(search);
            return ResponseEntity.ok(ApiResponse.success(customers));
        } catch (Exception e) {
            log.error("Failed to fetch customers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Fehler beim Laden der Kunden"));
        }
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<ApiResponse<CustomerProfileResponse>> getCustomerProfile(
            @PathVariable Long id) {
        try {
            CustomerProfileResponse profile = adminService.getCustomerProfile(id);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (IllegalArgumentException e) {
            log.error("Customer not found with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Kunde nicht gefunden"));
        } catch (Exception e) {
            log.error("Failed to fetch customer profile for id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Fehler beim Laden der Kundendaten"));
        }
    }

    @PostMapping("/availability/block")
    public ResponseEntity<ApiResponse<de.jexcellence.lmbeauty.database.entity.BlockedPeriod>> blockTime(
            @Valid @RequestBody BlockedPeriodRequest request) {
        try {
            var blockedPeriod = availabilityService.createBlockedPeriod(request);
            return ResponseEntity.ok(ApiResponse.success(blockedPeriod));
        } catch (Exception e) {
            log.error("Failed to block time period", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Fehler beim Blockieren des Zeitraums"));
        }
    }

    @DeleteMapping("/availability/block/{id}")
    public ResponseEntity<ApiResponse<Void>> unblockTime(@PathVariable Long id) {
        try {
            availabilityService.deleteBlockedPeriod(id);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (Exception e) {
            log.error("Failed to unblock time period with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Fehler beim Freigeben des Zeitraums"));
        }
    }
}

package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.booking.LoyaltyStampResponse;
import de.jexcellence.lmbeauty.dto.booking.LoyaltyStatusResponse;
import de.jexcellence.lmbeauty.service.LoyaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<LoyaltyStatusResponse>> getMyLoyaltyStatus(
            @AuthenticationPrincipal User user) {
        LoyaltyStatusResponse status = loyaltyService.getLoyaltyStatus(user.getId());
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<LoyaltyStampResponse>>> getMyLoyaltyHistory(
            @AuthenticationPrincipal User user) {
        List<LoyaltyStampResponse> history = loyaltyService.getLoyaltyHistory(user.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @PostMapping("/redeem")
    public ResponseEntity<ApiResponse<LoyaltyStatusResponse>> redeemReward(
            @AuthenticationPrincipal User user) {
        LoyaltyStatusResponse status = loyaltyService.redeemReward(user.getId());
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    // Admin endpoints

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LoyaltyStatusResponse>> getUserLoyaltyStatus(
            @PathVariable Long userId) {
        LoyaltyStatusResponse status = loyaltyService.getLoyaltyStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    @GetMapping("/user/{userId}/history")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LoyaltyStampResponse>>> getUserLoyaltyHistory(
            @PathVariable Long userId) {
        List<LoyaltyStampResponse> history = loyaltyService.getLoyaltyHistory(userId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @PostMapping("/stamp/{appointmentId}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LoyaltyStampResponse>> addStamp(
            @PathVariable Long appointmentId) {
        LoyaltyStampResponse stamp = loyaltyService.addStamp(appointmentId);
        return ResponseEntity.ok(ApiResponse.success(stamp));
    }
}

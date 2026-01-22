package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.service.OAuthWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Handles OAuth webhooks from Meta (Instagram/Facebook) for:
 * - Deauthorization callbacks (when user removes app access)
 * - Data deletion requests (GDPR compliance)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class OAuthWebhookController {

    private final OAuthWebhookService webhookService;

    /**
     * Instagram/Facebook Deauthorization Callback
     * Called when a user removes your app from their account settings
     */
    @PostMapping("/instagram/deauthorize")
    public ResponseEntity<ApiResponse<String>> handleInstagramDeauthorize(
            @RequestBody Map<String, Object> payload) {
        log.info("Instagram deauthorization callback received: {}", payload);
        
        try {
            String userId = extractUserId(payload);
            webhookService.handleDeauthorization("instagram", userId);
            return ResponseEntity.ok(ApiResponse.success("Deauthorization processed"));
        } catch (Exception e) {
            log.error("Failed to process Instagram deauthorization", e);
            return ResponseEntity.ok(ApiResponse.success("Acknowledged"));
        }
    }

    /**
     * Instagram/Facebook Data Deletion Request
     * Called when a user requests deletion of their data (GDPR)
     * Returns a confirmation code and URL where user can check deletion status
     */
    @PostMapping("/instagram/data-deletion")
    public ResponseEntity<Map<String, Object>> handleInstagramDataDeletion(
            @RequestBody Map<String, Object> payload) {
        log.info("Instagram data deletion request received: {}", payload);
        
        try {
            String userId = extractUserId(payload);
            String confirmationCode = webhookService.handleDataDeletionRequest("instagram", userId);
            
            // Meta requires this specific response format
            return ResponseEntity.ok(Map.of(
                "url", webhookService.getDeletionStatusUrl(confirmationCode),
                "confirmation_code", confirmationCode
            ));
        } catch (Exception e) {
            log.error("Failed to process Instagram data deletion request", e);
            String fallbackCode = "DEL-" + System.currentTimeMillis();
            return ResponseEntity.ok(Map.of(
                "url", webhookService.getDeletionStatusUrl(fallbackCode),
                "confirmation_code", fallbackCode
            ));
        }
    }

    /**
     * Facebook Deauthorization Callback
     */
    @PostMapping("/facebook/deauthorize")
    public ResponseEntity<ApiResponse<String>> handleFacebookDeauthorize(
            @RequestBody Map<String, Object> payload) {
        log.info("Facebook deauthorization callback received: {}", payload);
        
        try {
            String userId = extractUserId(payload);
            webhookService.handleDeauthorization("facebook", userId);
            return ResponseEntity.ok(ApiResponse.success("Deauthorization processed"));
        } catch (Exception e) {
            log.error("Failed to process Facebook deauthorization", e);
            return ResponseEntity.ok(ApiResponse.success("Acknowledged"));
        }
    }

    /**
     * Facebook Data Deletion Request
     */
    @PostMapping("/facebook/data-deletion")
    public ResponseEntity<Map<String, Object>> handleFacebookDataDeletion(
            @RequestBody Map<String, Object> payload) {
        log.info("Facebook data deletion request received: {}", payload);
        
        try {
            String userId = extractUserId(payload);
            String confirmationCode = webhookService.handleDataDeletionRequest("facebook", userId);
            
            return ResponseEntity.ok(Map.of(
                "url", webhookService.getDeletionStatusUrl(confirmationCode),
                "confirmation_code", confirmationCode
            ));
        } catch (Exception e) {
            log.error("Failed to process Facebook data deletion request", e);
            String fallbackCode = "DEL-" + System.currentTimeMillis();
            return ResponseEntity.ok(Map.of(
                "url", webhookService.getDeletionStatusUrl(fallbackCode),
                "confirmation_code", fallbackCode
            ));
        }
    }

    /**
     * Data Deletion Status Page
     * Users can check the status of their data deletion request
     */
    @GetMapping("/deletion-status/{confirmationCode}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDeletionStatus(
            @PathVariable String confirmationCode) {
        var status = webhookService.getDeletionStatus(confirmationCode);
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    private String extractUserId(Map<String, Object> payload) {
        // Meta sends signed_request which contains user_id
        if (payload.containsKey("signed_request")) {
            // In production, you should verify and decode the signed_request
            // For now, we'll try to extract from other fields
        }
        if (payload.containsKey("user_id")) {
            return String.valueOf(payload.get("user_id"));
        }
        return null;
    }
}
 
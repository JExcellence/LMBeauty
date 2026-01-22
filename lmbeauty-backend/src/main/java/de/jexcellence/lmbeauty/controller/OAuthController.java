package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.AuthResponse;
import de.jexcellence.lmbeauty.dto.OAuthCallbackRequest;
import de.jexcellence.lmbeauty.service.OAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
@Slf4j
public class OAuthController {

    private final OAuthService oAuthService;

    // Get OAuth authorization URLs
    @GetMapping("/google/url")
    public ResponseEntity<ApiResponse<String>> getGoogleAuthUrl(
            @RequestParam(value = "state", required = false, defaultValue = "login") String state
    ) {
        String url = oAuthService.getGoogleAuthUrl(state);
        return ResponseEntity.ok(ApiResponse.success(url, "Google OAuth URL generated"));
    }

    @GetMapping("/instagram/url")
    public ResponseEntity<ApiResponse<String>> getInstagramAuthUrl(
            @RequestParam(value = "state", required = false, defaultValue = "login") String state
    ) {
        String url = oAuthService.getInstagramAuthUrl(state);
        return ResponseEntity.ok(ApiResponse.success(url, "Instagram OAuth URL generated"));
    }

    @GetMapping("/facebook/url")
    public ResponseEntity<ApiResponse<String>> getFacebookAuthUrl(
            @RequestParam(value = "state", required = false, defaultValue = "login") String state
    ) {
        String url = oAuthService.getFacebookAuthUrl(state);
        return ResponseEntity.ok(ApiResponse.success(url, "Facebook OAuth URL generated"));
    }

    @GetMapping("/apple/url")
    public ResponseEntity<ApiResponse<String>> getAppleAuthUrl(
            @RequestParam(value = "state", required = false, defaultValue = "login") String state
    ) {
        String url = oAuthService.getAppleAuthUrl(state);
        return ResponseEntity.ok(ApiResponse.success(url, "Apple OAuth URL generated"));
    }

    // OAuth callback handlers
    @PostMapping("/google/callback")
    public ResponseEntity<ApiResponse<AuthResponse>> googleCallback(
            @Valid @RequestBody OAuthCallbackRequest request
    ) {
        log.info("Google OAuth callback received with code: {}", request.getCode().substring(0, 10) + "...");
        try {
            AuthResponse response = oAuthService.handleGoogleCallback(request.getCode());
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Google authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Google authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Google OAuth authentication failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Google authentication failed: " + e.getMessage()));
        }
    }

    @GetMapping("/google/callback")
    public ResponseEntity<ApiResponse<?>> googleCallbackGet(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state
    ) {
        log.info("Google OAuth GET callback received with code: {}, state: {}", code.substring(0, 10) + "...", state);
        try {
            // Check if this is an account linking request
            if ("link".equals(state)) {
                log.info("Processing Google account linking request");
                
                // Verify user is authenticated for linking
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                     "anonymousUser".equals(authentication.getPrincipal())) {
                    log.error("User not authenticated for account linking");
                    return ResponseEntity.status(401)
                            .body(ApiResponse.error("You must be logged in to link accounts"));
                }
                
                String message = oAuthService.linkAccount("google", code);
                return ResponseEntity.ok(ApiResponse.success(message, "Google account linked successfully"));
            }
            
            // Otherwise, it's a regular login/registration
            AuthResponse response = oAuthService.handleGoogleCallback(code);
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Google authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Google authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Google OAuth operation failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Google OAuth failed: " + e.getMessage()));
        }
    }

    @PostMapping("/instagram/callback")
    public ResponseEntity<ApiResponse<AuthResponse>> instagramCallback(
            @Valid @RequestBody OAuthCallbackRequest request
    ) {
        log.info("Instagram OAuth callback received with code: {}", request.getCode().substring(0, 10) + "...");
        try {
            AuthResponse response = oAuthService.handleInstagramCallback(request.getCode());
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Instagram authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Instagram authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Instagram OAuth authentication failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Instagram authentication failed: " + e.getMessage()));
        }
    }

    @GetMapping("/instagram/callback")
    public ResponseEntity<ApiResponse<?>> instagramCallbackGet(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state
    ) {
        log.info("Instagram OAuth GET callback received with code: {}, state: {}", code.substring(0, 10) + "...", state);
        try {
            if ("link".equals(state)) {
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                     "anonymousUser".equals(authentication.getPrincipal())) {
                    return ResponseEntity.status(401)
                            .body(ApiResponse.error("You must be logged in to link accounts"));
                }
                
                String message = oAuthService.linkAccount("instagram", code);
                return ResponseEntity.ok(ApiResponse.success(message, "Instagram account linked successfully"));
            }
            
            AuthResponse response = oAuthService.handleInstagramCallback(code);
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Instagram authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Instagram authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Instagram OAuth operation failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Instagram OAuth failed: " + e.getMessage()));
        }
    }

    @PostMapping("/facebook/callback")
    public ResponseEntity<ApiResponse<AuthResponse>> facebookCallback(
            @Valid @RequestBody OAuthCallbackRequest request
    ) {
        log.info("Facebook OAuth callback received with code: {}", request.getCode().substring(0, 10) + "...");
        try {
            AuthResponse response = oAuthService.handleFacebookCallback(request.getCode());
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Facebook authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Facebook authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Facebook OAuth authentication failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Facebook authentication failed: " + e.getMessage()));
        }
    }

    @GetMapping("/facebook/callback")
    public ResponseEntity<ApiResponse<?>> facebookCallbackGet(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state
    ) {
        log.info("Facebook OAuth GET callback received with code: {}, state: {}", code.substring(0, 10) + "...", state);
        try {
            if ("link".equals(state)) {
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                     "anonymousUser".equals(authentication.getPrincipal())) {
                    return ResponseEntity.status(401)
                            .body(ApiResponse.error("You must be logged in to link accounts"));
                }
                
                String message = oAuthService.linkAccount("facebook", code);
                return ResponseEntity.ok(ApiResponse.success(message, "Facebook account linked successfully"));
            }
            
            AuthResponse response = oAuthService.handleFacebookCallback(code);
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Facebook authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Facebook authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Facebook OAuth operation failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Facebook OAuth failed: " + e.getMessage()));
        }
    }

    @PostMapping("/apple/callback")
    public ResponseEntity<ApiResponse<AuthResponse>> appleCallback(
            @Valid @RequestBody OAuthCallbackRequest request
    ) {
        log.info("Apple OAuth callback received with code: {}", request.getCode().substring(0, 10) + "...");
        try {
            // Apple sends id_token in the request body for POST requests
            AuthResponse response = oAuthService.handleAppleCallback(request.getCode(), null);
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Apple authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Apple authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Apple OAuth authentication failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Apple authentication failed: " + e.getMessage()));
        }
    }

    @GetMapping("/apple/callback")
    public ResponseEntity<ApiResponse<?>> appleCallbackGet(
            @RequestParam("code") String code,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "id_token", required = false) String idToken
    ) {
        log.info("Apple OAuth GET callback received with code: {}, state: {}", code.substring(0, 10) + "...", state);
        try {
            if ("link".equals(state)) {
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                     "anonymousUser".equals(authentication.getPrincipal())) {
                    return ResponseEntity.status(401)
                            .body(ApiResponse.error("You must be logged in to link accounts"));
                }
                
                String message = oAuthService.linkAccount("apple", code);
                return ResponseEntity.ok(ApiResponse.success(message, "Apple account linked successfully"));
            }
            
            AuthResponse response = oAuthService.handleAppleCallback(code, idToken);
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "Apple authentication successful"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Apple authentication failed: " + response.getMessage()));
            }
        } catch (Exception e) {
            log.error("Apple OAuth operation failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Apple OAuth failed: " + e.getMessage()));
        }
    }
}
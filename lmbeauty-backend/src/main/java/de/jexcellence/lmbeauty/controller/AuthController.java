package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.dto.*;
import de.jexcellence.lmbeauty.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully"));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error(response.getError()));
            }
        } catch (Exception e) {
            log.error("Registration failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getError()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
        } else {
            return ResponseEntity.status(401).body(ApiResponse.error(response.getError()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", "Logout successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        AuthResponse response = authService.getCurrentUser();
        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response, "Current user retrieved"));
        } else {
            return ResponseEntity.status(401).body(ApiResponse.error(response.getError()));
        }
    }
}
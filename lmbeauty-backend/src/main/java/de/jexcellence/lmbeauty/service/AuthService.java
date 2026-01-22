package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.config.AdminProperties;
import de.jexcellence.lmbeauty.database.entity.RefreshToken;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.UserRepository;
import de.jexcellence.lmbeauty.dto.*;
import de.jexcellence.lmbeauty.type.EUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final AdminProperties adminProperties;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return AuthResponse.builder()
                .success(false)
                .error("Email already registered")
                .build();
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.builder()
                .success(false)
                .error("Username already taken")
                .build();
        }

        if (!request.isAcceptTerms()) {
            return AuthResponse.builder()
                .success(false)
                .error("You must accept the Terms of Service")
                .build();
        }

        // Create user entity
        User user = new User();
        user.setUsernameField(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPasswordSetByUser(true);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(determineUserRole(request.getEmail()));
        user.setEnabled(true);
        user.setTermsAccepted(true);
        user.setTermsAcceptedAt(new Date());

        User savedUser = userRepository.create(user);

        // Generate JWT tokens
        String jwtToken = jwtService.generateToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        return AuthResponse.builder()
            .success(true)
            .message("Registration successful")
            .accessToken(jwtToken)
            .refreshToken(refreshToken.getToken())
            .user(mapUserToDto(savedUser))
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Update last login timestamp
            user.setLastLoginAt(new Date());
            userRepository.update(user);

            String jwtToken = jwtService.generateToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

            return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .user(mapUserToDto(user))
                .build();
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            return AuthResponse.builder()
                .success(false)
                .error("Invalid email or password")
                .build();
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        try {
            RefreshToken token = refreshTokenService.findByToken(request.getRefreshToken());
            refreshTokenService.verifyExpiration(token);
            
            User user = token.getUser();
            String newJwtToken = jwtService.generateToken(user);

            return AuthResponse.builder()
                .success(true)
                .message("Token refreshed successfully")
                .accessToken(newJwtToken)
                .refreshToken(token.getToken())
                .user(mapUserToDto(user))
                .build();
        } catch (Exception e) {
            log.error("Token refresh failed", e);
            return AuthResponse.builder()
                .success(false)
                .error("Invalid or expired refresh token")
                .build();
        }
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        try {
            RefreshToken token = refreshTokenService.findByToken(request.getRefreshToken());
            refreshTokenService.deleteByUserId(token.getUser().getId());
        } catch (Exception e) {
            log.warn("Logout warning (non-fatal): {}", e.getMessage());
        }
    }

    public AuthResponse getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return AuthResponse.builder()
                .success(false)
                .error("User not authenticated")
                .build();
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return AuthResponse.builder()
            .success(true)
            .message("Current user retrieved")
            .user(mapUserToDto(user))
            .hasPassword(user.isPasswordSetByUser())
            .build();
    }

    private AuthResponse.UserDto mapUserToDto(User user) {
        return AuthResponse.UserDto.builder()
            .id(user.getId())
            .username(user.getUsernameField())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .profilePicture(user.getProfilePicture())
            .language(user.getLanguage())
            .role(user.getRole().name())
            .build();
    }

    /**
     * Determines the user role based on configured admin emails.
     * Admin emails get ADMIN role, others get USER role.
     */
    private EUserRole determineUserRole(String email) {
        if (adminProperties.isAdminEmail(email)) {
            log.info("Assigning ADMIN role to: {}", email);
            return EUserRole.ADMIN;
        }
        return EUserRole.USER;
    }
}
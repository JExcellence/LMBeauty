package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.config.JwtProperties;
import de.jexcellence.lmbeauty.database.entity.RefreshToken;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.RefreshTokenRepository;
import de.jexcellence.lmbeauty.database.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtProperties jwtProperties;

    @Transactional
    public synchronized RefreshToken createRefreshToken(Long userId) {
        try {
            User user = Optional.of(userRepository.findById(userId))
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // Delete existing refresh tokens for this user
            refreshTokenRepository.deleteByUserId(userId);

            // Create new refresh token
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setUser(user);
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(LocalDateTime.now().plusSeconds(
                jwtProperties.getRefreshToken().getExpiration() / 1000
            ));

            return refreshTokenRepository.create(refreshToken);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create refresh token", e);
        }
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token == null) {
            return null;
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token.getId());
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional(readOnly = true)
    public RefreshToken findByToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElse(null);
        if (refreshToken == null) {
            return null;
        }

        User user = refreshToken.getUser();
        if (user != null) {
            User actualUser = userRepository.findById(user.getId());
            if (actualUser != null) {
                refreshToken.setUser(actualUser);
            }
        }

        return refreshToken;
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}

package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.config.OAuthProperties;
import de.jexcellence.lmbeauty.database.entity.OAuthAccount;
import de.jexcellence.lmbeauty.database.entity.OAuthProvider;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.OAuthAccountRepository;
import de.jexcellence.lmbeauty.database.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for handling OAuth webhooks (deauthorization and data deletion)
 * 
 * Data Deletion Strategy:
 * - Anonymize personal data (name, email, profile picture)
 * - Keep appointment history for business records (with anonymized customer)
 * - Remove OAuth account links
 * - Keep a deletion record for compliance
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthWebhookService {

    private final OAuthAccountRepository oAuthAccountRepository;
    private final UserRepository userRepository;
    private final OAuthProperties oAuthProperties;
    private final RefreshTokenService refreshTokenService;

    // In-memory store for deletion status (in production, use database)
    private final ConcurrentHashMap<String, DeletionRecord> deletionRecords = new ConcurrentHashMap<>();

    /**
     * Handle deauthorization - user removed app access from their OAuth provider
     */
    @Transactional
    public void handleDeauthorization(String provider, String providerUserId) {
        log.info("Processing deauthorization for provider: {}, userId: {}", provider, providerUserId);
        
        if (providerUserId == null) {
            log.warn("No user ID provided for deauthorization");
            return;
        }

        OAuthProvider oAuthProvider = parseProvider(provider);
        if (oAuthProvider == null) {
            log.warn("Unknown provider: {}", provider);
            return;
        }

        // Find and remove the OAuth account link
        var oAuthAccount = oAuthAccountRepository.findByProviderAndProviderUserId(oAuthProvider, providerUserId);
        if (oAuthAccount.isPresent()) {
            OAuthAccount account = oAuthAccount.get();
            log.info("Removing OAuth link for user: {}", account.getUser().getId());
            oAuthAccountRepository.delete(account.getId());
        } else {
            log.info("No OAuth account found for provider: {}, userId: {}", provider, providerUserId);
        }
    }

    /**
     * Handle data deletion request - GDPR compliance
     * Anonymizes user data but keeps business records
     */
    @Transactional
    public String handleDataDeletionRequest(String provider, String providerUserId) {
        log.info("Processing data deletion request for provider: {}, userId: {}", provider, providerUserId);
        
        String confirmationCode = generateConfirmationCode();
        
        if (providerUserId == null) {
            log.warn("No user ID provided for data deletion");
            recordDeletion(confirmationCode, null, provider, "NO_USER_ID");
            return confirmationCode;
        }

        OAuthProvider oAuthProvider = parseProvider(provider);
        if (oAuthProvider == null) {
            log.warn("Unknown provider: {}", provider);
            recordDeletion(confirmationCode, null, provider, "UNKNOWN_PROVIDER");
            return confirmationCode;
        }

        // Find the OAuth account
        var oAuthAccount = oAuthAccountRepository.findByProviderAndProviderUserId(oAuthProvider, providerUserId);
        
        if (oAuthAccount.isPresent()) {
            OAuthAccount account = oAuthAccount.get();
            User user = account.getUser();
            
            if (user != null) {
                anonymizeUser(user);
                recordDeletion(confirmationCode, user.getId(), provider, "COMPLETED");
            }
            
            // Remove OAuth account link
            oAuthAccountRepository.delete(account.getId());
        } else {
            log.info("No OAuth account found for deletion request");
            recordDeletion(confirmationCode, null, provider, "NOT_FOUND");
        }
        
        return confirmationCode;
    }

    /**
     * Anonymize user data while keeping business records
     */
    private void anonymizeUser(User user) {
        log.info("Anonymizing user data for user ID: {}", user.getId());
        
        // Generate anonymous identifiers
        String anonymousId = "deleted_" + user.getId();
        
        // Anonymize personal data
        user.setFirstName("Gelöscht");
        user.setLastName("Benutzer");
        user.setEmail(anonymousId + "@deleted.local");
        user.setProfilePicture(null);
        
        // Mark as inactive (using setEnabled since that's the field name)
        user.setEnabled(false);
        
        // Clear any refresh tokens
        refreshTokenService.deleteByUserId(user.getId());
        
        // Update the user
        userRepository.update(user);
        
        log.info("User {} anonymized successfully", user.getId());
    }

    private OAuthProvider parseProvider(String provider) {
        try {
            return OAuthProvider.valueOf(provider.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String generateConfirmationCode() {
        return "DEL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void recordDeletion(String confirmationCode, Long userId, String provider, String status) {
        deletionRecords.put(confirmationCode, new DeletionRecord(
            confirmationCode,
            userId,
            provider,
            status,
            LocalDateTime.now()
        ));
    }

    public String getDeletionStatusUrl(String confirmationCode) {
        String frontendUrl = oAuthProperties.getFrontendUrl();
        return frontendUrl + "/datenschutz/loeschung?code=" + confirmationCode;
    }

    public Map<String, Object> getDeletionStatus(String confirmationCode) {
        DeletionRecord record = deletionRecords.get(confirmationCode);
        
        if (record == null) {
            return Map.of(
                "status", "NOT_FOUND",
                "message", "Kein Löschantrag mit diesem Code gefunden."
            );
        }
        
        return Map.of(
            "status", record.status,
            "provider", record.provider,
            "requestedAt", record.requestedAt.toString(),
            "message", getStatusMessage(record.status)
        );
    }

    private String getStatusMessage(String status) {
        return switch (status) {
            case "COMPLETED" -> "Ihre persönlichen Daten wurden erfolgreich anonymisiert. " +
                "Terminhistorie wird für geschäftliche Aufzeichnungen aufbewahrt.";
            case "NOT_FOUND" -> "Kein Konto mit dieser OAuth-Verbindung gefunden.";
            case "NO_USER_ID" -> "Anfrage erhalten, aber keine Benutzer-ID übermittelt.";
            default -> "Anfrage wird bearbeitet.";
        };
    }

    private record DeletionRecord(
        String confirmationCode,
        Long userId,
        String provider,
        String status,
        LocalDateTime requestedAt
    ) {}
}

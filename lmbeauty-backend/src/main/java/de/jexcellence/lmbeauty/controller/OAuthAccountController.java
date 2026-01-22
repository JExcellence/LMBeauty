package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.database.entity.OAuthAccount;
import de.jexcellence.lmbeauty.database.entity.OAuthProvider;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.OAuthAccountRepository;
import de.jexcellence.lmbeauty.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing OAuth account links
 */
@RestController
@RequestMapping("/api/oauth/accounts")
@RequiredArgsConstructor
@Slf4j
public class OAuthAccountController {

    private final OAuthAccountRepository oAuthAccountRepository;

    /**
     * Get all linked OAuth accounts for the current user
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LinkedAccountDto>>> getLinkedAccounts(
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Not authenticated"));
        }

        List<OAuthAccount> accounts = oAuthAccountRepository.findByUserId(user.getId());
        List<LinkedAccountDto> linkedAccounts = accounts.stream()
                .map(this::mapToDto)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(linkedAccounts, "Linked accounts retrieved"));
    }

    /**
     * Unlink an OAuth account from the current user
     */
    @DeleteMapping("/{provider}")
    public ResponseEntity<ApiResponse<String>> unlinkAccount(
            @AuthenticationPrincipal User user,
            @PathVariable String provider
    ) {
        if (user == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Not authenticated"));
        }

        try {
            OAuthProvider oAuthProvider = OAuthProvider.valueOf(provider.toUpperCase());
            
            // Check if account exists
            var existingAccount = oAuthAccountRepository
                    .findByUserIdAndProvider(user.getId(), oAuthProvider);
            
            if (existingAccount.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No " + provider + " account linked"));
            }

            // Check if user has a password set (can't unlink all OAuth if no password)
            if (!user.isPasswordSetByUser()) {
                List<OAuthAccount> allAccounts = oAuthAccountRepository.findByUserId(user.getId());
                if (allAccounts.size() <= 1) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error("Cannot unlink last OAuth account without setting a password first"));
                }
            }

            oAuthAccountRepository.deleteByUserIdAndProvider(user.getId(), oAuthProvider);
            log.info("Unlinked {} account for user: {}", provider, user.getEmail());

            return ResponseEntity.ok(ApiResponse.success(
                    provider + " account unlinked successfully",
                    "Account unlinked"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid provider: " + provider));
        } catch (Exception e) {
            log.error("Failed to unlink {} account", provider, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to unlink account: " + e.getMessage()));
        }
    }

    /**
     * Check which providers are linked for the current user
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<AccountStatusDto>> getAccountStatus(
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Not authenticated"));
        }

        List<OAuthAccount> accounts = oAuthAccountRepository.findByUserId(user.getId());
        
        AccountStatusDto status = new AccountStatusDto(
                accounts.stream().anyMatch(a -> a.getProvider() == OAuthProvider.GOOGLE),
                accounts.stream().anyMatch(a -> a.getProvider() == OAuthProvider.INSTAGRAM),
                accounts.stream().anyMatch(a -> a.getProvider() == OAuthProvider.FACEBOOK),
                accounts.stream().anyMatch(a -> a.getProvider() == OAuthProvider.APPLE),
                user.isPasswordSetByUser()
        );

        return ResponseEntity.ok(ApiResponse.success(status, "Account status retrieved"));
    }

    private LinkedAccountDto mapToDto(OAuthAccount account) {
        return new LinkedAccountDto(
                account.getProvider().name().toLowerCase(),
                account.getProviderEmail(),
                account.getProviderDisplayName(),
                account.getProviderAvatarUrl(),
                account.getCreatedAt() != null ? account.getCreatedAt().toString() : null
        );
    }

    public record LinkedAccountDto(
            String provider,
            String email,
            String displayName,
            String avatarUrl,
            String linkedAt
    ) {}

    public record AccountStatusDto(
            boolean googleLinked,
            boolean instagramLinked,
            boolean facebookLinked,
            boolean appleLinked,
            boolean hasPassword
    ) {}
}

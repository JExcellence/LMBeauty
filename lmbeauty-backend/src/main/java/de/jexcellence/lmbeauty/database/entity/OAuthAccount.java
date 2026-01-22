package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * OAuth account linked to a user.
 * Supports: Google, Instagram, Facebook, Apple
 */
@Entity
@Table(
    name = "oauth_accounts",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"provider", "provider_user_id"}, name = "uk_provider_user_id")
    },
    indexes = {
        @Index(name = "idx_oauth_user_id", columnList = "user_id"),
        @Index(name = "idx_oauth_provider", columnList = "provider"),
        @Index(name = "idx_oauth_user_provider", columnList = "user_id, provider")
    }
)
@Data
@EqualsAndHashCode(callSuper = true)
public class OAuthAccount extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OAuthProvider provider;

    @Column(name = "provider_user_id", nullable = false)
    private String providerUserId;

    /**
     * Display name from the OAuth provider
     */
    @Column(name = "provider_display_name")
    private String providerDisplayName;

    /**
     * Email from the OAuth provider (may differ from user's primary email)
     */
    @Column(name = "provider_email")
    private String providerEmail;

    /**
     * Avatar URL from the OAuth provider
     */
    @Column(name = "provider_avatar_url")
    private String providerAvatarUrl;

    @Column(name = "access_token_enc", nullable = false, columnDefinition = "text")
    private String accessTokenEnc;

    @Column(name = "refresh_token_enc", columnDefinition = "text")
    private String refreshTokenEnc;
}

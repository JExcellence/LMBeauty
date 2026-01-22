package de.jexcellence.lmbeauty.dto;

import de.jexcellence.lmbeauty.database.entity.OAuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthAccountInfo {
    private Long id;
    private OAuthProvider provider;
    private String providerUserId;
    private String providerDisplayName;
    private String providerEmail;
    private String providerUsername;
    private String providerAvatarUrl;
    private Date connectedAt;
    private Date linkedAt;
    private boolean isActive;
}
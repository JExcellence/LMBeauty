package de.jexcellence.lmbeauty.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String error;
    private String accessToken;
    private String refreshToken;
    private UserDto user;
    private boolean hasPassword;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String profilePicture;
        private String language;
        private String role;
        private List<OAuthAccountInfo> oauthAccounts;
    }
}
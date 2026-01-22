package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.config.AdminProperties;
import de.jexcellence.lmbeauty.config.OAuthProperties;
import de.jexcellence.lmbeauty.database.entity.OAuthAccount;
import de.jexcellence.lmbeauty.database.entity.OAuthProvider;
import de.jexcellence.lmbeauty.database.entity.RefreshToken;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.OAuthAccountRepository;
import de.jexcellence.lmbeauty.database.repository.UserRepository;
import de.jexcellence.lmbeauty.dto.AuthResponse;
import de.jexcellence.lmbeauty.type.EUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthService {

    private final OAuthProperties oAuthProperties;
    private final AdminProperties adminProperties;
    private final UserRepository userRepository;
    private final OAuthAccountRepository oAuthAccountRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();

    // ==================== URL Generation ====================

    public String getGoogleAuthUrl() {
        return getGoogleAuthUrl("login");
    }

    public String getGoogleAuthUrl(String state) {
        OAuthProperties.Provider google = oAuthProperties.getGoogle();
        String authUrl = google.getAuthorizationUrl() != null 
            ? google.getAuthorizationUrl() 
            : "https://accounts.google.com/o/oauth2/v2/auth";
        String scope = google.getScope() != null ? google.getScope() : "openid email profile";
        
        return authUrl + "?" +
            "client_id=" + google.getClientId() +
            "&redirect_uri=" + encode(google.getRedirectUri()) +
            "&response_type=code" +
            "&scope=" + encode(scope) +
            "&access_type=offline" +
            "&prompt=consent" +
            "&state=" + encode(state);
    }

    public String getInstagramAuthUrl() {
        return getInstagramAuthUrl("login");
    }

    public String getInstagramAuthUrl(String state) {
        OAuthProperties.Provider instagram = oAuthProperties.getInstagram();
        String authUrl = instagram.getAuthorizationUrl() != null 
            ? instagram.getAuthorizationUrl() 
            : "https://api.instagram.com/oauth/authorize";
        String scope = instagram.getScope() != null ? instagram.getScope() : "user_profile,user_media";
        
        return authUrl + "?" +
            "client_id=" + instagram.getClientId() +
            "&redirect_uri=" + encode(instagram.getRedirectUri()) +
            "&scope=" + encode(scope) +
            "&response_type=code" +
            "&state=" + encode(state);
    }

    public String getFacebookAuthUrl() {
        return getFacebookAuthUrl("login");
    }

    public String getFacebookAuthUrl(String state) {
        OAuthProperties.Provider facebook = oAuthProperties.getFacebook();
        String authUrl = facebook.getAuthorizationUrl() != null 
            ? facebook.getAuthorizationUrl() 
            : "https://www.facebook.com/v18.0/dialog/oauth";
        String scope = facebook.getScope() != null ? facebook.getScope() : "email,public_profile";
        
        return authUrl + "?" +
            "client_id=" + facebook.getClientId() +
            "&redirect_uri=" + encode(facebook.getRedirectUri()) +
            "&scope=" + encode(scope) +
            "&response_type=code" +
            "&state=" + encode(state);
    }

    public String getAppleAuthUrl() {
        return getAppleAuthUrl("login");
    }

    public String getAppleAuthUrl(String state) {
        OAuthProperties.AppleProvider apple = oAuthProperties.getApple();
        String authUrl = apple.getAuthorizationUrl() != null 
            ? apple.getAuthorizationUrl() 
            : "https://appleid.apple.com/auth/authorize";
        String scope = apple.getScope() != null ? apple.getScope() : "name email";
        
        return authUrl + "?" +
            "client_id=" + apple.getClientId() +
            "&redirect_uri=" + encode(apple.getRedirectUri()) +
            "&response_type=code" +
            "&scope=" + encode(scope) +
            "&response_mode=form_post" +
            "&state=" + encode(state);
    }

    // ==================== Callback Handlers ====================

    @Transactional
    public AuthResponse handleGoogleCallback(String code) {
        try {
            Map<String, Object> tokenResponse = exchangeGoogleCode(code);
            String accessToken = (String) tokenResponse.get("access_token");

            Map<String, Object> userInfo = getGoogleUserInfo(accessToken);
            String providerUserId = (String) userInfo.get("sub");
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String picture = (String) userInfo.get("picture");

            return processOAuthLogin(
                OAuthProvider.GOOGLE,
                providerUserId,
                email,
                name,
                picture,
                accessToken,
                (String) tokenResponse.get("refresh_token")
            );
        } catch (Exception e) {
            log.error("Google OAuth callback failed", e);
            return AuthResponse.builder()
                .success(false)
                .message("Google authentication failed: " + e.getMessage())
                .build();
        }
    }

    @Transactional
    public AuthResponse handleInstagramCallback(String code) {
        try {
            Map<String, Object> tokenResponse = exchangeInstagramCode(code);
            String accessToken = (String) tokenResponse.get("access_token");
            String userId = String.valueOf(tokenResponse.get("user_id"));

            Map<String, Object> userInfo = getInstagramUserInfo(accessToken);
            String username = (String) userInfo.get("username");

            return processOAuthLogin(
                OAuthProvider.INSTAGRAM,
                userId,
                null,
                username,
                null,
                accessToken,
                null
            );
        } catch (Exception e) {
            log.error("Instagram OAuth callback failed", e);
            return AuthResponse.builder()
                .success(false)
                .message("Instagram authentication failed: " + e.getMessage())
                .build();
        }
    }

    @Transactional
    public AuthResponse handleFacebookCallback(String code) {
        try {
            Map<String, Object> tokenResponse = exchangeFacebookCode(code);
            String accessToken = (String) tokenResponse.get("access_token");

            Map<String, Object> userInfo = getFacebookUserInfo(accessToken);
            String providerUserId = (String) userInfo.get("id");
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> pictureData = (Map<String, Object>) userInfo.get("picture");
            String picture = null;
            if (pictureData != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) pictureData.get("data");
                if (data != null) {
                    picture = (String) data.get("url");
                }
            }

            return processOAuthLogin(
                OAuthProvider.FACEBOOK,
                providerUserId,
                email,
                name,
                picture,
                accessToken,
                null
            );
        } catch (Exception e) {
            log.error("Facebook OAuth callback failed", e);
            return AuthResponse.builder()
                .success(false)
                .message("Facebook authentication failed: " + e.getMessage())
                .build();
        }
    }

    @Transactional
    public AuthResponse handleAppleCallback(String code, String idToken) {
        try {
            Map<String, Object> tokenResponse = exchangeAppleCode(code);
            String accessToken = (String) tokenResponse.get("access_token");
            
            String[] parts = idToken.split("\\.");
            String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            @SuppressWarnings("unchecked")
            Map<String, Object> claims = new com.google.gson.Gson().fromJson(payload, Map.class);
            
            String providerUserId = (String) claims.get("sub");
            String email = (String) claims.get("email");

            return processOAuthLogin(
                OAuthProvider.APPLE,
                providerUserId,
                email,
                null,
                null,
                accessToken,
                (String) tokenResponse.get("refresh_token")
            );
        } catch (Exception e) {
            log.error("Apple OAuth callback failed", e);
            return AuthResponse.builder()
                .success(false)
                .message("Apple authentication failed: " + e.getMessage())
                .build();
        }
    }

    // ==================== Token Exchange Methods ====================

    private Map<String, Object> exchangeGoogleCode(String code) {
        OAuthProperties.Provider google = oAuthProperties.getGoogle();
        String tokenUrl = google.getTokenUrl() != null 
            ? google.getTokenUrl() 
            : "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", google.getClientId());
        body.add("client_secret", google.getClientSecret());
        body.add("redirect_uri", google.getRedirectUri());
        body.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(tokenUrl, request, Map.class);
        return response;
    }

    private Map<String, Object> getGoogleUserInfo(String accessToken) {
        OAuthProperties.Provider google = oAuthProperties.getGoogle();
        String userInfoUrl = google.getUserInfoUrl() != null 
            ? google.getUserInfoUrl() 
            : "https://www.googleapis.com/oauth2/v3/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.exchange(
            userInfoUrl,
            HttpMethod.GET,
            request,
            Map.class
        ).getBody();
        return response;
    }

    private Map<String, Object> exchangeInstagramCode(String code) {
        OAuthProperties.Provider instagram = oAuthProperties.getInstagram();
        String tokenUrl = instagram.getTokenUrl() != null 
            ? instagram.getTokenUrl() 
            : "https://api.instagram.com/oauth/access_token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", instagram.getClientId());
        body.add("client_secret", instagram.getClientSecret());
        body.add("grant_type", "authorization_code");
        body.add("redirect_uri", instagram.getRedirectUri());
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(tokenUrl, request, Map.class);
        return response;
    }

    private Map<String, Object> getInstagramUserInfo(String accessToken) {
        OAuthProperties.Provider instagram = oAuthProperties.getInstagram();
        String userInfoUrl = instagram.getUserInfoUrl() != null 
            ? instagram.getUserInfoUrl() 
            : "https://graph.instagram.com/me";

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.getForObject(
            userInfoUrl + "?fields=id,username&access_token=" + accessToken,
            Map.class
        );
        return response;
    }

    private Map<String, Object> exchangeFacebookCode(String code) {
        OAuthProperties.Provider facebook = oAuthProperties.getFacebook();
        String tokenUrl = facebook.getTokenUrl() != null 
            ? facebook.getTokenUrl() 
            : "https://graph.facebook.com/v18.0/oauth/access_token";

        String url = tokenUrl + "?" +
            "client_id=" + facebook.getClientId() +
            "&redirect_uri=" + encode(facebook.getRedirectUri()) +
            "&client_secret=" + facebook.getClientSecret() +
            "&code=" + code;

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        return response;
    }

    private Map<String, Object> getFacebookUserInfo(String accessToken) {
        OAuthProperties.Provider facebook = oAuthProperties.getFacebook();
        String userInfoUrl = facebook.getUserInfoUrl() != null 
            ? facebook.getUserInfoUrl() 
            : "https://graph.facebook.com/me";

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.getForObject(
            userInfoUrl + "?fields=id,name,email,picture&access_token=" + accessToken,
            Map.class
        );
        return response;
    }

    private Map<String, Object> exchangeAppleCode(String code) {
        OAuthProperties.AppleProvider apple = oAuthProperties.getApple();
        String tokenUrl = apple.getTokenUrl() != null 
            ? apple.getTokenUrl() 
            : "https://appleid.apple.com/auth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", apple.getClientId());
        body.add("client_secret", generateAppleClientSecret());
        body.add("code", code);
        body.add("grant_type", "authorization_code");
        body.add("redirect_uri", apple.getRedirectUri());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(tokenUrl, request, Map.class);
        return response;
    }

    private String generateAppleClientSecret() {
        // Apple requires a JWT client secret signed with your private key
        // This is a placeholder - implement proper JWT generation
        return oAuthProperties.getApple().getPrivateKey();
    }

    // ==================== Core OAuth Processing ====================

    private AuthResponse processOAuthLogin(
        OAuthProvider provider,
        String providerUserId,
        String email,
        String displayName,
        String avatarUrl,
        String accessToken,
        String refreshToken
    ) {
        log.info("Processing OAuth login for provider: {}, providerUserId: {}, email: {}", 
                provider, providerUserId, email);
        
        OAuthAccount existingOAuth = oAuthAccountRepository
            .findByProviderAndProviderUserIdWithUser(provider, providerUserId)
            .orElse(null);

        User user;

        if (existingOAuth != null) {
            log.info("Found existing OAuth account for provider: {}, providerUserId: {}", provider, providerUserId);
            user = existingOAuth.getUser();
            if (user == null) {
                throw new RuntimeException("User not found for OAuth account");
            }
            
            existingOAuth.setAccessTokenEnc(accessToken);
            if (refreshToken != null) {
                existingOAuth.setRefreshTokenEnc(refreshToken);
            }
            if (avatarUrl != null) {
                existingOAuth.setProviderAvatarUrl(avatarUrl);
            }
            oAuthAccountRepository.update(existingOAuth);
        } else if (email != null) {
            log.info("No existing OAuth account found, checking for user by email: {}", email);
            user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                log.info("No existing user found with email: {}, creating new user", email);
                user = createNewUser(email, displayName, avatarUrl);
            } else {
                log.info("Found existing user with email: {}, linking OAuth account", email);
            }

            createOAuthAccount(user, provider, providerUserId, email, displayName, avatarUrl, accessToken, refreshToken);
        } else {
            String generatedEmail = provider.name().toLowerCase() + "_" + providerUserId + "@oauth.lmbeauty.de";
            log.info("No email provided, using generated email: {}", generatedEmail);
            user = userRepository.findByEmail(generatedEmail).orElse(null);

            if (user == null) {
                user = createNewUser(generatedEmail, displayName, avatarUrl);
            }

            createOAuthAccount(user, provider, providerUserId, generatedEmail, displayName, avatarUrl, accessToken, refreshToken);
        }

        // Update last login time - fetch fresh user to avoid lazy loading issues
        User freshUser = userRepository.findByEmail(user.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        freshUser.setLastLoginAt(new Date());
        freshUser = userRepository.update(freshUser);

        String jwtToken = jwtService.generateToken(freshUser);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(freshUser.getId());

        return AuthResponse.builder()
            .success(true)
            .message("Authentication successful")
            .accessToken(jwtToken)
            .refreshToken(newRefreshToken.getToken())
            .user(mapUserToDto(freshUser))
            .build();
    }

    private User createNewUser(String email, String displayName, String avatarUrl) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(generateUsername(displayName, email));
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setPasswordSetByUser(false);
        user.setRole(determineUserRole(email));
        user.setEnabled(true);

        if (displayName != null) {
            String[] nameParts = displayName.split(" ", 2);
            user.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                user.setLastName(nameParts[1]);
            }
        }

        if (avatarUrl != null) {
            user.setProfilePicture(avatarUrl);
        }

        log.info("Creating new user with email: {} and role: {}", email, user.getRole());
        return userRepository.create(user);
    }

    /**
     * Determines the user role based on configured admin emails.
     * Owner email gets OWNER role, admin emails get ADMIN role, others get USER role.
     */
    private EUserRole determineUserRole(String email) {
        if (adminProperties.isAdminEmail(email)) {
            log.info("Assigning ADMIN role to: {}", email);
            return EUserRole.ADMIN;
        }
        return EUserRole.USER;
    }

    private void createOAuthAccount(
        User user,
        OAuthProvider provider,
        String providerUserId,
        String email,
        String displayName,
        String avatarUrl,
        String accessToken,
        String refreshToken
    ) {
        OAuthAccount oAuthAccount = new OAuthAccount();
        oAuthAccount.setProvider(provider);
        oAuthAccount.setProviderUserId(providerUserId);
        oAuthAccount.setProviderEmail(email);
        oAuthAccount.setProviderDisplayName(displayName);
        oAuthAccount.setProviderAvatarUrl(avatarUrl);
        oAuthAccount.setAccessTokenEnc(accessToken);
        oAuthAccount.setRefreshTokenEnc(refreshToken);

        // Set the user directly without using the helper method to avoid lazy loading issues
        oAuthAccount.setUser(user);
        
        oAuthAccountRepository.create(oAuthAccount);
    }

    private String generateUsername(String displayName, String email) {
        String base = displayName != null ? 
            displayName.toLowerCase().replaceAll("[^a-z0-9]", "") :
            email.split("@")[0].toLowerCase().replaceAll("[^a-z0-9]", "");

        String username = base;
        int counter = 1;

        while (userRepository.existsByUsername(username)) {
            username = base + counter++;
        }

        return username;
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

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    // ==================== Account Linking ====================

    @Transactional
    public String linkAccount(String provider, String code) {
        var authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User must be authenticated to link accounts");
        }

        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        OAuthProvider oAuthProvider = OAuthProvider.valueOf(provider.toUpperCase());

        switch (oAuthProvider) {
            case GOOGLE -> linkGoogleAccount(user, code);
            case INSTAGRAM -> linkInstagramAccount(user, code);
            case FACEBOOK -> linkFacebookAccount(user, code);
            case APPLE -> linkAppleAccount(user, code);
            default -> throw new RuntimeException("Unsupported provider: " + provider);
        }

        return provider + " account linked successfully";
    }

    private void linkGoogleAccount(User user, String code) {
        Map<String, Object> tokenResponse = exchangeGoogleCode(code);
        String accessToken = (String) tokenResponse.get("access_token");
        Map<String, Object> userInfo = getGoogleUserInfo(accessToken);
        String providerUserId = (String) userInfo.get("sub");

        checkExistingLink(OAuthProvider.GOOGLE, providerUserId, user);

        createOrUpdateOAuthLink(user, OAuthProvider.GOOGLE, providerUserId, 
                (String) userInfo.get("email"),
                (String) userInfo.get("name"),
                (String) userInfo.get("picture"),
                accessToken,
                (String) tokenResponse.get("refresh_token"));
    }

    private void linkInstagramAccount(User user, String code) {
        Map<String, Object> tokenResponse = exchangeInstagramCode(code);
        String accessToken = (String) tokenResponse.get("access_token");
        String userId = String.valueOf(tokenResponse.get("user_id"));
        Map<String, Object> userInfo = getInstagramUserInfo(accessToken);
        String username = (String) userInfo.get("username");

        checkExistingLink(OAuthProvider.INSTAGRAM, userId, user);

        createOrUpdateOAuthLink(user, OAuthProvider.INSTAGRAM, userId,
                null, username, null, accessToken, null);
    }

    private void linkFacebookAccount(User user, String code) {
        Map<String, Object> tokenResponse = exchangeFacebookCode(code);
        String accessToken = (String) tokenResponse.get("access_token");
        Map<String, Object> userInfo = getFacebookUserInfo(accessToken);
        String providerUserId = (String) userInfo.get("id");

        checkExistingLink(OAuthProvider.FACEBOOK, providerUserId, user);

        @SuppressWarnings("unchecked")
        Map<String, Object> pictureData = (Map<String, Object>) userInfo.get("picture");
        String picture = null;
        if (pictureData != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) pictureData.get("data");
            if (data != null) {
                picture = (String) data.get("url");
            }
        }

        createOrUpdateOAuthLink(user, OAuthProvider.FACEBOOK, providerUserId,
                (String) userInfo.get("email"),
                (String) userInfo.get("name"),
                picture, accessToken, null);
    }

    private void linkAppleAccount(User user, String code) {
        Map<String, Object> tokenResponse = exchangeAppleCode(code);
        String accessToken = (String) tokenResponse.get("access_token");
        String idToken = (String) tokenResponse.get("id_token");

        String[] parts = idToken.split("\\.");
        String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
        @SuppressWarnings("unchecked")
        Map<String, Object> claims = new com.google.gson.Gson().fromJson(payload, Map.class);

        String providerUserId = (String) claims.get("sub");
        String email = (String) claims.get("email");

        checkExistingLink(OAuthProvider.APPLE, providerUserId, user);

        createOrUpdateOAuthLink(user, OAuthProvider.APPLE, providerUserId,
                email, null, null, accessToken,
                (String) tokenResponse.get("refresh_token"));
    }

    private void checkExistingLink(OAuthProvider provider, String providerUserId, User currentUser) {
        OAuthAccount existingAccount = oAuthAccountRepository
                .findByProviderAndProviderUserId(provider, providerUserId)
                .orElse(null);

        if (existingAccount != null && !existingAccount.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("This " + provider.name().toLowerCase() + 
                    " account is already linked to another user");
        }
    }

    private void createOrUpdateOAuthLink(User user, OAuthProvider provider, String providerUserId,
                                          String email, String displayName, String avatarUrl,
                                          String accessToken, String refreshToken) {
        OAuthAccount existingLink = oAuthAccountRepository
                .findByUserIdAndProvider(user.getId(), provider)
                .orElse(null);

        if (existingLink != null) {
            existingLink.setProviderUserId(providerUserId);
            existingLink.setAccessTokenEnc(accessToken);
            if (refreshToken != null) {
                existingLink.setRefreshTokenEnc(refreshToken);
            }
            if (email != null) {
                existingLink.setProviderEmail(email);
            }
            if (displayName != null) {
                existingLink.setProviderDisplayName(displayName);
            }
            if (avatarUrl != null) {
                existingLink.setProviderAvatarUrl(avatarUrl);
            }
            oAuthAccountRepository.update(existingLink);
        } else {
            OAuthAccount newLink = new OAuthAccount();
            newLink.setUser(user);
            newLink.setProvider(provider);
            newLink.setProviderUserId(providerUserId);
            newLink.setProviderEmail(email);
            newLink.setProviderDisplayName(displayName);
            newLink.setProviderAvatarUrl(avatarUrl);
            newLink.setAccessTokenEnc(accessToken);
            newLink.setRefreshTokenEnc(refreshToken);
            oAuthAccountRepository.create(newLink);
        }
    }
}

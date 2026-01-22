package de.jexcellence.lmbeauty.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "oauth")
@Data
public class OAuthProperties {

    private Provider google = new Provider();
    private Provider instagram = new Provider();
    private Provider facebook = new Provider();
    private AppleProvider apple = new AppleProvider();
    private String frontendUrl;

    /**
     * Generic OAuth Provider configuration
     */
    @Data
    public static class Provider {
        private String clientId;
        private String clientSecret;
        private String redirectUri;
        private String tokenUrl;
        private String userInfoUrl;
        private String authorizationUrl;
        private String scope;
        private List<String> scopes;
        
        /**
         * Get scopes as a list, parsing from comma-separated string if needed
         */
        public List<String> getScopes() {
            if (scopes != null && !scopes.isEmpty()) {
                return scopes;
            }
            if (scope != null && !scope.isEmpty()) {
                return List.of(scope.split("[,\\s]+"));
            }
            return List.of();
        }
    }

    /**
     * Apple-specific OAuth Provider configuration (has additional fields)
     */
    @Data
    public static class AppleProvider extends Provider {
        private String teamId;
        private String keyId;
        private String privateKey;
    }
}

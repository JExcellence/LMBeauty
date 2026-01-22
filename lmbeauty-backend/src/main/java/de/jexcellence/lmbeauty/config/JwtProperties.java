package de.jexcellence.lmbeauty.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {

    private String secret;
    private long expiration = 86400000; // 24 hours (matching working app)
    private RefreshToken refreshToken = new RefreshToken();

    @Data
    public static class RefreshToken {
        private long expiration = 604800000; // 7 days default
    }
}

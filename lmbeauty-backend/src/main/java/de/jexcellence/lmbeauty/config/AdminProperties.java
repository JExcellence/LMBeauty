package de.jexcellence.lmbeauty.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "admin")
@Data
public class AdminProperties {

    /**
     * Comma-separated list of admin emails - get ADMIN role automatically
     */
    private String adminEmails;

    public boolean isAdminEmail(String email) {
        if (adminEmails == null || adminEmails.isBlank()) {
            return false;
        }
        return getAdminEmailList().stream()
            .anyMatch(adminEmail -> adminEmail.equalsIgnoreCase(email));
    }

    public List<String> getAdminEmailList() {
        if (adminEmails == null || adminEmails.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(adminEmails.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .toList();
    }
}

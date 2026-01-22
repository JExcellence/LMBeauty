package de.jexcellence.lmbeauty.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service for managing Instagram access tokens and refreshing them.
 */
@Service
public class InstagramTokenService {
    
    private static final Logger logger = LoggerFactory.getLogger(InstagramTokenService.class);
    
    @Value("${oauth.instagram.client-id}")
    private String clientId;
    
    @Value("${oauth.instagram.client-secret}")
    private String clientSecret;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public InstagramTokenService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Refresh a long-lived Instagram access token.
     * Long-lived tokens are valid for 60 days and can be refreshed.
     */
    public String refreshLongLivedToken(String currentToken) {
        try {
            String url = String.format(
                "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=%s",
                currentToken
            );
            
            logger.info("Refreshing Instagram access token...");
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            
            if (jsonNode.has("access_token")) {
                String newToken = jsonNode.get("access_token").asText();
                long expiresIn = jsonNode.has("expires_in") ? jsonNode.get("expires_in").asLong() : 5184000; // 60 days default
                
                logger.info("Successfully refreshed Instagram token. Expires in {} seconds", expiresIn);
                return newToken;
            } else if (jsonNode.has("error")) {
                String errorMessage = jsonNode.get("error").get("message").asText();
                logger.error("Failed to refresh Instagram token: {}", errorMessage);
            }
            
        } catch (Exception e) {
            logger.error("Error refreshing Instagram token", e);
        }
        
        return null;
    }
    
    /**
     * Convert a short-lived token to a long-lived token.
     * Short-lived tokens expire in 1 hour, long-lived tokens expire in 60 days.
     */
    public String exchangeForLongLivedToken(String shortLivedToken) {
        try {
            String url = String.format(
                "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=%s&access_token=%s",
                clientSecret, shortLivedToken
            );
            
            logger.info("Converting short-lived token to long-lived token...");
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            
            if (jsonNode.has("access_token")) {
                String longLivedToken = jsonNode.get("access_token").asText();
                long expiresIn = jsonNode.has("expires_in") ? jsonNode.get("expires_in").asLong() : 5184000;
                
                logger.info("Successfully converted to long-lived token. Expires in {} seconds", expiresIn);
                return longLivedToken;
            } else if (jsonNode.has("error")) {
                String errorMessage = jsonNode.get("error").get("message").asText();
                logger.error("Failed to convert token: {}", errorMessage);
            }
            
        } catch (Exception e) {
            logger.error("Error converting Instagram token", e);
        }
        
        return null;
    }
    
    /**
     * Validate if a token is still valid by making a test API call.
     */
    public boolean validateToken(String token) {
        try {
            String url = "https://graph.instagram.com/me?fields=id,username&access_token=" + token;
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            
            return jsonNode.has("id") && !jsonNode.has("error");
        } catch (Exception e) {
            logger.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}
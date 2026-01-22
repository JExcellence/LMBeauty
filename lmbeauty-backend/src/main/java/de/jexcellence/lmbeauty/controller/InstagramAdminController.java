package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.service.InstagramService;
import de.jexcellence.lmbeauty.service.InstagramTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin controller for managing Instagram integration.
 */
@RestController
@RequestMapping("/api/admin/instagram")
public class InstagramAdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(InstagramAdminController.class);
    
    @Value("${instagram.access.token:}")
    private String currentToken;
    
    @Autowired
    private InstagramService instagramService;
    
    @Autowired
    private InstagramTokenService tokenService;
    
    /**
     * Check Instagram API status and token validity.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getInstagramStatus() {
        Map<String, Object> status = new HashMap<>();
        
        boolean hasToken = currentToken != null && !currentToken.trim().isEmpty();
        boolean tokenValid = hasToken && tokenService.validateToken(currentToken);
        
        status.put("hasToken", hasToken);
        status.put("tokenValid", tokenValid);
        status.put("tokenLength", hasToken ? currentToken.length() : 0);
        
        if (hasToken) {
            status.put("tokenPreview", currentToken.substring(0, Math.min(10, currentToken.length())) + "...");
        }
        
        // Try to get posts count
        try {
            var posts = instagramService.getCategorizedPosts();
            int totalPosts = posts.values().stream().mapToInt(List::size).sum();
            status.put("postsAvailable", totalPosts);
            status.put("categories", posts.keySet());
        } catch (Exception e) {
            status.put("postsAvailable", 0);
            status.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(status);
    }
    
    /**
     * Refresh Instagram posts cache.
     */
    @PostMapping("/refresh-posts")
    public ResponseEntity<Map<String, Object>> refreshPosts() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            instagramService.refreshPosts();
            var posts = instagramService.getCategorizedPosts();
            int totalPosts = posts.values().stream().mapToInt(List::size).sum();
            
            result.put("success", true);
            result.put("message", "Posts refreshed successfully");
            result.put("postsCount", totalPosts);
            result.put("categories", posts.keySet());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to refresh Instagram posts", e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    /**
     * Refresh Instagram access token.
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken() {
        Map<String, Object> result = new HashMap<>();
        
        if (currentToken == null || currentToken.trim().isEmpty()) {
            result.put("success", false);
            result.put("error", "No current token available to refresh");
            return ResponseEntity.badRequest().body(result);
        }
        
        try {
            String newToken = tokenService.refreshLongLivedToken(currentToken);
            
            if (newToken != null) {
                result.put("success", true);
                result.put("message", "Token refreshed successfully");
                result.put("newTokenPreview", newToken.substring(0, Math.min(10, newToken.length())) + "...");
                result.put("instruction", "Update your INSTAGRAM_ACCESS_TOKEN environment variable with the new token");
                
                logger.info("Instagram token refreshed successfully. New token: {}...", 
                    newToken.substring(0, Math.min(10, newToken.length())));
            } else {
                result.put("success", false);
                result.put("error", "Failed to refresh token. Check logs for details.");
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to refresh Instagram token", e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
    }
}
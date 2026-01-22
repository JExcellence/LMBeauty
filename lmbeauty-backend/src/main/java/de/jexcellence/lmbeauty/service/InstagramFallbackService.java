package de.jexcellence.lmbeauty.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * Fallback service for Instagram posts when the API is unavailable.
 * Provides placeholder images for treatments.
 */
@Service
public class InstagramFallbackService {
    
    private final Map<String, String> fallbackImages;
    
    public InstagramFallbackService() {
        this.fallbackImages = initializeFallbackImages();
    }
    
    /**
     * Get fallback image URL for a treatment.
     */
    public Optional<String> getFallbackImageForTreatment(String treatmentSlug) {
        if (treatmentSlug == null) {
            return Optional.empty();
        }
        
        String imageUrl = fallbackImages.get(treatmentSlug.toLowerCase());
        return Optional.ofNullable(imageUrl);
    }
    
    /**
     * Get fallback posts for all categories.
     */
    public Map<String, List<InstagramService.InstagramPost>> getFallbackCategorizedPosts() {
        Map<String, List<InstagramService.InstagramPost>> fallbackPosts = new HashMap<>();
        
        // Create placeholder posts for each category
        fallbackPosts.put("einzeltechnik", createFallbackPosts("einzeltechnik", 3));
        fallbackPosts.put("hybridtechnik", createFallbackPosts("hybridtechnik", 3));
        fallbackPosts.put("volumentechnik", createFallbackPosts("volumentechnik", 3));
        fallbackPosts.put("augenbrauen", createFallbackPosts("augenbrauen", 2));
        fallbackPosts.put("lifting", createFallbackPosts("lifting", 2));
        fallbackPosts.put("general", createFallbackPosts("general", 1));
        
        return fallbackPosts;
    }
    
    private List<InstagramService.InstagramPost> createFallbackPosts(String category, int count) {
        List<InstagramService.InstagramPost> posts = new ArrayList<>();
        
        for (int i = 1; i <= count; i++) {
            String id = "fallback_" + category + "_" + i;
            String caption = getFallbackCaption(category, i);
            String mediaUrl = getFallbackImageUrl(category, i);
            String permalink = "https://instagram.com/lm.beauty";
            String timestamp = "2024-01-01T12:00:00+0000";
            
            posts.add(new InstagramService.InstagramPost(
                id, caption, "IMAGE", mediaUrl, permalink, timestamp
            ));
        }
        
        return posts;
    }
    
    private String getFallbackCaption(String category, int index) {
        return switch (category) {
            case "einzeltechnik" -> "Natürliche Einzeltechnik für einen dezenten Look ✨ #einzeltechnik #naturallashes";
            case "hybridtechnik" -> "Perfekte Hybrid-Technik für mehr Volumen 💫 #hybridtechnik #lashextensions";
            case "volumentechnik" -> "Dramatische Volumentechnik für den WOW-Effekt 🔥 #volumentechnik #volumelashes";
            case "augenbrauen" -> "Perfekt geformte Augenbrauen 🎯 #augenbrauen #browshaping";
            case "lifting" -> "Wimpernlifting für natürlich geschwungene Wimpern 🌟 #wimpernlifting #lashlift";
            default -> "Schöne Wimpern von LM Beauty 💕 #lmbeauty #wimpern";
        };
    }
    
    private String getFallbackImageUrl(String category, int index) {
        // Use placeholder images or default beauty images
        return "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop&crop=face";
    }
    
    private Map<String, String> initializeFallbackImages() {
        Map<String, String> images = new HashMap<>();
        
        // Fallback images for each treatment type
        images.put("einzeltechnik", "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop&crop=face");
        images.put("hybridtechnik", "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=400&fit=crop&crop=face");
        images.put("volumentechnik", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face");
        images.put("augenbrauen-zupfen", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=face");
        images.put("augenbrauen-faerben", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=face");
        images.put("wimpern-lifting", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=face");
        images.put("wimpern-faerben", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&crop=face");
        
        return images;
    }
}
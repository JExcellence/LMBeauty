package de.jexcellence.lmbeauty.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for fetching Instagram posts and categorizing them for treatments.
 */
@Service
public class InstagramService {
    
    private static final Logger logger = LoggerFactory.getLogger(InstagramService.class);
    
    @Value("${instagram.access.token:}")
    private String accessToken;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final InstagramFallbackService fallbackService;
    
    // Cache for Instagram posts (1 hour TTL)
    private Map<String, InstagramPost> cachedPosts = new HashMap<>();
    private long lastFetchTime = 0;
    private static final long CACHE_TTL = 3600000; // 1 hour in milliseconds
    
    @Autowired
    public InstagramService(InstagramFallbackService fallbackService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.fallbackService = fallbackService;
    }
    
    /**
     * Get Instagram image URL for a treatment based on its slug.
     */
    public Optional<String> getImageForTreatment(String treatmentSlug) {
        if (treatmentSlug == null) {
            return Optional.empty();
        }
        
        Map<String, InstagramPost> posts = getCachedPosts();
        
        // Try to find a post that matches the treatment
        InstagramPost matchingPost = posts.get(treatmentSlug.toLowerCase());
        if (matchingPost != null) {
            return Optional.of(matchingPost.getMediaUrl());
        }
        
        // Fallback: try to find by category mapping
        String category = mapTreatmentToCategory(treatmentSlug);
        if (category != null) {
            matchingPost = posts.get(category);
            if (matchingPost != null) {
                return Optional.of(matchingPost.getMediaUrl());
            }
        }
        
        // Use fallback service if no Instagram posts available
        return fallbackService.getFallbackImageForTreatment(treatmentSlug);
    }
    
    /**
     * Get all Instagram posts categorized by treatment type - returns ALL posts per category.
     */
    public Map<String, List<InstagramPost>> getCategorizedPosts() {
        // Try to get real Instagram posts first
        try {
            List<InstagramPost> allPosts = fetchInstagramPosts();
            
            if (allPosts.isEmpty()) {
                logger.warn("No Instagram posts available, using fallback posts");
                return fallbackService.getFallbackCategorizedPosts();
            }
            
            Map<String, List<InstagramPost>> fullCategorization = new HashMap<>();
            
            // Initialize categories
            fullCategorization.put("einzeltechnik", new ArrayList<>());
            fullCategorization.put("hybridtechnik", new ArrayList<>());
            fullCategorization.put("volumentechnik", new ArrayList<>());
            fullCategorization.put("augenbrauen", new ArrayList<>());
            fullCategorization.put("lifting", new ArrayList<>());
            fullCategorization.put("general", new ArrayList<>());
            
            for (InstagramPost post : allPosts) {
                String category = categorizePost(post);
                if (category != null) {
                    fullCategorization.get(category).add(post);
                }
            }
            
            logger.info("Categorized {} posts into {} categories", allPosts.size(), fullCategorization.size());
            fullCategorization.forEach((cat, postList) -> 
                logger.info("Category '{}': {} posts", cat, postList.size()));
            
            return fullCategorization;
        } catch (Exception e) {
            logger.error("Error getting categorized posts, using fallback", e);
            return fallbackService.getFallbackCategorizedPosts();
        }
    }
    
    /**
     * Fetch fresh Instagram posts from API.
     */
    public void refreshPosts() {
        cachedPosts.clear();
        lastFetchTime = 0;
        getCachedPosts(); // This will trigger a fresh fetch
    }
    
    private Map<String, InstagramPost> getCachedPosts() {
        long currentTime = System.currentTimeMillis();
        
        // Check if cache is still valid
        if (currentTime - lastFetchTime < CACHE_TTL && !cachedPosts.isEmpty()) {
            return cachedPosts;
        }
        
        // Fetch fresh posts
        try {
            List<InstagramPost> posts = fetchInstagramPosts();
            cachedPosts = categorizePosts(posts);
            lastFetchTime = currentTime;
            logger.info("Refreshed Instagram posts cache with {} posts", posts.size());
        } catch (Exception e) {
            logger.warn("Failed to fetch Instagram posts: {}", e.getMessage());
            // Return existing cache if available, even if expired
        }
        
        return cachedPosts;
    }
    
    private List<InstagramPost> fetchInstagramPosts() {
        if (accessToken == null || accessToken.trim().isEmpty()) {
            logger.warn("Instagram access token not configured");
            return Collections.emptyList();
        }
        
        List<InstagramPost> allPosts = new ArrayList<>();
        String nextUrl = null;
        
        try {
            // Fetch ALL posts using pagination - no limit
            String url = "https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=100&access_token=" + accessToken;
            
            do {
                logger.info("Fetching Instagram posts from API...");
                
                String response = restTemplate.getForObject(url, String.class);
                JsonNode jsonNode = objectMapper.readTree(response);
                
                // Check for API errors
                if (jsonNode.has("error")) {
                    JsonNode errorNode = jsonNode.get("error");
                    String errorMessage = errorNode.get("message").asText();
                    String errorType = errorNode.has("type") ? errorNode.get("type").asText() : "Unknown";
                    
                    logger.error("Instagram API Error - Type: {}, Message: {}", errorType, errorMessage);
                    
                    if ("OAuthException".equals(errorType)) {
                        logger.error("Instagram access token is invalid or expired. Please refresh your token.");
                        logger.error("Get a new token from: https://developers.facebook.com/tools/explorer/");
                        logger.error("Or use the Instagram Basic Display API to get a long-lived token.");
                    }
                    
                    return Collections.emptyList();
                }
                
                JsonNode dataNode = jsonNode.get("data");
                if (dataNode != null && dataNode.isArray()) {
                    for (JsonNode postNode : dataNode) {
                        InstagramPost post = parseInstagramPost(postNode);
                        if (post != null) {
                            allPosts.add(post);
                        }
                    }
                }
                
                // Check for next page
                JsonNode pagingNode = jsonNode.get("paging");
                if (pagingNode != null && pagingNode.has("next")) {
                    nextUrl = pagingNode.get("next").asText();
                    url = nextUrl;
                } else {
                    nextUrl = null;
                }
                
                logger.info("Fetched {} posts so far, has next page: {}", allPosts.size(), nextUrl != null);
                
            } while (nextUrl != null);
            
            logger.info("Successfully fetched {} Instagram posts from API", allPosts.size());
            return allPosts;
            
        } catch (Exception e) {
            logger.error("Error fetching Instagram posts: {}", e.getMessage());
            
            // Provide helpful error messages
            if (e.getMessage().contains("400 Bad Request")) {
                logger.error("Instagram API returned 400 Bad Request. This usually means:");
                logger.error("1. Access token is expired or invalid");
                logger.error("2. Access token doesn't have required permissions");
                logger.error("3. Instagram app is not approved for production use");
            } else if (e.getMessage().contains("401 Unauthorized")) {
                logger.error("Instagram API returned 401 Unauthorized. Check your access token.");
            }
            
            return Collections.emptyList();
        }
    }
    
    private InstagramPost parseInstagramPost(JsonNode postNode) {
        try {
            String id = postNode.get("id").asText();
            String mediaType = postNode.get("media_type").asText();
            String mediaUrl = postNode.get("media_url").asText();
            String permalink = postNode.get("permalink").asText();
            String timestamp = postNode.get("timestamp").asText();
            
            // Use thumbnail for videos, media_url for images
            if ("VIDEO".equals(mediaType) && postNode.has("thumbnail_url")) {
                mediaUrl = postNode.get("thumbnail_url").asText();
            }
            
            String caption = postNode.has("caption") ? postNode.get("caption").asText() : "";
            
            // Handle CAROUSEL_ALBUM - fetch children images
            List<String> carouselImages = new ArrayList<>();
            if ("CAROUSEL_ALBUM".equals(mediaType)) {
                carouselImages = fetchCarouselChildren(id);
                logger.info("Carousel post {} has {} children images", id, carouselImages.size());
            }
            
            return new InstagramPost(id, caption, mediaType, mediaUrl, permalink, timestamp, carouselImages);
        } catch (Exception e) {
            logger.warn("Failed to parse Instagram post: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Fetch children images from a carousel post.
     */
    private List<String> fetchCarouselChildren(String carouselId) {
        List<String> childrenUrls = new ArrayList<>();
        
        try {
            String url = String.format(
                "https://graph.instagram.com/%s/children?fields=id,media_type,media_url,thumbnail_url&access_token=%s",
                carouselId,
                accessToken
            );
            
            logger.info("Fetching carousel children for post: {}", carouselId);
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            
            JsonNode dataNode = jsonNode.get("data");
            if (dataNode != null && dataNode.isArray()) {
                for (JsonNode childNode : dataNode) {
                    String mediaType = childNode.get("media_type").asText();
                    String mediaUrl;
                    
                    // Use thumbnail for videos, media_url for images
                    if ("VIDEO".equals(mediaType) && childNode.has("thumbnail_url")) {
                        mediaUrl = childNode.get("thumbnail_url").asText();
                    } else {
                        mediaUrl = childNode.get("media_url").asText();
                    }
                    
                    childrenUrls.add(mediaUrl);
                }
            }
            
            logger.info("Successfully fetched {} children for carousel {}", childrenUrls.size(), carouselId);
        } catch (Exception e) {
            logger.error("Failed to fetch carousel children for {}: {}", carouselId, e.getMessage());
        }
        
        return childrenUrls;
    }
    
    private Map<String, InstagramPost> categorizePosts(List<InstagramPost> posts) {
        Map<String, List<InstagramPost>> categorizedLists = new HashMap<>();
        
        // Initialize categories
        categorizedLists.put("einzeltechnik", new ArrayList<>());
        categorizedLists.put("hybridtechnik", new ArrayList<>());
        categorizedLists.put("volumentechnik", new ArrayList<>());
        categorizedLists.put("augenbrauen", new ArrayList<>());
        categorizedLists.put("lifting", new ArrayList<>());
        categorizedLists.put("general", new ArrayList<>());
        
        for (InstagramPost post : posts) {
            String category = categorizePost(post);
            if (category != null) {
                categorizedLists.get(category).add(post);
            }
        }
        
        // Convert to the expected format - but keep ALL posts per category
        Map<String, InstagramPost> result = new HashMap<>();
        for (Map.Entry<String, List<InstagramPost>> entry : categorizedLists.entrySet()) {
            String category = entry.getKey();
            List<InstagramPost> categoryPosts = entry.getValue();
            
            if (!categoryPosts.isEmpty()) {
                // For now, just take the first post per category for the main mapping
                // But the getCategorizedPosts() method will return all posts
                result.put(category, categoryPosts.get(0));
            }
        }
        
        return result;
    }
    
    private String categorizePost(InstagramPost post) {
        String caption = post.getCaption().toLowerCase();
        
        // Remove hashtags and clean up text for better matching
        String cleanCaption = caption.replaceAll("#\\w+", "")  // Remove hashtags
                                    .replaceAll("[()\\[\\]{}]", " ")  // Remove brackets/parentheses
                                    .replaceAll("\\s+", " ")  // Normalize whitespace
                                    .trim();
        
        // VERY STRICT keyword matching - posts must explicitly mention the technique
        
        // Volumen - HIGHEST priority (most specific keywords)
        if (cleanCaption.contains("volumen") ||
            cleanCaption.contains("whispy") ||
            cleanCaption.contains("wispy") ||
            cleanCaption.contains("anime")) {
            return "volumentechnik";
        }
        
        // Hybrid - SECOND priority (exclude if it also has volumen keywords)
        if (cleanCaption.contains("hybrid")) {
            // Make sure it's NOT volumen
            if (!cleanCaption.contains("volumen") &&
                !cleanCaption.contains("whispy") &&
                !cleanCaption.contains("wispy") &&
                !cleanCaption.contains("anime")) {
                return "hybridtechnik";
            } else {
                return "volumentechnik";
            }
        }
        
        // 1:1 Technik / Einzeltechnik - MOST RESTRICTIVE (only very specific keywords)
        if (cleanCaption.contains("1:1") || 
            cleanCaption.contains("einzeltechnik") || 
            cleanCaption.contains("classic wimpern")) {
            // Make sure it's NOT hybrid or volumen
            if (!cleanCaption.contains("hybrid") && 
                !cleanCaption.contains("volumen") &&
                !cleanCaption.contains("whispy") &&
                !cleanCaption.contains("wispy") &&
                !cleanCaption.contains("anime")) {
                return "einzeltechnik";
            }
        }
        
        // Lifting - look for lifting keywords
        if (cleanCaption.contains("wimpernlifting") || 
            cleanCaption.contains("lash lift") ||
            cleanCaption.contains("lifting") ||
            cleanCaption.contains("geliftet")) {
            return "lifting";
        }
        
        // Augenbrauen - look for brow keywords
        if (cleanCaption.contains("augenbrauen") || 
            cleanCaption.contains("brows") ||
            cleanCaption.contains("brauen")) {
            return "augenbrauen";
        }
        
        // Default category for posts that don't match specific techniques
        // These posts will NOT be shown in any service category
        return "general";
    }
    
    private String mapTreatmentToCategory(String treatmentSlug) {
        return switch (treatmentSlug.toLowerCase()) {
            case "einzeltechnik" -> "einzeltechnik";
            case "hybridtechnik" -> "hybridtechnik";
            case "volumentechnik" -> "volumentechnik";
            case "augenbrauen-zupfen", "augenbrauen-faerben" -> "augenbrauen";
            case "wimpern-lifting", "wimpern-faerben" -> "lifting";
            default -> "general";
        };
    }
    
    /**
     * Instagram Post data class.
     */
    public static class InstagramPost {
        private final String id;
        private final String caption;
        private final String mediaType;
        private final String mediaUrl;
        private final String permalink;
        private final String timestamp;
        private final List<String> carouselImages; // For CAROUSEL_ALBUM posts
        
        public InstagramPost(String id, String caption, String mediaType, String mediaUrl, String permalink, String timestamp) {
            this(id, caption, mediaType, mediaUrl, permalink, timestamp, new ArrayList<>());
        }
        
        public InstagramPost(String id, String caption, String mediaType, String mediaUrl, String permalink, String timestamp, List<String> carouselImages) {
            this.id = id;
            this.caption = caption;
            this.mediaType = mediaType;
            this.mediaUrl = mediaUrl;
            this.permalink = permalink;
            this.timestamp = timestamp;
            this.carouselImages = carouselImages;
        }
        
        public String getId() { return id; }
        public String getCaption() { return caption; }
        public String getMediaType() { return mediaType; }
        public String getMediaUrl() { return mediaUrl; }
        public String getPermalink() { return permalink; }
        public String getTimestamp() { return timestamp; }
        public List<String> getCarouselImages() { return carouselImages; }
        public boolean isCarousel() { return "CAROUSEL_ALBUM".equals(mediaType); }
    }
}
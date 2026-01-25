package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.database.repository.TreatmentRefillRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRepository;
import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.frontend.ServiceDto;
import de.jexcellence.lmbeauty.service.InstagramService;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for frontend-specific API endpoints.
 * Provides data in the exact format expected by the frontend components.
 */
@RestController
@RequestMapping("/api/frontend")
@RequiredArgsConstructor
@Slf4j
public class FrontendController {

    private final TreatmentRepository treatmentRepository;
    private final TreatmentRefillRepository treatmentRefillRepository;
    private final InstagramService instagramService;

    /**
     * Get services data for the ServicesSection component.
     * Returns data in the exact format expected by the frontend.
     */
    @GetMapping("/services")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getServices() {
        log.info("Getting services for frontend");
        
        try {
            // Get active treatments from main categories (WIMPERN)
            List<Treatment> treatments = treatmentRepository.findByCategoryAndActiveTrue(ETreatmentCategory.WIMPERN);
            log.info("Found {} treatments in WIMPERN category", treatments.size());
            
            // Load refill options for each treatment
            treatments.forEach(this::loadRefillOptions);
            
            // Convert to frontend DTOs
            List<ServiceDto> services = treatments.stream()
                    .map(ServiceDto::fromTreatment)
                    .collect(Collectors.toList());
            
            log.info("Converted to {} service DTOs", services.size());
            services.forEach(service -> {
                log.info("Service: {} - Refill prices: {}", service.getTitle(), 
                    service.getDetails() != null && service.getDetails().getRefillPrices() != null ? 
                    service.getDetails().getRefillPrices().size() : 0);
            });
            
            return ResponseEntity.ok(ApiResponse.success(services));
            
        } catch (Exception e) {
            log.error("Error getting services for frontend", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving services"));
        }
    }

    /**
     * Get services data with Instagram images for enhanced display.
     * Returns services with Instagram images when available, fallback to static images.
     */
    @GetMapping("/services/enhanced")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getEnhancedServices() {
        log.info("Getting enhanced services with Instagram images for frontend");
        
        try {
            // Get active treatments from main categories (WIMPERN)
            List<Treatment> treatments = treatmentRepository.findByCategoryAndActiveTrue(ETreatmentCategory.WIMPERN);
            log.info("Found {} treatments in WIMPERN category", treatments.size());
            
            // Load refill options for each treatment
            treatments.forEach(this::loadRefillOptions);
            
            // Convert to frontend DTOs with Instagram integration
            List<ServiceDto> services = treatments.stream()
                    .map(treatment -> ServiceDto.fromTreatment(treatment, instagramService))
                    .collect(Collectors.toList());
            
            log.info("Converted to {} enhanced service DTOs", services.size());
            services.forEach(service -> {
                log.info("Service: {} - Instagram image: {} - Refill prices: {}", 
                    service.getTitle(), 
                    service.getInstagramImageUrl() != null ? "Yes" : "No",
                    service.getDetails() != null && service.getDetails().getRefillPrices() != null ? 
                    service.getDetails().getRefillPrices().size() : 0);
            });
            
            return ResponseEntity.ok(ApiResponse.success(services));
            
        } catch (Exception e) {
            log.error("Error getting enhanced services for frontend", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving enhanced services"));
        }
    }

    /**
     * Get all active services including extras.
     */
    @GetMapping("/services/all")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getAllServices() {
        log.debug("Getting all services for frontend");
        
        try {
            List<Treatment> treatments = treatmentRepository.findByActiveTrue();
            
            // Load refill options for each treatment
            treatments.forEach(this::loadRefillOptions);
            
            List<ServiceDto> services = treatments.stream()
                    .map(ServiceDto::fromTreatment)
                    .collect(Collectors.toList());
            
            log.debug("Found {} total services for frontend", services.size());
            return ResponseEntity.ok(ApiResponse.success(services));
            
        } catch (Exception e) {
            log.error("Error getting all services for frontend", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving all services"));
        }
    }

    /**
     * Get services by category for frontend.
     */
    @GetMapping("/services/category/{category}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getServicesByCategory(
            @PathVariable ETreatmentCategory category) {
        
        log.debug("Getting services for category {} for frontend", category);
        
        try {
            List<Treatment> treatments = treatmentRepository.findByCategoryAndActiveTrue(category);
            
            // Load refill options for each treatment
            treatments.forEach(this::loadRefillOptions);
            
            List<ServiceDto> services = treatments.stream()
                    .map(ServiceDto::fromTreatment)
                    .collect(Collectors.toList());
            
            log.debug("Found {} services for category {} for frontend", services.size(), category);
            return ResponseEntity.ok(ApiResponse.success(services));
            
        } catch (Exception e) {
            log.error("Error getting services for category {} for frontend", category, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving services for category"));
        }
    }

    /**
     * Get a specific service by slug for frontend.
     */
    @GetMapping("/services/{slug}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<ServiceDto>> getService(@PathVariable String slug) {
        log.debug("Getting service {} for frontend", slug);
        
        try {
            Treatment treatment = treatmentRepository.findBySlug(slug)
                    .orElseThrow(() -> new IllegalArgumentException("Service not found: " + slug));
            
            // Load refill options
            loadRefillOptions(treatment);
            
            ServiceDto service = ServiceDto.fromTreatment(treatment);
            
            return ResponseEntity.ok(ApiResponse.success(service));
            
        } catch (IllegalArgumentException e) {
            log.warn("Service not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("Error getting service {} for frontend", slug, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving service"));
        }
    }

    /**
     * Helper method to load refill options for a treatment.
     */
    private void loadRefillOptions(Treatment treatment) {
        if (treatment.isHasRefillOptions()) {
            List<TreatmentRefill> refillOptions = treatmentRefillRepository.findByTreatmentIdAndActiveTrue(treatment.getId());
            treatment.setRefillOptions(refillOptions);
            log.info("Loaded {} refill options for treatment: {} (ID: {})", refillOptions.size(), treatment.getName(), treatment.getId());
            refillOptions.forEach(refill -> 
                log.info("  - Refill: {} weeks, {}€, {}", refill.getWeekThreshold(), refill.getPrice(), refill.getDescription())
            );
        } else {
            log.info("Treatment {} (ID: {}) has no refill options", treatment.getName(), treatment.getId());
        }
    }

    /**
     * Refresh Instagram posts cache.
     */
    @PostMapping("/instagram/refresh")
    public ResponseEntity<ApiResponse<String>> refreshInstagramPosts() {
        log.info("Refreshing Instagram posts cache");
        
        try {
            instagramService.refreshPosts();
            return ResponseEntity.ok(ApiResponse.success("Instagram posts refreshed successfully"));
            
        } catch (Exception e) {
            log.error("Error refreshing Instagram posts", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error refreshing Instagram posts"));
        }
    }

    /**
     * Get Instagram posts categorized by treatment type.
     */
    @GetMapping("/instagram/posts")
    public ResponseEntity<ApiResponse<Map<String, List<InstagramService.InstagramPost>>>> getInstagramPosts() {
        log.info("=== Getting categorized Instagram posts ===");
        
        try {
            Map<String, List<InstagramService.InstagramPost>> posts = instagramService.getCategorizedPosts();
            
            log.info("Instagram posts retrieved:");
            posts.forEach((category, postList) -> {
                log.info("  Category '{}': {} posts", category, postList.size());
                if (!postList.isEmpty()) {
                    log.info("    First post: {}", postList.get(0).getMediaUrl());
                }
            });
            
            if (posts.isEmpty() || posts.values().stream().allMatch(List::isEmpty)) {
                log.warn("No Instagram posts available - check if token is valid and posts exist");
            }
            
            return ResponseEntity.ok(ApiResponse.success(posts));
            
        } catch (Exception e) {
            log.error("Error getting Instagram posts", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving Instagram posts"));
        }
    }

    /**
     * Test endpoint to check Instagram API directly.
     */
    @GetMapping("/instagram/test")
    public ResponseEntity<ApiResponse<String>> testInstagram() {
        log.info("=== TESTING INSTAGRAM API ===");
        
        try {
            Map<String, List<InstagramService.InstagramPost>> posts = instagramService.getCategorizedPosts();
            
            int totalPosts = posts.values().stream().mapToInt(List::size).sum();
            
            StringBuilder result = new StringBuilder();
            result.append("Total posts: ").append(totalPosts).append("\n\n");
            
            posts.forEach((category, postList) -> {
                result.append("Category '").append(category).append("': ").append(postList.size()).append(" posts\n");
                postList.forEach(post -> {
                    result.append("  - ").append(post.getCaption().substring(0, Math.min(50, post.getCaption().length())))
                          .append("...\n");
                    result.append("    URL: ").append(post.getMediaUrl()).append("\n");
                });
            });
            
            log.info("Instagram test result:\n{}", result);
            
            return ResponseEntity.ok(ApiResponse.success(result.toString()));
            
        } catch (Exception e) {
            log.error("Instagram test failed", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Instagram test failed: " + e.getMessage()));
        }
    }

    /**
     * Get mock Instagram posts for testing (when no token is configured).
     */
    @GetMapping("/instagram/posts/mock")
    public ResponseEntity<ApiResponse<Map<String, List<InstagramService.InstagramPost>>>> getMockInstagramPosts() {
        log.debug("Getting mock Instagram posts for testing");
        
        try {
            // Create mock Instagram posts for testing
            Map<String, List<InstagramService.InstagramPost>> mockPosts = new java.util.HashMap<>();
            
            // Mock posts for each treatment type - multiple images for carousel
            mockPosts.put("einzeltechnik", List.of(
                new InstagramService.InstagramPost("1", "Beautiful 1:1 lash technique #einzeltechnik", "IMAGE", 
                    "https://images.unsplash.com/photo-1588528402605-6e6e1b8f2b3a?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock1", "2025-12-28T10:00:00Z"),
                new InstagramService.InstagramPost("4", "Natural 1:1 lash extension result #einzeltechnik", "IMAGE", 
                    "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock4", "2025-12-28T13:00:00Z"),
                new InstagramService.InstagramPost("7", "Perfect 1:1 technique for everyday #einzeltechnik", "IMAGE", 
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock7", "2025-12-28T16:00:00Z")
            ));
            
            mockPosts.put("hybridtechnik", List.of(
                new InstagramService.InstagramPost("2", "Stunning hybrid lash look #hybrid", "IMAGE", 
                    "https://images.unsplash.com/photo-1594359930464-01a68c5be4b5?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock2", "2025-12-28T11:00:00Z"),
                new InstagramService.InstagramPost("5", "Hybrid technique with perfect volume #hybrid", "IMAGE", 
                    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock5", "2025-12-28T14:00:00Z"),
                new InstagramService.InstagramPost("8", "Beautiful hybrid lashes for special occasions #hybrid", "IMAGE", 
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock8", "2025-12-28T17:00:00Z")
            ));
            
            mockPosts.put("volumentechnik", List.of(
                new InstagramService.InstagramPost("3", "Amazing volume lashes #volumen", "IMAGE", 
                    "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock3", "2025-12-28T12:00:00Z"),
                new InstagramService.InstagramPost("6", "Dramatic volume technique result #volumen", "IMAGE", 
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock6", "2025-12-28T15:00:00Z"),
                new InstagramService.InstagramPost("9", "Mega volume lashes for photoshoots #volumen", "IMAGE", 
                    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=750&fit=crop&q=80", 
                    "https://instagram.com/p/mock9", "2025-12-28T18:00:00Z")
            ));
            
            return ResponseEntity.ok(ApiResponse.success(mockPosts));
            
        } catch (Exception e) {
            log.error("Error getting mock Instagram posts", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving mock Instagram posts"));
        }
    }

    /**
     * Get Google reviews for testimonials section.
     * Returns mock data for now - integrate with Google Places API later.
     */
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReviews() {
        log.debug("Getting reviews for frontend");
        
        try {
            // Mock review data - replace with actual Google Places API integration
            Map<String, Object> reviewData = new java.util.HashMap<>();
            
            List<Map<String, Object>> reviews = List.of(
                Map.of(
                    "author_name", "Sarah M.",
                    "rating", 5,
                    "text", "Lisa ist einfach die Beste! Meine Wimpern sehen so natürlich und wunderschön aus. Ich komme immer wieder gerne.",
                    "time", System.currentTimeMillis() / 1000 - 86400 * 7,
                    "relative_time_description", "vor einer Woche"
                ),
                Map.of(
                    "author_name", "Julia K.",
                    "rating", 5,
                    "text", "Absolut professionell und das Ergebnis ist perfekt. Das Studio ist super gemütlich und Lisa nimmt sich viel Zeit.",
                    "time", System.currentTimeMillis() / 1000 - 86400 * 14,
                    "relative_time_description", "vor 2 Wochen"
                ),
                Map.of(
                    "author_name", "Anna L.",
                    "rating", 5,
                    "text", "Ich bin so happy mit meinen neuen Wimpern! Lisa berät super und das Ergebnis hält ewig. Absolute Empfehlung!",
                    "time", System.currentTimeMillis() / 1000 - 86400 * 21,
                    "relative_time_description", "vor 3 Wochen"
                )
            );
            
            reviewData.put("reviews", reviews);
            reviewData.put("rating", 5.0);
            reviewData.put("user_ratings_total", 47);
            
            return ResponseEntity.ok(ApiResponse.success(reviewData));
            
        } catch (Exception e) {
            log.error("Error getting reviews", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving reviews"));
        }
    }
}
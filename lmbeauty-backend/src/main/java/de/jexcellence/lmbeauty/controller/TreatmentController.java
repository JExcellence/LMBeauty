package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.config.TreatmentSeedingConfig;
import de.jexcellence.lmbeauty.dto.ApiResponse;
import de.jexcellence.lmbeauty.dto.booking.TreatmentRequest;
import de.jexcellence.lmbeauty.dto.booking.TreatmentResponse;
import de.jexcellence.lmbeauty.dto.refill.RefillOptionDto;
import de.jexcellence.lmbeauty.service.TreatmentService;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/treatments")
@RequiredArgsConstructor
@Slf4j
public class TreatmentController {

    private final TreatmentService treatmentService;
    private final TreatmentSeedingConfig seedingConfig;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TreatmentResponse>>> getActiveTreatments(
            @RequestParam(required = false) ETreatmentCategory category,
            @RequestParam(required = false) String service) {
        
        log.debug("Getting treatments with category={}, service={}", category, service);
        
        try {
            List<TreatmentResponse> treatments;
            
            if (service != null) {
                // Filter by service parameter (URL slug)
                if (!seedingConfig.isValidServiceParam(service)) {
                    log.warn("Invalid service parameter: {}", service);
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error("Invalid service parameter: " + service));
                }
                
                treatments = treatmentService.getTreatmentsByUrlSlug(service);
                log.debug("Found {} treatments for service parameter: {}", treatments.size(), service);
                
            } else if (category != null) {
                treatments = treatmentService.getTreatmentsByCategory(category);
                log.debug("Found {} treatments for category: {}", treatments.size(), category);
                
            } else {
                treatments = treatmentService.getActiveTreatments();
                log.debug("Found {} active treatments", treatments.size());
            }
            
            return ResponseEntity.ok(ApiResponse.success(treatments));
            
        } catch (Exception e) {
            log.error("Error getting treatments", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving treatments"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TreatmentResponse>> getTreatment(@PathVariable Long id) {
        TreatmentResponse treatment = treatmentService.getTreatmentById(id);
        return ResponseEntity.ok(ApiResponse.success(treatment));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<TreatmentResponse>> getTreatmentBySlug(@PathVariable String slug) {
        TreatmentResponse treatment = treatmentService.getTreatmentBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(treatment));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<TreatmentResponse>>> getTreatmentsByCategory(
            @PathVariable ETreatmentCategory category) {
        List<TreatmentResponse> treatments = treatmentService.getTreatmentsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(treatments));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TreatmentResponse>>> getAllTreatments() {
        List<TreatmentResponse> treatments = treatmentService.getAllTreatments();
        return ResponseEntity.ok(ApiResponse.success(treatments));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TreatmentResponse>> createTreatment(
            @Valid @RequestBody TreatmentRequest request) {
        try {
            TreatmentResponse treatment = treatmentService.createTreatment(request);
            return ResponseEntity.ok(ApiResponse.success(treatment));
        } catch (IllegalArgumentException e) {
            log.warn("Failed to create treatment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating treatment", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error creating treatment: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TreatmentResponse>> updateTreatment(
            @PathVariable Long id,
            @Valid @RequestBody TreatmentRequest request) {
        TreatmentResponse treatment = treatmentService.updateTreatment(id, request);
        return ResponseEntity.ok(ApiResponse.success(treatment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTreatment(@PathVariable Long id) {
        treatmentService.deleteTreatment(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{id}/new-version")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TreatmentResponse>> createNewVersion(
            @PathVariable Long id,
            @Valid @RequestBody TreatmentRequest request) {
        TreatmentResponse treatment = treatmentService.createNewVersion(id, request);
        return ResponseEntity.ok(ApiResponse.success(treatment));
    }

    // ===== URL PARAMETER AND SERVICE SUPPORT ENDPOINTS =====

    @GetMapping("/url-slug/{urlSlug}")
    public ResponseEntity<ApiResponse<List<TreatmentResponse>>> getTreatmentsByUrlSlug(
            @PathVariable String urlSlug) {
        
        log.debug("Getting treatments by URL slug: {}", urlSlug);
        
        try {
            List<TreatmentResponse> treatments = treatmentService.getTreatmentsByUrlSlug(urlSlug);
            
            if (treatments.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(ApiResponse.success(treatments));
            
        } catch (Exception e) {
            log.error("Error getting treatments by URL slug", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving treatments"));
        }
    }

    @GetMapping("/validate-service/{serviceParam}")
    public ResponseEntity<Map<String, Object>> validateServiceParameter(@PathVariable String serviceParam) {
        
        log.debug("Validating service parameter: {}", serviceParam);
        
        if (!seedingConfig.isValidServiceParam(serviceParam)) {
            return ResponseEntity.notFound().build();
        }
        
        TreatmentSeedingConfig.ServiceMapping mapping = seedingConfig.getServiceMapping(serviceParam);
        List<TreatmentResponse> treatments = treatmentService.getTreatmentsByUrlSlug(serviceParam);
        
        Map<String, Object> response = Map.of(
            "serviceParam", serviceParam,
            "valid", true,
            "mapping", mapping,
            "treatments", treatments,
            "treatmentCount", treatments.size()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/service-parameters")
    public ResponseEntity<ApiResponse<List<String>>> getValidServiceParameters() {
        log.debug("Getting valid service parameters");
        
        List<String> validParams = seedingConfig.getValidServiceParams();
        return ResponseEntity.ok(ApiResponse.success(validParams));
    }

    // ===== REFILL MANAGEMENT ENDPOINTS =====

    @GetMapping("/{id}/refills")
    public ResponseEntity<ApiResponse<List<RefillOptionDto>>> getRefillOptions(
            @PathVariable Long id) {
        
        log.debug("Getting refill options for treatment: {}", id);
        
        try {
            List<RefillOptionDto> refillOptions = treatmentService.getRefillOptions(id);
            return ResponseEntity.ok(ApiResponse.success(refillOptions));
            
        } catch (IllegalArgumentException e) {
            log.warn("Treatment not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("Error getting refill options", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving refill options"));
        }
    }

    @PutMapping("/{id}/url-slug")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> setUrlSlug(
            @PathVariable Long id,
            @RequestParam String urlSlug) {
        
        log.debug("Setting URL slug '{}' for treatment: {}", urlSlug, id);
        
        try {
            treatmentService.setUrlSlug(id, urlSlug);
            return ResponseEntity.ok(ApiResponse.success(null));
            
        } catch (IllegalArgumentException e) {
            log.warn("Treatment not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("Error setting URL slug", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error setting URL slug"));
        }
    }

    @PutMapping("/{id}/refill-options")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> setRefillOptionsEnabled(
            @PathVariable Long id,
            @RequestParam boolean enabled) {
        
        log.debug("Setting refill options enabled={} for treatment: {}", enabled, id);
        
        try {
            treatmentService.setRefillOptionsEnabled(id, enabled);
            return ResponseEntity.ok(ApiResponse.success(null));
            
        } catch (IllegalArgumentException e) {
            log.warn("Treatment not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("Error setting refill options", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error setting refill options"));
        }
    }

    // ===== ADMIN MANAGEMENT ENDPOINTS =====

    @GetMapping("/{id}/audit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTreatmentAuditHistory(
            @PathVariable Long id) {
        
        log.debug("Getting audit history for treatment: {}", id);
        
        try {
            // Verify treatment exists
            treatmentService.findById(id);
            
            // Get audit history - for now return empty list
            // In a real implementation, this would fetch from TreatmentAuditRepository
            List<Map<String, Object>> auditHistory = List.of();
            
            return ResponseEntity.ok(ApiResponse.success(auditHistory));
            
        } catch (IllegalArgumentException e) {
            log.warn("Treatment not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("Error getting audit history", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving audit history"));
        }
    }

    @PutMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpdateTreatments(
            @RequestBody List<Map<String, Object>> updates) {
        
        log.debug("Bulk updating {} treatments", updates.size());
        
        try {
            int successCount = 0;
            int errorCount = 0;
            List<String> errors = new java.util.ArrayList<>();
            
            for (Map<String, Object> update : updates) {
                try {
                    Long id = Long.valueOf(update.get("id").toString());
                    String urlSlug = (String) update.get("urlSlug");
                    Boolean hasRefillOptions = (Boolean) update.get("hasRefillOptions");
                    
                    if (urlSlug != null) {
                        treatmentService.setUrlSlug(id, urlSlug);
                    }
                    
                    if (hasRefillOptions != null) {
                        treatmentService.setRefillOptionsEnabled(id, hasRefillOptions);
                    }
                    
                    successCount++;
                    
                } catch (Exception e) {
                    errorCount++;
                    errors.add("Treatment " + update.get("id") + ": " + e.getMessage());
                    log.warn("Error updating treatment {}: {}", update.get("id"), e.getMessage());
                }
            }
            
            Map<String, Object> result = Map.of(
                "totalProcessed", updates.size(),
                "successCount", successCount,
                "errorCount", errorCount,
                "errors", errors
            );
            
            return ResponseEntity.ok(ApiResponse.success(result));
            
        } catch (Exception e) {
            log.error("Error during bulk update", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error during bulk update"));
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTreatmentStatistics() {
        log.debug("Getting treatment statistics");
        
        try {
            List<TreatmentResponse> allTreatments = treatmentService.getAllTreatments();
            List<TreatmentResponse> activeTreatments = treatmentService.getActiveTreatments();
            
            long treatmentsWithRefills = allTreatments.stream()
                    .mapToLong(t -> treatmentService.supportsRefills(Long.valueOf(t.id())) ? 1 : 0)
                    .sum();
            
            Map<ETreatmentCategory, Long> categoryCount = allTreatments.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            t -> t.category(),
                            java.util.stream.Collectors.counting()
                    ));
            
            Map<String, Object> statistics = Map.of(
                "totalTreatments", allTreatments.size(),
                "activeTreatments", activeTreatments.size(),
                "inactiveTreatments", allTreatments.size() - activeTreatments.size(),
                "treatmentsWithRefills", treatmentsWithRefills,
                "treatmentsByCategory", categoryCount,
                "validServiceParams", seedingConfig.getValidServiceParams().size()
            );
            
            return ResponseEntity.ok(ApiResponse.success(statistics));
            
        } catch (Exception e) {
            log.error("Error getting treatment statistics", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error retrieving statistics"));
        }
    }
}

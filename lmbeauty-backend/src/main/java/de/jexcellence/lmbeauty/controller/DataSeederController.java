package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.config.TreatmentSeedingConfig;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.dto.seeding.SeedingResult;
import de.jexcellence.lmbeauty.dto.seeding.SeedingStatus;
import de.jexcellence.lmbeauty.service.TreatmentDataSeederService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for administrative data seeding operations.
 * This controller provides endpoints for seeding the database with treatment data.
 */
@RestController
@RequestMapping("/api/admin/seed")
@RequiredArgsConstructor
@Slf4j
public class DataSeederController {

    private final TreatmentDataSeederService seederService;
    private final TreatmentSeedingConfig seedingConfig;

    @PostMapping("/treatments")
    public ResponseEntity<SeedingResult> seedTreatmentData() {
        log.info("Admin requested treatment data seeding");
        
        try {
            // For now, create a mock admin user - in real implementation,
            // this would come from authentication context
            User adminUser = createMockAdminUser();
            
            SeedingResult result = seederService.seedTreatmentData(adminUser);
            
            if (result.isSuccess()) {
                log.info("Treatment data seeding completed successfully");
                return ResponseEntity.ok(result);
            } else {
                log.error("Treatment data seeding failed: {}", result.getMessage());
                return ResponseEntity.internalServerError().body(result);
            }
            
        } catch (Exception e) {
            log.error("Error during treatment data seeding", e);
            
            SeedingResult errorResult = new SeedingResult();
            errorResult.setSuccess(false);
            errorResult.setMessage("Seeding failed: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResult);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<SeedingStatus> getSeedingStatus() {
        log.debug("Admin requested seeding status");
        
        try {
            SeedingStatus status = seederService.validateSeededData();
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            log.error("Error getting seeding status", e);
            
            SeedingStatus errorStatus = new SeedingStatus();
            errorStatus.setValid(false);
            errorStatus.setValidationErrors(List.of("Error retrieving status: " + e.getMessage()));
            
            return ResponseEntity.internalServerError().body(errorStatus);
        }
    }

    @PostMapping("/rollback")
    public ResponseEntity<SeedingResult> rollbackTreatmentData() {
        log.info("Admin requested treatment data rollback");
        
        try {
            User adminUser = createMockAdminUser();
            
            SeedingResult result = seederService.rollbackTreatmentData(adminUser);
            
            if (result.isSuccess()) {
                log.info("Treatment data rollback completed successfully");
                return ResponseEntity.ok(result);
            } else {
                log.error("Treatment data rollback failed: {}", result.getMessage());
                return ResponseEntity.internalServerError().body(result);
            }
            
        } catch (Exception e) {
            log.error("Error during treatment data rollback", e);
            
            SeedingResult errorResult = new SeedingResult();
            errorResult.setSuccess(false);
            errorResult.setMessage("Rollback failed: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResult);
        }
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getSeedingConfig() {
        log.debug("Admin requested seeding configuration");
        
        Map<String, Object> config = Map.of(
            "serviceMapping", seedingConfig.getServiceMapping(),
            "treatments", seedingConfig.getTreatments(),
            "totalTreatmentCount", seedingConfig.getTotalTreatmentCount(),
            "totalRefillOptionCount", seedingConfig.getTotalRefillOptionCount(),
            "validServiceParams", seedingConfig.getValidServiceParams()
        );
        
        return ResponseEntity.ok(config);
    }

    @GetMapping("/validate-service/{serviceParam}")
    public ResponseEntity<Map<String, Object>> validateServiceParameter(@PathVariable String serviceParam) {
        log.debug("Validating service parameter: {}", serviceParam);
        
        if (!seedingConfig.isValidServiceParam(serviceParam)) {
            return ResponseEntity.notFound().build();
        }
        
        TreatmentSeedingConfig.ServiceMapping mapping = seedingConfig.getServiceMapping(serviceParam);
        List<TreatmentSeedingConfig.TreatmentDefinition> treatments = seedingConfig.getTreatmentsForService(serviceParam);
        
        Map<String, Object> response = Map.of(
            "serviceParam", serviceParam,
            "valid", true,
            "mapping", mapping,
            "treatments", treatments,
            "treatmentCount", treatments.size()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/treatment/{urlSlug}")
    public ResponseEntity<TreatmentSeedingConfig.TreatmentDefinition> getTreatmentDefinition(@PathVariable String urlSlug) {
        log.debug("Getting treatment definition for URL slug: {}", urlSlug);
        
        TreatmentSeedingConfig.TreatmentDefinition treatment = seedingConfig.getTreatmentByUrlSlug(urlSlug);
        
        if (treatment == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(treatment);
    }

    @GetMapping("/preview")
    public ResponseEntity<Map<String, Object>> previewSeeding() {
        log.debug("Admin requested seeding preview");
        
        Map<String, Object> preview = Map.of(
            "treatmentsToCreate", seedingConfig.getTreatments(),
            "totalTreatments", seedingConfig.getTotalTreatmentCount(),
            "totalRefillOptions", seedingConfig.getTotalRefillOptionCount(),
            "serviceMapping", seedingConfig.getServiceMapping(),
            "validServiceParams", seedingConfig.getValidServiceParams()
        );
        
        return ResponseEntity.ok(preview);
    }

    /**
     * Create a mock admin user for seeding operations.
     * In a real implementation, this would come from the authentication context.
     */
    private User createMockAdminUser() {
        User adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@lmbeauty.com");
        adminUser.setFirstName("System");
        adminUser.setLastName("Admin");
        return adminUser;
    }
}
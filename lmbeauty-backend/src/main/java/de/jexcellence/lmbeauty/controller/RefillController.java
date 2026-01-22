package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.dto.refill.RefillEligibilityResponse;
import de.jexcellence.lmbeauty.dto.refill.RefillOptionDto;
import de.jexcellence.lmbeauty.service.RefillCalculationService;
import de.jexcellence.lmbeauty.service.TreatmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for refill-related operations.
 */
@RestController
@RequestMapping("/api/refills")
@RequiredArgsConstructor
@Slf4j
public class RefillController {

    private final RefillCalculationService refillCalculationService;
    private final TreatmentService treatmentService;

    @GetMapping("/calculate")
    public ResponseEntity<RefillEligibilityResponse> calculateRefillEligibility(
            @RequestParam Long customerId,
            @RequestParam Long treatmentId) {
        
        log.debug("Calculating refill eligibility for customer {} and treatment {}", customerId, treatmentId);
        
        try {
            RefillEligibilityResponse eligibility = refillCalculationService
                    .calculateRefillEligibility(customerId, treatmentId);
            return ResponseEntity.ok(eligibility);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for refill eligibility: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error calculating refill eligibility", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/calculate/category")
    public ResponseEntity<RefillEligibilityResponse> calculateRefillEligibilityByCategory(
            @RequestParam Long customerId,
            @RequestParam String category) {
        
        log.debug("Calculating refill eligibility for customer {} and category {}", customerId, category);
        
        try {
            RefillEligibilityResponse eligibility = refillCalculationService
                    .calculateRefillEligibilityForCategory(customerId, category);
            return ResponseEntity.ok(eligibility);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for refill eligibility by category: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error calculating refill eligibility by category", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/best-option")
    public ResponseEntity<RefillOptionDto> getBestRefillOption(
            @RequestParam Long customerId,
            @RequestParam Long treatmentId) {
        
        log.debug("Getting best refill option for customer {} and treatment {}", customerId, treatmentId);
        
        try {
            Optional<RefillOptionDto> bestOption = refillCalculationService
                    .getBestRefillOption(customerId, treatmentId);
            
            return bestOption
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.noContent().build());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for best refill option: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error getting best refill option", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/eligible")
    public ResponseEntity<Boolean> isEligibleForRefill(
            @RequestParam Long customerId,
            @RequestParam Long treatmentId,
            @RequestParam(defaultValue = "4") int maxWeeks) {
        
        log.debug("Checking refill eligibility for customer {} and treatment {} within {} weeks", 
                 customerId, treatmentId, maxWeeks);
        
        try {
            boolean eligible = refillCalculationService.isEligibleForRefill(customerId, treatmentId, maxWeeks);
            return ResponseEntity.ok(eligible);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for refill eligibility check: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error checking refill eligibility", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/treatments/{treatmentId}/options")
    public ResponseEntity<List<RefillOptionDto>> getRefillOptions(@PathVariable Long treatmentId) {
        
        log.debug("Getting refill options for treatment: {}", treatmentId);
        
        try {
            List<RefillOptionDto> options = treatmentService.getRefillOptions(treatmentId);
            return ResponseEntity.ok(options);
        } catch (IllegalArgumentException e) {
            log.warn("Treatment not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error getting refill options", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/treatments/{treatmentId}/options")
    public ResponseEntity<RefillOptionDto> addRefillOption(
            @PathVariable Long treatmentId,
            @RequestParam Integer weekThreshold,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description) {
        
        log.debug("Adding refill option to treatment {}: {} weeks, {} EUR", treatmentId, weekThreshold, price);
        
        try {
            RefillOptionDto refillOption = treatmentService
                    .addRefillOption(treatmentId, weekThreshold, price, description);
            return ResponseEntity.status(201).body(refillOption);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for adding refill option: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error adding refill option", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/options/{refillId}")
    public ResponseEntity<RefillOptionDto> updateRefillOption(
            @PathVariable Long refillId,
            @RequestParam(required = false) Integer weekThreshold,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) String description) {
        
        log.debug("Updating refill option: {}", refillId);
        
        try {
            RefillOptionDto refillOption = treatmentService
                    .updateRefillOption(refillId, weekThreshold, price, description);
            return ResponseEntity.ok(refillOption);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for updating refill option: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error updating refill option", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/options/{refillId}")
    public ResponseEntity<Void> deleteRefillOption(@PathVariable Long refillId) {
        
        log.debug("Deleting refill option: {}", refillId);
        
        try {
            treatmentService.removeRefillOption(refillId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Refill option not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting refill option", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/treatments/{treatmentId}/supports-refills")
    public ResponseEntity<Boolean> supportsRefills(@PathVariable Long treatmentId) {
        
        log.debug("Checking if treatment {} supports refills", treatmentId);
        
        try {
            boolean supportsRefills = treatmentService.supportsRefills(treatmentId);
            return ResponseEntity.ok(supportsRefills);
        } catch (IllegalArgumentException e) {
            log.warn("Treatment not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error checking refill support", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
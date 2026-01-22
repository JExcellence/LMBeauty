package de.jexcellence.lmbeauty.dto.seeding;

import lombok.Data;

import java.util.List;

/**
 * DTO for seeding validation status.
 */
@Data
public class SeedingStatus {
    
    private boolean valid;
    private List<String> validationErrors;
    private int totalTreatments;
    private int totalRefillOptions;
    
    /**
     * Check if there are any validation errors.
     */
    public boolean hasErrors() {
        return validationErrors != null && !validationErrors.isEmpty();
    }
    
    /**
     * Get the number of validation errors.
     */
    public int getErrorCount() {
        return validationErrors != null ? validationErrors.size() : 0;
    }
}
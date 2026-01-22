package de.jexcellence.lmbeauty.dto.seeding;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for seeding operation results.
 */
@Data
public class SeedingResult {
    
    private boolean success;
    private String message;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    private boolean backupCreated;
    private int backupCount;
    private int treatmentsCreated;
    private int refillOptionsCreated;
    
    /**
     * Get the duration of the seeding operation in milliseconds.
     */
    public long getDurationMs() {
        if (startTime != null && endTime != null) {
            return java.time.Duration.between(startTime, endTime).toMillis();
        }
        return 0;
    }
    
    /**
     * Check if the operation is still running.
     */
    public boolean isRunning() {
        return startTime != null && endTime == null;
    }
}
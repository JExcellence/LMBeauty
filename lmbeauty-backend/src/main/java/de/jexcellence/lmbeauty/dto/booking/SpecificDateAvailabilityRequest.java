package de.jexcellence.lmbeauty.dto.booking;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record SpecificDateAvailabilityRequest(
    @NotNull(message = "Date is required")
    LocalDate date,
    
    @NotNull(message = "Start time is required")
    LocalTime startTime,
    
    @NotNull(message = "End time is required")
    LocalTime endTime,
    
    Boolean active,
    
    String reason
) {
}
package de.jexcellence.lmbeauty.dto.booking;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record BlockedPeriodRequest(
    @NotNull(message = "Start date time is required")
    LocalDateTime startDateTime,

    @NotNull(message = "End date time is required")
    LocalDateTime endDateTime,

    String reason
) {}

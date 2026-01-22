package de.jexcellence.lmbeauty.dto.booking;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record BookAppointmentRequest(
    @NotNull(message = "Treatment ID is required")
    Long treatmentId,

    @NotNull(message = "Scheduled time is required")
    LocalDateTime scheduledAt,

    String customerNotes
) {}

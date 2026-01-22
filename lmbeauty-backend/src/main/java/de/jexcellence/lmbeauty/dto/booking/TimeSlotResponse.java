package de.jexcellence.lmbeauty.dto.booking;

import java.time.LocalDateTime;

public record TimeSlotResponse(
    LocalDateTime startTime,
    LocalDateTime endTime,
    boolean available
) {}

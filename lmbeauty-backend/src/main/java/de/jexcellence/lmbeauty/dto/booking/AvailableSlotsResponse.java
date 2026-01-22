package de.jexcellence.lmbeauty.dto.booking;

import java.time.LocalDate;
import java.util.List;

public record AvailableSlotsResponse(
    LocalDate date,
    Long treatmentId,
    List<TimeSlotResponse> slots
) {}

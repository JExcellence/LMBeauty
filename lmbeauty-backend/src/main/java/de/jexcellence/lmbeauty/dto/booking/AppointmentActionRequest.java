package de.jexcellence.lmbeauty.dto.booking;

public record AppointmentActionRequest(
    String reason,
    String ownerNotes
) {}

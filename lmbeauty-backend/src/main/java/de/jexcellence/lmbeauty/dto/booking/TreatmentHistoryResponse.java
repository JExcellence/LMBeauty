package de.jexcellence.lmbeauty.dto.booking;

import java.util.List;

public record TreatmentHistoryResponse(
    int totalAppointments,
    int completedAppointments,
    List<AppointmentResponse> appointments
) {}

package de.jexcellence.lmbeauty.dto.booking;

import java.time.LocalDateTime;
import java.util.List;

public record CustomerProfileResponse(
    Long id,
    String name,
    String email,
    String phone,
    LocalDateTime createdAt,
    int totalAppointments,
    int completedAppointments,
    LocalDateTime lastVisit,
    LoyaltyStatusResponse loyaltyStatus,
    List<AppointmentResponse> recentAppointments,
    String notes
) {}

package de.jexcellence.lmbeauty.dto.booking;

import java.math.BigDecimal;
import java.util.List;

public record DashboardMetricsResponse(
    int todayAppointments,
    int pendingAppointments,
    int confirmedAppointments,
    int completedThisWeek,
    BigDecimal weeklyRevenue,
    int totalCustomers,
    int newCustomersThisMonth,
    List<AppointmentResponse> upcomingAppointments
) {}

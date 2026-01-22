package de.jexcellence.lmbeauty.dto.booking;

import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import java.time.LocalDateTime;

public record AppointmentResponse(
    Long id,
    CustomerSummary customer,
    TreatmentResponse treatment,
    LocalDateTime scheduledAt,
    Integer durationMinutes,
    EAppointmentStatus status,
    String customerNotes,
    String ownerNotes,
    String rejectionReason,
    LocalDateTime confirmedAt,
    LocalDateTime cancelledAt,
    LocalDateTime completedAt,
    LocalDateTime createdAt
) {
    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
            appointment.getId(),
            CustomerSummary.from(appointment.getCustomer()),
            TreatmentResponse.from(appointment.getTreatment()),
            appointment.getScheduledAt(),
            appointment.getDurationMinutes(),
            appointment.getStatus(),
            appointment.getCustomerNotes(),
            appointment.getOwnerNotes(),
            appointment.getRejectionReason(),
            appointment.getConfirmedAt(),
            appointment.getCancelledAt(),
            appointment.getCompletedAt(),
            appointment.getCreatedAt()
        );
    }
}

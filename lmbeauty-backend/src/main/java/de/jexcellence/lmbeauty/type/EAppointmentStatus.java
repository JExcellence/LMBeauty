package de.jexcellence.lmbeauty.type;

/**
 * Appointment status enum representing the lifecycle states of an appointment.
 */
public enum EAppointmentStatus {
    PENDING,      // Awaiting owner approval
    CONFIRMED,    // Approved by owner
    REJECTED,     // Rejected by owner
    CANCELLED,    // Cancelled by customer or owner
    COMPLETED,    // Service delivered
    NO_SHOW       // Customer didn't show up
}

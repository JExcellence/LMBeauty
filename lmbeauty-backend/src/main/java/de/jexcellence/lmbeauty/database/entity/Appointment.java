package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * Appointment entity representing a scheduled booking for a treatment.
 */
@Entity
@Table(name = "appointments")
@Data
@EqualsAndHashCode(callSuper = true)
public class Appointment extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is required")
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "treatment_id", nullable = false)
    @NotNull(message = "Treatment is required")
    private Treatment treatment;

    @Column(name = "scheduled_at", nullable = false)
    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledAt;

    @Column(name = "duration_minutes", nullable = false)
    @NotNull(message = "Duration is required")
    private Integer durationMinutes;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private EAppointmentStatus status = EAppointmentStatus.PENDING;

    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;

    @Column(name = "owner_notes", columnDefinition = "TEXT")
    private String ownerNotes;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}

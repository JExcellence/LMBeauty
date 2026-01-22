package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * LoyaltyStamp entity representing a stamp earned in the loyalty program.
 * Customers earn one stamp per completed appointment.
 * After 10 stamps, they receive a 15% discount on their next booking.
 */
@Entity
@Table(name = "loyalty_stamps")
@Data
@EqualsAndHashCode(callSuper = true)
public class LoyaltyStamp extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    @NotNull(message = "Appointment is required")
    private Appointment appointment;

    @Column(name = "earned_at", nullable = false)
    @NotNull(message = "Earned date is required")
    private LocalDateTime earnedAt;

    @Column(name = "redeemed", nullable = false)
    private boolean redeemed = false;

    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;

    @Column(name = "cycle_number", nullable = false)
    private Integer cycleNumber = 1;
}

package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * BlockedPeriod entity representing time periods when the owner is unavailable.
 */
@Entity
@Table(name = "blocked_periods")
@Data
@EqualsAndHashCode(callSuper = true)
public class BlockedPeriod extends AbstractEntity {

    @Column(name = "start_date_time", nullable = false)
    @NotNull(message = "Start date time is required")
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    @NotNull(message = "End date time is required")
    private LocalDateTime endDateTime;

    @Column(name = "reason", length = 500)
    private String reason;

    /**
     * Validates that start datetime is before end datetime.
     */
    @PrePersist
    @PreUpdate
    private void validateDateTimeRange() {
        if (startDateTime != null && endDateTime != null && !startDateTime.isBefore(endDateTime)) {
            throw new IllegalArgumentException("Start date time must be before end date time");
        }
    }
}

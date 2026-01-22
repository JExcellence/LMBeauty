package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.DayOfWeek;
import java.time.LocalTime;

/**
 * WeeklyAvailability entity representing recurring availability slots for the salon owner.
 */
@Entity
@Table(name = "weekly_availability")
@Data
@EqualsAndHashCode(callSuper = true)
public class WeeklyAvailability extends AbstractEntity {

    @Column(name = "day_of_week", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    /**
     * Validates that start time is before end time.
     */
    @PrePersist
    @PreUpdate
    private void validateTimeRange() {
        if (startTime != null && endTime != null && !startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }
}

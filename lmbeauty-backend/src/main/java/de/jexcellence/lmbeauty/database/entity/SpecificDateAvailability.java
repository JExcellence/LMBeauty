package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "specific_date_availability")
@Data
@EqualsAndHashCode(callSuper = true)
public class SpecificDateAvailability extends AbstractEntity {

    @Column(name = "date", nullable = false)
    @NotNull(message = "Date is required")
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "reason")
    private String reason; // Optional reason for the specific date override

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
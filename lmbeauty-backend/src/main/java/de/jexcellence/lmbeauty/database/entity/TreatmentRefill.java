package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * TreatmentRefill entity representing time-based refill pricing for treatments.
 * Allows treatments to have different pricing based on weeks since last appointment.
 */
@Entity
@Table(name = "treatment_refills")
@Data
@EqualsAndHashCode(callSuper = true)
public class TreatmentRefill extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "treatment_id", nullable = false)
    @NotNull(message = "Treatment is required")
    private Treatment treatment;

    @Column(name = "week_threshold", nullable = false)
    @NotNull(message = "Week threshold is required")
    @Min(value = 1, message = "Week threshold must be at least 1")
    @Max(value = 52, message = "Week threshold must not exceed 52")
    private Integer weekThreshold;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Refill price is required")
    @Positive(message = "Refill price must be positive")
    private BigDecimal price;

    @Column(name = "description", length = 100)
    @Size(max = 100, message = "Description must not exceed 100 characters")
    private String description;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    /**
     * Constructor for creating a refill option.
     */
    public TreatmentRefill() {
        super();
    }

    /**
     * Constructor with parameters for easy creation.
     */
    public TreatmentRefill(Treatment treatment, Integer weekThreshold, BigDecimal price, String description) {
        this();
        this.treatment = treatment;
        this.weekThreshold = weekThreshold;
        this.price = price;
        this.description = description;
    }

    /**
     * Check if this refill option is applicable for the given weeks since last appointment.
     */
    public boolean isApplicableForWeeks(int weeksSinceLastAppointment) {
        return weeksSinceLastAppointment <= this.weekThreshold;
    }

    @Override
    public String toString() {
        return "TreatmentRefill{" +
                "id=" + getId() +
                ", weekThreshold=" + weekThreshold +
                ", price=" + price +
                ", description='" + description + '\'' +
                ", active=" + active +
                '}';
    }
}
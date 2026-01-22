package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Treatment entity representing a beauty service offered by the salon.
 */
@Entity
@Table(name = "treatments")
@Data
@EqualsAndHashCode(callSuper = true)
public class Treatment extends AbstractEntity {

    @Column(name = "name", nullable = false)
    @NotBlank(message = "Treatment name is required")
    private String name;

    @Column(name = "slug", nullable = false, unique = true)
    @NotBlank(message = "Slug is required")
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Category is required")
    private ETreatmentCategory category;

    @Column(name = "duration_minutes", nullable = false)
    @NotNull(message = "Duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 240, message = "Duration must not exceed 240 minutes")
    private Integer durationMinutes;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "version_number")
    private Integer versionNumber = 1;

    @Column(name = "previous_version_id")
    private Long previousVersionId;

    @Column(name = "url_slug", length = 100)
    @Size(max = 100, message = "URL slug must not exceed 100 characters")
    private String urlSlug;

    @Column(name = "has_refill_options")
    private boolean hasRefillOptions = false;

    @OneToMany(mappedBy = "treatment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TreatmentRefill> refillOptions = new ArrayList<>();

    /**
     * Add a refill option to this treatment.
     */
    public void addRefillOption(TreatmentRefill refillOption) {
        refillOptions.add(refillOption);
        refillOption.setTreatment(this);
        this.hasRefillOptions = true;
    }

    /**
     * Remove a refill option from this treatment.
     */
    public void removeRefillOption(TreatmentRefill refillOption) {
        refillOptions.remove(refillOption);
        refillOption.setTreatment(null);
        this.hasRefillOptions = !refillOptions.isEmpty();
    }

    /**
     * Check if this treatment supports refills.
     */
    public boolean supportsRefills() {
        return hasRefillOptions && !refillOptions.isEmpty();
    }
}

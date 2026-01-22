package de.jexcellence.lmbeauty.dto.booking;

import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record TreatmentRequest(
    @NotBlank(message = "Treatment name is required")
    String name,

    String slug,

    String description,

    @NotNull(message = "Category is required")
    ETreatmentCategory category,

    @NotNull(message = "Duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 240, message = "Duration must not exceed 240 minutes")
    Integer durationMinutes,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    BigDecimal price,

    String imageUrl,

    Boolean active,

    Integer sortOrder
) {}

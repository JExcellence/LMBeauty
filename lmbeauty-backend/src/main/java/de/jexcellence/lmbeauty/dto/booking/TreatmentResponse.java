package de.jexcellence.lmbeauty.dto.booking;

import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import java.math.BigDecimal;

public record TreatmentResponse(
    Long id,
    String name,
    String slug,
    String description,
    ETreatmentCategory category,
    Integer durationMinutes,
    BigDecimal price,
    String imageUrl,
    boolean active,
    Integer sortOrder,
    Integer versionNumber
) {
    public static TreatmentResponse from(Treatment treatment) {
        return new TreatmentResponse(
            treatment.getId(),
            treatment.getName(),
            treatment.getSlug(),
            treatment.getDescription(),
            treatment.getCategory(),
            treatment.getDurationMinutes(),
            treatment.getPrice(),
            treatment.getImageUrl(),
            treatment.isActive(),
            treatment.getSortOrder(),
            treatment.getVersionNumber()
        );
    }
}

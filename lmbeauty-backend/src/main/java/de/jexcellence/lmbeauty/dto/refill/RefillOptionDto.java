package de.jexcellence.lmbeauty.dto.refill;

import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for refill option information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefillOptionDto {

    private Long id;
    private Integer weekThreshold;
    private BigDecimal price;
    private String description;
    private boolean recommended;

    /**
     * Convert TreatmentRefill entity to DTO.
     */
    public static RefillOptionDto fromEntity(TreatmentRefill refill) {
        return RefillOptionDto.builder()
                .id(refill.getId())
                .weekThreshold(refill.getWeekThreshold())
                .price(refill.getPrice())
                .description(refill.getDescription())
                .recommended(false) // Will be set by service logic
                .build();
    }

    /**
     * Convert TreatmentRefill entity to DTO with recommendation flag.
     */
    public static RefillOptionDto fromEntity(TreatmentRefill refill, boolean recommended) {
        RefillOptionDto dto = fromEntity(refill);
        dto.setRecommended(recommended);
        return dto;
    }
}
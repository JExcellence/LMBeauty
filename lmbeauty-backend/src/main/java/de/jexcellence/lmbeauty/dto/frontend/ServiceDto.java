package de.jexcellence.lmbeauty.dto.frontend;

import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO that matches the frontend Service interface structure.
 * This provides all the data needed by the ServicesSection component.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {

    private String id;
    private String slug;
    private String title;
    private String personaTag;
    private String description;
    private PriceDto price;
    private Integer duration;
    private ImageDto image;
    private String badge;
    private String bookingUrl;
    private ServiceDetailsDto details;
    private String instagramImageUrl;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceDto {
        private BigDecimal amount;
        private String prefix;
        private String currency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDto {
        private String src;
        private String alt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceDetailsDto {
        private List<RefillPriceDto> refillPrices;
        private List<String> idealFor;
        private List<String> includes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefillPriceDto {
        private String weeks;
        private String price;
    }

    /**
     * Convert Treatment entity to frontend ServiceDto.
     */
    public static ServiceDto fromTreatment(Treatment treatment) {
        return fromTreatment(treatment, null);
    }

    /**
     * Convert Treatment entity to frontend ServiceDto with Instagram integration.
     */
    public static ServiceDto fromTreatment(Treatment treatment, de.jexcellence.lmbeauty.service.InstagramService instagramService) {
        String instagramImageUrl = null;
        if (instagramService != null) {
            instagramImageUrl = instagramService.getImageForTreatment(treatment.getSlug()).orElse(null);
        }

        return ServiceDto.builder()
                .id(treatment.getUrlSlug() != null ? treatment.getUrlSlug() : treatment.getSlug())
                .slug(treatment.getSlug())
                .title(treatment.getName())
                .personaTag(generatePersonaTag(treatment))
                .description(treatment.getDescription())
                .price(PriceDto.builder()
                        .amount(treatment.getPrice())
                        .prefix("ab")
                        .currency("€")
                        .build())
                .duration(treatment.getDurationMinutes())
                .image(ImageDto.builder()
                        .src(instagramImageUrl != null ? instagramImageUrl : treatment.getImageUrl())
                        .alt(treatment.getName() + " – " + generatePersonaTag(treatment))
                        .build())
                .badge(generateBadge(treatment))
                .bookingUrl("/online-booking?service=" + (treatment.getUrlSlug() != null ? treatment.getUrlSlug() : treatment.getSlug()))
                .details(ServiceDetailsDto.builder()
                        .refillPrices(generateRefillPrices(treatment))
                        .idealFor(generateIdealFor(treatment))
                        .includes(generateIncludes(treatment))
                        .build())
                .instagramImageUrl(instagramImageUrl)
                .build();
    }

    /**
     * Generate persona tag based on treatment characteristics.
     */
    private static String generatePersonaTag(Treatment treatment) {
        String name = treatment.getName().toLowerCase();
        
        if (name.contains("einzeltechnik") || name.contains("1:1")) {
            return "Der natürliche Weg";
        } else if (name.contains("hybrid")) {
            return "Mehr Fülle, natürlicher Ausdruck";
        } else if (name.contains("volumen")) {
            return "Ausdrucksstark und definiert";
        } else if (name.contains("lifting")) {
            return "Natürlich betont";
        } else if (name.contains("shellac") || name.contains("nägel")) {
            return "Gepflegt bis in die Fingerspitzen";
        } else {
            return "Perfekt für dich";
        }
    }

    /**
     * Generate badge based on treatment characteristics.
     */
    private static String generateBadge(Treatment treatment) {
        String name = treatment.getName().toLowerCase();
        
        if (name.contains("einzeltechnik") || name.contains("hybrid")) {
            return "popular";
        } else if (name.contains("volumen")) {
            return "premium";
        } else if (treatment.isHasRefillOptions()) {
            return "refill";
        }
        
        return null;
    }

    /**
     * Generate refill prices from treatment refill options.
     */
    private static List<RefillPriceDto> generateRefillPrices(Treatment treatment) {
        if (!treatment.isHasRefillOptions() || treatment.getRefillOptions() == null || treatment.getRefillOptions().isEmpty()) {
            return List.of();
        }

        return treatment.getRefillOptions().stream()
                .filter(TreatmentRefill::isActive)
                .map(refill -> RefillPriceDto.builder()
                        .weeks(
                                refill.getWeekThreshold() == 5 ?
                                "bis " + refill.getWeekThreshold() + " Wochen" :
                                "ab " + refill.getWeekThreshold() + " Wochen"
                        )
                        .price(refill.getPrice() + "€")
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Generate "ideal for" list based on treatment type.
     */
    private static List<String> generateIdealFor(Treatment treatment) {
        String name = treatment.getName().toLowerCase();
        
        if (name.contains("einzeltechnik") || name.contains("1:1")) {
            return List.of("Erstes Mal Wimpernverlängerung", "Alltag & Beruf", "Wer es natürlich mag");
        } else if (name.contains("hybrid")) {
            return List.of("Wer mehr möchte als 1:1 Technik", "Vielseitiger Alltag", "Besondere Anlässe");
        } else if (name.contains("volumen")) {
            return List.of("Besondere Anlässe", "Fotoshootings & Events", "Wer einen starken Look bevorzugt");
        } else if (name.contains("lifting")) {
            return List.of("Natürlicher Look", "Pflegeleicht", "Für alle Wimperntypen");
        } else {
            return List.of("Alle Hauttypen", "Besondere Anlässe", "Verwöhnmoment");
        }
    }

    /**
     * Generate "includes" list for all treatments.
     */
    private static List<String> generateIncludes(Treatment treatment) {
        String name = treatment.getName().toLowerCase();
        
        if (name.contains("volumen")) {
            return List.of("Ausführliche Beratung", "Augenpad-Anwendung", "Pflegehinweise");
        } else {
            return List.of("Persönliche Beratung", "Augenpad-Anwendung", "Pflegehinweise");
        }
    }
}
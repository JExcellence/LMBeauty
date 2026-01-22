package de.jexcellence.lmbeauty.config;

import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Configuration for treatment seeding data structure.
 */
@Configuration
@ConfigurationProperties(prefix = "lmbeauty.seeding")
@Data
public class TreatmentSeedingConfig {

    /**
     * Service parameter mappings for URL support.
     */
    private Map<String, ServiceMapping> serviceMapping = Map.of(
        "einzeltechnik", new ServiceMapping("wimpern", List.of("einzeltechnik"), "Einzeltechnik"),
        "refill", new ServiceMapping("refill", List.of("hybrid", "volumen"), "Refill Termine"),
        "hybrid", new ServiceMapping("wimpern", List.of("hybrid"), "Hybrid"),
        "volumen", new ServiceMapping("wimpern", List.of("volumen"), "Volumen"),
        "liftings", new ServiceMapping("augenbrauen", List.of("wimpernlifting", "augenbraunlifting", "lifting-kombi"), "Liftings"),
        "feinschliff", new ServiceMapping("extras", List.of("augenbrauen-zupfen", "augenbrauen-faerben", "shellac-naegel"), "Feinschliff")
    );

    /**
     * Treatment definitions with exact pricing.
     */
    private List<TreatmentDefinition> treatments = List.of(
        // Wimpern Treatments
        new TreatmentDefinition("Einzeltechnik", "einzeltechnik", "einzeltechnik", 
                               "Präzise 1:1 Technik für natürlichen Look", 
                               ETreatmentCategory.WIMPERN, new BigDecimal("75.00"), 90, false, List.of()),
        
        new TreatmentDefinition("Hybrid", "hybrid", "hybrid", 
                               "Kombination aus klassischer und Volumen-Technik", 
                               ETreatmentCategory.WIMPERN, new BigDecimal("85.00"), 120, true, 
                               List.of(
                                   new RefillDefinition(2, new BigDecimal("35.00"), "2 wochen"),
                                   new RefillDefinition(3, new BigDecimal("40.00"), "3 wochen")
                               )),
        
        new TreatmentDefinition("Volumen", "volumen", "volumen", 
                               "Volumen-Technik für maximale Fülle", 
                               ETreatmentCategory.WIMPERN, new BigDecimal("110.00"), 150, true, 
                               List.of(
                                   new RefillDefinition(2, new BigDecimal("50.00"), "2 wochen"),
                                   new RefillDefinition(3, new BigDecimal("55.00"), "3 wochen")
                               )),
        
        // Lifting Treatments
        new TreatmentDefinition("Wimpernlifting", "wimpernlifting", "liftings", 
                               "Natürliche Wimpernverlängerung ohne Extensions", 
                               ETreatmentCategory.AUGENBRAUEN, new BigDecimal("49.00"), 60, false, List.of()),
        
        new TreatmentDefinition("Augenbraunlifting", "augenbraunlifting", "liftings", 
                               "Augenbrauen-Lifting für perfekte Form", 
                               ETreatmentCategory.AUGENBRAUEN, new BigDecimal("49.00"), 45, false, List.of()),
        
        new TreatmentDefinition("Lifting Kombi Paket", "lifting-kombi", "liftings", 
                               "Wimpern- und Augenbraunlifting im Paket", 
                               ETreatmentCategory.AUGENBRAUEN, new BigDecimal("85.00"), 90, false, List.of()),
        
        // Feinschliff Treatments
        new TreatmentDefinition("Augenbrauen zupfen", "augenbrauen-zupfen", "feinschliff", 
                               "Professionelle Augenbrauen-Korrektur", 
                               ETreatmentCategory.EXTRAS, new BigDecimal("10.00"), 15, false, List.of()),
        
        new TreatmentDefinition("Augenbrauen färben", "augenbrauen-faerben", "feinschliff", 
                               "Augenbrauen-Färbung für mehr Intensität", 
                               ETreatmentCategory.EXTRAS, new BigDecimal("10.00"), 20, false, List.of()),
        
        new TreatmentDefinition("Shellac Nägel", "shellac-naegel", "feinschliff", 
                               "Langanhaltende Nagellackierung", 
                               ETreatmentCategory.NAEGEL, new BigDecimal("35.00"), 45, false, List.of())
    );

    @Data
    public static class ServiceMapping {
        private final String category;
        private final List<String> treatmentSlugs;
        private final String displayName;
    }

    @Data
    public static class TreatmentDefinition {
        private final String name;
        private final String slug;
        private final String urlSlug;
        private final String description;
        private final ETreatmentCategory category;
        private final BigDecimal price;
        private final int durationMinutes;
        private final boolean hasRefillOptions;
        private final List<RefillDefinition> refillOptions;
    }

    @Data
    public static class RefillDefinition {
        private final int weekThreshold;
        private final BigDecimal price;
        private final String description;
    }

    /**
     * Get service mapping for a specific service parameter.
     */
    public ServiceMapping getServiceMapping(String serviceParam) {
        return serviceMapping.get(serviceParam);
    }

    /**
     * Check if a service parameter is valid.
     */
    public boolean isValidServiceParam(String serviceParam) {
        return serviceMapping.containsKey(serviceParam);
    }

    /**
     * Get all valid service parameters.
     */
    public List<String> getValidServiceParams() {
        return List.copyOf(serviceMapping.keySet());
    }

    /**
     * Get treatment definition by URL slug.
     */
    public TreatmentDefinition getTreatmentByUrlSlug(String urlSlug) {
        return treatments.stream()
                .filter(t -> t.getUrlSlug().equals(urlSlug))
                .findFirst()
                .orElse(null);
    }

    /**
     * Get all treatments for a specific service parameter.
     */
    public List<TreatmentDefinition> getTreatmentsForService(String serviceParam) {
        ServiceMapping mapping = getServiceMapping(serviceParam);
        if (mapping == null) {
            return List.of();
        }
        
        return treatments.stream()
                .filter(t -> mapping.getTreatmentSlugs().contains(t.getUrlSlug()))
                .toList();
    }

    /**
     * Get total number of treatments to be seeded.
     */
    public int getTotalTreatmentCount() {
        return treatments.size();
    }

    /**
     * Get total number of refill options to be seeded.
     */
    public int getTotalRefillOptionCount() {
        return treatments.stream()
                .mapToInt(t -> t.getRefillOptions().size())
                .sum();
    }
}
package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.database.repository.TreatmentRefillRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRepository;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataSeederService {

    private final TreatmentRepository treatmentRepository;
    private final TreatmentRefillRepository treatmentRefillRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedData() {
        seedTreatments();
    }

    private void seedTreatments() {
        // Check if treatments already exist - skip seeding if they do
        List<Treatment> existingTreatments = treatmentRepository.findAll(0, Integer.MAX_VALUE);
        if (!existingTreatments.isEmpty()) {
            log.info("Found {} existing treatments, skipping seeding", existingTreatments.size());
            return;
        }

        log.info("Seeding treatments...");
        List<Treatment> treatments = createDefaultTreatments();
        treatments.forEach(treatment -> {
            Treatment saved = treatmentRepository.create(treatment);
            // Add refill options for main lash treatments
            if (saved.getSlug().equals("einzeltechnik") || saved.getSlug().equals("hybridtechnik") || saved.getSlug().equals("volumentechnik")) {
                addRefillOptions(saved);
            }
        });
        log.info("Seeded {} treatments", treatments.size());
    }

    private List<Treatment> createDefaultTreatments() {
        return List.of(
            // === WIMPERN - Neumodellage (matching frontend ServicesSection) ===
            createTreatment("1:1 Technik", "einzeltechnik",
                "Bei der 1:1 Technik wird auf jede Naturwimper eine einzelne Wimper geklebt. Somit wird ein sehr natürliches Ergebnis erzielt.",
                ETreatmentCategory.WIMPERN, 120, "75.00", 1),
            createTreatment("Hybrid Technik", "hybridtechnik",
                "Bei der Hybrid Technik werden abwechselnd Volumenfächer und Einzelwimpern auf die Naturwimpern geklebt. Perfekt für alle, die noch unsicher sind wie intensiv das Ergebnis werden soll.",
                ETreatmentCategory.WIMPERN, 120, "85.00", 2),
            createTreatment("Volumen Technik", "volumentechnik",
                "Bei der Volumen Technik wird auf eine einzelne Naturwimper ein handgemachter Fächer gesetzt. Je nach Wunsch von leichtem Volumen bis Mega Volumen möglich.",
                ETreatmentCategory.WIMPERN, 150, "110.00", 3),

            // === REFILL - 1:1 Technik ===
            createTreatment("Refill 1:1 (bis 2 Wochen)", "refill-einzeltechnik-2w",
                "Auffüllen der 1:1 Wimpernverlängerung innerhalb von 2 Wochen.",
                ETreatmentCategory.REFILL, 60, "35.00", 1),
            createTreatment("Refill 1:1 (bis 3 Wochen)", "refill-einzeltechnik-3w",
                "Auffüllen der 1:1 Wimpernverlängerung innerhalb von 3 Wochen.",
                ETreatmentCategory.REFILL, 75, "40.00", 2),
            createTreatment("Refill 1:1 (ab 5 Wochen)", "refill-einzeltechnik-5w",
                "Neumodellage der 1:1 Wimpernverlängerung ab 5 Wochen.",
                ETreatmentCategory.REFILL, 120, "75.00", 3),

            // === REFILL - Hybrid Technik ===
            createTreatment("Refill Hybrid (bis 2 Wochen)", "refill-hybridtechnik-2w",
                "Auffüllen der Hybrid Wimpernverlängerung innerhalb von 2 Wochen.",
                ETreatmentCategory.REFILL, 60, "35.00", 4),
            createTreatment("Refill Hybrid (bis 3 Wochen)", "refill-hybridtechnik-3w",
                "Auffüllen der Hybrid Wimpernverlängerung innerhalb von 3 Wochen.",
                ETreatmentCategory.REFILL, 75, "40.00", 5),
            createTreatment("Refill Hybrid (ab 5 Wochen)", "refill-hybridtechnik-5w",
                "Neumodellage der Hybrid Wimpernverlängerung ab 5 Wochen.",
                ETreatmentCategory.REFILL, 120, "85.00", 6),

            // === REFILL - Volumen Technik ===
            createTreatment("Refill Volumen (bis 2 Wochen)", "refill-volumentechnik-2w",
                "Auffüllen der Volumen Wimpernverlängerung innerhalb von 2 Wochen.",
                ETreatmentCategory.REFILL, 75, "50.00", 7),
            createTreatment("Refill Volumen (bis 3 Wochen)", "refill-volumentechnik-3w",
                "Auffüllen der Volumen Wimpernverlängerung innerhalb von 3 Wochen.",
                ETreatmentCategory.REFILL, 90, "55.00", 8),
            createTreatment("Refill Volumen (ab 5 Wochen)", "refill-volumentechnik-5w",
                "Neumodellage der Volumen Wimpernverlängerung ab 5 Wochen.",
                ETreatmentCategory.REFILL, 150, "110.00", 9),

            // === EXTRAS - Liftings (from ServicesSection extrasGroups) ===
            createTreatment("Wimpernlifting", "wimpernlifting",
                "Deine Naturwimpern, nur wacher.",
                ETreatmentCategory.EXTRAS, 60, "49.00", 1),
            createTreatment("Augenbrauenlifting", "augenbrauenlifting",
                "Der Rahmen, der alles zusammenhält.",
                ETreatmentCategory.EXTRAS, 45, "49.00", 2),
            createTreatment("Kombi Paket (Wimpern + Brauen Lifting)", "kombi-lifting",
                "Beides zusammen – spare 13€.",
                ETreatmentCategory.EXTRAS, 90, "85.00", 3),

            // === EXTRAS - Feinschliff ===
            createTreatment("Augenbrauen zupfen", "augenbrauen-zupfen",
                "Klare Linien, sauber gezupft.",
                ETreatmentCategory.AUGENBRAUEN, 15, "10.00", 1),
            createTreatment("Augenbrauen färben", "augenbrauen-faerben",
                "Mehr Definition, mehr Ausdruck.",
                ETreatmentCategory.AUGENBRAUEN, 15, "10.00", 2),
            createTreatment("Shellac Nägel", "naegel-shellac",
                "Gepflegt bis in die Fingerspitzen.",
                ETreatmentCategory.NAEGEL, 45, "35.00", 1),

            // === EXTRAS - Sonstiges ===
            createTreatment("Wimpern Entfernung", "wimpern-entfernung",
                "Professionelle und schonende Entfernung der Wimpernverlängerung.",
                ETreatmentCategory.EXTRAS, 30, "15.00", 10)
        );
    }

    private Treatment createTreatment(String name, String slug, String description,
                                       ETreatmentCategory category, int duration,
                                       String price, int sortOrder) {
        Treatment treatment = new Treatment();
        treatment.setName(name);
        treatment.setSlug(slug);
        treatment.setDescription(description);
        treatment.setCategory(category);
        treatment.setDurationMinutes(duration);
        treatment.setPrice(new BigDecimal(price));
        treatment.setActive(true);
        treatment.setSortOrder(sortOrder);
        treatment.setVersionNumber(1);
        
        // Set hasRefillOptions for main lash treatments
        if (slug.equals("einzeltechnik") || slug.equals("hybridtechnik") || slug.equals("volumentechnik")) {
            treatment.setHasRefillOptions(true);
        }
        
        return treatment;
    }

    /**
     * Add refill options to main lash treatments.
     */
    private void addRefillOptions(Treatment treatment) {
        String slug = treatment.getSlug();
        
        if (slug.equals("einzeltechnik")) {
            createRefillOption(treatment, 2, new BigDecimal("35.00"), "bis 2 Wochen");
            createRefillOption(treatment, 3, new BigDecimal("40.00"), "bis 3 Wochen");
            createRefillOption(treatment, 5, new BigDecimal("75.00"), "ab 5 Wochen (Neumodellage)");
        } else if (slug.equals("hybridtechnik")) {
            createRefillOption(treatment, 2, new BigDecimal("35.00"), "bis 2 Wochen");
            createRefillOption(treatment, 3, new BigDecimal("40.00"), "bis 3 Wochen");
            createRefillOption(treatment, 5, new BigDecimal("85.00"), "ab 5 Wochen (Neumodellage)");
        } else if (slug.equals("volumentechnik")) {
            createRefillOption(treatment, 2, new BigDecimal("50.00"), "bis 2 Wochen");
            createRefillOption(treatment, 3, new BigDecimal("55.00"), "bis 3 Wochen");
            createRefillOption(treatment, 5, new BigDecimal("110.00"), "ab 5 Wochen (Neumodellage)");
        }
        
        // Update the treatment to ensure hasRefillOptions is set
        treatmentRepository.update(treatment);
        log.info("Added refill options for treatment: {}", treatment.getName());
    }

    /**
     * Create a refill option for a treatment.
     */
    private void createRefillOption(Treatment treatment, int weekThreshold, BigDecimal price, String description) {
        TreatmentRefill refill = new TreatmentRefill(treatment, weekThreshold, price, description);
        refill.setActive(true);
        treatmentRefillRepository.save(refill);
        log.debug("Created refill option: {} weeks, {}€ for {}", weekThreshold, price, treatment.getName());
    }
}

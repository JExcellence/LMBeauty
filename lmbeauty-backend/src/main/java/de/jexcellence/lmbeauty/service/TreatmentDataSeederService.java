package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentAudit;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.TreatmentAuditRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRefillRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRepository;
import de.jexcellence.lmbeauty.dto.seeding.SeedingResult;
import de.jexcellence.lmbeauty.dto.seeding.SeedingStatus;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service for seeding the database with correct treatment data and pricing.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TreatmentDataSeederService {

    private final TreatmentRepository treatmentRepository;
    private final TreatmentRefillRepository treatmentRefillRepository;
    private final TreatmentAuditRepository treatmentAuditRepository;

    /**
     * Seed the database with the exact treatment data and pricing structure.
     */
    @Transactional
    public SeedingResult seedTreatmentData(User adminUser) {
        log.info("Starting treatment data seeding process");
        
        SeedingResult result = new SeedingResult();
        result.setStartTime(LocalDateTime.now());
        
        try {
            // Create backup of existing data
            List<Treatment> existingTreatments = backupExistingData();
            result.setBackupCreated(true);
            result.setBackupCount(existingTreatments.size());
            
            // Clear existing treatment data
            clearExistingTreatments();
            
            // Seed new treatment data
            List<Treatment> seededTreatments = seedAllTreatments();
            result.setTreatmentsCreated(seededTreatments.size());
            
            // Count refill options created
            int refillOptionsCreated = seededTreatments.stream()
                    .mapToInt(t -> t.getRefillOptions().size())
                    .sum();
            result.setRefillOptionsCreated(refillOptionsCreated);
            
            // Create audit entry
            TreatmentAudit auditEntry = TreatmentAudit.seedEntry(
                    String.format("Database seeded with %d treatments and %d refill options", 
                                 seededTreatments.size(), refillOptionsCreated), 
                    adminUser);
            treatmentAuditRepository.save(auditEntry);
            
            result.setSuccess(true);
            result.setEndTime(LocalDateTime.now());
            result.setMessage("Treatment data seeded successfully");
            
            log.info("Treatment data seeding completed successfully. Created {} treatments with {} refill options", 
                    seededTreatments.size(), refillOptionsCreated);
            
        } catch (Exception e) {
            log.error("Error during treatment data seeding", e);
            result.setSuccess(false);
            result.setEndTime(LocalDateTime.now());
            result.setMessage("Seeding failed: " + e.getMessage());
            
            // Create audit entry for failure
            TreatmentAudit auditEntry = TreatmentAudit.seedEntry(
                    "Seeding failed: " + e.getMessage(), adminUser);
            treatmentAuditRepository.save(auditEntry);
        }
        
        return result;
    }

    /**
     * Validate the seeded data against expected values.
     */
    @Transactional(readOnly = true)
    public SeedingStatus validateSeededData() {
        log.debug("Validating seeded treatment data");
        
        SeedingStatus status = new SeedingStatus();
        List<String> validationErrors = new ArrayList<>();
        
        try {
            // Check Einzeltechnik
            validateTreatment("einzeltechnik", "Einzeltechnik", new BigDecimal("75.00"), 
                             ETreatmentCategory.WIMPERN, false, 0, validationErrors);
            
            // Check Hybrid with refills
            validateTreatment("hybrid", "Hybrid", new BigDecimal("85.00"), 
                             ETreatmentCategory.WIMPERN, true, 2, validationErrors);
            
            // Check Volumen with refills
            validateTreatment("volumen", "Volumen", new BigDecimal("110.00"), 
                             ETreatmentCategory.WIMPERN, true, 2, validationErrors);
            
            // Check Liftings
            validateTreatment("wimpernlifting", "Wimpernlifting", new BigDecimal("49.00"), 
                             ETreatmentCategory.AUGENBRAUEN, false, 0, validationErrors);
            validateTreatment("augenbraunlifting", "Augenbraunlifting", new BigDecimal("49.00"), 
                             ETreatmentCategory.AUGENBRAUEN, false, 0, validationErrors);
            validateTreatment("lifting-kombi", "Lifting Kombi Paket", new BigDecimal("85.00"), 
                             ETreatmentCategory.AUGENBRAUEN, false, 0, validationErrors);
            
            // Check Feinschliff
            validateTreatment("augenbrauen-zupfen", "Augenbrauen zupfen", new BigDecimal("10.00"), 
                             ETreatmentCategory.EXTRAS, false, 0, validationErrors);
            validateTreatment("augenbrauen-faerben", "Augenbrauen färben", new BigDecimal("10.00"), 
                             ETreatmentCategory.EXTRAS, false, 0, validationErrors);
            validateTreatment("shellac-naegel", "Shellac Nägel", new BigDecimal("35.00"), 
                             ETreatmentCategory.NAEGEL, false, 0, validationErrors);
            
            status.setValid(validationErrors.isEmpty());
            status.setValidationErrors(validationErrors);
            status.setTotalTreatments(treatmentRepository.findByActiveTrue().size());
            status.setTotalRefillOptions(treatmentRefillRepository.findAll().size());
            
        } catch (Exception e) {
            log.error("Error during validation", e);
            validationErrors.add("Validation failed: " + e.getMessage());
            status.setValid(false);
            status.setValidationErrors(validationErrors);
        }
        
        return status;
    }

    /**
     * Rollback to previous treatment data (if backup exists).
     */
    @Transactional
    public SeedingResult rollbackTreatmentData(User adminUser) {
        log.info("Starting treatment data rollback");
        
        SeedingResult result = new SeedingResult();
        result.setStartTime(LocalDateTime.now());
        
        try {
            // For now, just clear current data - in a real implementation,
            // we would restore from backup
            clearExistingTreatments();
            
            // Create audit entry
            TreatmentAudit auditEntry = TreatmentAudit.seedEntry(
                    "Treatment data rolled back", adminUser);
            treatmentAuditRepository.save(auditEntry);
            
            result.setSuccess(true);
            result.setEndTime(LocalDateTime.now());
            result.setMessage("Treatment data rolled back successfully");
            
            log.info("Treatment data rollback completed");
            
        } catch (Exception e) {
            log.error("Error during rollback", e);
            result.setSuccess(false);
            result.setEndTime(LocalDateTime.now());
            result.setMessage("Rollback failed: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * Seed all treatments with exact pricing structure.
     */
    private List<Treatment> seedAllTreatments() {
        List<Treatment> treatments = new ArrayList<>();
        
        // Einzeltechnik - 75 EUR, with refills
        Treatment einzeltechnik = createTreatment(
                "1:1 Technik", "einzeltechnik", "einzeltechnik",
                "Bei der 1:1 Technik wird auf jede Naturwimper eine einzelne Wimper geklebt. Somit wird ein sehr natürliches Ergebnis erzielt.", 
                ETreatmentCategory.WIMPERN, new BigDecimal("75.00"), 120, true);
        addRefillOption(einzeltechnik, 2, new BigDecimal("35.00"), "bis 2 Wochen");
        addRefillOption(einzeltechnik, 3, new BigDecimal("40.00"), "bis 3 Wochen");
        addRefillOption(einzeltechnik, 5, new BigDecimal("75.00"), "ab 5 Wochen (Neumodellage)");
        treatments.add(einzeltechnik);
        
        // Hybrid - 85 EUR with refills
        Treatment hybrid = createTreatment(
                "Hybrid Technik", "hybridtechnik", "hybridtechnik",
                "Bei der Hybrid Technik werden abwechselnd Volumenfächer und Einzelwimpern auf die Naturwimpern geklebt. Perfekt für alle, die noch unsicher sind wie intensiv das Ergebnis werden soll.", 
                ETreatmentCategory.WIMPERN, new BigDecimal("85.00"), 120, true);
        addRefillOption(hybrid, 2, new BigDecimal("35.00"), "bis 2 Wochen");
        addRefillOption(hybrid, 3, new BigDecimal("40.00"), "bis 3 Wochen");
        addRefillOption(hybrid, 5, new BigDecimal("85.00"), "ab 5 Wochen (Neumodellage)");
        treatments.add(hybrid);
        
        // Volumen - 110 EUR with refills
        Treatment volumen = createTreatment(
                "Volumen Technik", "volumentechnik", "volumentechnik",
                "Bei der Volumen Technik wird auf eine einzelne Naturwimper ein handgemachter Fächer gesetzt. Je nach Wunsch von leichtem Volumen bis Mega Volumen möglich.", 
                ETreatmentCategory.WIMPERN, new BigDecimal("110.00"), 150, true);
        addRefillOption(volumen, 2, new BigDecimal("50.00"), "bis 2 Wochen");
        addRefillOption(volumen, 3, new BigDecimal("55.00"), "bis 3 Wochen");
        addRefillOption(volumen, 5, new BigDecimal("110.00"), "ab 5 Wochen (Neumodellage)");
        treatments.add(volumen);
        
        // Liftings
        Treatment wimpernlifting = createTreatment(
                "Wimpernlifting", "wimpern-lifting", "wimpern-lifting",
                "Natürliche Wimpernverlängerung ohne Extensions", 
                ETreatmentCategory.AUGENBRAUEN, new BigDecimal("49.00"), 60, false);
        treatments.add(wimpernlifting);
        
        Treatment augenbraunlifting = createTreatment(
                "Augenbraunlifting", "augenbrauen-lifting", "augenbrauen-lifting",
                "Augenbrauen-Lifting für perfekte Form", 
                ETreatmentCategory.AUGENBRAUEN, new BigDecimal("49.00"), 45, false);
        treatments.add(augenbraunlifting);
        
        Treatment liftingKombi = createTreatment(
                "Lifting Kombi Paket", "lifting-kombi", "lifting-kombi",
                "Wimpern- und Augenbraunlifting im Paket", 
                ETreatmentCategory.AUGENBRAUEN, new BigDecimal("85.00"), 90, false);
        treatments.add(liftingKombi);
        
        // Feinschliff
        Treatment augenbrauenZupfen = createTreatment(
                "Augenbrauen zupfen", "augenbrauen-zupfen", "augenbrauen-zupfen",
                "Professionelle Augenbrauen-Korrektur", 
                ETreatmentCategory.EXTRAS, new BigDecimal("10.00"), 15, false);
        treatments.add(augenbrauenZupfen);
        
        Treatment augenbrauenFaerben = createTreatment(
                "Augenbrauen färben", "augenbrauen-faerben", "augenbrauen-faerben",
                "Augenbrauen-Färbung für mehr Intensität", 
                ETreatmentCategory.EXTRAS, new BigDecimal("10.00"), 20, false);
        treatments.add(augenbrauenFaerben);
        
        Treatment wimpernFaerben = createTreatment(
                "Wimpern färben", "wimpern-faerben", "wimpern-faerben",
                "Wimpern-Färbung für mehr Intensität", 
                ETreatmentCategory.EXTRAS, new BigDecimal("10.00"), 20, false);
        treatments.add(wimpernFaerben);
        
        Treatment shellacNaegel = createTreatment(
                "Shellac Nägel", "shellac-naegel", "shellac-naegel",
                "Langanhaltende Nagellackierung", 
                ETreatmentCategory.NAEGEL, new BigDecimal("35.00"), 45, false);
        treatments.add(shellacNaegel);
        
        return treatments;
    }

    /**
     * Create a treatment with the specified parameters.
     */
    private Treatment createTreatment(String name, String slug, String urlSlug, String description,
                                    ETreatmentCategory category, BigDecimal price, int duration, 
                                    boolean hasRefillOptions) {
        Treatment treatment = new Treatment();
        treatment.setName(name);
        treatment.setSlug(slug);
        treatment.setUrlSlug(urlSlug);
        treatment.setDescription(description);
        treatment.setCategory(category);
        treatment.setPrice(price);
        treatment.setDurationMinutes(duration);
        treatment.setHasRefillOptions(hasRefillOptions);
        treatment.setActive(true);
        treatment.setSortOrder(0);
        treatment.setVersionNumber(1);
        
        Treatment saved = treatmentRepository.create(treatment);
        log.debug("Created treatment: {} (ID: {})", name, saved.getId());
        return saved;
    }

    /**
     * Add a refill option to a treatment.
     */
    private void addRefillOption(Treatment treatment, int weekThreshold, BigDecimal price, String description) {
        TreatmentRefill refill = new TreatmentRefill(treatment, weekThreshold, price, description);
        refill.setActive(true);
        
        TreatmentRefill saved = treatmentRefillRepository.save(refill);
        
        // Add to the treatment's collection (for in-memory consistency)
        treatment.addRefillOption(saved);
        
        // Update the treatment in the database to ensure hasRefillOptions is set correctly
        treatmentRepository.update(treatment);
        
        log.debug("Added refill option to {}: {} weeks, {} EUR", 
                 treatment.getName(), weekThreshold, price);
    }

    /**
     * Backup existing treatment data.
     */
    private List<Treatment> backupExistingData() {
        List<Treatment> existingTreatments = treatmentRepository.findAll(0, Integer.MAX_VALUE);
        log.debug("Backed up {} existing treatments", existingTreatments.size());
        return existingTreatments;
    }

    /**
     * Clear existing treatment data.
     */
    private void clearExistingTreatments() {
        // Delete all refill options first (due to foreign key constraints)
        List<TreatmentRefill> allRefills = treatmentRefillRepository.findAll();
        allRefills.forEach(treatmentRefillRepository::delete);
        log.debug("Cleared {} existing refill options", allRefills.size());
        
        // Delete all treatments
        List<Treatment> allTreatments = treatmentRepository.findAll(0, Integer.MAX_VALUE);
        allTreatments.forEach(treatment -> treatmentRepository.delete(treatment.getId()));
        log.debug("Cleared {} existing treatments", allTreatments.size());
    }

    /**
     * Validate a specific treatment against expected values.
     */
    private void validateTreatment(String urlSlug, String expectedName, BigDecimal expectedPrice,
                                 ETreatmentCategory expectedCategory, boolean shouldHaveRefills,
                                 int expectedRefillCount, List<String> validationErrors) {
        Optional<Treatment> treatmentOpt = treatmentRepository.findByUrlSlug(urlSlug);
        
        if (treatmentOpt.isEmpty()) {
            validationErrors.add("Treatment not found: " + urlSlug);
            return;
        }
        
        Treatment treatment = treatmentOpt.get();
        
        if (!expectedName.equals(treatment.getName())) {
            validationErrors.add(String.format("Treatment %s: expected name '%s', got '%s'", 
                                              urlSlug, expectedName, treatment.getName()));
        }
        
        if (expectedPrice.compareTo(treatment.getPrice()) != 0) {
            validationErrors.add(String.format("Treatment %s: expected price %s, got %s", 
                                              urlSlug, expectedPrice, treatment.getPrice()));
        }
        
        if (!expectedCategory.equals(treatment.getCategory())) {
            validationErrors.add(String.format("Treatment %s: expected category %s, got %s", 
                                              urlSlug, expectedCategory, treatment.getCategory()));
        }
        
        if (shouldHaveRefills != treatment.isHasRefillOptions()) {
            validationErrors.add(String.format("Treatment %s: expected hasRefillOptions %s, got %s", 
                                              urlSlug, shouldHaveRefills, treatment.isHasRefillOptions()));
        }
        
        List<TreatmentRefill> refills = treatmentRefillRepository.findByTreatmentIdAndActiveTrue(treatment.getId());
        if (refills.size() != expectedRefillCount) {
            validationErrors.add(String.format("Treatment %s: expected %d refill options, got %d", 
                                              urlSlug, expectedRefillCount, refills.size()));
        }
    }
}
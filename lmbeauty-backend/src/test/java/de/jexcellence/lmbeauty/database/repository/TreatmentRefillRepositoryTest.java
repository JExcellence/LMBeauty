package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("TreatmentRefillRepository Tests")
class TreatmentRefillRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TreatmentRefillRepository treatmentRefillRepository;

    private Treatment treatment;
    private TreatmentRefill twoWeekRefill;
    private TreatmentRefill threeWeekRefill;
    private TreatmentRefill inactiveRefill;

    @BeforeEach
    void setUp() {
        // Create test treatment
        treatment = new Treatment();
        treatment.setName("Hybrid Lashes");
        treatment.setSlug("hybrid-lashes");
        treatment.setCategory(ETreatmentCategory.WIMPERN);
        treatment.setDurationMinutes(120);
        treatment.setPrice(new BigDecimal("85.00"));
        treatment.setHasRefillOptions(true);
        treatment.setActive(true);
        treatment = entityManager.persistAndFlush(treatment);

        // Create test refill options
        twoWeekRefill = new TreatmentRefill(treatment, 2, new BigDecimal("35.00"), "2 wochen");
        twoWeekRefill.setActive(true);
        twoWeekRefill = entityManager.persistAndFlush(twoWeekRefill);

        threeWeekRefill = new TreatmentRefill(treatment, 3, new BigDecimal("40.00"), "3 wochen");
        threeWeekRefill.setActive(true);
        threeWeekRefill = entityManager.persistAndFlush(threeWeekRefill);

        inactiveRefill = new TreatmentRefill(treatment, 4, new BigDecimal("45.00"), "4 wochen");
        inactiveRefill.setActive(false);
        inactiveRefill = entityManager.persistAndFlush(inactiveRefill);

        entityManager.clear();
    }

    @Test
    @DisplayName("Should find active refill options by treatment ID")
    void shouldFindActiveRefillOptionsByTreatmentId() {
        List<TreatmentRefill> activeRefills = treatmentRefillRepository.findByTreatmentIdAndActiveTrue(treatment.getId());

        assertEquals(2, activeRefills.size());
        assertTrue(activeRefills.stream().allMatch(TreatmentRefill::isActive));
        assertTrue(activeRefills.stream().anyMatch(r -> r.getWeekThreshold().equals(2)));
        assertTrue(activeRefills.stream().anyMatch(r -> r.getWeekThreshold().equals(3)));
    }

    @Test
    @DisplayName("Should find all refill options by treatment ID including inactive")
    void shouldFindAllRefillOptionsByTreatmentId() {
        List<TreatmentRefill> allRefills = treatmentRefillRepository.findByTreatmentId(treatment.getId());

        assertEquals(3, allRefills.size());
        assertTrue(allRefills.stream().anyMatch(r -> r.getWeekThreshold().equals(2) && r.isActive()));
        assertTrue(allRefills.stream().anyMatch(r -> r.getWeekThreshold().equals(3) && r.isActive()));
        assertTrue(allRefills.stream().anyMatch(r -> r.getWeekThreshold().equals(4) && !r.isActive()));
    }

    @Test
    @DisplayName("Should find applicable refills for given weeks")
    void shouldFindApplicableRefillsForGivenWeeks() {
        // Test for 1 week - should return both 2-week and 3-week options
        List<TreatmentRefill> refillsFor1Week = treatmentRefillRepository
                .findApplicableRefillsForWeeks(treatment.getId(), 1);
        assertEquals(2, refillsFor1Week.size());
        assertEquals(2, refillsFor1Week.get(0).getWeekThreshold()); // Should be ordered by threshold ASC

        // Test for 2 weeks - should return both options
        List<TreatmentRefill> refillsFor2Weeks = treatmentRefillRepository
                .findApplicableRefillsForWeeks(treatment.getId(), 2);
        assertEquals(2, refillsFor2Weeks.size());

        // Test for 3 weeks - should return only 3-week option
        List<TreatmentRefill> refillsFor3Weeks = treatmentRefillRepository
                .findApplicableRefillsForWeeks(treatment.getId(), 3);
        assertEquals(1, refillsFor3Weeks.size());
        assertEquals(3, refillsFor3Weeks.get(0).getWeekThreshold());

        // Test for 4 weeks - should return no options (4-week option is inactive)
        List<TreatmentRefill> refillsFor4Weeks = treatmentRefillRepository
                .findApplicableRefillsForWeeks(treatment.getId(), 4);
        assertEquals(0, refillsFor4Weeks.size());
    }

    @Test
    @DisplayName("Should find best refill option for given weeks")
    void shouldFindBestRefillOptionForGivenWeeks() {
        // Test for 1 week - should return 2-week option (lowest threshold)
        Optional<TreatmentRefill> bestFor1Week = treatmentRefillRepository
                .findBestRefillForWeeks(treatment.getId(), 1);
        assertTrue(bestFor1Week.isPresent());
        assertEquals(2, bestFor1Week.get().getWeekThreshold());

        // Test for 2 weeks - should return 2-week option
        Optional<TreatmentRefill> bestFor2Weeks = treatmentRefillRepository
                .findBestRefillForWeeks(treatment.getId(), 2);
        assertTrue(bestFor2Weeks.isPresent());
        assertEquals(2, bestFor2Weeks.get().getWeekThreshold());

        // Test for 3 weeks - should return 3-week option
        Optional<TreatmentRefill> bestFor3Weeks = treatmentRefillRepository
                .findBestRefillForWeeks(treatment.getId(), 3);
        assertTrue(bestFor3Weeks.isPresent());
        assertEquals(3, bestFor3Weeks.get().getWeekThreshold());

        // Test for 5 weeks - should return empty (no applicable options)
        Optional<TreatmentRefill> bestFor5Weeks = treatmentRefillRepository
                .findBestRefillForWeeks(treatment.getId(), 5);
        assertFalse(bestFor5Weeks.isPresent());
    }

    @Test
    @DisplayName("Should find refill by treatment and week threshold")
    void shouldFindRefillByTreatmentAndWeekThreshold() {
        Optional<TreatmentRefill> twoWeekOption = treatmentRefillRepository
                .findByTreatmentIdAndWeekThreshold(treatment.getId(), 2);
        assertTrue(twoWeekOption.isPresent());
        assertEquals(2, twoWeekOption.get().getWeekThreshold());
        assertEquals(new BigDecimal("35.00"), twoWeekOption.get().getPrice());

        Optional<TreatmentRefill> nonExistentOption = treatmentRefillRepository
                .findByTreatmentIdAndWeekThreshold(treatment.getId(), 5);
        assertFalse(nonExistentOption.isPresent());
    }

    @Test
    @DisplayName("Should check if treatment has active refill options")
    void shouldCheckIfTreatmentHasActiveRefillOptions() {
        assertTrue(treatmentRefillRepository.existsByTreatmentIdAndActiveTrue(treatment.getId()));

        // Create treatment without refill options
        Treatment treatmentWithoutRefills = new Treatment();
        treatmentWithoutRefills.setName("Simple Treatment");
        treatmentWithoutRefills.setSlug("simple-treatment");
        treatmentWithoutRefills.setCategory(ETreatmentCategory.EXTRAS);
        treatmentWithoutRefills.setDurationMinutes(30);
        treatmentWithoutRefills.setPrice(new BigDecimal("25.00"));
        treatmentWithoutRefills.setHasRefillOptions(false);
        treatmentWithoutRefills.setActive(true);
        treatmentWithoutRefills = entityManager.persistAndFlush(treatmentWithoutRefills);

        assertFalse(treatmentRefillRepository.existsByTreatmentIdAndActiveTrue(treatmentWithoutRefills.getId()));
    }

    @Test
    @DisplayName("Should find refills ordered by week threshold")
    void shouldFindRefillsOrderedByWeekThreshold() {
        List<TreatmentRefill> orderedRefills = treatmentRefillRepository
                .findByTreatmentIdOrderByWeekThreshold(treatment.getId());

        assertEquals(2, orderedRefills.size());
        assertEquals(2, orderedRefills.get(0).getWeekThreshold());
        assertEquals(3, orderedRefills.get(1).getWeekThreshold());
    }

    @Test
    @DisplayName("Should count active refill options")
    void shouldCountActiveRefillOptions() {
        long count = treatmentRefillRepository.countByTreatmentIdAndActiveTrue(treatment.getId());
        assertEquals(2, count);
    }

    @Test
    @DisplayName("Should handle empty results gracefully")
    void shouldHandleEmptyResultsGracefully() {
        // Test with non-existent treatment ID
        List<TreatmentRefill> emptyResult = treatmentRefillRepository.findByTreatmentIdAndActiveTrue(999L);
        assertTrue(emptyResult.isEmpty());

        Optional<TreatmentRefill> emptyOptional = treatmentRefillRepository
                .findBestRefillForWeeks(999L, 2);
        assertFalse(emptyOptional.isPresent());

        long zeroCount = treatmentRefillRepository.countByTreatmentIdAndActiveTrue(999L);
        assertEquals(0, zeroCount);
    }

    @Test
    @DisplayName("Should handle edge cases for week calculations")
    void shouldHandleEdgeCasesForWeekCalculations() {
        // Test with 0 weeks
        List<TreatmentRefill> refillsFor0Weeks = treatmentRefillRepository
                .findApplicableRefillsForWeeks(treatment.getId(), 0);
        assertEquals(2, refillsFor0Weeks.size());

        // Test with negative weeks (should return all applicable)
        List<TreatmentRefill> refillsForNegativeWeeks = treatmentRefillRepository
                .findApplicableRefillsForWeeks(treatment.getId(), -1);
        assertEquals(2, refillsForNegativeWeeks.size());
    }
}
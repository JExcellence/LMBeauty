package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TreatmentRefill Entity Tests")
class TreatmentRefillTest {

    private Treatment treatment;
    private TreatmentRefill refillOption;

    @BeforeEach
    void setUp() {
        treatment = new Treatment();
        treatment.setName("Hybrid Lashes");
        treatment.setSlug("hybrid-lashes");
        treatment.setCategory(ETreatmentCategory.WIMPERN);
        treatment.setDurationMinutes(120);
        treatment.setPrice(new BigDecimal("85.00"));
        treatment.setHasRefillOptions(true);

        refillOption = new TreatmentRefill();
        refillOption.setTreatment(treatment);
        refillOption.setWeekThreshold(2);
        refillOption.setPrice(new BigDecimal("35.00"));
        refillOption.setDescription("2 wochen");
        refillOption.setActive(true);
    }

    @Test
    @DisplayName("Should create TreatmentRefill with valid data")
    void shouldCreateTreatmentRefillWithValidData() {
        assertNotNull(refillOption);
        assertEquals(treatment, refillOption.getTreatment());
        assertEquals(2, refillOption.getWeekThreshold());
        assertEquals(new BigDecimal("35.00"), refillOption.getPrice());
        assertEquals("2 wochen", refillOption.getDescription());
        assertTrue(refillOption.isActive());
    }

    @Test
    @DisplayName("Should create TreatmentRefill using constructor with parameters")
    void shouldCreateTreatmentRefillUsingConstructor() {
        TreatmentRefill refill = new TreatmentRefill(treatment, 3, new BigDecimal("40.00"), "3 wochen");
        
        assertEquals(treatment, refill.getTreatment());
        assertEquals(3, refill.getWeekThreshold());
        assertEquals(new BigDecimal("40.00"), refill.getPrice());
        assertEquals("3 wochen", refill.getDescription());
        assertTrue(refill.isActive()); // Default value
    }

    @Test
    @DisplayName("Should correctly determine applicability for weeks")
    void shouldCorrectlyDetermineApplicabilityForWeeks() {
        // 2-week refill should be applicable for 1 and 2 weeks
        assertTrue(refillOption.isApplicableForWeeks(1));
        assertTrue(refillOption.isApplicableForWeeks(2));
        
        // Should not be applicable for 3 or more weeks
        assertFalse(refillOption.isApplicableForWeeks(3));
        assertFalse(refillOption.isApplicableForWeeks(4));
    }

    @Test
    @DisplayName("Should handle edge cases for week applicability")
    void shouldHandleEdgeCasesForWeekApplicability() {
        // Test with 0 weeks (same week)
        assertTrue(refillOption.isApplicableForWeeks(0));
        
        // Test with exact threshold
        assertTrue(refillOption.isApplicableForWeeks(2));
        
        // Test just over threshold
        assertFalse(refillOption.isApplicableForWeeks(3));
    }

    @Test
    @DisplayName("Should have proper toString representation")
    void shouldHaveProperToStringRepresentation() {
        String toString = refillOption.toString();
        
        assertNotNull(toString);
        assertTrue(toString.contains("TreatmentRefill"));
        assertTrue(toString.contains("weekThreshold=2"));
        assertTrue(toString.contains("price=35.00"));
        assertTrue(toString.contains("description='2 wochen'"));
        assertTrue(toString.contains("active=true"));
    }

    @Test
    @DisplayName("Should handle null treatment gracefully")
    void shouldHandleNullTreatmentGracefully() {
        TreatmentRefill refill = new TreatmentRefill();
        refill.setWeekThreshold(2);
        refill.setPrice(new BigDecimal("35.00"));
        refill.setDescription("2 wochen");
        
        assertNull(refill.getTreatment());
        assertEquals(2, refill.getWeekThreshold());
        assertEquals(new BigDecimal("35.00"), refill.getPrice());
    }

    @Test
    @DisplayName("Should handle different week thresholds correctly")
    void shouldHandleDifferentWeekThresholdsCorrectly() {
        // Test 3-week refill
        TreatmentRefill threeWeekRefill = new TreatmentRefill(treatment, 3, new BigDecimal("40.00"), "3 wochen");
        
        assertTrue(threeWeekRefill.isApplicableForWeeks(1));
        assertTrue(threeWeekRefill.isApplicableForWeeks(2));
        assertTrue(threeWeekRefill.isApplicableForWeeks(3));
        assertFalse(threeWeekRefill.isApplicableForWeeks(4));
        
        // Test 1-week refill
        TreatmentRefill oneWeekRefill = new TreatmentRefill(treatment, 1, new BigDecimal("25.00"), "1 woche");
        
        assertTrue(oneWeekRefill.isApplicableForWeeks(0));
        assertTrue(oneWeekRefill.isApplicableForWeeks(1));
        assertFalse(oneWeekRefill.isApplicableForWeeks(2));
    }

    @Test
    @DisplayName("Should maintain active status correctly")
    void shouldMaintainActiveStatusCorrectly() {
        assertTrue(refillOption.isActive());
        
        refillOption.setActive(false);
        assertFalse(refillOption.isActive());
        
        refillOption.setActive(true);
        assertTrue(refillOption.isActive());
    }

    @Test
    @DisplayName("Should handle price precision correctly")
    void shouldHandlePricePrecisionCorrectly() {
        refillOption.setPrice(new BigDecimal("35.50"));
        assertEquals(new BigDecimal("35.50"), refillOption.getPrice());
        
        refillOption.setPrice(new BigDecimal("35.99"));
        assertEquals(new BigDecimal("35.99"), refillOption.getPrice());
    }
}
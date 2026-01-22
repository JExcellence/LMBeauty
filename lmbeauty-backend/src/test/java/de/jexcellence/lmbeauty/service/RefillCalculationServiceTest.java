package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.AppointmentRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRefillRepository;
import de.jexcellence.lmbeauty.dto.refill.RefillEligibilityResponse;
import de.jexcellence.lmbeauty.dto.refill.RefillOptionDto;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RefillCalculationService Integration Tests")
class RefillCalculationServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private TreatmentRefillRepository treatmentRefillRepository;

    @Mock
    private TreatmentService treatmentService;

    @InjectMocks
    private RefillCalculationService refillCalculationService;

    private User customer;
    private Treatment hybridTreatment;
    private Treatment einzeltechnikTreatment;
    private TreatmentRefill twoWeekRefill;
    private TreatmentRefill threeWeekRefill;
    private Appointment recentAppointment;
    private Appointment oldAppointment;

    @BeforeEach
    void setUp() {
        // Create test customer
        customer = new User();
        customer.setId(1L);
        customer.setEmail("customer@test.com");
        customer.setFirstName("Test");
        customer.setLastName("Customer");

        // Create test treatments
        hybridTreatment = new Treatment();
        hybridTreatment.setId(1L);
        hybridTreatment.setName("Hybrid Lashes");
        hybridTreatment.setCategory(ETreatmentCategory.WIMPERN);
        hybridTreatment.setPrice(new BigDecimal("85.00"));
        hybridTreatment.setHasRefillOptions(true);

        einzeltechnikTreatment = new Treatment();
        einzeltechnikTreatment.setId(2L);
        einzeltechnikTreatment.setName("Einzeltechnik");
        einzeltechnikTreatment.setCategory(ETreatmentCategory.WIMPERN);
        einzeltechnikTreatment.setPrice(new BigDecimal("75.00"));
        einzeltechnikTreatment.setHasRefillOptions(false);

        // Create test refill options
        twoWeekRefill = new TreatmentRefill(hybridTreatment, 2, new BigDecimal("35.00"), "2 wochen");
        twoWeekRefill.setId(1L);
        twoWeekRefill.setActive(true);

        threeWeekRefill = new TreatmentRefill(hybridTreatment, 3, new BigDecimal("40.00"), "3 wochen");
        threeWeekRefill.setId(2L);
        threeWeekRefill.setActive(true);

        // Create test appointments
        recentAppointment = new Appointment();
        recentAppointment.setId(1L);
        recentAppointment.setCustomer(customer);
        recentAppointment.setTreatment(hybridTreatment);
        recentAppointment.setScheduledAt(LocalDateTime.now().minusWeeks(1));
        recentAppointment.setCompletedAt(LocalDateTime.now().minusWeeks(1));
        recentAppointment.setStatus(EAppointmentStatus.COMPLETED);

        oldAppointment = new Appointment();
        oldAppointment.setId(2L);
        oldAppointment.setCustomer(customer);
        oldAppointment.setTreatment(hybridTreatment);
        oldAppointment.setScheduledAt(LocalDateTime.now().minusWeeks(5));
        oldAppointment.setCompletedAt(LocalDateTime.now().minusWeeks(5));
        oldAppointment.setStatus(EAppointmentStatus.COMPLETED);
    }

    @Test
    @DisplayName("Should calculate refill eligibility for customer with recent appointment")
    void shouldCalculateRefillEligibilityForRecentAppointment() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(recentAppointment));
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 1))
                .thenReturn(List.of(twoWeekRefill, threeWeekRefill));
        when(treatmentRefillRepository.findBestRefillForWeeks(1L, 1))
                .thenReturn(Optional.of(twoWeekRefill));

        // When
        RefillEligibilityResponse result = refillCalculationService.calculateRefillEligibility(1L, 1L);

        // Then
        assertTrue(result.isEligible());
        assertEquals(1, result.getWeeksSinceLastAppointment());
        assertEquals(2, result.getAvailableRefills().size());
        assertNotNull(result.getRecommendedOption());
        assertEquals(new BigDecimal("35.00"), result.getRecommendedOption().getPrice());
        assertEquals("Refill-Optionen verfügbar", result.getMessage());
    }

    @Test
    @DisplayName("Should return no eligibility for customer with old appointment")
    void shouldReturnNoEligibilityForOldAppointment() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(oldAppointment));
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 5))
                .thenReturn(List.of()); // No applicable refills for 5 weeks

        // When
        RefillEligibilityResponse result = refillCalculationService.calculateRefillEligibility(1L, 1L);

        // Then
        assertFalse(result.isEligible());
        assertEquals(5, result.getWeeksSinceLastAppointment());
        assertTrue(result.getAvailableRefills().isEmpty());
        assertNull(result.getRecommendedOption());
        assertEquals("Zu lange her für Refill. Neuanlage empfohlen.", result.getMessage());
    }

    @Test
    @DisplayName("Should return no history for customer with no appointments")
    void shouldReturnNoHistoryForCustomerWithNoAppointments() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of());

        // When
        RefillEligibilityResponse result = refillCalculationService.calculateRefillEligibility(1L, 1L);

        // Then
        assertFalse(result.isEligible());
        assertNull(result.getWeeksSinceLastAppointment());
        assertTrue(result.getAvailableRefills().isEmpty());
        assertNull(result.getRecommendedOption());
        assertEquals("Keine vorherigen Termine gefunden. Nur Neuanlage möglich.", result.getMessage());
    }

    @Test
    @DisplayName("Should return not eligible for treatment without refill support")
    void shouldReturnNotEligibleForTreatmentWithoutRefillSupport() {
        // Given
        when(treatmentService.findById(2L)).thenReturn(einzeltechnikTreatment);

        // When
        RefillEligibilityResponse result = refillCalculationService.calculateRefillEligibility(1L, 2L);

        // Then
        assertFalse(result.isEligible());
        assertEquals("Diese Behandlung unterstützt keine Refills", result.getMessage());
    }

    @Test
    @DisplayName("Should calculate refill eligibility by category")
    void shouldCalculateRefillEligibilityByCategory() {
        // Given
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(recentAppointment));
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 1))
                .thenReturn(List.of(twoWeekRefill, threeWeekRefill));
        when(treatmentRefillRepository.findBestRefillForWeeks(1L, 1))
                .thenReturn(Optional.of(twoWeekRefill));

        // When
        RefillEligibilityResponse result = refillCalculationService
                .calculateRefillEligibilityForCategory(1L, "WIMPERN");

        // Then
        assertTrue(result.isEligible());
        assertEquals(1, result.getWeeksSinceLastAppointment());
        assertEquals(2, result.getAvailableRefills().size());
    }

    @Test
    @DisplayName("Should check if customer is eligible for refill within max weeks")
    void shouldCheckIfCustomerIsEligibleForRefillWithinMaxWeeks() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(recentAppointment));
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 1))
                .thenReturn(List.of(twoWeekRefill, threeWeekRefill));
        when(treatmentRefillRepository.findBestRefillForWeeks(1L, 1))
                .thenReturn(Optional.of(twoWeekRefill));

        // When
        boolean eligible = refillCalculationService.isEligibleForRefill(1L, 1L, 4);

        // Then
        assertTrue(eligible);
    }

    @Test
    @DisplayName("Should not be eligible if weeks exceed max weeks")
    void shouldNotBeEligibleIfWeeksExceedMaxWeeks() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(oldAppointment)); // 5 weeks ago
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 5))
                .thenReturn(List.of());

        // When
        boolean eligible = refillCalculationService.isEligibleForRefill(1L, 1L, 3); // Max 3 weeks

        // Then
        assertFalse(eligible);
    }

    @Test
    @DisplayName("Should get best refill option for eligible customer")
    void shouldGetBestRefillOptionForEligibleCustomer() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(recentAppointment));
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 1))
                .thenReturn(List.of(twoWeekRefill, threeWeekRefill));
        when(treatmentRefillRepository.findBestRefillForWeeks(1L, 1))
                .thenReturn(Optional.of(twoWeekRefill));

        // When
        Optional<RefillOptionDto> bestOption = refillCalculationService.getBestRefillOption(1L, 1L);

        // Then
        assertTrue(bestOption.isPresent());
        assertEquals(new BigDecimal("35.00"), bestOption.get().getPrice());
        assertEquals(2, bestOption.get().getWeekThreshold());
        assertTrue(bestOption.get().isRecommended());
    }

    @Test
    @DisplayName("Should return empty for customer with no refill options")
    void shouldReturnEmptyForCustomerWithNoRefillOptions() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(oldAppointment));
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 5))
                .thenReturn(List.of());

        // When
        Optional<RefillOptionDto> bestOption = refillCalculationService.getBestRefillOption(1L, 1L);

        // Then
        assertFalse(bestOption.isPresent());
    }

    @Test
    @DisplayName("Should get all refill options for treatment")
    void shouldGetAllRefillOptionsForTreatment() {
        // Given
        when(treatmentRefillRepository.findByTreatmentIdAndActiveTrue(1L))
                .thenReturn(List.of(twoWeekRefill, threeWeekRefill));

        // When
        List<RefillOptionDto> options = refillCalculationService.getAllRefillOptionsForTreatment(1L);

        // Then
        assertEquals(2, options.size());
        assertTrue(options.stream().anyMatch(o -> o.getWeekThreshold().equals(2)));
        assertTrue(options.stream().anyMatch(o -> o.getWeekThreshold().equals(3)));
    }

    @Test
    @DisplayName("Should check if treatment supports refills")
    void shouldCheckIfTreatmentSupportsRefills() {
        // Given
        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(treatmentService.findById(2L)).thenReturn(einzeltechnikTreatment);

        // When & Then
        assertTrue(refillCalculationService.treatmentSupportsRefills(1L));
        assertFalse(refillCalculationService.treatmentSupportsRefills(2L));
    }

    @Test
    @DisplayName("Should handle appointment with completed date vs scheduled date")
    void shouldHandleAppointmentWithCompletedDateVsScheduledDate() {
        // Given - appointment with different completed and scheduled dates
        Appointment appointmentWithCompletedDate = new Appointment();
        appointmentWithCompletedDate.setId(3L);
        appointmentWithCompletedDate.setCustomer(customer);
        appointmentWithCompletedDate.setTreatment(hybridTreatment);
        appointmentWithCompletedDate.setScheduledAt(LocalDateTime.now().minusWeeks(2));
        appointmentWithCompletedDate.setCompletedAt(LocalDateTime.now().minusWeeks(1)); // Completed later
        appointmentWithCompletedDate.setStatus(EAppointmentStatus.COMPLETED);

        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(appointmentWithCompletedDate));
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 1))
                .thenReturn(List.of(twoWeekRefill, threeWeekRefill));
        when(treatmentRefillRepository.findBestRefillForWeeks(1L, 1))
                .thenReturn(Optional.of(twoWeekRefill));

        // When
        RefillEligibilityResponse result = refillCalculationService.calculateRefillEligibility(1L, 1L);

        // Then - should use completed date (1 week ago) not scheduled date (2 weeks ago)
        assertTrue(result.isEligible());
        assertEquals(1, result.getWeeksSinceLastAppointment());
    }

    @Test
    @DisplayName("Should handle appointment without completed date")
    void shouldHandleAppointmentWithoutCompletedDate() {
        // Given - appointment without completed date
        Appointment appointmentWithoutCompletedDate = new Appointment();
        appointmentWithoutCompletedDate.setId(4L);
        appointmentWithoutCompletedDate.setCustomer(customer);
        appointmentWithoutCompletedDate.setTreatment(hybridTreatment);
        appointmentWithoutCompletedDate.setScheduledAt(LocalDateTime.now().minusWeeks(1));
        appointmentWithoutCompletedDate.setCompletedAt(null); // No completed date
        appointmentWithoutCompletedDate.setStatus(EAppointmentStatus.COMPLETED);

        when(treatmentService.findById(1L)).thenReturn(hybridTreatment);
        when(appointmentRepository.findByCustomerIdAndStatusIn(eq(1L), any(Set.class)))
                .thenReturn(List.of(appointmentWithoutCompletedDate));
        when(treatmentRefillRepository.findApplicableRefillsForWeeks(1L, 1))
                .thenReturn(List.of(twoWeekRefill, threeWeekRefill));
        when(treatmentRefillRepository.findBestRefillForWeeks(1L, 1))
                .thenReturn(Optional.of(twoWeekRefill));

        // When
        RefillEligibilityResponse result = refillCalculationService.calculateRefillEligibility(1L, 1L);

        // Then - should use scheduled date
        assertTrue(result.isEligible());
        assertEquals(1, result.getWeeksSinceLastAppointment());
    }
}
package de.jexcellence.lmbeauty.controller;

import de.jexcellence.lmbeauty.dto.refill.RefillEligibilityResponse;
import de.jexcellence.lmbeauty.dto.refill.RefillOptionDto;
import de.jexcellence.lmbeauty.service.RefillCalculationService;
import de.jexcellence.lmbeauty.service.TreatmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RefillController.class)
@DisplayName("RefillController Integration Tests")
class RefillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RefillCalculationService refillCalculationService;

    @MockitoBean
    private TreatmentService treatmentService;

    private RefillEligibilityResponse eligibleResponse;
    private RefillEligibilityResponse notEligibleResponse;
    private RefillOptionDto refillOption;

    @BeforeEach
    void setUp() {
        refillOption = RefillOptionDto.builder()
                .id(1L)
                .weekThreshold(2)
                .price(new BigDecimal("35.00"))
                .description("2 wochen")
                .recommended(true)
                .build();

        eligibleResponse = RefillEligibilityResponse.builder()
                .isEligible(true)
                .weeksSinceLastAppointment(1)
                .availableRefills(List.of(refillOption))
                .recommendedOption(refillOption)
                .lastAppointmentDate(LocalDateTime.now().minusWeeks(1))
                .message("Refill-Optionen verfügbar")
                .build();

        notEligibleResponse = RefillEligibilityResponse.builder()
                .isEligible(false)
                .weeksSinceLastAppointment(null)
                .availableRefills(List.of())
                .recommendedOption(null)
                .lastAppointmentDate(null)
                .message("Keine vorherigen Termine gefunden. Nur Neuanlage möglich.")
                .build();
    }

    @Test
    @DisplayName("Should calculate refill eligibility successfully")
    void shouldCalculateRefillEligibilitySuccessfully() throws Exception {
        // Given
        when(refillCalculationService.calculateRefillEligibility(1L, 1L))
                .thenReturn(eligibleResponse);

        // When & Then
        mockMvc.perform(get("/api/refills/calculate")
                        .param("customerId", "1")
                        .param("treatmentId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isEligible").value(true))
                .andExpect(jsonPath("$.weeksSinceLastAppointment").value(1))
                .andExpect(jsonPath("$.availableRefills").isArray())
                .andExpect(jsonPath("$.availableRefills[0].price").value(35.00))
                .andExpect(jsonPath("$.recommendedOption.recommended").value(true))
                .andExpect(jsonPath("$.message").value("Refill-Optionen verfügbar"));

        verify(refillCalculationService).calculateRefillEligibility(1L, 1L);
    }

    @Test
    @DisplayName("Should return bad request for invalid parameters")
    void shouldReturnBadRequestForInvalidParameters() throws Exception {
        // Given
        when(refillCalculationService.calculateRefillEligibility(anyLong(), anyLong()))
                .thenThrow(new IllegalArgumentException("Invalid treatment ID"));

        // When & Then
        mockMvc.perform(get("/api/refills/calculate")
                        .param("customerId", "1")
                        .param("treatmentId", "999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should calculate refill eligibility by category")
    void shouldCalculateRefillEligibilityByCategory() throws Exception {
        // Given
        when(refillCalculationService.calculateRefillEligibilityForCategory(1L, "WIMPERN"))
                .thenReturn(eligibleResponse);

        // When & Then
        mockMvc.perform(get("/api/refills/calculate/category")
                        .param("customerId", "1")
                        .param("category", "WIMPERN")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isEligible").value(true))
                .andExpect(jsonPath("$.weeksSinceLastAppointment").value(1));

        verify(refillCalculationService).calculateRefillEligibilityForCategory(1L, "WIMPERN");
    }

    @Test
    @DisplayName("Should get best refill option")
    void shouldGetBestRefillOption() throws Exception {
        // Given
        when(refillCalculationService.getBestRefillOption(1L, 1L))
                .thenReturn(Optional.of(refillOption));

        // When & Then
        mockMvc.perform(get("/api/refills/best-option")
                        .param("customerId", "1")
                        .param("treatmentId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.weekThreshold").value(2))
                .andExpect(jsonPath("$.price").value(35.00))
                .andExpect(jsonPath("$.description").value("2 wochen"))
                .andExpect(jsonPath("$.recommended").value(true));

        verify(refillCalculationService).getBestRefillOption(1L, 1L);
    }

    @Test
    @DisplayName("Should return no content when no best refill option available")
    void shouldReturnNoContentWhenNoBestRefillOptionAvailable() throws Exception {
        // Given
        when(refillCalculationService.getBestRefillOption(1L, 1L))
                .thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/refills/best-option")
                        .param("customerId", "1")
                        .param("treatmentId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(refillCalculationService).getBestRefillOption(1L, 1L);
    }

    @Test
    @DisplayName("Should check refill eligibility")
    void shouldCheckRefillEligibility() throws Exception {
        // Given
        when(refillCalculationService.isEligibleForRefill(1L, 1L, 4))
                .thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/refills/eligible")
                        .param("customerId", "1")
                        .param("treatmentId", "1")
                        .param("maxWeeks", "4")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(refillCalculationService).isEligibleForRefill(1L, 1L, 4);
    }

    @Test
    @DisplayName("Should use default max weeks when not provided")
    void shouldUseDefaultMaxWeeksWhenNotProvided() throws Exception {
        // Given
        when(refillCalculationService.isEligibleForRefill(1L, 1L, 4))
                .thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/refills/eligible")
                        .param("customerId", "1")
                        .param("treatmentId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        verify(refillCalculationService).isEligibleForRefill(1L, 1L, 4); // Default value
    }

    @Test
    @DisplayName("Should get refill options for treatment")
    void shouldGetRefillOptionsForTreatment() throws Exception {
        // Given
        List<RefillOptionDto> options = List.of(
                RefillOptionDto.builder().id(1L).weekThreshold(2).price(new BigDecimal("35.00")).description("2 wochen").build(),
                RefillOptionDto.builder().id(2L).weekThreshold(3).price(new BigDecimal("40.00")).description("3 wochen").build()
        );
        when(treatmentService.getRefillOptions(1L)).thenReturn(options);

        // When & Then
        mockMvc.perform(get("/api/refills/treatments/1/options")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].weekThreshold").value(2))
                .andExpect(jsonPath("$[0].price").value(35.00))
                .andExpect(jsonPath("$[1].weekThreshold").value(3))
                .andExpect(jsonPath("$[1].price").value(40.00));

        verify(treatmentService).getRefillOptions(1L);
    }

    @Test
    @DisplayName("Should return not found for invalid treatment when getting refill options")
    void shouldReturnNotFoundForInvalidTreatmentWhenGettingRefillOptions() throws Exception {
        // Given
        when(treatmentService.getRefillOptions(999L))
                .thenThrow(new IllegalArgumentException("Treatment not found"));

        // When & Then
        mockMvc.perform(get("/api/refills/treatments/999/options")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should add refill option to treatment")
    void shouldAddRefillOptionToTreatment() throws Exception {
        // Given
        when(treatmentService.addRefillOption(1L, 2, new BigDecimal("35.00"), "2 wochen"))
                .thenReturn(refillOption);

        // When & Then
        mockMvc.perform(post("/api/refills/treatments/1/options")
                        .param("weekThreshold", "2")
                        .param("price", "35.00")
                        .param("description", "2 wochen")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.weekThreshold").value(2))
                .andExpect(jsonPath("$.price").value(35.00))
                .andExpect(jsonPath("$.description").value("2 wochen"));

        verify(treatmentService).addRefillOption(1L, 2, new BigDecimal("35.00"), "2 wochen");
    }

    @Test
    @DisplayName("Should return bad request when adding duplicate refill option")
    void shouldReturnBadRequestWhenAddingDuplicateRefillOption() throws Exception {
        // Given
        when(treatmentService.addRefillOption(1L, 2, new BigDecimal("35.00"), "2 wochen"))
                .thenThrow(new IllegalArgumentException("Refill option already exists"));

        // When & Then
        mockMvc.perform(post("/api/refills/treatments/1/options")
                        .param("weekThreshold", "2")
                        .param("price", "35.00")
                        .param("description", "2 wochen")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should update refill option")
    void shouldUpdateRefillOption() throws Exception {
        // Given
        RefillOptionDto updatedOption = RefillOptionDto.builder()
                .id(1L)
                .weekThreshold(3)
                .price(new BigDecimal("40.00"))
                .description("3 wochen")
                .build();
        when(treatmentService.updateRefillOption(1L, 3, new BigDecimal("40.00"), "3 wochen"))
                .thenReturn(updatedOption);

        // When & Then
        mockMvc.perform(put("/api/refills/options/1")
                        .param("weekThreshold", "3")
                        .param("price", "40.00")
                        .param("description", "3 wochen")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.weekThreshold").value(3))
                .andExpect(jsonPath("$.price").value(40.00))
                .andExpect(jsonPath("$.description").value("3 wochen"));

        verify(treatmentService).updateRefillOption(1L, 3, new BigDecimal("40.00"), "3 wochen");
    }

    @Test
    @DisplayName("Should return bad request when updating non-existent refill option")
    void shouldReturnBadRequestWhenUpdatingNonExistentRefillOption() throws Exception {
        // Given
        when(treatmentService.updateRefillOption(eq(999L), any(), any(), any()))
                .thenThrow(new IllegalArgumentException("Refill option not found"));

        // When & Then
        mockMvc.perform(put("/api/refills/options/999")
                        .param("price", "40.00")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should delete refill option")
    void shouldDeleteRefillOption() throws Exception {
        // Given
        doNothing().when(treatmentService).removeRefillOption(1L);

        // When & Then
        mockMvc.perform(delete("/api/refills/options/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(treatmentService).removeRefillOption(1L);
    }

    @Test
    @DisplayName("Should return not found when deleting non-existent refill option")
    void shouldReturnNotFoundWhenDeletingNonExistentRefillOption() throws Exception {
        // Given
        doThrow(new IllegalArgumentException("Refill option not found"))
                .when(treatmentService).removeRefillOption(999L);

        // When & Then
        mockMvc.perform(delete("/api/refills/options/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should check if treatment supports refills")
    void shouldCheckIfTreatmentSupportsRefills() throws Exception {
        // Given
        when(treatmentService.supportsRefills(1L)).thenReturn(true);
        when(treatmentService.supportsRefills(2L)).thenReturn(false);

        // When & Then - Treatment that supports refills
        mockMvc.perform(get("/api/refills/treatments/1/supports-refills")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        // When & Then - Treatment that doesn't support refills
        mockMvc.perform(get("/api/refills/treatments/2/supports-refills")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        verify(treatmentService).supportsRefills(1L);
        verify(treatmentService).supportsRefills(2L);
    }

    @Test
    @DisplayName("Should return not found when checking refill support for non-existent treatment")
    void shouldReturnNotFoundWhenCheckingRefillSupportForNonExistentTreatment() throws Exception {
        // Given
        when(treatmentService.supportsRefills(999L))
                .thenThrow(new IllegalArgumentException("Treatment not found"));

        // When & Then
        mockMvc.perform(get("/api/refills/treatments/999/supports-refills")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should handle internal server error gracefully")
    void shouldHandleInternalServerErrorGracefully() throws Exception {
        // Given
        when(refillCalculationService.calculateRefillEligibility(anyLong(), anyLong()))
                .thenThrow(new RuntimeException("Database connection error"));

        // When & Then
        mockMvc.perform(get("/api/refills/calculate")
                        .param("customerId", "1")
                        .param("treatmentId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }
}
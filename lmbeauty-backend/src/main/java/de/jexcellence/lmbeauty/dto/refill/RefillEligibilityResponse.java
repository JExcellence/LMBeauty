package de.jexcellence.lmbeauty.dto.refill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for refill eligibility calculation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefillEligibilityResponse {

    private boolean isEligible;
    private Integer weeksSinceLastAppointment;
    private List<RefillOptionDto> availableRefills;
    private RefillOptionDto recommendedOption;
    private LocalDateTime lastAppointmentDate;
    private String message;

    /**
     * Create response for customer with no appointment history.
     */
    public static RefillEligibilityResponse noHistory() {
        return RefillEligibilityResponse.builder()
                .isEligible(false)
                .weeksSinceLastAppointment(null)
                .availableRefills(List.of())
                .recommendedOption(null)
                .lastAppointmentDate(null)
                .message("Keine vorherigen Termine gefunden. Nur Neuanlage möglich.")
                .build();
    }

    /**
     * Create response for customer with no eligible refills.
     */
    public static RefillEligibilityResponse noEligibleRefills(Integer weeksSinceLastAppointment, 
                                                             LocalDateTime lastAppointmentDate) {
        return RefillEligibilityResponse.builder()
                .isEligible(false)
                .weeksSinceLastAppointment(weeksSinceLastAppointment)
                .availableRefills(List.of())
                .recommendedOption(null)
                .lastAppointmentDate(lastAppointmentDate)
                .message("Zu lange her für Refill. Neuanlage empfohlen.")
                .build();
    }

    /**
     * Create response for eligible customer.
     */
    public static RefillEligibilityResponse eligible(Integer weeksSinceLastAppointment,
                                                   List<RefillOptionDto> availableRefills,
                                                   RefillOptionDto recommendedOption,
                                                   LocalDateTime lastAppointmentDate) {
        return RefillEligibilityResponse.builder()
                .isEligible(true)
                .weeksSinceLastAppointment(weeksSinceLastAppointment)
                .availableRefills(availableRefills)
                .recommendedOption(recommendedOption)
                .lastAppointmentDate(lastAppointmentDate)
                .message("Refill-Optionen verfügbar")
                .build();
    }
}
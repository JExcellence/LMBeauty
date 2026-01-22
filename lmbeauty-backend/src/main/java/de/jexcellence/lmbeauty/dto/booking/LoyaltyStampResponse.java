package de.jexcellence.lmbeauty.dto.booking;

import de.jexcellence.lmbeauty.database.entity.LoyaltyStamp;
import java.time.LocalDateTime;

public record LoyaltyStampResponse(
    Long id,
    Long userId,
    Long appointmentId,
    String treatmentName,
    LocalDateTime earnedAt,
    boolean redeemed,
    LocalDateTime redeemedAt,
    int cycleNumber
) {
    public static LoyaltyStampResponse from(LoyaltyStamp stamp) {
        return new LoyaltyStampResponse(
            stamp.getId(),
            stamp.getUser().getId(),
            stamp.getAppointment().getId(),
            stamp.getAppointment().getTreatment().getName(),
            stamp.getEarnedAt(),
            stamp.isRedeemed(),
            stamp.getRedeemedAt(),
            stamp.getCycleNumber()
        );
    }
}

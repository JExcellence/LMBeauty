package de.jexcellence.lmbeauty.dto.booking;

import java.math.BigDecimal;

public record LoyaltyStatusResponse(
    Long userId,
    int currentStamps,
    int totalStamps,
    int currentCycle,
    boolean rewardAvailable,
    BigDecimal rewardDiscount,
    int stampsToNextReward
) {}

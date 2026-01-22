package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.database.entity.LoyaltyStamp;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.AppointmentRepository;
import de.jexcellence.lmbeauty.database.repository.LoyaltyStampRepository;
import de.jexcellence.lmbeauty.database.repository.UserRepository;
import de.jexcellence.lmbeauty.dto.booking.LoyaltyStampResponse;
import de.jexcellence.lmbeauty.dto.booking.LoyaltyStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private static final int STAMPS_FOR_REWARD = 10;
    private static final BigDecimal REWARD_DISCOUNT_PERCENT = new BigDecimal("15");

    private final LoyaltyStampRepository loyaltyStampRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public LoyaltyStatusResponse getLoyaltyStatus(Long userId) {
        int currentStamps = loyaltyStampRepository.countByUserIdAndRedeemedFalse(userId);
        int totalStamps = loyaltyStampRepository.countByUserId(userId);
        int currentCycle = loyaltyStampRepository.getCurrentCycleNumber(userId);
        boolean rewardAvailable = currentStamps >= STAMPS_FOR_REWARD;
        int stampsToNextReward = rewardAvailable ? 0 : STAMPS_FOR_REWARD - currentStamps;

        return new LoyaltyStatusResponse(
            userId,
            currentStamps,
            totalStamps,
            currentCycle,
            rewardAvailable,
            REWARD_DISCOUNT_PERCENT,
            stampsToNextReward
        );
    }

    @Transactional(readOnly = true)
    public List<LoyaltyStampResponse> getLoyaltyHistory(Long userId) {
        return loyaltyStampRepository.findByUserId(userId).stream()
            .map(LoyaltyStampResponse::from)
            .toList();
    }

    @Transactional
    public LoyaltyStampResponse addStamp(Long appointmentId) {
        // Check if stamp already exists for this appointment
        if (loyaltyStampRepository.existsByAppointmentId(appointmentId)) {
            throw new IllegalStateException("Stamp already exists for this appointment");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId);
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment not found");
        }

        User user = appointment.getCustomer();
        int currentCycle = loyaltyStampRepository.getCurrentCycleNumber(user.getId());

        LoyaltyStamp stamp = new LoyaltyStamp();
        stamp.setUser(user);
        stamp.setAppointment(appointment);
        stamp.setEarnedAt(LocalDateTime.now());
        stamp.setRedeemed(false);
        stamp.setCycleNumber(currentCycle);

        LoyaltyStamp saved = loyaltyStampRepository.create(stamp);
        return LoyaltyStampResponse.from(saved);
    }

    @Transactional
    public LoyaltyStatusResponse redeemReward(Long userId) {
        int currentStamps = loyaltyStampRepository.countByUserIdAndRedeemedFalse(userId);
        
        if (currentStamps < STAMPS_FOR_REWARD) {
            throw new IllegalStateException("Not enough stamps to redeem reward. Need " + 
                STAMPS_FOR_REWARD + " stamps, have " + currentStamps);
        }

        // Mark stamps as redeemed
        List<LoyaltyStamp> unredeemed = loyaltyStampRepository.findByUserIdAndRedeemed(userId, false);
        int stampsToRedeem = Math.min(unredeemed.size(), STAMPS_FOR_REWARD);
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < stampsToRedeem; i++) {
            LoyaltyStamp stamp = unredeemed.get(i);
            stamp.setRedeemed(true);
            stamp.setRedeemedAt(now);
            loyaltyStampRepository.update(stamp);
        }

        // Start new cycle for future stamps
        int newCycle = loyaltyStampRepository.getCurrentCycleNumber(userId) + 1;

        return getLoyaltyStatus(userId);
    }

    @Transactional(readOnly = true)
    public boolean hasAvailableReward(Long userId) {
        int currentStamps = loyaltyStampRepository.countByUserIdAndRedeemedFalse(userId);
        return currentStamps >= STAMPS_FOR_REWARD;
    }

    @Transactional(readOnly = true)
    public BigDecimal getRewardDiscountPercent() {
        return REWARD_DISCOUNT_PERCENT;
    }

    public BigDecimal calculateDiscountedPrice(BigDecimal originalPrice, boolean applyReward) {
        if (!applyReward) {
            return originalPrice;
        }
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
            REWARD_DISCOUNT_PERCENT.divide(new BigDecimal("100"))
        );
        return originalPrice.multiply(discountMultiplier);
    }
}

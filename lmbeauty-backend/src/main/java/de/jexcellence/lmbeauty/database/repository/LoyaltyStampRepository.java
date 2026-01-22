package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.LoyaltyStamp;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ExecutorService;

@Repository
public class LoyaltyStampRepository extends GenericCachedRepository<LoyaltyStamp, Long, Long> {

    public LoyaltyStampRepository(
        final ExecutorService executor,
        final EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, LoyaltyStamp.class, LoyaltyStamp::getId);
    }

    public List<LoyaltyStamp> findByUserId(Long userId) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(s -> s.getUser().getId().equals(userId))
            .sorted(Comparator.comparing(LoyaltyStamp::getEarnedAt).reversed())
            .toList();
    }

    public List<LoyaltyStamp> findByUserIdAndRedeemed(Long userId, boolean redeemed) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(s -> s.getUser().getId().equals(userId))
            .filter(s -> s.isRedeemed() == redeemed)
            .sorted(Comparator.comparing(LoyaltyStamp::getEarnedAt))
            .toList();
    }

    public List<LoyaltyStamp> findByUserIdAndCycleNumber(Long userId, int cycleNumber) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(s -> s.getUser().getId().equals(userId))
            .filter(s -> s.getCycleNumber() == cycleNumber)
            .sorted(Comparator.comparing(LoyaltyStamp::getEarnedAt))
            .toList();
    }

    public int countByUserIdAndRedeemedFalse(Long userId) {
        return (int) this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(s -> s.getUser().getId().equals(userId))
            .filter(s -> !s.isRedeemed())
            .count();
    }

    public int countByUserId(Long userId) {
        return (int) this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(s -> s.getUser().getId().equals(userId))
            .count();
    }

    public int getCurrentCycleNumber(Long userId) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(s -> s.getUser().getId().equals(userId))
            .mapToInt(LoyaltyStamp::getCycleNumber)
            .max()
            .orElse(1);
    }

    public boolean existsByAppointmentId(Long appointmentId) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .anyMatch(s -> s.getAppointment().getId().equals(appointmentId));
    }
}

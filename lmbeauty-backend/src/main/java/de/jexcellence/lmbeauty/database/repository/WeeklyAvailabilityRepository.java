package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.WeeklyAvailability;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.concurrent.ExecutorService;

@Repository
public class WeeklyAvailabilityRepository extends GenericCachedRepository<WeeklyAvailability, Long, Long> {

    public WeeklyAvailabilityRepository(
        final ExecutorService executor,
        final EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, WeeklyAvailability.class, WeeklyAvailability::getId);
    }

    public List<WeeklyAvailability> findByDayOfWeekAndActiveTrue(DayOfWeek dayOfWeek) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(wa -> wa.isActive() && wa.getDayOfWeek() == dayOfWeek)
            .toList();
    }

    public List<WeeklyAvailability> findByDayOfWeek(DayOfWeek dayOfWeek) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(wa -> wa.getDayOfWeek() == dayOfWeek)
            .toList();
    }

    public List<WeeklyAvailability> findByActiveTrue() {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(WeeklyAvailability::isActive)
            .toList();
    }
}

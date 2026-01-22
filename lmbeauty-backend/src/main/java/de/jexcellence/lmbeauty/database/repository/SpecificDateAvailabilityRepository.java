package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.SpecificDateAvailability;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutorService;

@Repository
public class SpecificDateAvailabilityRepository extends GenericCachedRepository<SpecificDateAvailability, Long, Long> {

    public SpecificDateAvailabilityRepository(
        final ExecutorService executor,
        final EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, SpecificDateAvailability.class, SpecificDateAvailability::getId);
    }

    public List<SpecificDateAvailability> findByDateAndActiveTrue(LocalDate date) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(sda -> sda.isActive() && sda.getDate().equals(date))
            .toList();
    }

    public List<SpecificDateAvailability> findByDate(LocalDate date) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(sda -> sda.getDate().equals(date))
            .toList();
    }

    public List<SpecificDateAvailability> findByActiveTrue() {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(SpecificDateAvailability::isActive)
            .toList();
    }

    public List<SpecificDateAvailability> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(sda -> !sda.getDate().isBefore(startDate) && !sda.getDate().isAfter(endDate))
            .toList();
    }
}
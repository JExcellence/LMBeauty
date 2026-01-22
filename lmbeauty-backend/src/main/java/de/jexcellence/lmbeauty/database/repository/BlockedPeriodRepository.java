package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.BlockedPeriod;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ExecutorService;

@Repository
public class BlockedPeriodRepository extends GenericCachedRepository<BlockedPeriod, Long, Long> {

    public BlockedPeriodRepository(
        final ExecutorService executor,
        final EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, BlockedPeriod.class, BlockedPeriod::getId);
    }

    /**
     * Find blocked periods that overlap with the given time range.
     * A period overlaps if it starts before the range ends AND ends after the range starts.
     */
    public List<BlockedPeriod> findOverlapping(LocalDateTime start, LocalDateTime end) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(bp -> bp.getStartDateTime().isBefore(end) && bp.getEndDateTime().isAfter(start))
            .toList();
    }
}

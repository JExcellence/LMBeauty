package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;

@Repository
public class TreatmentRepository extends GenericCachedRepository<Treatment, Long, Long> {

    public TreatmentRepository(
        final ExecutorService executor,
        final EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, Treatment.class, Treatment::getId);
    }

    public List<Treatment> findByActiveTrue() {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(Treatment::isActive)
            .toList();
    }

    public Optional<Treatment> findBySlug(String slug) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(t -> t.isActive() && slug.equals(t.getSlug()))
            .findFirst();
    }

    public Optional<Treatment> findBySlugIncludingInactive(String slug) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(t -> slug.equals(t.getSlug()))
            .findFirst();
    }

    public List<Treatment> findByCategory(ETreatmentCategory category) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(t -> t.isActive() && t.getCategory() == category)
            .toList();
    }

    public List<Treatment> findByCategoryAndActiveTrue(ETreatmentCategory category) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(t -> t.isActive() && t.getCategory() == category)
            .toList();
    }

    public List<Treatment> findByCategoryOrderBySortOrder(ETreatmentCategory category) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(t -> t.isActive() && t.getCategory() == category)
            .sorted((a, b) -> {
                int orderA = a.getSortOrder() != null ? a.getSortOrder() : 0;
                int orderB = b.getSortOrder() != null ? b.getSortOrder() : 0;
                return Integer.compare(orderA, orderB);
            })
            .toList();
    }

    public boolean existsBySlug(String slug) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .anyMatch(t -> slug.equals(t.getSlug()));
    }

    public List<Treatment> findByUrlSlugAndActiveTrue(String urlSlug) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(t -> t.isActive() && urlSlug.equals(t.getUrlSlug()))
            .toList();
    }

    public Optional<Treatment> findByUrlSlug(String urlSlug) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(t -> urlSlug.equals(t.getUrlSlug()))
            .findFirst();
    }
}

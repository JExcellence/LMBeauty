package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for TreatmentRefill entity operations.
 */
@Repository
public interface TreatmentRefillRepository extends JpaRepository<TreatmentRefill, Long> {

    /**
     * Find all active refill options for a specific treatment.
     */
    List<TreatmentRefill> findByTreatmentIdAndActiveTrue(Long treatmentId);

    /**
     * Find all refill options for a specific treatment (including inactive).
     */
    List<TreatmentRefill> findByTreatmentId(Long treatmentId);

    /**
     * Find refill options for a treatment that are applicable for the given weeks.
     * Returns refills where weekThreshold >= weeksSinceLastAppointment, ordered by weekThreshold ascending.
     */
    @Query("SELECT tr FROM TreatmentRefill tr WHERE tr.treatment.id = :treatmentId " +
           "AND tr.active = true AND tr.weekThreshold >= :weeksSinceLastAppointment " +
           "ORDER BY tr.weekThreshold ASC")
    List<TreatmentRefill> findApplicableRefillsForWeeks(@Param("treatmentId") Long treatmentId, 
                                                        @Param("weeksSinceLastAppointment") Integer weeksSinceLastAppointment);

    /**
     * Find the best (lowest threshold) refill option for given weeks since last appointment.
     */
    @Query("SELECT tr FROM TreatmentRefill tr WHERE tr.treatment.id = :treatmentId " +
           "AND tr.active = true AND tr.weekThreshold >= :weeksSinceLastAppointment " +
           "ORDER BY tr.weekThreshold ASC LIMIT 1")
    Optional<TreatmentRefill> findBestRefillForWeeks(@Param("treatmentId") Long treatmentId, 
                                                     @Param("weeksSinceLastAppointment") Integer weeksSinceLastAppointment);

    /**
     * Find refill option by treatment and exact week threshold.
     */
    Optional<TreatmentRefill> findByTreatmentIdAndWeekThreshold(Long treatmentId, Integer weekThreshold);

    /**
     * Check if a treatment has any active refill options.
     */
    boolean existsByTreatmentIdAndActiveTrue(Long treatmentId);

    /**
     * Find all refill options ordered by week threshold.
     */
    @Query("SELECT tr FROM TreatmentRefill tr WHERE tr.treatment.id = :treatmentId " +
           "AND tr.active = true ORDER BY tr.weekThreshold ASC")
    List<TreatmentRefill> findByTreatmentIdOrderByWeekThreshold(@Param("treatmentId") Long treatmentId);

    /**
     * Delete all refill options for a treatment.
     */
    void deleteByTreatmentId(Long treatmentId);

    /**
     * Count active refill options for a treatment.
     */
    long countByTreatmentIdAndActiveTrue(Long treatmentId);
}
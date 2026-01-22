package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.TreatmentAudit;
import de.jexcellence.lmbeauty.type.EAuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for TreatmentAudit entity operations.
 */
@Repository
public interface TreatmentAuditRepository extends JpaRepository<TreatmentAudit, Long> {

    /**
     * Find all audit entries for a specific treatment, ordered by timestamp descending.
     */
    List<TreatmentAudit> findByTreatmentIdOrderByTimestampDesc(Long treatmentId);

    /**
     * Find audit entries for a specific treatment with pagination.
     */
    Page<TreatmentAudit> findByTreatmentIdOrderByTimestampDesc(Long treatmentId, Pageable pageable);

    /**
     * Find audit entries by action type.
     */
    List<TreatmentAudit> findByActionOrderByTimestampDesc(EAuditAction action);

    /**
     * Find audit entries by admin user.
     */
    List<TreatmentAudit> findByAdminUserIdOrderByTimestampDesc(Long adminUserId);

    /**
     * Find audit entries within a date range.
     */
    @Query("SELECT ta FROM TreatmentAudit ta WHERE ta.timestamp BETWEEN :startDate AND :endDate " +
           "ORDER BY ta.timestamp DESC")
    List<TreatmentAudit> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);

    /**
     * Find recent audit entries (last N entries).
     */
    @Query("SELECT ta FROM TreatmentAudit ta ORDER BY ta.timestamp DESC LIMIT :limit")
    List<TreatmentAudit> findRecentEntries(@Param("limit") int limit);

    /**
     * Find audit entries for a specific treatment and action.
     */
    List<TreatmentAudit> findByTreatmentIdAndActionOrderByTimestampDesc(Long treatmentId, EAuditAction action);

    /**
     * Find audit entries for a specific field change.
     */
    List<TreatmentAudit> findByFieldChangedOrderByTimestampDesc(String fieldChanged);

    /**
     * Count audit entries for a treatment.
     */
    long countByTreatmentId(Long treatmentId);

    /**
     * Count audit entries by action type.
     */
    long countByAction(EAuditAction action);

    /**
     * Find all seeding operations.
     */
    @Query("SELECT ta FROM TreatmentAudit ta WHERE ta.action = 'SEED' ORDER BY ta.timestamp DESC")
    List<TreatmentAudit> findAllSeedingOperations();

    /**
     * Find the last seeding operation.
     */
    @Query("SELECT ta FROM TreatmentAudit ta WHERE ta.action = 'SEED' ORDER BY ta.timestamp DESC LIMIT 1")
    TreatmentAudit findLastSeedingOperation();

    /**
     * Delete audit entries older than specified date.
     */
    void deleteByTimestampBefore(LocalDateTime cutoffDate);
}
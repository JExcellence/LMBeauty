package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.TreatmentAudit;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.type.EAuditAction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("TreatmentAuditRepository Tests")
class TreatmentAuditRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TreatmentAuditRepository treatmentAuditRepository;

    private User adminUser;
    private Long treatmentId1;
    private Long treatmentId2;
    private TreatmentAudit createAudit;
    private TreatmentAudit updateAudit;
    private TreatmentAudit deleteAudit;
    private TreatmentAudit seedAudit;

    @BeforeEach
    void setUp() {
        // Create test admin user
        adminUser = new User();
        adminUser.setEmail("admin@lmbeauty.com");
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser = entityManager.persistAndFlush(adminUser);

        treatmentId1 = 100L;
        treatmentId2 = 200L;

        // Create test audit entries
        createAudit = TreatmentAudit.createEntry(treatmentId1, adminUser, "Treatment created");
        createAudit.setTimestamp(LocalDateTime.now().minusHours(4));
        createAudit = entityManager.persistAndFlush(createAudit);

        updateAudit = TreatmentAudit.updateEntry(treatmentId1, "price", "75.00", "80.00", adminUser);
        updateAudit.setTimestamp(LocalDateTime.now().minusHours(2));
        updateAudit = entityManager.persistAndFlush(updateAudit);

        deleteAudit = TreatmentAudit.deleteEntry(treatmentId2, adminUser, "Treatment deleted");
        deleteAudit.setTimestamp(LocalDateTime.now().minusHours(1));
        deleteAudit = entityManager.persistAndFlush(deleteAudit);

        seedAudit = TreatmentAudit.seedEntry("Database seeded with treatment data", adminUser);
        seedAudit.setTimestamp(LocalDateTime.now().minusHours(3));
        seedAudit = entityManager.persistAndFlush(seedAudit);

        entityManager.clear();
    }

    @Test
    @DisplayName("Should find audit entries by treatment ID ordered by timestamp desc")
    void shouldFindAuditEntriesByTreatmentIdOrderedByTimestampDesc() {
        List<TreatmentAudit> audits = treatmentAuditRepository.findByTreatmentIdOrderByTimestampDesc(treatmentId1);

        assertEquals(2, audits.size());
        // Should be ordered by timestamp descending (most recent first)
        assertEquals(EAuditAction.UPDATE, audits.get(0).getAction()); // More recent
        assertEquals(EAuditAction.CREATE, audits.get(1).getAction()); // Older
        assertTrue(audits.get(0).getTimestamp().isAfter(audits.get(1).getTimestamp()));
    }

    @Test
    @DisplayName("Should find audit entries with pagination")
    void shouldFindAuditEntriesWithPagination() {
        PageRequest pageRequest = PageRequest.of(0, 1);
        Page<TreatmentAudit> auditPage = treatmentAuditRepository
                .findByTreatmentIdOrderByTimestampDesc(treatmentId1, pageRequest);

        assertEquals(1, auditPage.getContent().size());
        assertEquals(2, auditPage.getTotalElements());
        assertEquals(2, auditPage.getTotalPages());
        assertEquals(EAuditAction.UPDATE, auditPage.getContent().get(0).getAction()); // Most recent
    }

    @Test
    @DisplayName("Should find audit entries by action type")
    void shouldFindAuditEntriesByActionType() {
        List<TreatmentAudit> createAudits = treatmentAuditRepository.findByActionOrderByTimestampDesc(EAuditAction.CREATE);
        assertEquals(1, createAudits.size());
        assertEquals(EAuditAction.CREATE, createAudits.get(0).getAction());

        List<TreatmentAudit> updateAudits = treatmentAuditRepository.findByActionOrderByTimestampDesc(EAuditAction.UPDATE);
        assertEquals(1, updateAudits.size());
        assertEquals(EAuditAction.UPDATE, updateAudits.get(0).getAction());

        List<TreatmentAudit> seedAudits = treatmentAuditRepository.findByActionOrderByTimestampDesc(EAuditAction.SEED);
        assertEquals(1, seedAudits.size());
        assertEquals(EAuditAction.SEED, seedAudits.get(0).getAction());
    }

    @Test
    @DisplayName("Should find audit entries by admin user")
    void shouldFindAuditEntriesByAdminUser() {
        List<TreatmentAudit> userAudits = treatmentAuditRepository.findByAdminUserIdOrderByTimestampDesc(adminUser.getId());

        assertEquals(4, userAudits.size()); // All audits are by the same admin user
        assertTrue(userAudits.stream().allMatch(audit -> audit.getAdminUser().getId().equals(adminUser.getId())));
        
        // Should be ordered by timestamp descending
        for (int i = 0; i < userAudits.size() - 1; i++) {
            assertTrue(userAudits.get(i).getTimestamp().isAfter(userAudits.get(i + 1).getTimestamp()) ||
                      userAudits.get(i).getTimestamp().equals(userAudits.get(i + 1).getTimestamp()));
        }
    }

    @Test
    @DisplayName("Should find audit entries within date range")
    void shouldFindAuditEntriesWithinDateRange() {
        LocalDateTime startDate = LocalDateTime.now().minusHours(3).minusMinutes(30);
        LocalDateTime endDate = LocalDateTime.now().minusHours(1).minusMinutes(30);

        List<TreatmentAudit> auditsInRange = treatmentAuditRepository.findByTimestampBetween(startDate, endDate);

        assertEquals(2, auditsInRange.size()); // Should include seedAudit and updateAudit
        assertTrue(auditsInRange.stream().anyMatch(audit -> audit.getAction() == EAuditAction.SEED));
        assertTrue(auditsInRange.stream().anyMatch(audit -> audit.getAction() == EAuditAction.UPDATE));
    }

    @Test
    @DisplayName("Should find recent audit entries with limit")
    void shouldFindRecentAuditEntriesWithLimit() {
        List<TreatmentAudit> recentAudits = treatmentAuditRepository.findRecentEntries(2);

        assertEquals(2, recentAudits.size());
        // Should be the 2 most recent entries
        assertEquals(EAuditAction.DELETE, recentAudits.get(0).getAction()); // Most recent
        assertEquals(EAuditAction.UPDATE, recentAudits.get(1).getAction()); // Second most recent
    }

    @Test
    @DisplayName("Should find audit entries by treatment and action")
    void shouldFindAuditEntriesByTreatmentAndAction() {
        List<TreatmentAudit> treatment1Creates = treatmentAuditRepository
                .findByTreatmentIdAndActionOrderByTimestampDesc(treatmentId1, EAuditAction.CREATE);
        assertEquals(1, treatment1Creates.size());
        assertEquals(treatmentId1, treatment1Creates.get(0).getTreatmentId());

        List<TreatmentAudit> treatment1Updates = treatmentAuditRepository
                .findByTreatmentIdAndActionOrderByTimestampDesc(treatmentId1, EAuditAction.UPDATE);
        assertEquals(1, treatment1Updates.size());
        assertEquals(treatmentId1, treatment1Updates.get(0).getTreatmentId());

        List<TreatmentAudit> treatment2Deletes = treatmentAuditRepository
                .findByTreatmentIdAndActionOrderByTimestampDesc(treatmentId2, EAuditAction.DELETE);
        assertEquals(1, treatment2Deletes.size());
        assertEquals(treatmentId2, treatment2Deletes.get(0).getTreatmentId());
    }

    @Test
    @DisplayName("Should find audit entries by field changed")
    void shouldFindAuditEntriesByFieldChanged() {
        List<TreatmentAudit> priceChanges = treatmentAuditRepository.findByFieldChangedOrderByTimestampDesc("price");

        assertEquals(1, priceChanges.size());
        assertEquals("price", priceChanges.get(0).getFieldChanged());
        assertEquals("75.00", priceChanges.get(0).getOldValue());
        assertEquals("80.00", priceChanges.get(0).getNewValue());
    }

    @Test
    @DisplayName("Should count audit entries by treatment")
    void shouldCountAuditEntriesByTreatment() {
        long treatment1Count = treatmentAuditRepository.countByTreatmentId(treatmentId1);
        assertEquals(2, treatment1Count);

        long treatment2Count = treatmentAuditRepository.countByTreatmentId(treatmentId2);
        assertEquals(1, treatment2Count);

        long nonExistentTreatmentCount = treatmentAuditRepository.countByTreatmentId(999L);
        assertEquals(0, nonExistentTreatmentCount);
    }

    @Test
    @DisplayName("Should count audit entries by action")
    void shouldCountAuditEntriesByAction() {
        long createCount = treatmentAuditRepository.countByAction(EAuditAction.CREATE);
        assertEquals(1, createCount);

        long updateCount = treatmentAuditRepository.countByAction(EAuditAction.UPDATE);
        assertEquals(1, updateCount);

        long deleteCount = treatmentAuditRepository.countByAction(EAuditAction.DELETE);
        assertEquals(1, deleteCount);

        long seedCount = treatmentAuditRepository.countByAction(EAuditAction.SEED);
        assertEquals(1, seedCount);
    }

    @Test
    @DisplayName("Should find all seeding operations")
    void shouldFindAllSeedingOperations() {
        List<TreatmentAudit> seedingOps = treatmentAuditRepository.findAllSeedingOperations();

        assertEquals(1, seedingOps.size());
        assertEquals(EAuditAction.SEED, seedingOps.get(0).getAction());
        assertEquals("Database seeded with treatment data", seedingOps.get(0).getDescription());
    }

    @Test
    @DisplayName("Should find last seeding operation")
    void shouldFindLastSeedingOperation() {
        // Add another seeding operation
        TreatmentAudit newerSeedAudit = TreatmentAudit.seedEntry("Second seeding operation", adminUser);
        newerSeedAudit.setTimestamp(LocalDateTime.now().minusMinutes(30));
        entityManager.persistAndFlush(newerSeedAudit);

        TreatmentAudit lastSeed = treatmentAuditRepository.findLastSeedingOperation();

        assertNotNull(lastSeed);
        assertEquals(EAuditAction.SEED, lastSeed.getAction());
        assertEquals("Second seeding operation", lastSeed.getDescription());
    }

    @Test
    @DisplayName("Should handle empty results gracefully")
    void shouldHandleEmptyResultsGracefully() {
        List<TreatmentAudit> emptyResult = treatmentAuditRepository.findByTreatmentIdOrderByTimestampDesc(999L);
        assertTrue(emptyResult.isEmpty());

        List<TreatmentAudit> emptyFieldResult = treatmentAuditRepository.findByFieldChangedOrderByTimestampDesc("nonexistent");
        assertTrue(emptyFieldResult.isEmpty());

        long zeroCount = treatmentAuditRepository.countByTreatmentId(999L);
        assertEquals(0, zeroCount);
    }

    @Test
    @DisplayName("Should handle null treatment ID for seed operations")
    void shouldHandleNullTreatmentIdForSeedOperations() {
        List<TreatmentAudit> seedAudits = treatmentAuditRepository.findByActionOrderByTimestampDesc(EAuditAction.SEED);

        assertEquals(1, seedAudits.size());
        assertNull(seedAudits.get(0).getTreatmentId()); // Seed operations have null treatment ID
        assertEquals(EAuditAction.SEED, seedAudits.get(0).getAction());
    }
}
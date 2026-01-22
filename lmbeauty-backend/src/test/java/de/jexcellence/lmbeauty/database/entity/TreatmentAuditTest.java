package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.lmbeauty.type.EAuditAction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TreatmentAudit Entity Tests")
class TreatmentAuditTest {

    private User adminUser;
    private TreatmentAudit auditEntry;
    private Long treatmentId;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@lmbeauty.com");
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");

        treatmentId = 123L;

        auditEntry = new TreatmentAudit();
        auditEntry.setTreatmentId(treatmentId);
        auditEntry.setAction(EAuditAction.UPDATE);
        auditEntry.setFieldChanged("price");
        auditEntry.setOldValue("75.00");
        auditEntry.setNewValue("80.00");
        auditEntry.setAdminUser(adminUser);
        auditEntry.setDescription("Price updated by admin");
    }

    @Test
    @DisplayName("Should create TreatmentAudit with valid data")
    void shouldCreateTreatmentAuditWithValidData() {
        assertNotNull(auditEntry);
        assertEquals(treatmentId, auditEntry.getTreatmentId());
        assertEquals(EAuditAction.UPDATE, auditEntry.getAction());
        assertEquals("price", auditEntry.getFieldChanged());
        assertEquals("75.00", auditEntry.getOldValue());
        assertEquals("80.00", auditEntry.getNewValue());
        assertEquals(adminUser, auditEntry.getAdminUser());
        assertEquals("Price updated by admin", auditEntry.getDescription());
        assertNotNull(auditEntry.getTimestamp());
    }

    @Test
    @DisplayName("Should set timestamp automatically on creation")
    void shouldSetTimestampAutomaticallyOnCreation() {
        LocalDateTime beforeCreation = LocalDateTime.now().minusSeconds(1);
        TreatmentAudit newAudit = new TreatmentAudit();
        LocalDateTime afterCreation = LocalDateTime.now().plusSeconds(1);

        assertNotNull(newAudit.getTimestamp());
        assertTrue(newAudit.getTimestamp().isAfter(beforeCreation));
        assertTrue(newAudit.getTimestamp().isBefore(afterCreation));
    }

    @Test
    @DisplayName("Should create audit entry using constructor with parameters")
    void shouldCreateAuditEntryUsingConstructorWithParameters() {
        TreatmentAudit audit = new TreatmentAudit(treatmentId, EAuditAction.CREATE, adminUser);

        assertEquals(treatmentId, audit.getTreatmentId());
        assertEquals(EAuditAction.CREATE, audit.getAction());
        assertEquals(adminUser, audit.getAdminUser());
        assertNotNull(audit.getTimestamp());
    }

    @Test
    @DisplayName("Should create audit entry with field changes")
    void shouldCreateAuditEntryWithFieldChanges() {
        TreatmentAudit audit = new TreatmentAudit(treatmentId, EAuditAction.UPDATE, 
                                                 "name", "Old Name", "New Name", adminUser);

        assertEquals(treatmentId, audit.getTreatmentId());
        assertEquals(EAuditAction.UPDATE, audit.getAction());
        assertEquals("name", audit.getFieldChanged());
        assertEquals("Old Name", audit.getOldValue());
        assertEquals("New Name", audit.getNewValue());
        assertEquals(adminUser, audit.getAdminUser());
    }

    @Test
    @DisplayName("Should create audit entry with description")
    void shouldCreateAuditEntryWithDescription() {
        String description = "Treatment created via data seeding";
        TreatmentAudit audit = new TreatmentAudit(treatmentId, EAuditAction.CREATE, description, adminUser);

        assertEquals(treatmentId, audit.getTreatmentId());
        assertEquals(EAuditAction.CREATE, audit.getAction());
        assertEquals(description, audit.getDescription());
        assertEquals(adminUser, audit.getAdminUser());
    }

    @Test
    @DisplayName("Should create CREATE audit entry using static method")
    void shouldCreateCreateAuditEntryUsingStaticMethod() {
        String description = "New treatment created";
        TreatmentAudit audit = TreatmentAudit.createEntry(treatmentId, adminUser, description);

        assertEquals(treatmentId, audit.getTreatmentId());
        assertEquals(EAuditAction.CREATE, audit.getAction());
        assertEquals(description, audit.getDescription());
        assertEquals(adminUser, audit.getAdminUser());
        assertNotNull(audit.getTimestamp());
    }

    @Test
    @DisplayName("Should create UPDATE audit entry using static method")
    void shouldCreateUpdateAuditEntryUsingStaticMethod() {
        TreatmentAudit audit = TreatmentAudit.updateEntry(treatmentId, "price", "75.00", "80.00", adminUser);

        assertEquals(treatmentId, audit.getTreatmentId());
        assertEquals(EAuditAction.UPDATE, audit.getAction());
        assertEquals("price", audit.getFieldChanged());
        assertEquals("75.00", audit.getOldValue());
        assertEquals("80.00", audit.getNewValue());
        assertEquals(adminUser, audit.getAdminUser());
    }

    @Test
    @DisplayName("Should create DELETE audit entry using static method")
    void shouldCreateDeleteAuditEntryUsingStaticMethod() {
        String description = "Treatment deleted by admin";
        TreatmentAudit audit = TreatmentAudit.deleteEntry(treatmentId, adminUser, description);

        assertEquals(treatmentId, audit.getTreatmentId());
        assertEquals(EAuditAction.DELETE, audit.getAction());
        assertEquals(description, audit.getDescription());
        assertEquals(adminUser, audit.getAdminUser());
    }

    @Test
    @DisplayName("Should create SEED audit entry using static method")
    void shouldCreateSeedAuditEntryUsingStaticMethod() {
        String description = "Database seeded with treatment data";
        TreatmentAudit audit = TreatmentAudit.seedEntry(description, adminUser);

        assertNull(audit.getTreatmentId()); // Seed entries don't have specific treatment ID
        assertEquals(EAuditAction.SEED, audit.getAction());
        assertEquals(description, audit.getDescription());
        assertEquals(adminUser, audit.getAdminUser());
    }

    @Test
    @DisplayName("Should handle all audit action types")
    void shouldHandleAllAuditActionTypes() {
        for (EAuditAction action : EAuditAction.values()) {
            TreatmentAudit audit = new TreatmentAudit(treatmentId, action, adminUser);
            assertEquals(action, audit.getAction());
        }
    }

    @Test
    @DisplayName("Should have proper toString representation")
    void shouldHaveProperToStringRepresentation() {
        String toString = auditEntry.toString();

        assertNotNull(toString);
        assertTrue(toString.contains("TreatmentAudit"));
        assertTrue(toString.contains("treatmentId=" + treatmentId));
        assertTrue(toString.contains("action=" + EAuditAction.UPDATE));
        assertTrue(toString.contains("fieldChanged='price'"));
        assertTrue(toString.contains("description='Price updated by admin'"));
    }

    @Test
    @DisplayName("Should handle null values gracefully")
    void shouldHandleNullValuesGracefully() {
        TreatmentAudit audit = new TreatmentAudit();
        audit.setAction(EAuditAction.CREATE);

        assertNull(audit.getTreatmentId());
        assertEquals(EAuditAction.CREATE, audit.getAction());
        assertNull(audit.getFieldChanged());
        assertNull(audit.getOldValue());
        assertNull(audit.getNewValue());
        assertNull(audit.getAdminUser());
        assertNull(audit.getDescription());
        assertNotNull(audit.getTimestamp()); // Should still be set automatically
    }

    @Test
    @DisplayName("Should handle long text values")
    void shouldHandleLongTextValues() {
        String longOldValue = "A".repeat(1000);
        String longNewValue = "B".repeat(1000);
        String longDescription = "C".repeat(500);

        auditEntry.setOldValue(longOldValue);
        auditEntry.setNewValue(longNewValue);
        auditEntry.setDescription(longDescription);

        assertEquals(longOldValue, auditEntry.getOldValue());
        assertEquals(longNewValue, auditEntry.getNewValue());
        assertEquals(longDescription, auditEntry.getDescription());
    }

    @Test
    @DisplayName("Should maintain timestamp precision")
    void shouldMaintainTimestampPrecision() {
        LocalDateTime specificTime = LocalDateTime.of(2024, 1, 15, 10, 30, 45, 123456789);
        auditEntry.setTimestamp(specificTime);

        assertEquals(specificTime, auditEntry.getTimestamp());
    }
}
package de.jexcellence.lmbeauty.database.entity;

import de.jexcellence.hibernate.entity.AbstractEntity;
import de.jexcellence.lmbeauty.type.EAuditAction;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * TreatmentAudit entity for tracking changes to treatments and refill options.
 * Provides audit trail for administrative actions.
 */
@Entity
@Table(name = "treatment_audit")
@Data
@EqualsAndHashCode(callSuper = true)
public class TreatmentAudit extends AbstractEntity {

    @Column(name = "treatment_id")
    private Long treatmentId;

    @Column(name = "action", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Action is required")
    private EAuditAction action;

    @Column(name = "field_changed", length = 50)
    @Size(max = 50, message = "Field name must not exceed 50 characters")
    private String fieldChanged;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id")
    private User adminUser;

    @Column(name = "timestamp", nullable = false)
    @NotNull(message = "Timestamp is required")
    private LocalDateTime timestamp;

    @Column(name = "description", length = 500)
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    /**
     * Default constructor.
     */
    public TreatmentAudit() {
        super();
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Constructor for creating audit entries.
     */
    public TreatmentAudit(Long treatmentId, EAuditAction action, User adminUser) {
        this();
        this.treatmentId = treatmentId;
        this.action = action;
        this.adminUser = adminUser;
    }

    /**
     * Constructor for field-specific changes.
     */
    public TreatmentAudit(Long treatmentId, EAuditAction action, String fieldChanged, 
                         String oldValue, String newValue, User adminUser) {
        this(treatmentId, action, adminUser);
        this.fieldChanged = fieldChanged;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    /**
     * Constructor with description.
     */
    public TreatmentAudit(Long treatmentId, EAuditAction action, String description, User adminUser) {
        this(treatmentId, action, adminUser);
        this.description = description;
    }

    /**
     * Create audit entry for treatment creation.
     */
    public static TreatmentAudit createEntry(Long treatmentId, User adminUser, String description) {
        return new TreatmentAudit(treatmentId, EAuditAction.CREATE, description, adminUser);
    }

    /**
     * Create audit entry for treatment update.
     */
    public static TreatmentAudit updateEntry(Long treatmentId, String fieldChanged, 
                                           String oldValue, String newValue, User adminUser) {
        return new TreatmentAudit(treatmentId, EAuditAction.UPDATE, fieldChanged, oldValue, newValue, adminUser);
    }

    /**
     * Create audit entry for treatment deletion.
     */
    public static TreatmentAudit deleteEntry(Long treatmentId, User adminUser, String description) {
        return new TreatmentAudit(treatmentId, EAuditAction.DELETE, description, adminUser);
    }

    /**
     * Create audit entry for data seeding.
     */
    public static TreatmentAudit seedEntry(String description, User adminUser) {
        return new TreatmentAudit(null, EAuditAction.SEED, description, adminUser);
    }

    @Override
    public String toString() {
        return "TreatmentAudit{" +
                "id=" + getId() +
                ", treatmentId=" + treatmentId +
                ", action=" + action +
                ", fieldChanged='" + fieldChanged + '\'' +
                ", timestamp=" + timestamp +
                ", description='" + description + '\'' +
                '}';
    }
}
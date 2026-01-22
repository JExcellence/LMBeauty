package de.jexcellence.lmbeauty.type;

/**
 * Audit action types for tracking changes to treatments and related entities.
 */
public enum EAuditAction {
    CREATE("Create"),
    UPDATE("Update"),
    DELETE("Delete"),
    SEED("Data Seed");

    private final String displayName;

    EAuditAction(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
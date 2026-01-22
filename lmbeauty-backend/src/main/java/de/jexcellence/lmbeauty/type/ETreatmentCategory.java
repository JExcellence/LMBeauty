package de.jexcellence.lmbeauty.type;

/**
 * Treatment categories for organizing beauty services.
 */
public enum ETreatmentCategory {
    WIMPERN("Wimpern"),
    AUGENBRAUEN("Augenbrauen"),
    GESICHT("Gesicht"),
    NAEGEL("Nägel"),
    REFILL("Refill"),
    EXTRAS("Extras");

    private final String displayName;

    ETreatmentCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.config.BookingProperties;
import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.TreatmentRefill;
import de.jexcellence.lmbeauty.database.repository.TreatmentRepository;
import de.jexcellence.lmbeauty.database.repository.TreatmentRefillRepository;
import de.jexcellence.lmbeauty.dto.booking.TreatmentRequest;
import de.jexcellence.lmbeauty.dto.booking.TreatmentResponse;
import de.jexcellence.lmbeauty.dto.refill.RefillOptionDto;
import de.jexcellence.lmbeauty.type.ETreatmentCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;
    private final TreatmentRefillRepository treatmentRefillRepository;
    private final BookingProperties bookingProperties;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Transactional(readOnly = true)
    public List<TreatmentResponse> getActiveTreatments() {
        return treatmentRepository.findByActiveTrue().stream()
            .map(TreatmentResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TreatmentResponse> getTreatmentsByCategory(ETreatmentCategory category) {
        return treatmentRepository.findByCategoryOrderBySortOrder(category).stream()
            .map(TreatmentResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TreatmentResponse> getAllTreatments() {
        return treatmentRepository.findAll(0, Integer.MAX_VALUE).stream()
            .map(TreatmentResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public TreatmentResponse getTreatmentById(Long id) {
        Treatment treatment = treatmentRepository.findById(id);
        if (treatment == null) {
            throw new IllegalArgumentException("Treatment not found with ID: " + id);
        }
        return TreatmentResponse.from(treatment);
    }

    @Transactional(readOnly = true)
    public TreatmentResponse getTreatmentBySlug(String slug) {
        return treatmentRepository.findBySlug(slug)
            .map(TreatmentResponse::from)
            .orElseThrow(() -> new IllegalArgumentException("Treatment not found with slug: " + slug));
    }

    /**
     * Find treatments by URL slug for service parameter support.
     */
    @Transactional(readOnly = true)
    public List<TreatmentResponse> getTreatmentsByUrlSlug(String urlSlug) {
        log.debug("Finding treatments by URL slug: {}", urlSlug);
        return treatmentRepository.findByUrlSlugAndActiveTrue(urlSlug).stream()
                .map(TreatmentResponse::from)
                .toList();
    }

    /**
     * Find treatment entity by ID (for internal use).
     */
    @Transactional(readOnly = true)
    public Treatment findById(Long id) {
        Treatment treatment = treatmentRepository.findById(id);
        if (treatment == null) {
            throw new IllegalArgumentException("Treatment not found with ID: " + id);
        }
        return treatment;
    }

    @Transactional
    public TreatmentResponse createTreatment(TreatmentRequest request) {
        validateDuration(request.durationMinutes());

        String slug = request.slug() != null ? request.slug() : generateSlug(request.name());
        
        // Check for existing slug (both in cache and database)
        if (treatmentRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Treatment with slug already exists: " + slug);
        }

        Treatment treatment = new Treatment();
        treatment.setName(request.name());
        treatment.setSlug(slug);
        treatment.setDescription(request.description());
        treatment.setCategory(request.category());
        treatment.setDurationMinutes(request.durationMinutes());
        treatment.setPrice(request.price());
        treatment.setImageUrl(request.imageUrl());
        treatment.setActive(request.active() != null ? request.active() : true);
        treatment.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        treatment.setVersionNumber(1);

        try {
            Treatment saved = treatmentRepository.create(treatment);
            return TreatmentResponse.from(saved);
        } catch (Exception e) {
            // Handle duplicate key constraint violation
            if (e.getMessage() != null && e.getMessage().contains("slug")) {
                throw new IllegalArgumentException("Treatment with slug already exists: " + slug);
            }
            throw e;
        }
    }

    @Transactional
    public TreatmentResponse updateTreatment(Long id, TreatmentRequest request) {
        Treatment treatment = treatmentRepository.findById(id);
        if (treatment == null) {
            throw new IllegalArgumentException("Treatment not found with ID: " + id);
        }

        if (request.durationMinutes() != null) {
            validateDuration(request.durationMinutes());
            treatment.setDurationMinutes(request.durationMinutes());
        }
        if (request.name() != null) treatment.setName(request.name());
        if (request.description() != null) treatment.setDescription(request.description());
        if (request.category() != null) treatment.setCategory(request.category());
        if (request.price() != null) treatment.setPrice(request.price());
        if (request.imageUrl() != null) treatment.setImageUrl(request.imageUrl());
        if (request.active() != null) treatment.setActive(request.active());
        if (request.sortOrder() != null) treatment.setSortOrder(request.sortOrder());

        Treatment updated = treatmentRepository.update(treatment);
        return TreatmentResponse.from(updated);
    }

    /**
     * Creates a new version of a treatment, deactivating the old one.
     * Useful for price changes or significant updates while preserving history.
     */
    @Transactional
    public TreatmentResponse createNewVersion(Long id, TreatmentRequest request) {
        Treatment oldTreatment = treatmentRepository.findById(id);
        if (oldTreatment == null) {
            throw new IllegalArgumentException("Treatment not found with ID: " + id);
        }

        int newVersionNumber = oldTreatment.getVersionNumber() + 1;
        String baseSlug = oldTreatment.getSlug().replaceAll("-v\\d+$", ""); // Remove existing version suffix
        String newSlug = baseSlug + "-v" + newVersionNumber;

        // Deactivate old version
        oldTreatment.setActive(false);
        treatmentRepository.update(oldTreatment);

        // Create new version with unique slug
        Treatment newTreatment = new Treatment();
        newTreatment.setName(request.name() != null ? request.name() : oldTreatment.getName());
        newTreatment.setSlug(newSlug);
        newTreatment.setDescription(request.description() != null ? request.description() : oldTreatment.getDescription());
        newTreatment.setCategory(request.category() != null ? request.category() : oldTreatment.getCategory());
        newTreatment.setDurationMinutes(request.durationMinutes() != null ? request.durationMinutes() : oldTreatment.getDurationMinutes());
        newTreatment.setPrice(request.price() != null ? request.price() : oldTreatment.getPrice());
        newTreatment.setImageUrl(request.imageUrl() != null ? request.imageUrl() : oldTreatment.getImageUrl());
        newTreatment.setActive(true);
        newTreatment.setSortOrder(oldTreatment.getSortOrder());
        newTreatment.setVersionNumber(newVersionNumber);
        newTreatment.setPreviousVersionId(oldTreatment.getId());
        newTreatment.setUrlSlug(oldTreatment.getUrlSlug()); // Preserve URL slug for routing
        newTreatment.setHasRefillOptions(oldTreatment.isHasRefillOptions());

        Treatment saved = treatmentRepository.create(newTreatment);
        return TreatmentResponse.from(saved);
    }

    @Transactional
    public void deleteTreatment(Long id) {
        Treatment treatment = treatmentRepository.findById(id);
        if (treatment == null) {
            throw new IllegalArgumentException("Treatment not found with ID: " + id);
        }
        // Soft delete
        treatment.setActive(false);
        treatmentRepository.update(treatment);
    }

    private void validateDuration(Integer durationMinutes) {
        if (durationMinutes % bookingProperties.getSlotIncrementMinutes() != 0) {
            throw new IllegalArgumentException("Duration must be in " + bookingProperties.getSlotIncrementMinutes() + "-minute increments");
        }
        if (durationMinutes < bookingProperties.getMinTreatmentDuration()) {
            throw new IllegalArgumentException("Duration must be at least " + bookingProperties.getMinTreatmentDuration() + " minutes");
        }
        if (durationMinutes > bookingProperties.getMaxTreatmentDuration()) {
            throw new IllegalArgumentException("Duration must not exceed " + bookingProperties.getMaxTreatmentDuration() + " minutes");
        }
    }

    private String generateSlug(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String slug = WHITESPACE.matcher(normalized).replaceAll("-");
        slug = NONLATIN.matcher(slug).replaceAll("");
        slug = slug.toLowerCase(Locale.GERMAN)
            .replace("ä", "ae")
            .replace("ö", "oe")
            .replace("ü", "ue")
            .replace("ß", "ss");
        return slug.replaceAll("-+", "-").replaceAll("^-|-$", "");
    }

    // ===== REFILL MANAGEMENT METHODS =====

    /**
     * Get all refill options for a treatment.
     */
    @Transactional(readOnly = true)
    public List<RefillOptionDto> getRefillOptions(Long treatmentId) {
        log.debug("Getting refill options for treatment: {}", treatmentId);
        List<TreatmentRefill> refills = treatmentRefillRepository.findByTreatmentIdAndActiveTrue(treatmentId);
        return refills.stream()
                .map(RefillOptionDto::fromEntity)
                .toList();
    }

    /**
     * Add a refill option to a treatment.
     */
    @Transactional
    public RefillOptionDto addRefillOption(Long treatmentId, Integer weekThreshold, BigDecimal price, String description) {
        log.debug("Adding refill option to treatment {}: {} weeks, {} EUR", treatmentId, weekThreshold, price);
        
        Treatment treatment = findById(treatmentId);
        
        // Check if refill option already exists for this week threshold
        Optional<TreatmentRefill> existing = treatmentRefillRepository
                .findByTreatmentIdAndWeekThreshold(treatmentId, weekThreshold);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Refill option already exists for " + weekThreshold + " weeks");
        }

        TreatmentRefill refill = new TreatmentRefill(treatment, weekThreshold, price, description);
        refill = treatmentRefillRepository.save(refill);

        // Update treatment to indicate it has refill options
        if (!treatment.isHasRefillOptions()) {
            treatment.setHasRefillOptions(true);
            treatmentRepository.update(treatment);
        }

        log.debug("Added refill option with ID: {}", refill.getId());
        return RefillOptionDto.fromEntity(refill);
    }

    /**
     * Update a refill option.
     */
    @Transactional
    public RefillOptionDto updateRefillOption(Long refillId, Integer weekThreshold, BigDecimal price, String description) {
        log.debug("Updating refill option: {}", refillId);
        
        TreatmentRefill refill = treatmentRefillRepository.findById(refillId)
                .orElseThrow(() -> new IllegalArgumentException("Refill option not found with ID: " + refillId));

        if (weekThreshold != null) refill.setWeekThreshold(weekThreshold);
        if (price != null) refill.setPrice(price);
        if (description != null) refill.setDescription(description);

        refill = treatmentRefillRepository.save(refill);
        return RefillOptionDto.fromEntity(refill);
    }

    /**
     * Remove a refill option.
     */
    @Transactional
    public void removeRefillOption(Long refillId) {
        log.debug("Removing refill option: {}", refillId);
        
        TreatmentRefill refill = treatmentRefillRepository.findById(refillId)
                .orElseThrow(() -> new IllegalArgumentException("Refill option not found with ID: " + refillId));

        Long treatmentId = refill.getTreatment().getId();
        treatmentRefillRepository.delete(refill);

        // Check if treatment still has refill options
        long remainingRefills = treatmentRefillRepository.countByTreatmentIdAndActiveTrue(treatmentId);
        if (remainingRefills == 0) {
            Treatment treatment = findById(treatmentId);
            treatment.setHasRefillOptions(false);
            treatmentRepository.update(treatment);
        }
    }

    /**
     * Enable/disable refill options for a treatment.
     */
    @Transactional
    public void setRefillOptionsEnabled(Long treatmentId, boolean enabled) {
        log.debug("Setting refill options enabled={} for treatment: {}", enabled, treatmentId);
        
        Treatment treatment = findById(treatmentId);
        treatment.setHasRefillOptions(enabled);
        treatmentRepository.update(treatment);

        if (!enabled) {
            // Deactivate all refill options
            List<TreatmentRefill> refills = treatmentRefillRepository.findByTreatmentId(treatmentId);
            refills.forEach(refill -> {
                refill.setActive(false);
                treatmentRefillRepository.save(refill);
            });
        }
    }

    /**
     * Set URL slug for a treatment (for service parameter support).
     */
    @Transactional
    public void setUrlSlug(Long treatmentId, String urlSlug) {
        log.debug("Setting URL slug '{}' for treatment: {}", urlSlug, treatmentId);
        
        Treatment treatment = findById(treatmentId);
        treatment.setUrlSlug(urlSlug);
        treatmentRepository.update(treatment);
    }

    /**
     * Check if a treatment supports refills.
     */
    @Transactional(readOnly = true)
    public boolean supportsRefills(Long treatmentId) {
        Treatment treatment = findById(treatmentId);
        return treatment.supportsRefills();
    }
}

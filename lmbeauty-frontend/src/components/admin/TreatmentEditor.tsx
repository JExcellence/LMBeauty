'use client';

import { useState, useEffect } from 'react';
import { Text, Icon, Button } from '@once-ui-system/core';
import { adminApi } from '@/lib/adminApi';
import styles from './TreatmentEditor.module.scss';

interface RefillOption {
  id?: number;
  weekThreshold: number;
  price: number;
  active: boolean;
}

interface TreatmentEditorProps {
  treatment?: any;
  onClose: () => void;
  onSave?: () => void;
}

export function TreatmentEditor({ treatment, onClose, onSave }: TreatmentEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'WIMPERN',
    price: '',
    durationMinutes: '',
    active: true,
    imageUrl: '',
    hasRefillOptions: false,
    slug: '',
    urlSlug: ''
  });

  const [refillOptions, setRefillOptions] = useState<RefillOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (treatment) {
      setFormData({
        name: treatment.name || '',
        description: treatment.description || '',
        category: treatment.category || 'WIMPERN',
        price: treatment.price?.toString() || '',
        durationMinutes: treatment.durationMinutes?.toString() || '',
        active: treatment.active ?? true,
        imageUrl: treatment.imageUrl || '',
        hasRefillOptions: treatment.hasRefillOptions || false,
        slug: treatment.slug || '',
        urlSlug: treatment.urlSlug || ''
      });

      // Load refill options if they exist
      if (treatment.hasRefillOptions && treatment.id) {
        loadRefillOptions(treatment.id);
      }
    } else {
      // Reset for new treatment
      setFormData({
        name: '',
        description: '',
        category: 'WIMPERN',
        price: '',
        durationMinutes: '',
        active: true,
        imageUrl: '',
        hasRefillOptions: false,
        slug: '',
        urlSlug: ''
      });
      setRefillOptions([]);
    }
  }, [treatment]);

  const loadRefillOptions = async (treatmentId: number) => {
    try {
      const options = await adminApi.getRefillOptions(treatmentId);
      setRefillOptions(options.map(option => ({
        id: option.id,
        weekThreshold: option.weekThreshold,
        price: option.price,
        active: option.active
      })));
    } catch (error) {
      console.error('Error loading refill options:', error);
      // Set default refill options for Wimpern services if API fails
      if (formData.category === 'WIMPERN') {
        setRefillOptions([
          { weekThreshold: 3, price: 45, active: true },
          { weekThreshold: 4, price: 55, active: true },
          { weekThreshold: 5, price: 65, active: true }
        ]);
      }
    }
  };

  const categories = [
    { value: 'WIMPERN', label: 'Wimpern' },
    { value: 'AUGENBRAUEN', label: 'Augenbrauen' },
    { value: 'GESICHT', label: 'Gesicht' },
    { value: 'NAEGEL', label: 'Nägel' },
    { value: 'EXTRAS', label: 'Extras' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && value) {
      const slug = value.toLowerCase()
        .replace(/[äöüß]/g, (match: string) => {
          const map: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
          return map[match] || match;
        })
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug, urlSlug: slug }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle refill options toggle
    if (field === 'hasRefillOptions' && value && formData.category === 'WIMPERN' && refillOptions.length === 0) {
      setRefillOptions([
        { weekThreshold: 3, price: 45, active: true },
        { weekThreshold: 4, price: 55, active: true },
        { weekThreshold: 5, price: 65, active: true }
      ]);
    }
  };

  const handleRefillChange = (index: number, field: keyof RefillOption, value: any) => {
    setRefillOptions(prev => prev.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    ));
  };

  const addRefillOption = () => {
    setRefillOptions(prev => [...prev, { weekThreshold: 6, price: 75, active: true }]);
  };

  const removeRefillOption = (index: number) => {
    setRefillOptions(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Beschreibung ist erforderlich';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Gültiger Preis ist erforderlich';
    }

    if (!formData.durationMinutes || parseInt(formData.durationMinutes) <= 0) {
      newErrors.durationMinutes = 'Gültige Dauer ist erforderlich';
    }

    // Validate refill options
    if (formData.hasRefillOptions && refillOptions.length > 0) {
      refillOptions.forEach((option, index) => {
        if (option.weekThreshold <= 0) {
          newErrors[`refill_${index}_weeks`] = 'Wochen müssen größer als 0 sein';
        }
        if (option.price <= 0) {
          newErrors[`refill_${index}_price`] = 'Preis muss größer als 0 sein';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSaveSuccess(false);
    
    try {
      const treatmentData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes),
        active: formData.active,
        imageUrl: formData.imageUrl || null,
        hasRefillOptions: formData.hasRefillOptions,
        slug: formData.slug,
        urlSlug: formData.urlSlug
      };

      console.log('Saving treatment data:', treatmentData);

      let savedTreatment;
      if (treatment?.id) {
        // Update existing treatment
        console.log('Updating treatment with ID:', treatment.id);
        savedTreatment = await adminApi.updateTreatment(treatment.id, treatmentData);
      } else {
        // Create new treatment
        console.log('Creating new treatment');
        savedTreatment = await adminApi.createTreatment(treatmentData);
      }

      console.log('Treatment saved successfully:', savedTreatment);

      // Only try additional operations if the main save succeeded
      if (savedTreatment?.id) {
        // Set URL slug if provided (non-critical)
        if (formData.urlSlug) {
          try {
            console.log('Setting URL slug:', formData.urlSlug);
            await adminApi.setTreatmentUrlSlug(savedTreatment.id, formData.urlSlug);
            console.log('URL slug set successfully');
          } catch (slugError: any) {
            console.warn('URL slug could not be set (non-critical):', slugError.message);
          }
        }

        // Enable/disable refill options (non-critical)
        try {
          console.log('Setting refill options enabled:', formData.hasRefillOptions);
          await adminApi.setRefillOptionsEnabled(savedTreatment.id, formData.hasRefillOptions);
          console.log('Refill options setting updated successfully');
        } catch (refillToggleError: any) {
          console.warn('Refill options setting could not be updated (non-critical):', refillToggleError.message);
        }

        // Log refill options for future implementation
        if (formData.hasRefillOptions && refillOptions.length > 0) {
          console.log('Refill options to save (not implemented yet):', refillOptions);
        }
      }

      setSaveSuccess(true);
      
      // Call onSave callback to refresh the list
      if (onSave) {
        onSave();
      }
      
      // Close after a brief success message
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error saving treatment:', error);
      
      // More specific error handling
      let errorMessage = 'Fehler beim Speichern';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!treatment;
  const canHaveRefills = formData.category === 'WIMPERN';

  return (
    <div className={styles.treatmentEditor}>
      <div className={styles.editorContainer}>
        <header className={styles.editorHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <Text className={styles.editorTitle}>
                {isEditing ? 'Service bearbeiten' : 'Neuer Service'}
              </Text>
              <Text className={styles.editorSubtitle}>
                {isEditing ? 'Perfektioniere deine Behandlung' : 'Erschaffe etwas Wunderschönes'}
              </Text>
            </div>
            
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Editor schließen"
            >
              <Icon name="close" size="s" />
            </button>
          </div>
        </header>

        <div className={styles.editorContent}>
          {saveSuccess && (
            <div className={styles.successMessage}>
              <Icon name="check" size="s" />
              <Text>Service erfolgreich gespeichert!</Text>
            </div>
          )}

          {errors.general && (
            <div className={styles.errorMessage}>
              <Icon name="alert" size="s" />
              <Text>{errors.general}</Text>
            </div>
          )}

          <div className={styles.formGrid}>
            {/* Basic Information */}
            <section className={styles.formSection}>
              <Text className={styles.sectionTitle}>Grundinformationen</Text>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Text className={styles.labelText}>Service Name</Text>
                  <input
                    type="text"
                    className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="z.B. Wimpernverlängerung 1:1 Technik"
                  />
                  {errors.name && (
                    <Text className={styles.errorText}>{errors.name}</Text>
                  )}
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Text className={styles.labelText}>Beschreibung</Text>
                  <textarea
                    className={`${styles.formTextarea} ${errors.description ? styles.inputError : ''}`}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Beschreibe deine Behandlung mit liebevollen Details..."
                    rows={4}
                  />
                  {errors.description && (
                    <Text className={styles.errorText}>{errors.description}</Text>
                  )}
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Text className={styles.labelText}>Kategorie</Text>
                  <select
                    className={styles.formSelect}
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            {/* Pricing & Duration */}
            <section className={styles.formSection}>
              <Text className={styles.sectionTitle}>Preis & Dauer</Text>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Text className={styles.labelText}>Preis (€)</Text>
                    <input
                      type="number"
                      className={`${styles.formInput} ${errors.price ? styles.inputError : ''}`}
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {errors.price && (
                      <Text className={styles.errorText}>{errors.price}</Text>
                    )}
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Text className={styles.labelText}>Dauer (Min)</Text>
                    <input
                      type="number"
                      className={`${styles.formInput} ${errors.durationMinutes ? styles.inputError : ''}`}
                      value={formData.durationMinutes}
                      onChange={(e) => handleInputChange('durationMinutes', e.target.value)}
                      placeholder="60"
                      min="1"
                    />
                    {errors.durationMinutes && (
                      <Text className={styles.errorText}>{errors.durationMinutes}</Text>
                    )}
                  </label>
                </div>
              </div>
            </section>

            {/* Refill Options - Only for Wimpern */}
            {canHaveRefills && (
              <section className={styles.formSection}>
                <Text className={styles.sectionTitle}>Refill Optionen</Text>
                
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={formData.hasRefillOptions}
                      onChange={(e) => handleInputChange('hasRefillOptions', e.target.checked)}
                    />
                    <div className={styles.checkboxCustom}>
                      {formData.hasRefillOptions && <Icon name="check" size="xs" />}
                    </div>
                    <Text className={styles.checkboxText}>Refill-Optionen aktivieren</Text>
                  </label>
                </div>

                {formData.hasRefillOptions && (
                  <div className={styles.refillOptionsContainer}>
                    <Text className={styles.refillTitle}>Refill Preise nach Wochen</Text>
                    
                    {refillOptions.map((option, index) => (
                      <div key={index} className={styles.refillOption}>
                        <div className={styles.refillInputs}>
                          <div className={styles.refillInput}>
                            <Text className={styles.refillLabel}>Wochen</Text>
                            <input
                              type="number"
                              className={`${styles.formInput} ${styles.refillInputField}`}
                              value={option.weekThreshold}
                              onChange={(e) => handleRefillChange(index, 'weekThreshold', parseInt(e.target.value))}
                              min="1"
                            />
                          </div>
                          <div className={styles.refillInput}>
                            <Text className={styles.refillLabel}>Preis (€)</Text>
                            <input
                              type="number"
                              className={`${styles.formInput} ${styles.refillInputField}`}
                              value={option.price}
                              onChange={(e) => handleRefillChange(index, 'price', parseFloat(e.target.value))}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className={styles.refillInput}>
                            <label className={styles.refillActiveLabel}>
                              <input
                                type="checkbox"
                                checked={option.active}
                                onChange={(e) => handleRefillChange(index, 'active', e.target.checked)}
                              />
                              <Text className={styles.refillActiveText}>Aktiv</Text>
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.removeRefillButton}
                          onClick={() => removeRefillOption(index)}
                          aria-label="Refill Option entfernen"
                        >
                          <Icon name="trash" size="xs" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className={styles.addRefillButton}
                      onClick={addRefillOption}
                    >
                      <Icon name="plus" size="xs" />
                      Weitere Refill Option
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Additional Options */}
            <section className={styles.formSection}>
              <Text className={styles.sectionTitle}>Zusätzliche Optionen</Text>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Text className={styles.labelText}>Bild URL (optional)</Text>
                  <input
                    type="url"
                    className={styles.formInput}
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Text className={styles.labelText}>URL Slug (automatisch generiert)</Text>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.urlSlug}
                    onChange={(e) => handleInputChange('urlSlug', e.target.value)}
                    placeholder="wimpernverlaengerung-1-1-technik"
                  />
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                  />
                  <div className={styles.checkboxCustom}>
                    {formData.active && <Icon name="check" size="xs" />}
                  </div>
                  <Text className={styles.checkboxText}>Service ist aktiv</Text>
                </label>
              </div>
            </section>
          </div>
        </div>

        <footer className={styles.editorFooter}>
          <div className={styles.footerActions}>
            <Button
              variant="secondary"
              size="m"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            
            <Button
              variant="primary"
              size="m"
              onClick={handleSave}
              disabled={isLoading}
              className={styles.saveButton}
            >
              {isLoading ? (
                <>
                  <Icon name="loading" size="xs" />
                  Speichern...
                </>
              ) : (
                <>
                  <Icon name="check" size="xs" />
                  {isEditing ? 'Änderungen speichern' : 'Service erstellen'}
                </>
              )}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default TreatmentEditor;
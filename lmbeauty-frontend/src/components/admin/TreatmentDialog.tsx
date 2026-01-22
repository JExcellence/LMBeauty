'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  Column,
  Row,
  Text,
  Input,
  Textarea,
  NumberInput,
  Button,
  Switch,
  DropdownWrapper,
  Option,
  Icon,
  Flex
} from '@once-ui-system/core';

interface Treatment {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  durationMinutes: number;
  price: number;
  imageUrl: string | null;
  active: boolean;
  sortOrder: number;
  versionNumber: number;
}

interface TreatmentFormData {
  name: string;
  slug: string;
  description: string;
  category: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
  active: boolean;
  sortOrder: number;
}

interface CategoryConfig {
  value: string;
  label: string;
  iconName: string;
  gradient: string;
}

interface TreatmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingTreatment: Treatment | null;
  formData: TreatmentFormData;
  onChange: (data: TreatmentFormData) => void;
  onSave: () => void;
  isSaving: boolean;
  categories: CategoryConfig[];
}

export function TreatmentDialog({
  isOpen,
  onClose,
  editingTreatment,
  formData,
  onChange,
  onSave,
  isSaving,
  categories
}: TreatmentDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate slug from name
  useEffect(() => {
    if (formData.name && !editingTreatment) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[äöüß]/g, (match) => {
          const replacements: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
          return replacements[match] || match;
        })
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      if (slug !== formData.slug) {
        onChange({ ...formData, slug });
      }
    }
  }, [formData.name, formData.slug, editingTreatment, onChange]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'URL-Slug ist erforderlich';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'URL-Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Beschreibung ist erforderlich';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preis muss größer als 0 sein';
    }

    if (formData.durationMinutes <= 0) {
      newErrors.durationMinutes = 'Dauer muss größer als 0 sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  const handleInputChange = (field: keyof TreatmentFormData, value: any) => {
    onChange({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingTreatment ? 'Behandlung bearbeiten' : 'Neue Behandlung'}
    >
      <Column gap="24" padding="24">
        <Row gap="12" vertical="center">
          <Flex
            width="40"
            height="40"
            center
            radius="m"
            background="brand-alpha-medium"
          >
            <Icon name="heart" size="s" onBackground="brand-strong" />
          </Flex>
          <Column gap="4">
            <Text variant="heading-strong-l" onBackground="neutral-strong">
              {editingTreatment ? 'Behandlung bearbeiten' : 'Neue Behandlung'}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-medium">
              {editingTreatment ? 'Bearbeite die Behandlungsdetails' : 'Erstelle eine neue Behandlung'}
            </Text>
          </Column>
        </Row>

        <Column gap="16">
          <Row gap="16" fillWidth>
            <Column flex={2} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">Name *</Text>
              <Input
                id="name"
                placeholder="z.B. Hybrid Technik"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && (
                <Text variant="body-default-xs" onBackground="danger-strong">{errors.name}</Text>
              )}
            </Column>
            <Column flex={1} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">URL-Slug *</Text>
              <Input
                id="slug"
                placeholder="hybrid-technik"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase())}
              />
              {errors.slug && (
                <Text variant="body-default-xs" onBackground="danger-strong">{errors.slug}</Text>
              )}
            </Column>
          </Row>

          <Column gap="8">
            <Text variant="label-default-s" onBackground="neutral-strong">Beschreibung *</Text>
            <Textarea
              id="description"
              placeholder="Beschreibe die Behandlung..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
            {errors.description && (
              <Text variant="body-default-xs" onBackground="danger-strong">{errors.description}</Text>
            )}
          </Column>

          <Row gap="16" fillWidth>
            <Column flex={1} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">Kategorie</Text>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </Column>
            <Column flex={1} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">Bild-URL</Text>
              <Input
                id="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              />
            </Column>
          </Row>

          <Row gap="16" fillWidth>
            <Column flex={1} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">Preis (€) *</Text>
              <NumberInput
                id="price"
                value={formData.price}
                onChange={(value) => handleInputChange('price', value)}
                min={0}
                step={0.01}
              />
              {errors.price && (
                <Text variant="body-default-xs" onBackground="danger-strong">{errors.price}</Text>
              )}
            </Column>
            <Column flex={1} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">Dauer (Min.) *</Text>
              <NumberInput
                id="durationMinutes"
                value={formData.durationMinutes}
                onChange={(value) => handleInputChange('durationMinutes', value)}
                min={1}
                step={5}
              />
              {errors.durationMinutes && (
                <Text variant="body-default-xs" onBackground="danger-strong">{errors.durationMinutes}</Text>
              )}
            </Column>
          </Row>

          <Row gap="16" fillWidth>
            <Column flex={1} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">Sortierung</Text>
              <NumberInput
                id="sortOrder"
                value={formData.sortOrder}
                onChange={(value) => handleInputChange('sortOrder', value)}
                min={0}
                step={1}
              />
            </Column>
            <Column flex={1} gap="8">
              <Text variant="label-default-s" onBackground="neutral-strong">Status</Text>
              <Row gap="8" vertical="center" paddingTop="8">
                <Switch
                  isChecked={formData.active}
                  onToggle={() => handleInputChange('active', !formData.active)}
                />
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {formData.active ? 'Aktiv' : 'Inaktiv'}
                </Text>
              </Row>
            </Column>
          </Row>
        </Column>

        <Row gap="12" horizontal="end" fillWidth>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            prefixIcon={isSaving ? undefined : "check"}
          >
            {isSaving ? 'Speichern...' : 'Speichern'}
          </Button>
        </Row>
      </Column>
    </Dialog>
  );
}
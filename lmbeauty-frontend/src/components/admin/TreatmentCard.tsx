'use client';

import {
  Column,
  Row,
  Flex,
  Text,
  Icon,
  IconButton,
  Button,
  Tag,
  Switch
} from '@once-ui-system/core';
import styles from './TreatmentCard.module.scss';

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

interface CategoryConfig {
  value: string;
  label: string;
  iconName: string;
  gradient: string;
}

interface TreatmentCardProps {
  treatment: Treatment;
  categoryConfig: CategoryConfig;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

export function TreatmentCard({
  treatment,
  categoryConfig,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleActive
}: TreatmentCardProps) {
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} Min.`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} Std.`;
    }
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')} Std.`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <Column
      fillWidth
      gap="16"
      padding="20"
      background="surface"
      radius="xl"
      border="neutral-alpha-weak"
      className={`${styles.card} ${!treatment.active ? styles.inactive : ''}`}
    >
      {/* Header */}
      <Row fillWidth horizontal="between" vertical="start" gap="12">
        <Row gap="12" vertical="center" flex={1}>
          <Flex
            width="40"
            height="40"
            center
            radius="m"
            style={{ background: categoryConfig.gradient }}
          >
            <Icon name={categoryConfig.iconName as any} size="s" style={{ color: 'white' }} />
          </Flex>
          <Column gap="2" flex={1}>
            <Row gap="8" vertical="center">
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                {treatment.name}
              </Text>
              {!treatment.active && (
                <Tag variant="neutral" size="s">Inaktiv</Tag>
              )}
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-medium">
              {treatment.slug}
            </Text>
          </Column>
        </Row>
        <Row gap="4">
          <IconButton
            icon={isExpanded ? "chevronUp" : "chevronDown"}
            size="s"
            variant="ghost"
            onClick={onToggleExpand}
            tooltip={isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
          />
        </Row>
      </Row>

      {/* Price and Duration */}
      <Row gap="16" fillWidth>
        <Flex
          flex={1}
          padding="12"
          gap="8"
          vertical="center"
          radius="m"
          background="brand-alpha-weak"
        >
          <Icon name="euro" size="xs" onBackground="brand-medium" />
          <Text variant="heading-strong-s" onBackground="brand-strong">
            {formatPrice(treatment.price)}
          </Text>
        </Flex>
        <Flex
          flex={1}
          padding="12"
          gap="8"
          vertical="center"
          radius="m"
          background="neutral-alpha-weak"
        >
          <Icon name="clock" size="xs" onBackground="neutral-medium" />
          <Text variant="body-default-s" onBackground="neutral-strong">
            {formatDuration(treatment.durationMinutes)}
          </Text>
        </Flex>
      </Row>

      {/* Expanded Content */}
      {isExpanded && (
        <Column gap="16" fillWidth>
          <Column gap="8">
            <Text variant="label-default-xs" onBackground="neutral-medium">BESCHREIBUNG</Text>
            <Text variant="body-default-s" onBackground="neutral-strong">
              {treatment.description || 'Keine Beschreibung verfügbar'}
            </Text>
          </Column>

          <Row gap="16" fillWidth>
            <Column gap="4" flex={1}>
              <Text variant="label-default-xs" onBackground="neutral-medium">KATEGORIE</Text>
              <Row gap="s" vertical="center">
                <Icon name={categoryConfig.iconName as any} size="xs" onBackground="neutral-medium" />
                <Text variant="body-default-s" onBackground="neutral-strong">
                  {categoryConfig.label}
                </Text>
              </Row>
            </Column>
            <Column gap="4" flex={1}>
              <Text variant="label-default-xs" onBackground="neutral-medium">SORTIERUNG</Text>
              <Text variant="body-default-s" onBackground="neutral-strong">
                {treatment.sortOrder}
              </Text>
            </Column>
          </Row>

          {treatment.imageUrl && (
            <Column gap="8">
              <Text variant="label-default-xs" onBackground="neutral-medium">BILD</Text>
              <Flex
                fillWidth
                radius="m"
                background="neutral-alpha-weak"
                style={{
                  height: '120px',
                  backgroundImage: `url(${treatment.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </Column>
          )}

          {/* Actions */}
          <Row gap="8" fillWidth horizontal="between" vertical="center">
            <Row gap="8" vertical="center">
              <Switch
                isChecked={treatment.active}
                onToggle={onToggleActive}
              />
              <Text variant="body-default-xs" onBackground="neutral-medium">
                {treatment.active ? 'Aktiv' : 'Inaktiv'}
              </Text>
            </Row>
            <Row gap="8">
              <Button
                variant="secondary"
                size="s"
                prefixIcon="edit"
                onClick={onEdit}
              >
                Bearbeiten
              </Button>
              <IconButton
                icon="trash"
                size="s"
                variant="danger"
                onClick={onDelete}
                tooltip="Löschen"
              />
            </Row>
          </Row>
        </Column>
      )}
    </Column>
  );
}
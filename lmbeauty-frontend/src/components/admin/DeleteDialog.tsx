'use client';

import {
  Dialog,
  Column,
  Row,
  Text,
  Button,
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

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  treatment: Treatment | null;
  onDelete: () => void;
  isSaving: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  treatment,
  onDelete,
  isSaving
}: DeleteDialogProps) {
  if (!treatment) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Löschen bestätigen"
    >
      <Column gap="24" padding="24">
        <Row gap="12" vertical="center">
          <Flex
            width="40"
            height="40"
            center
            radius="m"
            background="danger-alpha-medium"
          >
            <Icon name="trash" size="s" onBackground="danger-strong" />
          </Flex>
          <Column gap="4">
            <Text variant="heading-strong-l" onBackground="neutral-strong">
              Behandlung löschen
            </Text>
            <Text variant="body-default-s" onBackground="neutral-medium">
              Diese Aktion kann nicht rückgängig gemacht werden
            </Text>
          </Column>
        </Row>

        <Column gap="16" padding="16" background="danger-alpha-weak" radius="m">
          <Text variant="body-default-s" onBackground="danger-strong">
            Möchtest du die folgende Behandlung wirklich löschen?
          </Text>
          
          <Column gap="8">
            <Row gap="8" vertical="center">
              <Text variant="label-default-s" onBackground="neutral-strong">Name:</Text>
              <Text variant="body-default-s" onBackground="neutral-strong">{treatment.name}</Text>
            </Row>
            <Row gap="8" vertical="center">
              <Text variant="label-default-s" onBackground="neutral-strong">Preis:</Text>
              <Text variant="body-default-s" onBackground="neutral-strong">{formatPrice(treatment.price)}</Text>
            </Row>
            <Row gap="8" vertical="center">
              <Text variant="label-default-s" onBackground="neutral-strong">Kategorie:</Text>
              <Text variant="body-default-s" onBackground="neutral-strong">{treatment.category}</Text>
            </Row>
          </Column>
        </Column>

        <Column gap="8">
          <Text variant="body-default-s" onBackground="neutral-medium">
            <strong>Warnung:</strong> Alle zukünftigen Termine mit dieser Behandlung werden ebenfalls betroffen sein.
          </Text>
          <Text variant="body-default-s" onBackground="neutral-medium">
            Vergangene Termine bleiben unverändert.
          </Text>
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
            variant="danger"
            onClick={onDelete}
            disabled={isSaving}
            prefixIcon={isSaving ? undefined : "trash"}
          >
            {isSaving ? 'Löschen...' : 'Endgültig löschen'}
          </Button>
        </Row>
      </Column>
    </Dialog>
  );
}
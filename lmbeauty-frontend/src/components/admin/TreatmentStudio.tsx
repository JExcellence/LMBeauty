'use client';

import { useState, useEffect } from 'react';
import { Text, Icon, Button } from '@once-ui-system/core';
import { useTreatments } from '@/hooks/useAdmin';
import { TreatmentEditor } from './TreatmentEditor';
import styles from './TreatmentStudio.module.scss';

type StudioView = 'overview' | 'editor' | 'analytics';

interface SegmentedControlProps {
  options: { value: StudioView; label: string; icon: string }[];
  value: StudioView;
  onChange: (value: StudioView) => void;
}

function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className={styles.segmentedControl}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.segment} ${value === option.value ? styles.segmentActive : ''}`}
          onClick={() => onChange(option.value)}
          type="button"
        >
          <Icon name={option.icon as any} size="xs" />
          <span className={styles.segmentLabel}>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

interface TreatmentCardProps {
  treatment: any;
  onEdit: (treatment: any) => void;
  onDelete: (treatment: any) => void;
}

function TreatmentCard({ treatment, onEdit, onDelete }: TreatmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Möchtest du "${treatment.name}" wirklich löschen?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(treatment);
    } catch (error) {
      console.error('Error deleting treatment:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  const categoryNames = {
    'WIMPERN': 'Wimpern',
    'AUGENBRAUEN': 'Augenbrauen', 
    'GESICHT': 'Gesicht',
    'NAEGEL': 'Nägel',
    'EXTRAS': 'Extras'
  };

  const categoryName = (categoryNames as any)[treatment.category] || treatment.category;

  return (
    <article className={styles.treatmentCard}>
      <div className={styles.cardHeader}>
        <div className={styles.categoryBadge}>
          <Text className={styles.categoryText}>{categoryName}</Text>
        </div>
        <div className={styles.cardActions}>
          <button 
            className={styles.editButton}
            onClick={() => onEdit(treatment)}
            aria-label={`${treatment.name} bearbeiten`}
          >
            <Icon name="edit" size="xs" />
          </button>
          <button 
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`${treatment.name} löschen`}
          >
            <Icon name={isDeleting ? "loading" : "trash"} size="xs" />
          </button>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <Text className={styles.treatmentTitle}>{treatment.name}</Text>
        <Text className={styles.treatmentDescription}>
          {treatment.description}
        </Text>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.treatmentMeta}>
          <div className={styles.metaItem}>
            <Icon name="clock" size="xs" />
            <Text className={styles.metaText}>{treatment.durationMinutes} Min</Text>
          </div>
          <div className={styles.metaItem}>
            <Icon name="euro" size="xs" />
            <Text className={styles.metaText}>{treatment.price}€</Text>
          </div>
        </div>
        
        <div className={styles.treatmentStatus}>
          <div className={`${styles.statusDot} ${treatment.active ? styles.statusActive : styles.statusInactive}`} />
          <Text className={styles.statusText}>
            {treatment.active ? 'Aktiv' : 'Inaktiv'}
          </Text>
        </div>
      </div>
    </article>
  );
}

interface CategorySectionProps {
  category: string;
  treatments: any[];
  onEditTreatment: (treatment: any) => void;
  onDeleteTreatment: (treatment: any) => void;
}

function CategorySection({ category, treatments, onEditTreatment, onDeleteTreatment }: CategorySectionProps) {
  const categoryNames = {
    'WIMPERN': 'Wimpern',
    'AUGENBRAUEN': 'Augenbrauen', 
    'GESICHT': 'Gesicht',
    'NAEGEL': 'Nägel',
    'EXTRAS': 'Extras'
  };

  const categoryName = (categoryNames as any)[category] || category;

  if (treatments.length === 0) return null;

  return (
    <section className={styles.categorySection}>
      <header className={styles.categoryHeader}>
        <div className={styles.categoryTitleGroup}>
          <Text className={styles.categoryTitle}>{categoryName}</Text>
          <div className={styles.categoryCount}>
            <Text className={styles.countText}>
              {treatments.length} {treatments.length === 1 ? 'Service' : 'Services'}
            </Text>
          </div>
        </div>
      </header>
      
      <div className={styles.treatmentGrid}>
        {treatments.map((treatment) => (
          <TreatmentCard 
            key={treatment.id} 
            treatment={treatment} 
            onEdit={onEditTreatment}
            onDelete={onDeleteTreatment}
          />
        ))}
      </div>
    </section>
  );
}

function OverviewView({ treatments, onEditTreatment, onDeleteTreatment, onCreateNew }: { 
  treatments: any[]; 
  onEditTreatment: (treatment: any) => void; 
  onDeleteTreatment: (treatment: any) => void; 
  onCreateNew: () => void;
}) {
  const groupedTreatments = treatments?.reduce((groups: any, treatment: any) => {
    const category = treatment.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(treatment);
    return groups;
  }, {}) || {};

  const totalTreatments = treatments?.length || 0;
  const activeTreatments = treatments?.filter(t => t.active)?.length || 0;

  return (
    <div className={styles.overviewView}>
      <div className={styles.studioStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon name="heart" size="s" />
          </div>
          <div className={styles.statContent}>
            <Text className={styles.statNumber}>{totalTreatments}</Text>
            <Text className={styles.statLabel}>Gesamt Services</Text>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon name="check" size="s" />
          </div>
          <div className={styles.statContent}>
            <Text className={styles.statNumber}>{activeTreatments}</Text>
            <Text className={styles.statLabel}>Aktive Services</Text>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon name="grid" size="s" />
          </div>
          <div className={styles.statContent}>
            <Text className={styles.statNumber}>{Object.keys(groupedTreatments).length}</Text>
            <Text className={styles.statLabel}>Kategorien</Text>
          </div>
        </div>
      </div>

      {Object.keys(groupedTreatments).length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Icon name="plus" size="l" />
          </div>
          <Text className={styles.emptyTitle}>Dein Beauty-Studio wartet auf dich</Text>
          <Text className={styles.emptyDescription}>
            Erstelle deine ersten Services und bringe deine Vision zum Leben
          </Text>
          <Button 
            variant="primary" 
            size="m"
            className={styles.createButton}
            onClick={onCreateNew}
          >
            <Icon name="plus" size="xs" />
            Ersten Service erstellen
          </Button>
        </div>
      ) : (
        <div className={styles.categoriesContainer}>
          {Object.entries(groupedTreatments).map(([category, categoryTreatments]) => (
            <CategorySection 
              key={category} 
              category={category} 
              treatments={categoryTreatments as any[]}
              onEditTreatment={onEditTreatment}
              onDeleteTreatment={onDeleteTreatment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className={styles.analyticsView}>
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>
          <Icon name="chart" size="l" />
        </div>
        <Text className={styles.comingSoonTitle}>Analytics kommen bald</Text>
        <Text className={styles.comingSoonDescription}>
          Hier wirst du bald detaillierte Einblicke in deine Services erhalten
        </Text>
      </div>
    </div>
  );
}

export function TreatmentStudio() {
  const { treatments, isLoading, refresh, deleteTreatment } = useTreatments();
  const [currentView, setCurrentView] = useState<StudioView>('overview');
  const [editingTreatment, setEditingTreatment] = useState<any>(null);

  const studioViews = [
    { value: 'overview' as StudioView, label: 'Übersicht', icon: 'grid' },
    { value: 'editor' as StudioView, label: 'Editor', icon: 'edit' },
    { value: 'analytics' as StudioView, label: 'Analytics', icon: 'chart' }
  ];

  const handleEditTreatment = (treatment: any) => {
    setEditingTreatment(treatment);
    setCurrentView('editor');
  };

  const handleDeleteTreatment = async (treatment: any) => {
    await deleteTreatment(treatment.id);
    refresh();
  };

  const handleCreateNew = () => {
    setEditingTreatment(null);
    setCurrentView('editor');
  };

  const handleCloseEditor = () => {
    setEditingTreatment(null);
    setCurrentView('overview');
  };

  const handleSaveTreatment = () => {
    // Refresh the treatments list
    refresh();
  };

  if (isLoading) {
    return (
      <div className={styles.studioLoading}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>
            <Icon name="heart" size="m" />
          </div>
          <Text className={styles.loadingText}>
            Dein Beauty-Studio wird geladen...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.treatmentStudio}>
      <header className={styles.studioHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Text className={styles.studioTitle}>Beauty Studio</Text>
            <Text className={styles.studioSubtitle}>
              Kuratiere deine Services mit Liebe zum Detail
            </Text>
          </div>
          
          <div className={styles.headerActions}>
            <Button 
              variant="secondary" 
              size="m"
              className={styles.actionButton}
              onClick={handleCreateNew}
            >
              <Icon name="plus" size="xs" />
              Neuer Service
            </Button>
          </div>
        </div>
        
        <div className={styles.navigationSection}>
          <SegmentedControl 
            options={studioViews}
            value={currentView}
            onChange={setCurrentView}
          />
        </div>
      </header>

      <main className={styles.studioMain}>
        {currentView === 'overview' && (
          <OverviewView 
            treatments={treatments || []} 
            onEditTreatment={handleEditTreatment}
            onDeleteTreatment={handleDeleteTreatment}
            onCreateNew={handleCreateNew}
          />
        )}
        
        {currentView === 'editor' && (
          <TreatmentEditor 
            treatment={editingTreatment}
            onClose={handleCloseEditor}
            onSave={handleSaveTreatment}
          />
        )}
        
        {currentView === 'analytics' && <AnalyticsView />}
      </main>
    </div>
  );
}

export default TreatmentStudio;
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Text, Icon, Button, Spinner, Switch } from '@once-ui-system/core';
import { useAvailability } from '@/hooks/useAdmin';
import { adminApi } from '@/lib/adminApi';
import { TimePicker } from '@/components/ui';
import styles from './AvailabilityManager.module.scss';

type ViewMode = "calendar" | "weekly";
type PlanningRange = "1month" | "3months";

interface DayData {
  date: Date;
  dayOfWeek: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isBlocked: boolean;
  hasAvailability: boolean;
  slots: { startTime: string; endTime: string }[];
}

const DAYS_OF_WEEK = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAYS_MAP: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
};

const GERMAN_DAYS: Record<string, string> = {
  'MONDAY': 'Montag',
  'TUESDAY': 'Dienstag',
  'WEDNESDAY': 'Mittwoch',
  'THURSDAY': 'Donnerstag',
  'FRIDAY': 'Freitag',
  'SATURDAY': 'Samstag',
  'SUNDAY': 'Sonntag'
};

const PLANNING_RANGES: { key: PlanningRange; label: string; months: number }[] = [
  { key: '1month', label: '1 Monat', months: 1 },
  { key: '3months', label: '3 Monate', months: 3 }
];

function TimeRhythm({ day, slots, onEdit }: { 
  day: string; 
  slots: any[]; 
  onEdit: () => void; 
}) {
  const dayName = GERMAN_DAYS[day] || day;
  const isOpen = slots.length > 0;

  return (
    <div className={styles.timeRhythm}>
      <div className={styles.dayPresence}>
        <Text className={styles.dayName}>{dayName}</Text>
        {!isOpen && (
          <Text className={styles.closedState}>Geschlossen</Text>
        )}
      </div>

      <div className={styles.timeFlow}>
        {isOpen ? (
          <div className={styles.timeSlots}>
            {slots.map((slot, index) => (
              <Text key={index} className={styles.timeSlot}>
                {slot.startTime} – {slot.endTime}
              </Text>
            ))}
          </div>
        ) : (
          <div className={styles.emptyTime}>
            <Text className={styles.emptyText}>Keine Zeiten definiert</Text>
          </div>
        )}
      </div>

      <div className={styles.gentleActions}>
        <Button
          variant="tertiary"
          size="s"
          onClick={onEdit}
          className={styles.editButton}
        >
          <Icon name="edit" size="xs" />
        </Button>
      </div>
    </div>
  );
}

function TimeEditor({ 
  day, 
  slots, 
  onSave, 
  onCancel 
}: { 
  day: string; 
  slots: any[]; 
  onSave: (slots: any[]) => void; 
  onCancel: () => void; 
}) {
  const [editingSlots, setEditingSlots] = useState(
    slots.length > 0 ? slots : [{ startTime: '09:00', endTime: '17:00' }]
  );

  const addTimeSlot = () => {
    setEditingSlots([...editingSlots, { startTime: '09:00', endTime: '17:00' }]);
  };

  const removeTimeSlot = (index: number) => {
    setEditingSlots(editingSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: string, value: string) => {
    setEditingSlots(editingSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  return (
    <div className={styles.timeEditor}>
      <div className={styles.editorHeader}>
        <Text className={styles.editorTitle}>Zeiten für {GERMAN_DAYS[day]} bearbeiten</Text>
      </div>

      <div className={styles.slotsEditor}>
        {editingSlots.map((slot, index) => (
          <div key={index} className={styles.slotEditor}>
            <TimePicker
              id={`start-${day}-${index}`}
              label="Von"
              value={slot.startTime}
              onChange={(value) => updateTimeSlot(index, 'startTime', value)}
              minHour={6}
              maxHour={22}
              minuteStep={15}
            />
            <TimePicker
              id={`end-${day}-${index}`}
              label="Bis"
              value={slot.endTime}
              onChange={(value) => updateTimeSlot(index, 'endTime', value)}
              minHour={6}
              maxHour={23}
              minuteStep={15}
            />
            {editingSlots.length > 1 && (
              <Button
                variant="tertiary"
                size="s"
                onClick={() => removeTimeSlot(index)}
                className={styles.removeButton}
              >
                <Icon name="close" size="xs" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.editorActions}>
        <Button
          variant="tertiary"
          size="s"
          onClick={addTimeSlot}
          className={styles.addButton}
        >
          <Icon name="plus" size="xs" />
          <Text>Zeitfenster</Text>
        </Button>
        
        <div className={styles.saveActions}>
          <Button
            variant="tertiary"
            size="s"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            <Text>Abbrechen</Text>
          </Button>
          <Button
            variant="tertiary"
            size="s"
            onClick={() => onSave(editingSlots)}
            className={styles.saveButton}
          >
            <Text>Speichern</Text>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AvailabilityManager() {
  const { availability, isLoading, updateAvailability } = useAvailability();
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [planningRange, setPlanningRange] = useState<PlanningRange>('1month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [dateSlots, setDateSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [isWeekMode, setIsWeekMode] = useState(true); // Default to week mode
  const [specificDateAvailability, setSpecificDateAvailability] = useState<Map<string, any[]>>(new Map());

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  const getMonthsToShow = useMemo(() => {
    const range = PLANNING_RANGES.find(r => r.key === planningRange);
    return Math.max(1, Math.ceil(range?.months || 1));
  }, [planningRange]);

  // Load specific date availability for the visible calendar range
  const loadSpecificDateAvailability = useCallback(async () => {
    if (viewMode !== 'calendar') return;
    
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + getMonthsToShow, 0);
      
      const dateMap = new Map<string, any[]>();
      
      // Load specific date availability for each day in the range
      const promises: Promise<void>[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dateToCheck = new Date(currentDate);
        
        promises.push(
          adminApi.getSpecificDateAvailability(dateString)
            .then(availability => {
              if (availability && availability.length > 0) {
                dateMap.set(dateString, availability);
              }
            })
            .catch(() => {
              // Ignore errors for individual dates
            })
        );
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Wait for all requests to complete (but don't block on failures)
      await Promise.allSettled(promises);
      
      setSpecificDateAvailability(dateMap);
    } catch (error) {
      console.error('Failed to load specific date availability:', error);
    }
  }, [viewMode, currentMonth, getMonthsToShow]);

  // Load specific date availability when calendar view changes
  useEffect(() => {
    loadSpecificDateAvailability();
  }, [loadSpecificDateAvailability]);

  const getDaySlots = (day: string) => {
    return availability?.filter(slot => slot.dayOfWeek === day && slot.active) || [];
  };

  const handleEditDay = (day: string) => {
    setEditingDay(day);
  };

  const handleSaveDay = async (day: string, slots: any[]) => {
    try {
      await updateAvailability(day, slots);
      setEditingDay(null);
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
  };

  const handleDateClick = async (day: DayData) => {
    if (day.date < new Date(new Date().setHours(0, 0, 0, 0))) return; // Don't allow past dates
    
    setSelectedDate(day.date);
    
    const dateString = day.date.toISOString().split('T')[0];
    const cachedSpecificAvailability = specificDateAvailability.get(dateString);
    
    if (cachedSpecificAvailability && cachedSpecificAvailability.length > 0) {
      // Use cached specific date availability
      setDateSlots(cachedSpecificAvailability.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      })));
      setIsWeekMode(false); // Set to specific date mode
    } else {
      // Try to fetch specific date availability if not in cache
      try {
        const specificAvailability = await adminApi.getSpecificDateAvailability(dateString);
        
        if (specificAvailability && specificAvailability.length > 0) {
          // Use specific date availability
          setDateSlots(specificAvailability.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime
          })));
          setIsWeekMode(false); // Set to specific date mode
          
          // Update cache
          const updatedMap = new Map(specificDateAvailability);
          updatedMap.set(dateString, specificAvailability);
          setSpecificDateAvailability(updatedMap);
        } else {
          // Fall back to weekly pattern
          const dayOfWeek = DAYS_MAP[day.date.getDay()];
          const dayAvailability = getDaySlots(dayOfWeek);
          setDateSlots(dayAvailability.length > 0 ? [...dayAvailability] : [{ startTime: '09:00', endTime: '17:00' }]);
          setIsWeekMode(true); // Set to weekly mode
        }
      } catch (error) {
        // If specific date availability fails, fall back to weekly pattern
        const dayOfWeek = DAYS_MAP[day.date.getDay()];
        const dayAvailability = getDaySlots(dayOfWeek);
        setDateSlots(dayAvailability.length > 0 ? [...dayAvailability] : [{ startTime: '09:00', endTime: '17:00' }]);
        setIsWeekMode(true);
      }
    }
    
    setIsDateDialogOpen(true);
  };

  const handleSaveDateAvailability = async () => {
    if (!selectedDate) return;
    
    try {
      if (isWeekMode) {
        // Save for all days of this type (e.g., all Mondays)
        const dayOfWeek = DAYS_MAP[selectedDate.getDay()];
        await updateAvailability(dayOfWeek, dateSlots);
      } else {
        // Save for specific date only
        const dateString = selectedDate.toISOString().split('T')[0];
        await adminApi.updateSpecificDateAvailability(dateString, dateSlots);
        
        // Update the cache with the new specific date availability
        const updatedMap = new Map(specificDateAvailability);
        if (dateSlots.length > 0) {
          updatedMap.set(dateString, dateSlots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            active: true
          })));
        } else {
          updatedMap.delete(dateString);
        }
        setSpecificDateAvailability(updatedMap);
      }
      
      setIsDateDialogOpen(false);
      setSelectedDate(null);
      setIsWeekMode(true); // Reset to default
    } catch (error) {
      console.error('Failed to update date availability:', error);
    }
  };

  const addDateSlot = () => {
    setDateSlots([...dateSlots, { startTime: '09:00', endTime: '17:00' }]);
  };

  const removeDateSlot = (index: number) => {
    setDateSlots(dateSlots.filter((_, i) => i !== index));
  };

  const updateDateSlot = (index: number, field: string, value: string) => {
    setDateSlots(dateSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const calendarMonths = useMemo(() => {
    const months: Date[] = [];
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    for (let i = 0; i < getMonthsToShow; i++) {
      months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
    }
    return months;
  }, [currentMonth, getMonthsToShow]);

  const generateCalendarDays = useCallback((month: Date): DayData[] => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days: DayData[] = [];
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, monthIndex, -i);
      days.push(createDayData(date, false, today));
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      days.push(createDayData(date, true, today));
    }
    
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, monthIndex + 1, i);
      days.push(createDayData(date, false, today));
    }
    
    return days;
  }, [availability, specificDateAvailability]);

  const createDayData = (date: Date, isCurrentMonth: boolean, today: Date): DayData => {
    const dayOfWeek = DAYS_MAP[date.getDay()];
    const dateString = date.toISOString().split('T')[0];
    
    // Check if there's specific date availability for this date
    const specificAvailability = specificDateAvailability.get(dateString);
    
    if (specificAvailability && specificAvailability.length > 0) {
      // Use specific date availability
      return {
        date,
        dayOfWeek,
        isCurrentMonth,
        isToday: date.getTime() === today.getTime(),
        isBlocked: false,
        hasAvailability: true,
        slots: specificAvailability.map(a => ({ startTime: a.startTime, endTime: a.endTime }))
      };
    } else {
      // Fall back to weekly availability patterns
      const dayAvailability = availability?.filter(
        a => a.dayOfWeek === dayOfWeek && a.active
      ) || [];
      
      return {
        date,
        dayOfWeek,
        isCurrentMonth,
        isToday: date.getTime() === today.getTime(),
        isBlocked: false,
        hasAvailability: dayAvailability.length > 0,
        slots: dayAvailability.map(a => ({ startTime: a.startTime, endTime: a.endTime }))
      };
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="m" />
        <Text className={styles.loadingText}>Verfügbarkeit wird geladen...</Text>
      </div>
    );
  }

  return (
    <div className={styles.availabilityManager}>
      <div className={styles.managerHeader}>
        <div className={styles.headerContent}>
          <Text className={styles.managerTitle}>Verfügbarkeit verwalten</Text>
          <Text className={styles.managerSubtitle}>
            Plane deine Arbeitszeiten und Verfügbarkeiten
          </Text>
        </div>
        
        <div className={styles.viewToggle}>
          <Button
            variant={viewMode === 'weekly' ? 'primary' : 'tertiary'}
            size="s"
            onClick={() => setViewMode('weekly')}
            className={styles.toggleButton}
          >
            Wochenplan
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'tertiary'}
            size="s"
            onClick={() => setViewMode('calendar')}
            className={styles.toggleButton}
          >
            Kalender
          </Button>
        </div>
      </div>

      {viewMode === 'weekly' && (
        <div className={styles.weeklyView}>
          <div className={styles.rhythmRiver}>
            {days.map((day) => {
              const daySlots = getDaySlots(day);
              const isEditing = editingDay === day;

              return (
                <div key={day} className={styles.dayContainer}>
                  {isEditing ? (
                    <TimeEditor
                      day={day}
                      slots={daySlots}
                      onSave={(slots) => handleSaveDay(day, slots)}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <TimeRhythm
                      day={day}
                      slots={daySlots}
                      onEdit={() => handleEditDay(day)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className={styles.calendarView}>
          <div className={styles.calendarControls}>
            <div className={styles.rangeSelector}>
              {PLANNING_RANGES.map(range => (
                <Button
                  key={range.key}
                  variant={planningRange === range.key ? 'secondary' : 'tertiary'}
                  size="s"
                  onClick={() => setPlanningRange(range.key)}
                  className={styles.rangeButton}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          <div className={styles.calendarSection}>
            <div className={styles.calendarHeader}>
              <Button
                variant="tertiary"
                size="s"
                onClick={() => navigateMonth(-1)}
                className={styles.navButton}
              >
                <Icon name="chevronLeft" size="s" />
              </Button>
              <Text className={styles.monthTitle}>
                {formatMonth(currentMonth)}
              </Text>
              <Button
                variant="tertiary"
                size="s"
                onClick={() => navigateMonth(1)}
                className={styles.navButton}
              >
                <Icon name="chevronRight" size="s" />
              </Button>
            </div>

            <div className={styles.calendarsContainer}>
              {calendarMonths.map((month, idx) => (
                <div key={idx} className={styles.calendarMonth}>
                  {idx > 0 && (
                    <Text className={styles.monthLabel}>
                      {formatMonth(month)}
                    </Text>
                  )}
                  <div className={styles.calendarGrid}>
                    {DAYS_OF_WEEK.map(day => (
                      <div key={day} className={styles.dayHeader}>
                        <Text className={styles.dayHeaderText}>{day}</Text>
                      </div>
                    ))}
                    {generateCalendarDays(month).map((day, i) => {
                      const isPast = day.date < new Date(new Date().setHours(0, 0, 0, 0));
                      const dateString = day.date.toISOString().split('T')[0];
                      const hasSpecificAvailability = specificDateAvailability.has(dateString);
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleDateClick(day)}
                          disabled={isPast}
                          className={`
                            ${styles.calendarDay}
                            ${!day.isCurrentMonth ? styles.otherMonth : ''}
                            ${day.isToday ? styles.today : ''}
                            ${day.hasAvailability ? styles.available : ''}
                            ${hasSpecificAvailability ? styles.specificDate : ''}
                            ${isPast ? styles.past : ''}
                            ${!isPast ? styles.clickable : ''}
                          `}
                        >
                          <span className={styles.dayNumber}>{day.date.getDate()}</span>
                          {day.hasAvailability && !isPast && (
                            <span className={`${styles.availabilityDot} ${hasSpecificAvailability ? styles.specificDot : ''}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendAvailable}`} />
                <Text className={styles.legendText}>Wöchentliche Verfügbarkeit</Text>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendSpecific}`} />
                <Text className={styles.legendText}>Spezifische Datumseinstellung</Text>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendToday}`} />
                <Text className={styles.legendText}>Heute</Text>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Availability Dialog */}
      {isDateDialogOpen && selectedDate && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dateDialog}>
            <div className={styles.dialogHeader}>
              <Text className={styles.dialogTitle}>
                Verfügbarkeit für {formatSelectedDate()}
              </Text>
              <Button
                variant="tertiary"
                size="s"
                onClick={() => setIsDateDialogOpen(false)}
                className={styles.closeButton}
              >
                <Icon name="close" size="s" />
              </Button>
            </div>

            <div className={styles.dialogContent}>
              {/* Fancy Toggle for Day/Week Setting */}
              <div className={styles.scopeToggle}>
                <Text className={styles.scopeLabel}>Änderung gilt für:</Text>
                <div className={styles.toggleContainer}>
                  <div 
                    className={`${styles.toggleOption} ${!isWeekMode ? styles.active : ''}`}
                    onClick={() => setIsWeekMode(false)}
                  >
                    <Icon name="calendar" size="xs" />
                    <Text>Nur diesen Tag</Text>
                  </div>
                  <div 
                    className={`${styles.toggleOption} ${isWeekMode ? styles.active : ''}`}
                    onClick={() => setIsWeekMode(true)}
                  >
                    <Icon name="refresh" size="xs" />
                    <Text>Alle {GERMAN_DAYS[DAYS_MAP[selectedDate.getDay()]]}e</Text>
                  </div>
                  <div className={`${styles.toggleSlider} ${isWeekMode ? styles.right : styles.left}`} />
                </div>
                
                {!isWeekMode && (
                  <div className={styles.dialogNote}>
                    <Icon name="info" size="xs" />
                    <Text className={styles.noteText}>
                      Diese Einstellung gilt nur für den ausgewählten Tag und überschreibt die Standard-Wochenplanung.
                    </Text>
                  </div>
                )}
              </div>

              <Text className={styles.dialogDescription}>
                {isWeekMode 
                  ? `Bearbeite die Standard-Verfügbarkeit für alle ${GERMAN_DAYS[DAYS_MAP[selectedDate.getDay()]]}e`
                  : `Bearbeite die Verfügbarkeit nur für ${formatSelectedDate()}`
                }
              </Text>

              <div className={styles.slotsEditor}>
                {dateSlots.map((slot, index) => (
                  <div key={index} className={styles.slotEditor}>
                    <TimePicker
                      id={`dialog-start-${index}`}
                      label="Von"
                      value={slot.startTime}
                      onChange={(value) => updateDateSlot(index, 'startTime', value)}
                      minHour={6}
                      maxHour={22}
                      minuteStep={15}
                    />
                    <TimePicker
                      id={`dialog-end-${index}`}
                      label="Bis"
                      value={slot.endTime}
                      onChange={(value) => updateDateSlot(index, 'endTime', value)}
                      minHour={6}
                      maxHour={23}
                      minuteStep={15}
                    />
                    {dateSlots.length > 1 && (
                      <Button
                        variant="tertiary"
                        size="s"
                        onClick={() => removeDateSlot(index)}
                        className={styles.removeButton}
                      >
                        <Icon name="close" size="xs" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="tertiary"
                size="s"
                onClick={addDateSlot}
                className={styles.addButton}
              >
                <Icon name="plus" size="xs" />
                <Text>Zeitfenster hinzufügen</Text>
              </Button>

              {isWeekMode && (
                <div className={styles.dialogNote}>
                  <Icon name="info" size="xs" />
                  <Text className={styles.noteText}>
                    Diese Änderung wird für alle zukünftigen {GERMAN_DAYS[DAYS_MAP[selectedDate.getDay()]]}e übernommen
                  </Text>
                </div>
              )}
            </div>

            <div className={styles.dialogActions}>
              <Button
                variant="tertiary"
                size="m"
                onClick={() => setIsDateDialogOpen(false)}
                className={styles.cancelButton}
              >
                <Text>Abbrechen</Text>
              </Button>
              <Button
                variant="primary"
                size="m"
                onClick={handleSaveDateAvailability}
                className={styles.saveButton}
              >
                <Text>{isWeekMode ? 'Für alle Tage speichern' : 'Nur für diesen Tag speichern'}</Text>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailabilityManager;
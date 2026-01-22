'use client';

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Spinner, RevealFx } from '@once-ui-system/core';
import { useAuth } from '@/contexts/AuthContext';
import { useTreatments } from '@/hooks/useBooking';
import { Treatment, availabilityApi } from '@/lib/bookingApi';
import { WeeklyAvailability } from '@/lib/availabilityApi';
import styles from './booking.module.scss';

// ============================================
// Types
// ============================================
interface BookingState {
  step: 1 | 2 | 3 | 4;
  selectedTreatment: Treatment | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  isComplete: boolean;
}

type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

// ============================================
// Helpers
// ============================================
const getDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[date.getDay()];
};

const generateTimeSlots = (
  availability: WeeklyAvailability | undefined,
  serviceDuration: number
): string[] => {
  if (!availability || !availability.active) return [];
  
  const slots: string[] = [];
  const [startHour, startMin] = availability.startTime.split(':').map(Number);
  const [endHour, endMin] = availability.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Generate slots every 30 minutes, ensuring service fits before end time
  for (let time = startMinutes; time + serviceDuration <= endMinutes; time += 30) {
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
  }
  
  return slots;
};

const getNextAvailableDays = (
  weeklyAvailability: WeeklyAvailability[],
  count: number
): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  const activeDays = weeklyAvailability.filter(a => a.active).map(a => a.dayOfWeek);
  
  for (let i = 1; days.length < count && i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = getDayOfWeek(date);
    
    if (activeDays.includes(dayOfWeek)) {
      days.push(date);
    }
  }
  
  return days;
};

// ============================================
// Main Component
// ============================================
function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { treatments, isLoading: treatmentsLoading } = useTreatments();
  
  const serviceParam = searchParams?.get('service');
  
  const [state, setState] = useState<BookingState>({
    step: 1,
    selectedTreatment: null,
    selectedDate: null,
    selectedTime: null,
    isComplete: false
  });

  const [mounted, setMounted] = useState(false);
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [instagramImages, setInstagramImages] = useState<Record<string, string>>({});
  const [realTimeSlots, setRealTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch weekly availability from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/availability/weekly');
        if (response.ok) {
          const data = await response.json();
          setWeeklyAvailability(data);
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        // Fallback default availability
        setWeeklyAvailability([
          { id: 1, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', active: true },
          { id: 2, dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00', active: true },
          { id: 3, dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00', active: true },
          { id: 4, dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00', active: true },
          { id: 5, dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '17:00', active: true },
          { id: 6, dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '16:00', active: true },
        ]);
      } finally {
        setAvailabilityLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  // Fetch Instagram images for treatments
  useEffect(() => {
    const fetchInstagramImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/frontend/instagram/posts');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const images: Record<string, string> = {};
            Object.entries(result.data).forEach(([category, posts]: [string, any]) => {
              if (posts && posts.length > 0) {
                // Map category to treatment slugs
                if (category === 'einzeltechnik') images['classic'] = posts[0].mediaUrl || posts[0].media_url;
                if (category === 'hybridtechnik') images['hybrid'] = posts[0].mediaUrl || posts[0].media_url;
                if (category === 'volumentechnik') images['volume'] = posts[0].mediaUrl || posts[0].media_url;
              }
            });
            setInstagramImages(images);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Instagram images:', error);
      }
    };
    fetchInstagramImages();
  }, []);

  // Auto-select service from URL - FIXED: wait for treatments to load
  useEffect(() => {
    if (serviceParam && treatments.length > 0 && !state.selectedTreatment) {
      const match = treatments.find(t => 
        t.slug?.toLowerCase() === serviceParam.toLowerCase() || 
        t.name?.toLowerCase().includes(serviceParam.toLowerCase()) ||
        t.id.toString() === serviceParam
      );
      if (match) {
        setState(prev => ({ ...prev, selectedTreatment: match, step: 2 }));
      }
    }
  }, [serviceParam, treatments, state.selectedTreatment]);

  // Fetch real time slots when date is selected
  useEffect(() => {
    const fetchSlots = async () => {
      if (!state.selectedTreatment || !state.selectedDate) return;
      
      setSlotsLoading(true);
      try {
        const dateStr = state.selectedDate.toISOString().split('T')[0];
        const response = await availabilityApi.getSlots(state.selectedTreatment.id, dateStr);
        if (response.slots) {
          setRealTimeSlots(response.slots.map(s => ({ time: s.startTime, available: s.available })));
        }
      } catch (error) {
        // Fallback: generate slots from weekly availability
        const dayOfWeek = getDayOfWeek(state.selectedDate);
        const dayAvailability = weeklyAvailability.find(a => a.dayOfWeek === dayOfWeek);
        const slots = generateTimeSlots(dayAvailability, state.selectedTreatment.durationMinutes);
        setRealTimeSlots(slots.map(time => ({ time, available: true })));
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [state.selectedDate, state.selectedTreatment, weeklyAvailability]);

  // Get available days based on weekly availability
  const availableDays = useMemo(() => {
    return getNextAvailableDays(weeklyAvailability, 14);
  }, [weeklyAvailability]);

  // Auto-redirect to contact if no availability when on step 2
  useEffect(() => {
    if (!availabilityLoading && availableDays.length === 0) {
      router.push('/#contact');
    }
  }, [state.step, availabilityLoading, availableDays.length, router]);

  const selectTreatment = useCallback((treatment: Treatment) => {
    setState(prev => ({ ...prev, selectedTreatment: treatment, step: 2, selectedDate: null, selectedTime: null }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date, selectedTime: null }));
  }, []);

  const selectTime = useCallback((time: string) => {
    setState(prev => ({ ...prev, selectedTime: time, step: 3 }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) as 1 | 2 | 3 | 4 }));
  }, []);

  // Generate WhatsApp message
  const generateWhatsAppMessage = useCallback(() => {
    if (!state.selectedTreatment || !state.selectedDate || !state.selectedTime) return '';
    
    const dateStr = state.selectedDate.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
    
    return encodeURIComponent(
      `Hallo Lisa! 💕\n\n` +
      `Ich möchte gerne einen Termin buchen:\n\n` +
      `✨ ${state.selectedTreatment.name}\n` +
      `📅 ${dateStr}\n` +
      `🕐 ${state.selectedTime} Uhr\n\n` +
      `Ist dieser Termin noch verfügbar?\n\n` +
      `Liebe Grüße${user?.firstName ? `, ${user.firstName}` : ''}`
    );
  }, [state, user]);

  // Generate Instagram DM link
  const generateInstagramMessage = useCallback(() => {
    // Instagram doesn't support pre-filled messages, but we can link to the profile
    return 'https://www.instagram.com/_l.m_beauty_/';
  }, []);

  // Fallback treatments
  const displayTreatments: Treatment[] = treatments.length > 0 ? treatments : [
    { id: 1, name: 'Classic Wimpern', description: 'Natürlich & elegant für jeden Tag', durationMinutes: 120, price: 85, category: 'WIMPERN' as const, slug: 'classic', active: true, sortOrder: 1 },
    { id: 2, name: 'Hybrid Wimpern', description: 'Mix aus Classic & Volume', durationMinutes: 135, price: 95, category: 'WIMPERN' as const, slug: 'hybrid', active: true, sortOrder: 2 },
    { id: 3, name: 'Volume Wimpern', description: 'Voller Look für besondere Momente', durationMinutes: 150, price: 110, category: 'WIMPERN' as const, slug: 'volume', active: true, sortOrder: 3 },
    { id: 4, name: 'Wimpernlifting', description: 'Deine Wimpern, perfekt geschwungen', durationMinutes: 60, price: 49, category: 'EXTRAS' as const, slug: 'lifting', active: true, sortOrder: 4 },
    { id: 5, name: 'Augenbrauenlifting', description: 'Der perfekte Rahmen', durationMinutes: 45, price: 49, category: 'AUGENBRAUEN' as const, slug: 'brow-lifting', active: true, sortOrder: 5 },
  ];

  if (!mounted) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingLogo}>LM</div>
          <div className={styles.loadingBar}><div className={styles.loadingProgress} /></div>
          <p className={styles.loadingText}>Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingPage}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.headerBack} onClick={() => state.step === 1 ? router.push('/') : goBack()}>
          ← {state.step === 1 ? 'Zurück' : 'Zurück'}
        </button>
        <div className={styles.headerStep}>
          {state.step}/3
        </div>
      </header>

      {/* Progress */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${(state.step / 3) * 100}%` }} />
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        
        {/* Step 1: Treatment Selection */}
        {state.step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <RevealFx delay={0} translateY={20}>
                <h1 className={styles.stepTitle}>
                  Wähle deine <span className={styles.accent}>Behandlung</span>
                </h1>
              </RevealFx>
              <RevealFx delay={0.1} translateY={15}>
                <p className={styles.stepDesc}>
                  Alle Behandlungen inkl. Beratung & Nachpflege-Tipps
                </p>
              </RevealFx>
            </div>

            {treatmentsLoading ? (
              <div className={styles.treatmentGrid}>
                {[1,2,3,4].map(i => (
                  <div key={i} className={styles.treatmentSkeleton}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonTextShort} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.treatmentGrid}>
                {displayTreatments.map((treatment, i) => {
                  const hasImage = instagramImages[treatment.slug];
                  return (
                    <RevealFx key={treatment.id} delay={0.1 + i * 0.06} translateY={20}>
                      <button
                        className={`${styles.treatmentCard} ${state.selectedTreatment?.id === treatment.id ? styles.selected : ''}`}
                        onClick={() => selectTreatment(treatment)}
                      >
                        <div 
                          className={styles.treatmentImage} 
                          data-category={treatment.category}
                          style={hasImage ? { backgroundImage: `url(${hasImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                        >
                          {!hasImage && (
                            <span className={styles.treatmentEmoji}>
                              {treatment.category === 'WIMPERN' && '✨'}
                              {treatment.category === 'EXTRAS' && '🌸'}
                              {treatment.category === 'AUGENBRAUEN' && '🌙'}
                            </span>
                          )}
                        </div>
                        <div className={styles.treatmentInfo}>
                          <h3 className={styles.treatmentName}>{treatment.name}</h3>
                          <p className={styles.treatmentDesc}>{treatment.description}</p>
                          <div className={styles.treatmentMeta}>
                            <span className={styles.treatmentPrice}>ab {treatment.price}€</span>
                            <span className={styles.treatmentDot}>·</span>
                            <span className={styles.treatmentTime}>{treatment.durationMinutes} Min</span>
                          </div>
                        </div>
                      </button>
                    </RevealFx>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {state.step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <RevealFx delay={0} translateY={20}>
                <h1 className={styles.stepTitle}>
                  Wann passt es <span className={styles.accent}>dir</span>?
                </h1>
              </RevealFx>
              <RevealFx delay={0.1} translateY={15}>
                <p className={styles.stepDesc}>
                  {state.selectedTreatment?.name} · ca. {state.selectedTreatment?.durationMinutes} Minuten
                </p>
              </RevealFx>
            </div>

            {availabilityLoading ? (
              <div className={styles.loadingState}>
                <Spinner size="m" />
                <p>Verfügbarkeit wird geladen...</p>
              </div>
            ) : availableDays.length === 0 ? (
              /* No availability - redirecting to contact */
              <div className={styles.loadingState}>
                <Spinner size="m" />
                <p>Weiterleitung...</p>
              </div>
            ) : (
              <>
                <RevealFx delay={0.15} translateY={20}>
                  <div className={styles.dateSection}>
                    <p className={styles.sectionLabel}>Tag wählen</p>
                    <div className={styles.dateScroll}>
                      {availableDays.map((date) => {
                        const isSelected = state.selectedDate?.toDateString() === date.toDateString();
                        return (
                          <button
                            key={date.toISOString()}
                            className={`${styles.dateChip} ${isSelected ? styles.selected : ''}`}
                            onClick={() => selectDate(date)}
                          >
                            <span className={styles.dateDay}>{date.toLocaleDateString('de-DE', { weekday: 'short' })}</span>
                            <span className={styles.dateNum}>{date.getDate()}</span>
                            <span className={styles.dateMonth}>{date.toLocaleDateString('de-DE', { month: 'short' })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </RevealFx>

                {state.selectedDate && (
                  <RevealFx delay={0} translateY={20}>
                    <div className={styles.timeSection}>
                      <p className={styles.sectionLabel}>
                        {state.selectedDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      {slotsLoading ? (
                        <div className={styles.loadingState}>
                          <Spinner size="s" />
                        </div>
                      ) : realTimeSlots.length > 0 ? (
                        <div className={styles.timeGrid}>
                          {realTimeSlots.map(({ time, available }) => {
                            const isSelected = state.selectedTime === time;
                            return (
                              <button
                                key={time}
                                className={`${styles.timeChip} ${isSelected ? styles.selected : ''} ${!available ? styles.unavailable : ''}`}
                                onClick={() => available && selectTime(time)}
                                disabled={!available}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className={styles.noSlots}>Keine Termine an diesem Tag verfügbar</p>
                      )}
                    </div>
                  </RevealFx>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3: Contact Options */}
        {state.step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <RevealFx delay={0} translateY={20}>
                <h1 className={styles.stepTitle}>
                  Fast <span className={styles.accent}>geschafft</span>!
                </h1>
              </RevealFx>
              <RevealFx delay={0.1} translateY={15}>
                <p className={styles.stepDesc}>
                  Wähle wie du buchen möchtest
                </p>
              </RevealFx>
            </div>

            <RevealFx delay={0.15} translateY={20}>
              <div className={styles.bookingSummary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryIcon}>✨</span>
                  <span>{state.selectedTreatment?.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryIcon}>📅</span>
                  <span>{state.selectedDate?.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryIcon}>🕐</span>
                  <span>{state.selectedTime} Uhr · ca. {state.selectedTreatment?.durationMinutes} Min</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryIcon}>💰</span>
                  <span>ab {state.selectedTreatment?.price}€</span>
                </div>
              </div>
            </RevealFx>

            <div className={styles.contactOptions}>
              {isAuthenticated ? (
                // Logged in user - can book directly
                <RevealFx delay={0.25} translateY={20}>
                  <div className={styles.loggedInOption}>
                    <p className={styles.optionLabel}>Eingeloggt als {user?.firstName || user?.email}</p>
                    <button
                      className={styles.primaryBtn}
                      onClick={() => {
                        // TODO: Call booking API
                        setState(prev => ({ ...prev, isComplete: true, step: 4 }));
                      }}
                    >
                      Termin verbindlich buchen
                    </button>
                    <p className={styles.optionHint}>Du erhältst eine Bestätigung per E-Mail</p>
                  </div>
                </RevealFx>
              ) : (
                // Not logged in - show contact options
                <>
                  <RevealFx delay={0.2} translateY={20}>
                    <a
                      href={`https://wa.me/4915259675346?text=${generateWhatsAppMessage()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactBtn}
                      data-type="whatsapp"
                    >
                      <span className={styles.contactIcon}>💬</span>
                      <div className={styles.contactInfo}>
                        <span className={styles.contactTitle}>Per WhatsApp anfragen</span>
                        <span className={styles.contactHint}>Schnelle Antwort, meist innerhalb 1h</span>
                      </div>
                    </a>
                  </RevealFx>

                  <RevealFx delay={0.3} translateY={20}>
                    <a
                      href={generateInstagramMessage()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactBtn}
                      data-type="instagram"
                    >
                      <span className={styles.contactIcon}>📸</span>
                      <div className={styles.contactInfo}>
                        <span className={styles.contactTitle}>Per Instagram anfragen</span>
                        <span className={styles.contactHint}>DM an @_l.m_beauty_</span>
                      </div>
                    </a>
                  </RevealFx>

                  <RevealFx delay={0.4} translateY={20}>
                    <div className={styles.dividerOr}>
                      <span>oder</span>
                    </div>
                  </RevealFx>

                  <RevealFx delay={0.45} translateY={20}>
                    <a href="/anmelden" className={styles.loginLink}>
                      Anmelden für direkte Buchung →
                    </a>
                  </RevealFx>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation (only for logged in users) */}
        {state.step === 4 && state.isComplete && (
          <div className={styles.stepContent}>
            <div className={styles.confirmationBox}>
              <RevealFx delay={0} translateY={30}>
                <div className={styles.confirmIcon}>✓</div>
              </RevealFx>
              
              <RevealFx delay={0.15} translateY={20}>
                <h1 className={styles.confirmTitle}>Termin gebucht!</h1>
              </RevealFx>
              
              <RevealFx delay={0.25} translateY={15}>
                <p className={styles.confirmText}>
                  Du erhältst eine Bestätigung an <strong>{user?.email}</strong>
                </p>
              </RevealFx>

              <RevealFx delay={0.35} translateY={15}>
                <div className={styles.confirmSummary}>
                  <p><strong>{state.selectedTreatment?.name}</strong></p>
                  <p>{state.selectedDate?.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })} · {state.selectedTime} Uhr</p>
                </div>
              </RevealFx>

              <RevealFx delay={0.45} translateY={15}>
                <div className={styles.confirmActions}>
                  <a href="/mein-bereich" className={styles.confirmBtn}>Meine Termine</a>
                  <a href="/" className={styles.confirmLink}>Zur Startseite</a>
                </div>
              </RevealFx>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingLogo}>LM</div>
          <div className={styles.loadingBar}><div className={styles.loadingProgress} /></div>
          <p className={styles.loadingText}>Wird geladen...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
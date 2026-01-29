'use client';

import {Spinner} from '@once-ui-system/core';
import {useNextAppointment} from '@/hooks/useMeinBereich';
import styles from '../../../app/(client)/mein-bereich/mein-bereich.module.scss';

export function TermineSection() {
    const {appointment, isLoading} = useNextAppointment();

    if (isLoading) {
        return (
            <div className={styles.softPanel}>
                <div className={styles.loadingState}>
                    <Spinner size="m"/>
                    <p className={styles.loadingText}>Wird geladen...</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        }) + ' Uhr';
    };

    if (!appointment) {
        return (
            <div className={styles.softPanel}>
                <div className={styles.noAppointment}>
                    <p className={styles.noAppointmentText}>
                        Kein Termin geplant — gönn dir etwas Schönes.
                    </p>
                    <a href="/#contact" className={styles.bookButton}>
                        Termin buchen
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.softPanel}>
            <div className={styles.nextAppointment}>
                <p className={styles.appointmentLabel}>Dein nächster Termin</p>
                <p className={styles.appointmentDate}>{formatDate(appointment.dateIso)}</p>
                <p className={styles.appointmentTime}>{formatTime(appointment.dateIso)}</p>
                <p className={styles.appointmentTreatment}>{appointment.treatmentName}</p>
                <div className={styles.appointmentActions}>
                    {appointment.reschedulable && (
                        <button className={styles.appointmentAction}>
                            Verschieben
                        </button>
                    )}
                    <button className={styles.appointmentAction}>
                        Absagen
                    </button>
                </div>
            </div>
        </div>
    );
}

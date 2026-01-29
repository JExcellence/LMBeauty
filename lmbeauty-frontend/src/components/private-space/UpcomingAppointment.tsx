'use client';

import {Button, Column, Icon, Row, Text} from '@once-ui-system/core';
import type {Appointment} from '@/types';
import {formatFutureRelativeDate, formatWarmDate} from '@/lib/dateUtils';
import styles from './UpcomingAppointment.module.scss';

interface UpcomingAppointmentProps {
    appointment?: Appointment;
    onViewDetails?: () => void;
    onReschedule?: () => void;
    onBook?: () => void;
}

export function UpcomingAppointment({
                                        appointment,
                                        onViewDetails,
                                        onReschedule,
                                        onBook
                                    }: UpcomingAppointmentProps) {
    if (!appointment) {
        return (
            <Column className={styles.upcomingAppointment} gap="20">
                <Row gap="12" vertical="center">
                    <Column center className={styles.sectionIcon}>
                        <Icon name="calendar" size="m"/>
                    </Column>
                    <Text variant="heading-strong-m" style={{color: '#2D2A26'}}>
                        Dein nächster Termin
                    </Text>
                </Row>

                <Column className={styles.emptyCard} center gap="16">
                    <Column center className={styles.emptyIcon}>
                        <Icon name="sparkle" size="l"/>
                    </Column>
                    <Column gap="4" center>
                        <Text variant="body-strong-m" style={{color: '#2D2A26', textAlign: 'center'}}>
                            Noch kein Termin geplant
                        </Text>
                        <Text variant="body-default-s" style={{color: '#5A5550', textAlign: 'center'}}>
                            Bereit für deinen nächsten Beauty-Moment?
                        </Text>
                    </Column>
                    <Button
                        variant="primary"
                        size="m"
                        href="/#contact"
                        label="Termin buchen"
                        prefixIcon="calendar"
                    />
                </Column>
            </Column>
        );
    }

    const warmDate = formatWarmDate(appointment.scheduledDate);
    const relativeDate = formatFutureRelativeDate(appointment.scheduledDate);

    return (
        <Column className={styles.upcomingAppointment} gap="20">
            <Row gap="12" vertical="center">
                <Column center className={styles.sectionIcon}>
                    <Icon name="calendar" size="m"/>
                </Column>
                <Text variant="heading-strong-m" style={{color: '#2D2A26'}}>
                    Dein nächster Termin
                </Text>
            </Row>

            <Column className={styles.appointmentCard} gap="16">
                <Row gap="16" vertical="center" fillWidth>
                    <Column center className={styles.dateBox}>
                        <Text variant="label-default-xs" style={{color: '#C4607A'}}>
                            {new Date(appointment.scheduledDate).toLocaleDateString('de-DE', {weekday: 'short'})}
                        </Text>
                        <Text variant="heading-strong-xl" style={{color: '#2D2A26'}}>
                            {new Date(appointment.scheduledDate).getDate()}
                        </Text>
                        <Text variant="label-default-xs" style={{color: '#8A8580'}}>
                            {new Date(appointment.scheduledDate).toLocaleDateString('de-DE', {month: 'short'})}
                        </Text>
                    </Column>
                    <Column gap="4" flex={1}>
                        <Text variant="body-strong-m" style={{color: '#2D2A26'}}>
                            {appointment.treatmentName}
                        </Text>
                        <Row gap="8" vertical="center">
                            <Icon name="clock" size="xs" style={{color: '#8A8580'}}/>
                            <Text variant="body-default-s" style={{color: '#5A5550'}}>
                                {appointment.scheduledTime} Uhr
                            </Text>
                        </Row>
                        <Text variant="label-default-xs" style={{color: '#C4607A'}}>
                            {relativeDate}
                        </Text>
                    </Column>
                </Row>

                <Row gap="8" className={styles.actions}>
                    {onViewDetails && (
                        <Button variant="tertiary" size="s" onClick={onViewDetails} label="Details"/>
                    )}
                    {onReschedule && (
                        <Button variant="tertiary" size="s" onClick={onReschedule} label="Verschieben"/>
                    )}
                </Row>
            </Column>
        </Column>
    );
}

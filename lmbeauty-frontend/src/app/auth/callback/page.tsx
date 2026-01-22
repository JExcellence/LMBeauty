"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Column, Flex } from "@once-ui-system/core";
import styles from './callback.module.scss';

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Einen Moment...');

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (error) {
            setStatus('error');
            setMessage('Die Anmeldung hat nicht geklappt. Versuch es noch einmal.');
            setTimeout(() => router.push('/anmelden'), 3000);
            return;
        }

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            
            setStatus('success');
            setMessage('Willkommen zurück.');
            
            setTimeout(() => router.push('/'), 1500);
        } else {
            setStatus('error');
            setMessage('Etwas ist schiefgelaufen.');
            setTimeout(() => router.push('/anmelden'), 3000);
        }
    }, [searchParams, router]);

    return (
        <Column fillWidth className={styles.callbackPage}>
            <Flex 
                flex={1}
                direction="column"
                horizontal="center"
                vertical="center"
                className={styles.content}
            >
                <div className={styles.statusContainer}>
                    {status === 'processing' && (
                        <div className={styles.spinner} aria-label="Wird verarbeitet" />
                    )}
                    {status === 'success' && (
                        <div className={styles.successIcon} aria-label="Erfolgreich">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className={styles.errorIcon} aria-label="Fehler">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
                <p className={styles.message}>{message}</p>
            </Flex>
        </Column>
    );
}

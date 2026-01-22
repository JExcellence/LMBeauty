'use client';

import { Spinner } from '@once-ui-system/core';
import { useLoyalty } from '@/hooks/useMeinBereich';
import styles from '../../../app/(client)/mein-bereich/mein-bereich.module.scss';

export function TreueSection() {
  const { loyalty, isLoading, redeemVoucher } = useLoyalty();

  if (isLoading) {
    return (
      <div className={styles.softPanel}>
        <div className={styles.loadingState}>
          <Spinner size="m" />
          <p className={styles.loadingText}>Wird geladen...</p>
        </div>
      </div>
    );
  }

  const handleGoogleReview = () => {
    window.open('https://g.page/r/CTi0opc7g1QzEBM/review', '_blank');
  };

  return (
    <>
      <div className={styles.softPanel}>
        <div className={styles.loyaltySection}>
          <h2 className={styles.loyaltyTitle}>Treuepunkte</h2>
          <p className={styles.loyaltySubtitle}>
            Deine Treue wird gesehen — ganz ohne Druck.
          </p>

          {loyalty && loyalty.stampsTotal > 0 && (
            <div className={styles.loyaltyProgress}>
              {Array.from({ length: loyalty.stampsTotal }, (_, index) => (
                <div
                  key={index}
                  className={`${styles.loyaltyStamp} ${
                    index < loyalty.stampsFilled ? styles.filled : ''
                  }`}
                />
              ))}
            </div>
          )}

          {loyalty?.vouchers && loyalty.vouchers.length > 0 && (
            <>
              {loyalty.vouchers.map((voucher) => (
                <div key={voucher.id} className={styles.loyaltyReward}>
                  <div className={styles.rewardInfo}>
                    <p className={styles.rewardTitle}>{voucher.title}</p>
                    {voucher.expires && (
                      <p className={styles.rewardExpiry}>
                        Gültig bis {new Date(voucher.expires).toLocaleDateString('de-DE')}
                      </p>
                    )}
                  </div>
                  <button
                    className={styles.rewardButton}
                    onClick={() => redeemVoucher(voucher.id)}
                  >
                    Einlösen
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className={styles.reviewPrompt}>
        <p className={styles.reviewText}>
          Zufrieden mit deinem letzten Besuch? Eine Bewertung hilft anderen, 
          den Weg zu mir zu finden.
        </p>
        <button className={styles.reviewButton} onClick={handleGoogleReview}>
          <svg className={styles.reviewIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Bewertung schreiben
        </button>
      </div>
    </>
  );
}

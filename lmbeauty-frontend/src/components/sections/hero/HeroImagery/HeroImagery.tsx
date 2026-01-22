"use client";

import React, { useState, useEffect } from 'react';
import styles from './HeroImagery.module.scss';
import { Column } from "@once-ui-system/core";

interface HeroImageryProps {
  videoSrc?: string;
  videoSrcMobile?: string;
}

export const HeroImagery: React.FC<HeroImageryProps> = ({
  videoSrc = '/videos/lmbeauty_store_full_hd.mp4',
  videoSrcMobile = '/videos/lmbeauty_store.mov'
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentVideoSrc = isMobile ? videoSrcMobile : videoSrc;

  return (
    <Column
      fill
      className={styles.imageryColumn}
    >
      <Column
        fillWidth
        aspectRatio="4 / 5"
        className={styles.videoContainer}
      >
        <div className={styles.videoFrame}>
          <div className={styles.videoInner}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.studioVideo}
              key={currentVideoSrc}
            >
              <source src={currentVideoSrc} type="video/mp4" />
            </video>
            
            <div className={styles.videoGradient} aria-hidden="true" />
            
            <div className={styles.videoGlow} aria-hidden="true" />
          </div>
        </div>
      </Column>
    </Column>
  );
};

export default HeroImagery;

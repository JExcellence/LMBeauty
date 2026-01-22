"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './ImageCarousel.module.scss';
import {Row, Column, IconButton} from "@once-ui-system/core";

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  permalink?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoPlay = true,
  interval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }
  
  const hasMultiple = images.length > 1;
  
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);
  
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);
  
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!autoPlay || !hasMultiple || isPaused) return;
    
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, hasMultiple, isPaused, interval, goToNext]);
  
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  
  const currentImage = images[currentIndex];
  
  return (
    <Column
        fillWidth
        aspectRatio="3 / 4"
        background="surface"
        overflow="hidden"
        topRadius="l"
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Column fill>
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
          onLoad={() => setIsLoaded(true)}
          priority={currentIndex === 0}
        />
        {currentImage.permalink && (
            <Column
                position="absolute"
                top="8"
                right="8"
                width="32"
                height="32"
                radius="l"
                onBackground="brand-weak"
                background="brand-strong"
                zIndex={1}
            >
                <IconButton
                    icon="instagram"
                    href={currentImage.permalink}
                    size="m"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Auf Instagram ansehen"
                    tooltip="Auf Instagram ansehen"
                    variant="tertiary"
                />
            </Column>
        )}
      </Column>

        <Column position="absolute" fill vertical="center">
            {hasMultiple && (
                <>
                    <Column
                        position="absolute"
                        left="12"
                    >
                        <IconButton
                            onClick={goToPrev}
                            aria-label="Vorheriges Bild"
                            tooltip="Vorheriges Bild"
                            icon="chevronLeft"
                            variant="secondary"
                        />
                    </Column>
                    <Column
                        position="absolute"
                        right="12"
                    >
                        <IconButton
                            onClick={goToNext}
                            aria-label="Nächstes Bild"
                            tooltip="Nächstes Bild"
                            icon="chevronRight"
                            variant="secondary"
                        />
                    </Column>

                </>
            )}

            {hasMultiple && (
                <Row
                    fillWidth
                    position="absolute"
                    bottom="12"
                    className={styles.dots}
                    center
                    gap="8"
                >
                    {images.map((_, index) => (
                        <Column
                            width="8"
                            height="8"
                            radius="full"
                            background="surface"
                            key={index}
                            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                            onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                            aria-label={`Bild ${index + 1} von ${images.length}`}
                            aria-current={index === currentIndex}
                        />
                    ))}
                </Row>
            )}
        </Column>

    </Column>
  );
};

export default ImageCarousel;

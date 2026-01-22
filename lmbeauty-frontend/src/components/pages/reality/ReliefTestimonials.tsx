"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './ReliefTestimonials.module.scss';
import { reliefTestimonials, pageContent, ReliefTestimonial } from './data';

/**
 * ReliefTestimonials — "Das sagen andere nach ihrem ersten Mal"
 * 
 * Real testimonials focused on relief and positive experiences.
 * Helps nervous first-timers see that others felt the same way.
 */

// Scroll reveal hook
const useScrollReveal = (threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isVisible };
};

// Testimonial card
interface TestimonialCardProps {
  testimonial: ReliefTestimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  return (
    <figure 
      className={styles.testimonialCard}
      style={{ '--card-index': index } as React.CSSProperties}
    >
      <blockquote className={styles.quote}>
        „{testimonial.quote}"
      </blockquote>
      <figcaption className={styles.attribution}>
        <span className={styles.name}>{testimonial.name}, {testimonial.age}</span>
        <span className={styles.context}>{testimonial.context}</span>
      </figcaption>
    </figure>
  );
};

export const ReliefTestimonials: React.FC = () => {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
  
  return (
    <section
      ref={sectionRef}
      className={`${styles.reliefSection} ${isVisible ? styles.visible : ''}`}
      aria-label="Kundenstimmen"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.sectionHeader}>
          <h2 className={styles.headline}>{pageContent.section3.headline}</h2>
          {pageContent.section3.subline && (
            <p className={styles.subline}>{pageContent.section3.subline}</p>
          )}
        </header>
        
        {/* Testimonials */}
        <div className={styles.testimonialsGrid}>
          {reliefTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReliefTestimonials;

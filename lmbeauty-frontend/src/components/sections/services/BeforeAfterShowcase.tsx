"use client";

import React, { useState, useEffect } from 'react';
import { Column, Heading, Text, Spinner, CompareImage } from "@once-ui-system/core";
import styles from './BeforeAfterShowcase.module.scss';

interface BeforeAfterPair {
  before: string;
  after: string;
  caption?: string;
}

export const BeforeAfterShowcase: React.FC = () => {
  const [pairs, setPairs] = useState<BeforeAfterPair[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBeforeAfter = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
                      (process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL + '/api' : 'https://api.lmbeauty.de/api');
        
        const response = await fetch(`${apiUrl}/frontend/instagram/posts`);
        const result = await response.json();
        
        if (result.success && result.data) {
          // Get all posts from all categories
          const allPosts = Object.values(result.data).flat() as any[];
          
          // Filter posts that have "Vorher" and "Nachher" in caption
          const beforeAfterPosts = allPosts.filter(post => 
            post.caption && 
            post.caption.toLowerCase().includes('vorher') && 
            post.caption.toLowerCase().includes('nachher')
          );
          
          // For Instagram carousel posts, we'd need the album children
          // For now, we'll use pairs of consecutive posts
          const extractedPairs: BeforeAfterPair[] = [];
          
          for (let i = 0; i < beforeAfterPosts.length - 1; i += 2) {
            const post1 = beforeAfterPosts[i];
            const post2 = beforeAfterPosts[i + 1];
            
            if (post1 && post2) {
              extractedPairs.push({
                before: post1.mediaUrl || post1.media_url,
                after: post2.mediaUrl || post2.media_url,
                caption: post1.caption
              });
            }
          }
          
          setPairs(extractedPairs.slice(0, 1)); // Show only first pair
        }
      } catch (error) {
        console.error('Failed to fetch before/after images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBeforeAfter();
  }, []);

  if (isLoading) {
    return (
      <Column center padding="xl">
        <Spinner size="m" />
      </Column>
    );
  }

  if (pairs.length === 0) {
    return null;
  }

  return (
    <Column fillWidth gap="m" className={styles.showcase} maxWidth={60} center>
      <Column gap="xs" center>
        <Heading as="h3" variant="heading-strong-l" align="center">
          Vorher & Nachher
        </Heading>
        <Text variant="body-default-m" align="center" onBackground="neutral-medium">
          Sieh selbst den Unterschied
        </Text>
      </Column>
      
      {pairs.map((pair, index) => (
        <CompareImage
          key={index}
          radius="xl"
          border="neutral-alpha-weak"
          overflow="hidden"
          aspectRatio="4 / 3"
          leftContent={{ src: pair.before, alt: "Vorher" }}
          rightContent={{ src: pair.after, alt: "Nachher" }}
        />
      ))}
    </Column>
  );
};

export default BeforeAfterShowcase;

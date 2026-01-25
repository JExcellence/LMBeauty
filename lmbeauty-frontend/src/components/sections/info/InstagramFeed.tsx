"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './InstagramFeed.module.scss';
import { Column, Grid, Heading, Row, SmartLink, Text } from "@once-ui-system/core";

export interface InstagramPostData {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
}

interface InstagramFeedProps {
  handle?: string;
  maxPosts?: number;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({ 
  handle = '_l.m_beauty_',
  maxPosts = 6
}) => {
  const [posts, setPosts] = useState<InstagramPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const instagramUrl = `https://instagram.com/${handle}`;
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
                      (process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL + '/api' : 'https://api.lmbeauty.de/api');
        const response = await fetch(`${apiUrl}/frontend/instagram/posts`);
        const result = await response.json();
        
        if (result.success && result.data && Object.keys(result.data).length > 0) {
          const allPosts = Object.values(result.data).flat().map((post: any) => ({
            id: post.id,
            media_url: post.mediaUrl || post.media_url,
            permalink: post.permalink,
            caption: post.caption
          })) as InstagramPostData[];
          setPosts(allPosts.slice(0, maxPosts));
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Failed to fetch Instagram posts:', err);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [maxPosts]);
  
  return (
    <Column fillWidth gap="m">
      <Row fillWidth vertical="center" horizontal="between">
        <Heading as="h3" variant="heading-strong-m" onBackground="brand-weak" className={styles.title}>
          Auf Instagram
        </Heading>
        <SmartLink
          href={instagramUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.handle}
        >
          <Text variant="label-default-s">@{handle}</Text>
        </SmartLink>
      </Row>
      
      <Grid columns={3} gap="s" fillWidth className={styles.grid}>
        {isLoading ? (
          Array.from({ length: maxPosts }).map((_, index) => (
            <div key={index} className={styles.placeholder} />
          ))
        ) : posts.length > 0 ? (
          posts.filter(post => post.media_url).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.post}
            >
              <Image 
                src={post.media_url} 
                alt={post.caption || 'Instagram'} 
                fill
                sizes="(max-width: 480px) 100px, 120px"
                style={{ objectFit: 'cover' }}
                loading="lazy"
                unoptimized={post.media_url?.includes('cdninstagram') || post.media_url?.includes('fbcdn') || false}
              />
            </a>
          ))
        ) : (
          <Column fillWidth center padding="l" className={styles.empty}>
            <Text variant="body-default-s">Folge uns auf Instagram</Text>
          </Column>
        )}
      </Grid>
      
      {posts.length > 0 && (
        <SmartLink
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.moreLink}
        >
          <Text variant="label-default-s">
            Mehr auf Instagram
          </Text>
        </SmartLink>
      )}
    </Column>
  );
};

export default InstagramFeed;
"use client";

import React, { useEffect, useState } from 'react';
import { Column, Flex, Heading, Text, Spinner } from '@once-ui-system/core';
import styles from './WimpernliftingGallery.module.scss';

interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    caption?: string;
}

export const WimpernverlaengerungGallery: React.FC = () => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInstagram = async () => {
            try {
                console.log('Fetching Instagram posts from: /api/frontend/instagram/posts');

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch('/api/frontend/instagram/posts', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    console.warn('Instagram API returned non-OK status:', response.status);
                    setIsLoading(false);
                    return;
                }

                const result = await response.json();
                console.log('Instagram API response:', result);

                if (result.success && result.data && Object.keys(result.data).length > 0) {
                    const extensionPosts: InstagramPost[] = [];
                    
                    // Get posts from einzeltechnik, hybridtechnik, and volumentechnik categories
                    ['einzeltechnik', 'hybridtechnik', 'volumentechnik'].forEach(category => {
                        if (result.data[category] && Array.isArray(result.data[category])) {
                            console.log(`Found ${category} with`, result.data[category].length, 'posts');
                            result.data[category].forEach((post: any) => {
                                extensionPosts.push({
                                    id: post.id,
                                    media_url: post.mediaUrl || post.media_url,
                                    permalink: post.permalink,
                                    caption: post.caption
                                });
                            });
                        }
                    });

                    console.log('Setting', extensionPosts.length, 'extension posts');
                    setPosts(extensionPosts.slice(0, 9));
                } else {
                    console.log('No Instagram posts available');
                }
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Instagram fetch timed out after 10 seconds');
                } else {
                    console.error('Instagram fetch failed:', error);
                }
                setIsLoading(false);
            }
        };

        fetchInstagram();
    }, []);

    if (isLoading) {
        return (
            <Column center padding="xl" style={{ minHeight: '400px' }}>
                <Spinner size="s" />
                <Text variant="label-default-s" onBackground="brand-weak">
                    Ergebnisse werden geladen...
                </Text>
            </Column>
        );
    }

    return (
        <Flex
            as="section"
            id="gallery"
            fillWidth
            paddingY="xl"
            direction="column"
            horizontal="center"
        >
            <Column fillWidth maxWidth={80} gap="xl" paddingX="xl" s={{maxWidth: 100, paddingX: "l"}}>
                <Column gap="xs" center>
                    <Heading as="h2" variant="display-strong-xs" align="center">
                        Ergebnisse <Text as="span" onBackground="brand-weak">#WimpernverlängerungOldenburg</Text>
                    </Heading>
                    <div className={styles.headlineUnderline}></div>
                </Column>

                <div className={styles.gallery}>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.galleryItem}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <img
                                    src={post.media_url}
                                    alt={post.caption || `Wimpernverlängerung Ergebnis ${index + 1}`}
                                    loading="lazy"
                                />
                                <div className={styles.overlay}>
                                    <Text variant="label-default-s" onSolid="brand-strong">
                                        Auf Instagram ansehen
                                    </Text>
                                </div>
                            </a>
                        ))
                    ) : (
                        <Column fillWidth gap="m" center style={{ gridColumn: '1 / -1', padding: '64px 0' }}>
                            <Text variant="body-default-m" onBackground="brand-medium" align="center">
                                Ergebnisse werden bald verfügbar sein
                            </Text>
                        </Column>
                    )}
                </div>
            </Column>
        </Flex>
    );
};

export default WimpernverlaengerungGallery;

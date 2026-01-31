"use client";

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Background,
    Badge,
    Button,
    Card,
    Column,
    Flex,
    Grid,
    Heading,
    Icon,
    Line,
    List,
    ListItem,
    Row,
    SmartLink,
    Spinner,
    Text
} from "@once-ui-system/core";
import styles from './ServicesSection.module.scss';
import {Service, ServicesSectionProps} from './types';
import {defaultServices, defaultTestimonial, sectionContent} from './data';
import {CarouselImage, ImageCarousel} from './ImageCarousel';

interface ExtraService {
    id: string;
    title: string;
    description: string;
    price?: string;
    bookingUrl: string;
}

interface ServiceGroup {
    id: string;
    label: string;
    services: ExtraService[];
}

const extrasGroups: ServiceGroup[] = [
    {
        id: 'liftings',
        label: 'Liftings',
        services: [
            {
                id: 'wimpernlifting',
                title: 'Wimpernlifting',
                description: 'Deine Naturwimpern, nur wacher.',
                price: '49€',
                bookingUrl: '/wimpernlifting-oldenburg/'
            },
            {
                id: 'augenbrauenlifting',
                title: 'Augenbrauenlifting',
                description: 'Der Rahmen, der alles zusammenhält.',
                price: '49€',
                bookingUrl: '/#contact'
            },
            {
                id: 'kombi-lifting',
                title: 'Kombi Paket',
                description: 'Beides zusammen – spare 13€.',
                price: '85€',
                bookingUrl: '/#contact'
            },
        ],
    },
    {
        id: 'feinschliff',
        label: 'Feinschliff',
        services: [
            {
                id: 'augenbrauen-zupfen',
                title: 'Augenbrauen zupfen',
                description: 'Klare Linien, sauber gezupft.',
                price: '10€',
                bookingUrl: '/#contact'
            },
            {
                id: 'augenbrauen-faerben',
                title: 'Augenbrauen färben',
                description: 'Mehr Definition, mehr Ausdruck.',
                price: '10€',
                bookingUrl: '/#contact'
            },
            {
                id: 'naegel-shellac',
                title: 'Shellac Nägel',
                description: 'Gepflegt bis in die Fingerspitzen.',
                price: '35€',
                bookingUrl: '/#contact'
            },
        ],
    },
];

interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    caption?: string;
    category?: string;
}

interface InstagramData {
    posts: InstagramPost[];
    byCategory: Record<string, InstagramPost[]>;
}

const useScrollReveal = (threshold = 0.1) => {
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
            {threshold, rootMargin: '0px 0px 0px 0px'}
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return {ref, isVisible};
};

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


interface ExtraCardProps {
    service: ExtraService;
    index: number;
    groupIndex: number;
    isMobile: boolean;
}

const ExtraCard: React.FC<ExtraCardProps> = ({service, index, groupIndex, isMobile}) => {
    if (isMobile) {
        return (
            <Card
                radius="l"
                border="neutral-alpha-medium"
                background="surface"
                fillWidth
            >
                <SmartLink
                    href={service.bookingUrl}
                    aria-label={`${service.title} — Mehr erfahren`}
                    fillWidth
                >
                    <Column fillWidth padding="m" gap="m">
                        <Row fillWidth horizontal="between" vertical="start" gap="s">
                            <Column gap="4" flex={1}>
                                <Heading as="h5" variant="heading-default-s" onBackground="brand-strong">
                                    {service.title}
                                </Heading>
                                <Text variant="body-default-xs" onBackground="brand-medium">
                                    {service.description}
                                </Text>
                            </Column>
                            {service.price && (
                                <Column gap="2" horizontal="end">
                                    <Text variant="heading-strong-m" onBackground="brand-strong">
                                        {service.price}
                                    </Text>
                                </Column>
                            )}
                        </Row>
                        <Row fillWidth horizontal="end" vertical="center" gap="4">
                            <Text variant="label-default-xs" onBackground="brand-medium">
                                Mehr erfahren
                            </Text>
                            <Icon name="chevronRight" size="xs" onBackground="brand-medium"/>
                        </Row>
                    </Column>
                </SmartLink>
            </Card>
        );
    }

    return (
        <SmartLink
            prefixIcon="chevronRight"
            iconSize="xs"
            href={service.bookingUrl}
            aria-label={`${service.title} — Mehr erfahren`}
        >
            <Flex
                vertical="center"
                horizontal="between"
                gap="xs"
                padding="xs"
                fill
                background="brand-weak"
                radius="l"
                flex={1}
            >
                <Column gap="4">
                    <Heading as="h5" onBackground="brand-weak">{service.title}</Heading>
                    <Text as="p" variant="label-default-xs">{service.description}</Text>
                    {service.price && (
                        <Text as="p" variant="label-default-xs">{service.price}</Text>
                    )}
                </Column>
            </Flex>
        </SmartLink>
    );
};

interface ExtrasInlineProps {
    groups: ServiceGroup[];
}

const ExtrasInline: React.FC<ExtrasInlineProps> = ({groups}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();

        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <Column fillWidth gap="m">
            <Column gap="s" center paddingX="xs">
                <Heading as="h3" variant="heading-default-s" onBackground="brand-medium" align="center"><i>Oft sind es
                    die kleinen Dinge, die einen Look komplett machen.</i></Heading>
                <Text as="p" variant="label-default-s" onBackground="brand-strong" align="center">Kleine Extras, die den
                    Look abrunden — wenn du Lust hast.</Text>
            </Column>

            <Column
                gap={isMobile ? "m" : "xs"}
                marginBottom="xs"
                maxWidth={isMobile ? 100 : 80}
                center
            >
                {groups.map((group, groupIndex) => (
                    <Column
                        gap="xs"
                        key={group.id}
                        fillWidth
                        horizontal="start"
                        className={styles.extrasServiceGroup}
                    >
                        <Text as="span" variant="label-default-xs" className={styles.extrasGroupLabel}
                              onBackground="brand-weak" align="left">{group.label}</Text>
                        <Flex
                            gap="xs"
                            direction={isMobile ? "column" : "row"}
                            fillWidth={isMobile}
                        >
                            {group.services.map((service, index) => (
                                <ExtraCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    isMobile={isMobile}
                                    groupIndex={groupIndex}
                                />
                            ))}
                        </Flex>
                    </Column>
                ))}
            </Column>
        </Column>
    );
};


interface ServiceCardComponentProps {
    service: Service;
    index: number;
    instagramImages?: CarouselImage[];
    isImagesLoading?: boolean;
    isExpanded: boolean;
    onToggle: () => void;
}

const ServiceCard: React.FC<ServiceCardComponentProps> = ({
                                                              service,
                                                              index,
                                                              instagramImages = [],
                                                              isImagesLoading = false,
                                                              isExpanded,
                                                              onToggle
                                                          }) => {
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
        }
        if (e.key === 'Escape' && isExpanded) {
            onToggle();
        }
    }, [isExpanded, onToggle]);

    const showImageSection = isImagesLoading || instagramImages.length > 0;

    return (
        <Card
            radius="l"
            direction="column"
            border="neutral-alpha-medium"
            style={{
                minHeight: showImageSection ? 'auto' : '400px'
            }}
        >
            {showImageSection && (
                <Column
                    fillWidth
                    overflow="hidden"
                    onClick={onToggle}
                    onKeyDown={handleKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-label={`${service.title} Details ${isExpanded ? 'schließen' : 'anzeigen'}`}
                >
                    {isImagesLoading ? (
                        <Column
                            position="absolute"
                            center
                            aria-posinset={0}
                            gap="s"
                        >
                            <Spinner size="xs" title="Bilder werden geladen..."/>
                        </Column>
                    ) : instagramImages.length > 0 ? (
                        <ImageCarousel
                            images={instagramImages}
                            autoPlay={true}
                            interval={5000}
                        />
                    ) : null}
                </Column>
            )}

            <Column padding="m" gap="m" fillWidth style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: showImageSection ? 'auto' : '350px'
            }}>
                <Column gap="s">
                    <Column gap="xs">
                        <Heading as="h4" onBackground="brand-medium">
                            {service.title}
                        </Heading>
                        <Text variant="label-default-xs" onBackground="brand-weak">
                            <i>{service.personaTag}</i>
                        </Text>
                        <Text variant="body-default-xs" onBackground="brand-medium" className={styles.cardDescription}>
                            {service.description}
                        </Text>
                    </Column>


                    {isExpanded && service.details && (
                        <Column fillWidth gap="m" paddingTop="m">
                            <Line/>
                            <Column fillWidth gap="xs">
                                {service.details.refillPrices && service.details.refillPrices.length > 0 && (
                                    <Column gap="4">
                                        <Text as="span" variant="label-strong-s"
                                              onBackground="neutral-strong">Refill:</Text>
                                        <Column gap="2">
                                            {service.details.refillPrices.map((refill, i) => (
                                                <Row
                                                    fillWidth
                                                    horizontal="between"
                                                    paddingY="4"
                                                    key={i}
                                                    borderBottom="neutral-alpha-weak"
                                                >
                                                    <Text as="span" variant="body-default-xs"
                                                          onBackground="neutral-medium">{refill.weeks}</Text>
                                                    <Text as="span" variant="label-strong-xs"
                                                          onBackground="neutral-medium">{refill.price}</Text>
                                                </Row>
                                            ))}
                                        </Column>
                                    </Column>
                                )}

                                {service.details.idealFor && service.details.idealFor.length > 0 && (
                                    <Column gap="xs" marginTop="4">
                                        <Text as="span" variant="label-strong-s" onBackground="neutral-strong">Perfekt
                                            für:</Text>
                                        <List as="ul" gap="4" style={{padding: 0}} className={styles.includesList}>
                                            {service.details.idealFor.map((item, i) => (
                                                <ListItem style={{padding: 0}} key={i}>
                                                    <CheckIcon/>
                                                    <Text as="span" variant="body-default-xs"
                                                          onBackground="brand-medium">{item}</Text>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Column>
                                )}
                            </Column>
                        </Column>
                    )}
                </Column>

                <Column fillWidth gap="m">
                    <Column fillWidth gap="m">
                        <Row vertical="end" horizontal="between">
                            <Column gap="2">
                                {service.price.prefix && (
                                    <Text variant="label-default-m" onBackground="brand-strong"
                                          className={styles.pricePrefix}>
                                        {service.price.prefix}
                                    </Text>
                                )}
                                <Row gap="4" vertical="center">
                                    <Text variant="heading-strong-m" onBackground="brand-strong"
                                          className={styles.priceAmount}>
                                        {service.price.amount}
                                    </Text>
                                    <Text variant="label-strong-m" onBackground="brand-strong"
                                          className={styles.priceCurrency}>
                                        {service.price.currency}
                                    </Text>
                                </Row>
                            </Column>
                            <Row gap="4" vertical="center">
                                <Icon name="clock" size="s" onBackground="neutral-medium"/>
                                <Text variant="label-default-m" onBackground="neutral-medium">
                                    {service.duration} Min
                                </Text>
                            </Row>
                        </Row>

                        <Button
                            href={service.bookingUrl}
                            variant="primary"
                            size="m"
                            fillWidth
                            className={styles.cardCta}
                            label="Jetzt buchen"
                            aria-label={`${service.title} jetzt buchen`}
                        />
                    </Column>
                </Column>
            </Column>
        </Card>
    );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
                                                                    headline = sectionContent.title,
                                                                    subheadline = sectionContent.subtitle,
                                                                    services: initialServices,
                                                                    testimonial = defaultTestimonial,
                                                                    showStyleQuiz = true,
                                                                    showAllServicesLink = true
                                                                }) => {
    const {ref: sectionRef, isVisible} = useScrollReveal(0.1);
    const [instagramData, setInstagramData] = useState<InstagramData | null>(null);
    const [services, setServices] = useState<Service[]>(initialServices || defaultServices);
    const [isLoading, setIsLoading] = useState(!initialServices);
    const [isInstagramLoading, setIsInstagramLoading] = useState(true);
    const [allExpanded, setAllExpanded] = useState(false);

    const toggleAllCards = useCallback(() => {
        setAllExpanded(prev => !prev);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            if (initialServices) {
                return;
            }

            try {
                setIsLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL ||
                    (process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL + '/api' : 'https://api.lmbeauty.de/api');
                const response = await fetch(`${apiUrl}/frontend/services/enhanced`);
                const result = await response.json();

                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setServices(result.data);
                } else {
                    console.warn('No services data available, using fallback');
                    setServices(defaultServices);
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
                setServices(defaultServices);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, [initialServices]);

    useEffect(() => {
        const fetchInstagram = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL ||
                    (process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL + '/api' : 'https://api.lmbeauty.de/api');
                console.log('Fetching Instagram posts from:', `${apiUrl}/frontend/instagram/posts`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(`${apiUrl}/frontend/instagram/posts`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    console.warn('Instagram API returned non-OK status:', response.status);
                    const errorText = await response.text();
                    console.warn('Error response:', errorText);
                    setIsInstagramLoading(false);
                    return;
                }

                const result = await response.json();
                console.log('Instagram API response:', result);

                if (result.success && result.data && Object.keys(result.data).length > 0) {
                    const transformedData: InstagramData = {
                        posts: [],
                        byCategory: {}
                    };

                    Object.entries(result.data).forEach(([category, posts]: [string, any]) => {
                        const serviceId = mapCategoryToServiceId(category);
                        if (serviceId) {
                            const mappedPosts = posts.map((post: any) => ({
                                id: post.id,
                                media_url: post.mediaUrl || post.media_url,
                                permalink: post.permalink,
                                caption: post.caption
                            }));
                            transformedData.byCategory[serviceId] = mappedPosts;
                            transformedData.posts.push(...mappedPosts);
                        }
                    });

                    setInstagramData(transformedData);
                    console.log('Successfully loaded Instagram data for services:', transformedData);
                } else {
                    console.log('No Instagram posts available for services');
                }
                setIsInstagramLoading(false);
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Instagram fetch timed out after 10 seconds');
                } else {
                    console.error('Instagram fetch failed:', error);
                }
                setIsInstagramLoading(false);
            }
        };

        fetchInstagram();
    }, []);

    const getCarouselImages = (serviceId: string): CarouselImage[] => {
        if (!instagramData?.byCategory) {
            return [];
        }

        const categoryPosts = instagramData.byCategory[serviceId] || [];
        return categoryPosts.map(post => ({
            id: post.id,
            src: post.media_url,
            alt: post.caption || `Wimpernverlängerung ${serviceId} Ergebnis bei LM Beauty Oldenburg - Vorher Nachher`,
            permalink: post.permalink,
        }));
    };

    const mapCategoryToServiceId = (category: string): string | null => {
        const mapping: Record<string, string> = {
            'einzeltechnik': 'einzeltechnik',
            'hybridtechnik': 'hybridtechnik',
            'volumentechnik': 'volumentechnik'
        };
        return mapping[category] || null;
    };

    return (
        <Flex
            as="section"
            ref={sectionRef}
            id="services"
            aria-labelledby="services-headline"
            fillWidth
            paddingY="xl"
            paddingX="l"
            direction="column"
            horizontal="center"
        >
            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 100,
                    x: 50,
                    y: 100,
                    colorStart: "brand-background-strong",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 100,
                    radius: 100
                }}
                zIndex={0}
            />
            <Column
                fillWidth
                maxWidth={80}
                padding="l"
                gap="xl"
                center
                s={{maxWidth: 100}}
            >
                <Column
                    fillWidth
                    gap="l"
                    horizontal="start"
                    paddingTop="xl"
                    paddingBottom="l"
                >
                    <Column gap="s" fitWidth>
                        <Heading
                            as="h2"
                            id="services-headline"
                            variant="display-strong-s"
                            onBackground="neutral-strong"
                        >
                            {headline}
                        </Heading>
                        <div className={styles.headlineUnderline}/>
                    </Column>

                    <Column gap="s" fillWidth horizontal="center">
                        <Text
                            variant="body-default-xl"
                            onBackground="brand-weak"
                        >
                            {subheadline}
                        </Text>

                        <Text
                            as="p"
                            variant="body-default-s"
                            onBackground="brand-weak"
                            align="center"
                        >
                            Jede Behandlung beginnt mit einem Gespräch. Ich möchte verstehen,
                            was du dir <Text as="span" onBackground="brand-medium"
                                             style={{fontWeight: 600}}>wünschst</Text> —
                            nicht nur, was du buchst.
                        </Text>
                    </Column>
                </Column>

                <Grid
                    fillWidth
                    marginBottom="m"
                    gap="m"
                    columns={3}
                    m={{columns: 1}}
                    s={{columns: 1}}
                    aria-label="Verfügbare Services"
                >
                    {isLoading ? (
                        Array.from({length: 3}).map((_, index) => (
                            <div key={`skeleton-${index}`} className={`${styles.serviceCard} ${styles.cardSkeleton}`}>
                                <div className={styles.skeletonImage}></div>
                                <div className={styles.cardContent}>
                                    <div className={styles.skeletonTitle}></div>
                                    <div className={styles.skeletonText}></div>
                                    <div className={styles.skeletonText}></div>
                                    <div className={styles.cardMeta}>
                                        <div className={styles.skeletonPrice}></div>
                                        <div className={styles.skeletonDuration}></div>
                                    </div>
                                    <div className={styles.skeletonButton}></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                index={index}
                                instagramImages={getCarouselImages(service.id)}
                                isImagesLoading={isInstagramLoading}
                                isExpanded={true}//{allExpanded}
                                onToggle={toggleAllCards}
                            />
                        ))
                    )}
                </Grid>

                <Column fillWidth center>
                    <ExtrasInline groups={extrasGroups}/>
                </Column>

                {(showStyleQuiz || showAllServicesLink) && (
                    <Flex
                        gap="m"
                        fillWidth
                        center
                        s={{direction: "row"}}
                        aria-label="Weitere Optionen"
                        marginBottom="m"
                    >
                        {showStyleQuiz && (
                            <SmartLink
                                /*href={sectionContent.styleQuizUrl}*/
                                aria-label="Style-Quiz starten um deinen perfekten Look zu finden"
                            >
                                <Badge icon="sparkle" radius="l">
                                    Kommt bald...
                                </Badge>
                            </SmartLink>
                        )}
                        {showAllServicesLink && (
                            <SmartLink
                                /*href={sectionContent.allServicesUrl}*/
                                href="#contact"
                                className={styles.allServicesLink}
                            >
                                <Text as="p"
                                      className={styles.allServicesLinkText}>{sectionContent.allServicesText} →</Text>
                            </SmartLink>
                        )}
                    </Flex>
                )}
            </Column>
        </Flex>
    );
};

export default ServicesSection;

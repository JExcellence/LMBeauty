import React from 'react';
import {Background, Column, Schema} from "@once-ui-system/core";
import dynamic from 'next/dynamic';
import {AboutSection, ContactSection, FitCheckSection, InfoSection, ServicesSection} from "@/components/sections";
import {Footer} from "@/components/footer/Footer";
import {FloatingContactButton} from "@/components/ui/FloatingContactButton";
import {baseURL, meta} from "@/resources";
import {Hero} from "@/components/sections/hero/HeroSection";

const AftermathSection = dynamic(() => import("@/components/sections/aftermath/AftermathSection").then(mod => ({default: mod.AftermathSection})), {
    ssr: true,
});

const StandardsSection = dynamic(() => import("@/components/sections").then(mod => ({default: mod.StandardsSection})), {
    ssr: true,
});

const VoicesSection = dynamic(() => import("@/components/sections").then(mod => ({default: mod.VoicesSection})), {
    ssr: true,
});

export default function Home() {
    return (
        <Column as="main" fillWidth>
            <Schema
                as="webPage"
                baseURL={baseURL}
                title={meta.home.title}
                description={meta.home.description}
                path={meta.home.path}
            />
            <Background
                position="absolute"
                fill
                gradient={{
                    display: true,
                    opacity: 100,
                    x: 50,
                    y: 0,
                    colorStart: "brand-background-strong",
                    colorEnd: "brand-background-weak"
                }}
                mask={{
                    x: 50,
                    y: 0,
                    radius: 250
                }}
                zIndex={0}
                style={{
                    willChange: 'auto',
                    contain: 'layout style paint'
                }}
                suppressHydrationWarning
            />
            <Hero/>
            <AboutSection/>
            <ServicesSection/>
            <FitCheckSection/>
            <VoicesSection/>
            <InfoSection/>
            <AftermathSection/>
            <StandardsSection/>
            <ContactSection/>
            <Footer/>
            <FloatingContactButton/>
        </Column>
    );
}

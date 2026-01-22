import React from 'react';
import {Background, Column, Schema} from "@once-ui-system/core";
import {
    AboutSection, AftermathSection, ContactSection,
    FitCheckSection,
    InfoSection,
    ServicesSection, StandardsSection,
    VoicesSection
} from "@/components/sections";
import {baseURL, meta} from "@/resources";
import {Hero} from "@/components/sections/hero/HeroSection";

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
          />
          <Hero />
          <AboutSection />
          <ServicesSection />
          <FitCheckSection />
          <VoicesSection />
          <InfoSection />
          <AftermathSection />
          <StandardsSection />
          <ContactSection />
      </Column>
  );
}

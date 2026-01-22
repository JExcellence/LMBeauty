# Enhanced Hero Section

A premium, animated hero section for LM Beauty featuring a dark theme with blue/purple gradients, floating decorations, transformation gallery, and smooth micro-animations.

## Features

- 🎨 Dark theme with blue (#4d96ff) and purple (#bf73ff) gradient accents
- ✨ Floating decorations (sparkles, hearts, stars) with subtle animations
- 🖼️ Transformation gallery with auto-advance and swipe support
- 💬 Client testimonials with star ratings
- 📱 Fully responsive (mobile-first design)
- ♿ Accessible (ARIA labels, keyboard navigation, reduced motion support)
- ⚡ Performance optimized (GPU-accelerated animations)

## Usage

```tsx
import { HeroSection } from '@/components/sections/hero';

export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `HeroSection` | Main container orchestrating all sub-components |
| `LoadingOverlay` | Branded loading animation with spinner |
| `BackgroundLayer` | Dark gradient background with ambient glows |
| `FloatingDecorations` | Animated sparkles, hearts, and stars |
| `HeroContent` | Left column: badge, title, CTAs, trust indicators |
| `TransformationShowcase` | Right column: image gallery with testimonials |
| `FloatingStat` | Floating stat cards (rating, duration) |
| `ScrollIndicator` | Bouncing scroll prompt |

## Customization

### Transformation Stories

Edit the `transformationStories` array in `HeroSection.tsx`:

```tsx
const transformationStories: TransformationStory[] = [
  {
    id: 1,
    image: "https://...",
    title: "Your Title",
    description: "Description",
    clientName: "Client Name",
    testimonial: "Testimonial quote",
    rating: 5
  },
  // Add more...
];
```

### Colors

The component uses CSS variables from `custom.scss`:
- `--scheme-brand-600`: Primary blue (#4d96ff)
- `--scheme-accent-600`: Primary purple (#bf73ff)

### Animations

Disable animations for users who prefer reduced motion:
- Component automatically detects `prefers-reduced-motion: reduce`
- All non-essential animations are disabled

## File Structure

```
src/components/sections/hero/
├── HeroSection.tsx      # Main component
├── HeroSection.module.scss
├── index.ts                      # Barrel export
├── README.md                     # This file
└── components/
    ├── index.ts
    ├── LoadingOverlay.tsx
    ├── LoadingOverlay.module.scss
    ├── BackgroundLayer.tsx
    ├── BackgroundLayer.module.scss
    ├── FloatingDecorations.tsx
    ├── FloatingDecorations.module.scss
    ├── HeroContent.tsx
    ├── HeroContent.module.scss
    ├── TransformationShowcase.tsx
    ├── TransformationShowcase.module.scss
    ├── FloatingStat.tsx
    ├── FloatingStat.module.scss
    ├── ScrollIndicator.tsx
    └── ScrollIndicator.module.scss
```

## Accessibility

- All interactive elements have visible focus indicators
- Transformation gallery supports keyboard navigation (Arrow keys)
- ARIA labels on images and interactive elements
- Respects `prefers-reduced-motion` preference
- Minimum 4.5:1 color contrast ratio for text

# About Section - "Stille Eleganz" Design System

Premium about section component matching the LM Beauty hero section and sidebar's elegant design language.

## Design Philosophy

### "Stille Eleganz" (Quiet Elegance)
- **Premium Materials**: Glassmorphism container with subtle backdrop blur
- **Warm Color Palette**: Pink tones (#D4708A, #C4607A) with warm backgrounds (#FFF8F5)
- **Refined Typography**: Merriweather Sans for premium feel
- **Smooth Interactions**: Elegant scroll-triggered animations
- **Accessibility First**: WCAG AA compliant with proper focus states

## Key Features

### Visual Design
- **Glassmorphism Container**: Premium backdrop blur with elegant borders
- **Premium Shadows**: Multi-layered shadow system for depth
- **Refined Typography**: Consistent font hierarchy with subtle text shadows
- **Elegant Animations**: Smooth scroll-triggered reveals with staggered timing

### Interactive Elements
- **Photo Hover Effects**: Subtle scale and shadow enhancements
- **Signature Styling**: Decorative underline with elegant fade-in
- **Trust Indicators**: Premium border treatment with gradient accents

## Component Structure

```tsx
<AboutSection />
```

### Layout System
- **Desktop**: Side-by-side photo and content layout
- **Mobile**: Stacked vertical layout with centered alignment
- **Responsive**: Fluid transitions between breakpoints

## Styling Architecture

### Container System
```scss
.aboutSection {
  // Subtle background patterns for texture
  // Premium glassmorphism container
  // Multi-layered shadow system
}
```

### Photo Presentation
```scss
.photoWrapper {
  // Premium shadow system
  // Elegant border treatment
  // Hover effects with scale transform
  // Subtle overlay gradient
}
```

### Typography Hierarchy
```scss
.headline {
  // 32px → 28px → 24px (responsive)
  // Merriweather Sans, 700 weight
  // Subtle text shadow for depth
}

.greeting {
  // 18px → 17px → 16px (responsive)
  // Medium weight with emphasis colors
}

.description {
  // 16px → 15px (responsive)
  // Optimized line height for readability
}
```

## Animation System

### Scroll Reveal
- **Container**: 800ms entrance with vertical transform
- **Photo**: 600ms with scale effect (100ms delay)
- **Content**: 600ms fade-in (200ms delay)
- **Trust Line**: 500ms with vertical transform (400ms delay)
- **Signature**: 500ms with horizontal slide (500ms delay)

### Hover Effects
- **Photo Scale**: Subtle 1.05x scale on hover
- **Shadow Enhancement**: Increased shadow depth and spread

## Accessibility Features

### WCAG AA Compliance
- **Color Contrast**: All text meets 4.5:1 minimum ratio
- **Focus States**: Visible focus indicators where applicable
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Screen Readers**: Descriptive alt text and ARIA labels

### Reduced Motion Support
```scss
@media (prefers-reduced-motion: reduce) {
  // Disables all transforms and complex animations
  // Preserves opacity transitions for content visibility
}
```

### High Contrast Mode
```scss
@media (prefers-contrast: high) {
  // Enhanced border visibility
  // Stronger color emphasis
  // Increased font weights
}
```

## Responsive Behavior

### Breakpoints
- **Desktop (≥1025px)**: Full side-by-side layout with 48px padding
- **Tablet (768px-1024px)**: Reduced padding and font sizes
- **Mobile (≤767px)**: Stacked layout with centered alignment

### Typography Scaling
- **Headline**: 32px → 28px → 24px
- **Greeting**: 18px → 17px → 16px
- **Description**: 16px → 15px
- **Signature**: 16px → 15px

## Performance Optimizations

### Image Handling
- **Priority Loading**: Hero image loaded with priority flag
- **Aspect Ratio**: Maintained with CSS for layout stability
- **Object Fit**: Cover mode for consistent presentation

### Animation Performance
- **Hardware Acceleration**: Transform and opacity properties
- **Cubic Bezier Easing**: Smooth, natural motion curves
- **Staggered Timing**: Prevents overwhelming simultaneous animations

## Usage Example

```tsx
import { AboutSection } from '@/components/sections/about';

// Basic usage
<AboutSection />
```

## Data Requirements

The component expects `aboutData` from `./data` with:
```typescript
{
  image: {
    src: string;
    alt: string;
  }
}
```

## Browser Support

- **Modern Browsers**: Full glassmorphism and backdrop-filter support
- **Fallbacks**: Solid backgrounds for older browsers
- **Performance**: Optimized for 60fps animations on modern devices
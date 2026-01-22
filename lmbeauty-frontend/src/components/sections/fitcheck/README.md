# FitCheck Section - "Stille Eleganz" Design System

Premium fit check section component matching the LM Beauty hero section, about section, and sidebar's elegant design language.

## Design Philosophy

### "Stille Eleganz" (Quiet Elegance)
- **Premium Materials**: Multi-layered glassmorphism with hero-style background
- **Warm Color Palette**: Pink tones (#D4708A, #C4607A) with warm backgrounds (#FFF8F5)
- **Refined Typography**: Merriweather Sans for premium feel
- **Smooth Interactions**: Elegant scroll-triggered animations with staggered timing
- **Accessibility First**: WCAG AA compliant with proper focus states

## Key Features

### Visual Design
- **Hero-Style Background**: Matching warm gradient system from hero section
- **Glassmorphism Cards**: Premium backdrop blur with individual column cards
- **Premium Shadows**: Multi-layered shadow system for depth
- **Refined Typography**: Consistent font hierarchy with subtle text shadows
- **Interactive Elements**: Hover effects with gentle transforms and shadow enhancements

### Layout System
- **Main Container**: Large glassmorphism card with premium styling
- **Column Cards**: Individual cards for positive/negative sections
- **Responsive Grid**: Side-by-side on desktop, stacked on mobile
- **Premium Icons**: Gradient backgrounds with elegant shadows

## Component Structure

```tsx
<FitCheckSection />
```

### Layout Architecture
- **Desktop**: Two-column grid with individual glassmorphism cards
- **Mobile**: Stacked single-column layout
- **Responsive**: Fluid transitions between breakpoints

## Styling Architecture

### Background System
```scss
.fitCheckSection {
  // Hero-style gradient background
  // Multi-layered texture overlays
  // Subtle animated gradient overlay
}
```

### Card System
```scss
.contentCard {
  // Main glassmorphism container
  // Premium shadow system
  // Elegant border treatment
}

.column {
  // Individual column cards
  // Hover effects with transforms
  // Color-coded accents (positive/negative)
}
```

### Typography Hierarchy
```scss
.headline {
  // 36px → 32px → 28px (responsive)
  // Merriweather Sans, 700 weight
  // Decorative accent underline
}

.columnTitle {
  // 18px → 17px → 16px (responsive)
  // Premium icon integration
}

.listItem {
  // 16px → 15px → 14px (responsive)
  // Enhanced bullet points with gradients
}
```

## Animation System

### Scroll Reveal Sequence
1. **Main Card**: 800ms entrance with scale effect
2. **Header**: 600ms fade-in (100ms delay)
3. **Positive Column**: 600ms with transform (200ms delay)
4. **Negative Column**: 600ms with transform (300ms delay)
5. **List Items**: 500ms staggered reveals (200ms+ delays)
6. **Footer**: 600ms fade-in (600ms delay)

### Interactive Effects
- **Column Hover**: Subtle lift with enhanced shadows
- **Link Hover**: Background blur with gentle transform
- **Focus States**: Visible outlines for accessibility

## Content Structure

### Positive Section
- **Icon**: Green gradient checkmark with shadow
- **Items**: Benefits and ideal user characteristics
- **Styling**: Subtle green accent overlay

### Negative Section
- **Icon**: Neutral gradient dash with shadow
- **Items**: Potential limitations or concerns
- **Styling**: Neutral gray accent overlay

## Accessibility Features

### WCAG AA Compliance
- **Color Contrast**: All text meets 4.5:1 minimum ratio
- **Focus States**: Visible focus indicators on interactive elements
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Screen Readers**: Descriptive content structure

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
- **Desktop (≥769px)**: Two-column grid with 40px gap
- **Tablet (768px)**: Single column with reduced spacing
- **Mobile (≤639px)**: Compact single column layout

### Typography Scaling
- **Headline**: 36px → 32px → 28px
- **Column Title**: 18px → 17px → 16px
- **List Items**: 16px → 15px → 14px
- **Footer Text**: 16px → 15px → 14px

### Spacing Adjustments
- **Card Padding**: 56px → 48px → 40px → 32px
- **Column Gap**: 40px → 32px
- **Section Margins**: Proportional scaling

## Performance Optimizations

### Animation Performance
- **Hardware Acceleration**: Transform and opacity properties
- **Cubic Bezier Easing**: Smooth, natural motion curves
- **Staggered Timing**: Prevents overwhelming simultaneous animations

### Glassmorphism Optimization
- **Backdrop Filter**: Efficient blur implementation
- **Layer Management**: Proper z-index stacking
- **Fallbacks**: Solid backgrounds for older browsers

## Usage Example

```tsx
import { FitCheckSection } from '@/components/sections/fitcheck';

// Basic usage
<FitCheckSection />
```

## Content Customization

The component includes predefined content arrays:
```typescript
const perfectForItems = [
  'du Wert auf Natürlichkeit legst, auch bei Volumen',
  // ... more items
];

const notIdealItems = [
  'du regelmäßig schwimmen gehst',
  // ... more items
];
```

## Browser Support

- **Modern Browsers**: Full glassmorphism and backdrop-filter support
- **Fallbacks**: Solid backgrounds for older browsers
- **Performance**: Optimized for 60fps animations on modern devices
- **Mobile**: Touch-optimized with proper safe areas
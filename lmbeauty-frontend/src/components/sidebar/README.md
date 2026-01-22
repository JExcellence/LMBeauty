# Sidebar Navigation - "Stille Eleganz" Design System

Premium navigation components matching the LM Beauty hero section's elegant design language.

## Components

### `Sidebar`
Desktop/tablet sidebar navigation with collapsible functionality and integrated mobile menu button.

### `MobileBottomNav`
Mobile-optimized bottom navigation bar for quick access to main sections.

### `MobileSidebar`
Full-screen mobile sidebar overlay with premium glassmorphism design matching the landing page aesthetic.

### `MobileMenuButton`
Elegant menu button for triggering the mobile sidebar, with premium styling and smooth animations.

### `UserSidebar`
Specialized sidebar for authenticated user areas with enhanced profile display.

## Design Philosophy

### "Stille Eleganz" (Quiet Elegance)
- **Premium Materials**: Glassmorphism effects with subtle backdrop blur
- **Warm Color Palette**: Pink tones (#D4708A, #C4607A) with warm backgrounds (#FFF8F5)
- **Refined Typography**: Merriweather Sans for premium feel
- **Smooth Interactions**: Elegant transitions with cubic-bezier easing
- **Accessibility First**: WCAG AA compliant with proper focus states

## Color System

```scss
// Primary Colors
--lm-pink-medium: #D4708A
--lm-pink-dark: #C4607A
--lm-pink-darker: #B85A6E

// Background Colors
--lm-bg-warm: #FFF8F5
--lm-text-dark: #2C1810

// Opacity Variations
rgba(212, 112, 138, 0.06) // Subtle hover
rgba(212, 112, 138, 0.12) // Active states
rgba(212, 112, 138, 0.2)  // Borders
```

## Typography

```scss
font-family: 'Merriweather Sans', sans-serif;
font-weight: 500-700; // Medium to Bold
letter-spacing: -0.02em to 0.02em;
```

## Effects

### Glassmorphism
```scss
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(212, 112, 138, 0.15);
```

### Premium Shadows
```scss
box-shadow: 
  0 4px 20px rgba(212, 112, 138, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.9);
```

### Elegant Transitions
```scss
transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

## Responsive Behavior

### Desktop (≥769px)
- Full sidebar with collapsible functionality
- Glassmorphism effects and premium shadows
- Hover states with subtle transforms

### Mobile (≤768px)
- Full-screen mobile sidebar overlay with premium design
- Mobile menu button with glassmorphism styling
- Bottom navigation bar for quick access
- Touch-optimized interactions (56px minimum touch targets)
- Safe area support for modern phones
- Staggered entrance animations for premium feel

## Accessibility Features

- **WCAG AA Compliant**: Proper color contrast ratios
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Screen Reader Support**: Proper ARIA labels and roles
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **High Contrast**: Enhanced visibility in high contrast mode

## Usage

```tsx
import { 
  Sidebar, 
  MobileBottomNav, 
  MobileSidebar, 
  MobileMenuButton,
  UserSidebar 
} from '@/components/sidebar';

// Main Layout with integrated mobile functionality
<Sidebar 
  isCollapsed={isCollapsed} 
  onToggleCollapse={handleToggle} 
/>

// Mobile Bottom Navigation (automatically hidden on desktop)
<MobileBottomNav />

// For custom mobile implementations
<MobileMenuButton 
  onClick={() => setMobileOpen(true)}
  isOpen={isMobileOpen}
/>
<MobileSidebar 
  isOpen={isMobileOpen}
  onClose={() => setMobileOpen(false)}
/>

// User-specific sidebar
<UserSidebar 
  isCollapsed={isCollapsed} 
  onToggleCollapse={handleToggle} 
/>
```

## States

### Navigation Items
- **Default**: Subtle transparency with warm colors
- **Hover**: Glassmorphism background with gentle transform
- **Active**: Enhanced glassmorphism with premium shadow
- **Focus**: Visible outline for keyboard users

### User Profile
- **Avatar**: Gradient background with elegant shadow
- **Hover**: Scale transform with enhanced shadow
- **Info**: Refined typography with subtle text shadows

## Mobile Optimizations

- **Touch Targets**: Minimum 56px for enhanced accessibility
- **Safe Areas**: Respects device safe areas and notches
- **Performance**: Optimized backdrop-filter usage with fallbacks
- **Gestures**: Smooth touch interactions with haptic feedback
- **Animations**: Staggered entrance animations for premium feel
- **Full-Screen Experience**: Immersive mobile sidebar matching landing page design

## Browser Support

- **Modern Browsers**: Full glassmorphism effects
- **Fallbacks**: Solid backgrounds for older browsers
- **Performance**: Hardware acceleration for smooth animations
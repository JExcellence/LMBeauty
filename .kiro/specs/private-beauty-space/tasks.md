# Implementation Plan

- [x] 1. Set up page route and authentication protection





  - [x] 1.1 Create the `/mein-bereich` page route


    - Create `lmbeauty-frontend/src/app/mein-bereich/page.tsx`
    - Implement authentication check using `useAuth` hook
    - Redirect unauthenticated users to `/anmelden`
    - Display branded loading state while checking auth
    - _Requirements: 8.1, 8.2, 8.3_

  - [-] 1.2 Create the PrivateBeautySpace container component

    - Create `lmbeauty-frontend/src/components/private-space/PrivateBeautySpace.tsx`
    - Create `lmbeauty-frontend/src/components/private-space/PrivateBeautySpace.module.scss`
    - Implement single vertical Column layout with generous spacing
    - Use Once UI components only
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2. Implement WelcomeMoment component






  - [x] 2.1 Create WelcomeMoment component

    - Create `lmbeauty-frontend/src/components/private-space/WelcomeMoment.tsx`
    - Display personalized greeting with user's first name
    - Show warm generic greeting when name unavailable
    - Add soft subtext beneath greeting
    - Implement subtle fade-in animation
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 2.2 Write unit tests for WelcomeMoment
    - Test personalized greeting with first name
    - Test fallback greeting without name
    - _Requirements: 1.1, 1.3_

- [x] 3. Implement BeautyJourney and TreatmentMemory components





  - [x] 3.1 Extend types with treatment history interfaces


    - Add `TreatmentHistory` interface to `types/index.ts`
    - Add relative date formatting utility
    - _Requirements: 2.1, 2.2_
  - [x] 3.2 Create TreatmentMemory component


    - Create `lmbeauty-frontend/src/components/private-space/TreatmentMemory.tsx`
    - Display treatment name and relative date
    - Use warm language like "vor 3 Wochen"
    - Apply soft visual styling with rounded corners
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Create BeautyJourney component

    - Create `lmbeauty-frontend/src/components/private-space/BeautyJourney.tsx`
    - Render vertical list of TreatmentMemory items
    - Limit to 5 most recent with "view more" option
    - Display encouraging empty state message
    - _Requirements: 2.3, 2.4, 2.5_
  - [ ]* 3.4 Write unit tests for BeautyJourney
    - Test rendering with treatments
    - Test empty state
    - Test 5-item limit
    - _Requirements: 2.3, 2.4, 2.5_

- [x] 4. Implement UpcomingAppointment component





  - [x] 4.1 Extend types with appointment interface


    - Add `Appointment` interface to `types/index.ts`
    - _Requirements: 3.2_
  - [x] 4.2 Create UpcomingAppointment component


    - Create `lmbeauty-frontend/src/components/private-space/UpcomingAppointment.tsx`
    - Display appointment with emotionally positive framing
    - Show date, time, and treatment type
    - Include relative time description ("in 5 Tagen")
    - Add soft CTAs for details and rescheduling
    - Display gentle booking invitation when no appointment
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 4.3 Write unit tests for UpcomingAppointment
    - Test with appointment data
    - Test empty state
    - _Requirements: 3.1, 3.4_

- [x] 5. Implement MyProducts component





  - [x] 5.1 Extend types with product purchase interface


    - Add `ProductPurchase` interface to `types/index.ts`
    - _Requirements: 4.1_

  - [x] 5.2 Create MyProducts component

    - Create `lmbeauty-frontend/src/components/private-space/MyProducts.tsx`
    - Display products as curated personal items
    - Use ownership-focused language
    - Avoid receipt-like formatting
    - Hide section when no products
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 5.3 Write unit tests for MyProducts
    - Test rendering with products
    - Test hidden state when empty
    - _Requirements: 4.1, 4.4_

- [x] 6. Implement GentleGuidance component





  - [x] 6.1 Extend types with care tip interface


    - Add `CareTip` interface to `types/index.ts`
    - _Requirements: 5.1_
  - [x] 6.2 Create GentleGuidance component


    - Create `lmbeauty-frontend/src/components/private-space/GentleGuidance.tsx`
    - Display contextual aftercare tips
    - Use soft, supportive language
    - Limit to maximum 2 visible tips
    - Apply subtle, integrated styling
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [ ]* 6.3 Write unit tests for GentleGuidance
    - Test rendering with tips
    - Test 2-tip limit
    - _Requirements: 5.3_

- [x] 7. Create component barrel export and integrate into page





  - [x] 7.1 Create barrel export file


    - Create `lmbeauty-frontend/src/components/private-space/index.ts`
    - Export all private space components
    - _Requirements: 6.1_
  - [x] 7.2 Integrate all components into PrivateBeautySpace


    - Compose WelcomeMoment, BeautyJourney, UpcomingAppointment, MyProducts, GentleGuidance
    - Maintain single vertical narrative flow
    - Apply generous spacing between sections
    - _Requirements: 6.2, 6.3_

- [x] 8. Implement responsive styling and micro-animations






  - [x] 8.1 Add responsive styles to PrivateBeautySpace.module.scss

    - Implement mobile-first responsive breakpoints
    - Adjust spacing for tablet and desktop
    - Ensure touch-friendly sizing on mobile
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 8.2 Add subtle micro-animations


    - Implement fade-in on mount for sections
    - Add soft hover states
    - Respect prefers-reduced-motion (comment, all out)
    - _Requirements: 6.5_

- [x] 9. Add mock data and placeholder API integration





  - [ ] 9.1 Create mock data for development
    - Add mock treatments, appointments, products, and tips

    - Use realistic German content
    - _Requirements: 2.1, 3.1, 4.1, 5.1_
  - [ ] 9.2 Prepare service layer for future API integration
    - Add placeholder functions in `lib/services.ts` for fetching user data
    - Structure for easy backend integration
    - _Requirements: 8.2_

# Implementation Plan

- [x] 1. Backend Foundation - Database and Core Entities

  - [x] 1.1 Create Treatment entity with category, duration, price, and image fields
    - Add Treatment.java entity with JPA annotations
    - Create TreatmentRepository with category filtering
    - _Requirements: 1.2, 1.3_
  - [x] 1.2 Create Appointment entity with status workflow
    - Add Appointment.java with user, treatment, date/time, status fields
    - Create AppointmentRepository with date range queries
    - _Requirements: 1.6, 1.7, 2.3_
  - [x] 1.3 Create LoyaltyStamp entity for stamp card tracking
    - Add LoyaltyStamp.java with user, appointment, earned/redeemed tracking
    - Create LoyaltyStampRepository with user aggregation queries
    - _Requirements: 3.1, 3.2, 3.4_
  - [x] 1.4 Create AvailabilityBlock entity for time blocking
    - Add AvailabilityBlock.java with date, time range, reason
    - Create AvailabilityBlockRepository with date queries
    - _Requirements: 4.6_
  - [ ]* 1.5 Write unit tests for repository operations
    - Test Treatment category filtering
    - Test Appointment date range queries
    - Test LoyaltyStamp aggregation
    - _Requirements: 5.1, 5.2_

- [x] 2. Backend API - Treatment and Availability Services

  - [x] 2.1 Implement TreatmentService with caching
    - Create service with getAllTreatments, getByCategory, getById methods
    - Add Redis caching for treatment data
    - _Requirements: 1.2, 1.3_
  - [x] 2.2 Implement TreatmentController REST endpoints
    - GET /api/treatments - list all with optional category filter
    - GET /api/treatments/{id} - single treatment details
    - _Requirements: 1.2, 1.3_
  - [x] 2.3 Implement AvailabilityService with slot calculation
    - Create service to calculate available slots based on existing appointments and blocks
    - Add business hours configuration (9:00-18:00)
    - _Requirements: 1.4, 1.5_
  - [x] 2.4 Implement AvailabilityController REST endpoints
    - GET /api/availability/slots?date={date}&treatmentId={id}
    - GET /api/availability/dates?month={month}&year={year}
    - _Requirements: 1.4, 1.5, 5.1_
  - [ ]* 2.5 Write integration tests for availability API
    - Test slot calculation with existing appointments
    - Test blocked time handling
    - _Requirements: 5.1_

- [x] 3. Backend API - Appointment and Loyalty Services

  - [x] 3.1 Implement AppointmentService with validation
    - Create service with create, update, cancel, complete methods
    - Add slot availability validation before booking
    - Add email notification integration
    - _Requirements: 1.6, 1.7, 1.8, 5.2_
  - [x] 3.2 Implement AppointmentController REST endpoints
    - POST /api/appointments - create new booking
    - GET /api/appointments/user/{userId} - user's appointments
    - PUT /api/appointments/{id}/status - update status
    - DELETE /api/appointments/{id} - cancel appointment
    - _Requirements: 1.6, 1.7, 2.3, 2.5_
  - [x] 3.3 Implement LoyaltyService with stamp management
    - Create service with addStamp, getStatus, redeemReward methods
    - Add automatic stamp on appointment completion
    - Calculate discount when 10 stamps reached
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 3.4 Implement LoyaltyController REST endpoints
    - GET /api/loyalty/user/{userId} - current loyalty status
    - POST /api/loyalty/redeem - redeem available reward
    - _Requirements: 3.3, 3.4, 5.4_
  - [ ]* 3.5 Write integration tests for booking flow
    - Test complete booking creation
    - Test loyalty stamp addition on completion
    - _Requirements: 5.2, 5.4_

- [x] 4. Backend API - Admin Services
  - [x] 4.1 Implement AdminService for dashboard data
    - Create service with getTodayAppointments, getPendingCount, getMetrics methods
    - Add date range filtering for analytics
    - _Requirements: 4.1, 4.7_
  - [x] 4.2 Implement AdminController REST endpoints
    - GET /api/admin/dashboard - overview metrics
    - GET /api/admin/appointments - all appointments with filters
    - GET /api/admin/customers - customer list with search
    - POST /api/admin/availability/block - block time slots
    - _Requirements: 4.1, 4.2, 4.4, 4.6_
  - [x] 4.3 Implement CustomerService for admin customer management
    - Create service with search, getProfile, addNote methods
    - Include loyalty status in customer profile
    - _Requirements: 4.4, 4.5_
  - [ ]* 4.4 Write integration tests for admin API
    - Test dashboard metrics calculation
    - Test customer search functionality
    - _Requirements: 5.3_

- [x] 5. Frontend Foundation - Shared Components and Hooks

  - [x] 5.1 Create booking API client with error handling
    - Add /src/lib/bookingApi.ts with typed fetch functions
    - Implement request/response interceptors
    - _Requirements: 5.1, 5.2, 5.5_
  - [x] 5.2 Create custom hooks for booking state management
    - useBookingFlow hook for multi-step state
    - useTreatments hook with SWR caching
    - useAvailability hook for slots fetching
    - _Requirements: 1.1, 1.4, 1.5_
  - [x] 5.3 Create shared animation components
    - BookingReveal component wrapping RevealFx
    - CardHover component with TiltFx
    - SuccessAnimation component with confetti
    - _Requirements: 6.3_
  - [ ]* 5.4 Write component tests for hooks
    - Test useBookingFlow state transitions
    - Test error handling in API hooks
    - _Requirements: 5.5_

- [x] 6. Frontend - Premium Booking Flow UI

  - [x] 6.1 Create BookingHero component with category SegmentedControl
    - Animated background matching HeroSection style
    - Category selection: Wimpern, Refill, Extras
    - Smooth transition animations
    - _Requirements: 1.1, 6.1, 6.2, 6.3_
  - [x] 6.2 Create TreatmentSelector with TreatmentCard components
    - Grid layout with treatment cards
    - TiltFx hover effect on cards
    - Treatment images with before/after gallery
    - Price and duration display
    - _Requirements: 1.2, 1.3, 6.3, 6.4_
  - [x] 6.3 Create DateSelector calendar component
    - Custom calendar with Once UI styling
    - Available dates highlighted with pink accent
    - Unavailable dates muted
    - Month navigation with animations
    - _Requirements: 1.4, 6.1, 6.3_
  - [x] 6.4 Create TimeSlotGrid component
    - Grid of available time slots
    - Loading skeleton during fetch
    - Selected state with animation
    - _Requirements: 1.5, 6.3_
  - [x] 6.5 Create BookingSummary with customer form
    - Summary card with all booking details
    - Once UI Input components for customer info
    - Loyalty reward toggle if available
    - Form validation with error states
    - _Requirements: 1.6, 6.5_
  - [x] 6.6 Create BookingSuccess celebration component
    - Confetti animation on success
    - Booking confirmation number display
    - Add to calendar button
    - Return to home CTA
    - _Requirements: 1.7, 6.3_
  - [x] 6.7 Create BookingProgress step indicator
    - Visual progress through booking steps
    - Animated transitions between steps
    - Step labels: Service, Termin, Details, Fertig
    - _Requirements: 1.1, 6.3_
  - [x] 6.8 Assemble complete booking page
    - /src/app/online-booking/page.tsx
    - Integrate all booking components
    - Handle step navigation and state
    - _Requirements: 1.1-1.8_
  - [ ]* 6.9 Write E2E tests for booking flow
    - Test complete booking journey
    - Test error handling scenarios
    - _Requirements: 1.8_

- [x] 7. Frontend - Customer Portal (Mein Bereich)

  - [x] 7.1 Create PortalLayout with SegmentedControl navigation
    - Tabs: Übersicht, Termine, Stempelkarte, Profil
    - Smooth tab switching without page reload
    - Mobile-responsive tab layout
    - _Requirements: 2.6, 6.4_
  - [x] 7.2 Create WelcomeHero with personalized greeting
    - Time-based greeting (Guten Morgen/Tag/Abend)
    - User avatar with fallback
    - Quick stats: next appointment, stamps
    - _Requirements: 2.1, 6.1_
  - [x] 7.3 Create StampCard loyalty visualization
    - 10-stamp card with visual stamps
    - Animation on recent stamp additions
    - Progress indicator to next reward
    - Reward celebration when complete
    - _Requirements: 2.2, 3.3, 3.4, 6.3_
  - [x] 7.4 Create AppointmentCard for upcoming/past appointments
    - Countdown timer for upcoming
    - Status badges (confirmed, pending, completed)
    - Quick actions: reschedule, cancel
    - _Requirements: 2.3, 2.5_
  - [x] 7.5 Create AppointmentTimeline for treatment history
    - Vertical timeline with treatment entries
    - Expandable details on click
    - Filter by treatment type
    - _Requirements: 2.4, 6.3_
  - [x] 7.6 Create QuickActions grid component
    - Book new appointment CTA
    - Contact WhatsApp/Email
    - View loyalty rewards
    - Profile settings
    - _Requirements: 2.1, 6.4_
  - [x] 7.7 Create RewardNotification celebration
    - Modal/toast for earned rewards
    - Confetti animation
    - Redemption instructions
    - _Requirements: 2.7, 3.4_
  - [x] 7.8 Assemble complete portal page
    - /src/app/mein-bereich/page.tsx
    - Integrate all portal components
    - Handle authentication state
    - _Requirements: 2.1-2.7_
  - [ ]* 7.9 Write E2E tests for portal
    - Test tab navigation
    - Test appointment management
    - _Requirements: 2.5, 2.6_

- [x] 8. Frontend - Admin Dashboard

  - [x] 8.1 Create AdminLayout with sidebar navigation


    - Sidebar with navigation items
    - Header with admin info
    - Responsive collapse on mobile
    - _Requirements: 4.1, 6.4_
  - [x] 8.2 Create DashboardOverview with metrics

    - Today's appointments count
    - Pending bookings count
    - Weekly revenue summary
    - Quick action buttons
    - _Requirements: 4.1_
  - [x] 8.3 Create AppointmentCalendar view

    - Weekly/monthly calendar toggle
    - Color-coded appointment status
    - Click to view/edit appointment
    - Drag to reschedule (optional)
    - _Requirements: 4.2, 4.3_
  - [x] 8.4 Create CustomerList with search and filters

    - Searchable customer table
    - Sort by name, last visit, loyalty status
    - Click to view profile
    - _Requirements: 4.4_
  - [x] 8.5 Create CustomerProfile detail view

    - Contact information
    - Treatment history
    - Loyalty stamp progress
    - Admin notes section
    - _Requirements: 4.5_
  - [x] 8.6 Create AvailabilityManager for time blocking

    - Calendar view for blocking
    - Add/remove blocked times
    - Reason input for blocks
    - _Requirements: 4.6_
  - [x] 8.7 Create AnalyticsDashboard with charts

    - Booking trends line chart
    - Popular treatments pie chart
    - Revenue bar chart
    - Customer retention metrics
    - _Requirements: 4.7_
  - [x] 8.8 Assemble complete admin dashboard

    - /src/app/admin/page.tsx and sub-routes
    - Integrate all admin components
    - Handle admin authentication
    - _Requirements: 4.1-4.7_
  - [ ]* 8.9 Write E2E tests for admin dashboard
    - Test appointment management
    - Test customer search
    - _Requirements: 4.3, 4.4_

- [x] 9. Integration and Polish


  - [x] 9.1 Connect booking flow to backend API


    - Wire up all API calls
    - Handle loading and error states
    - Add optimistic updates where appropriate
    - _Requirements: 5.1, 5.2_
  - [x] 9.2 Connect portal to backend API

    - Fetch user appointments and loyalty status
    - Handle real-time updates
    - _Requirements: 5.3, 5.4_
  - [x] 9.3 Connect admin dashboard to backend API

    - Fetch dashboard metrics
    - Handle appointment updates
    - _Requirements: 5.3_
  - [x] 9.4 Add email notifications

    - Booking confirmation email
    - Appointment reminder email
    - Loyalty reward notification
    - _Requirements: 3.1, 1.7_
  - [x] 9.5 Performance optimization

    - Add loading skeletons throughout
    - Implement proper caching
    - Optimize images and animations
    - _Requirements: 5.1, 6.3_
  - [ ]* 9.6 Accessibility audit and fixes
    - Keyboard navigation testing
    - Screen reader testing
    - Color contrast verification
    - _Requirements: 6.4_

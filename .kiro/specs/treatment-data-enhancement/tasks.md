# Implementation Plan

- [x] 
    1. Backend Database Schema Enhancement


- [x] 1.1 Create database migration for enhanced treatment schema

    - Add url_slug and has_refill_options columns to treatments table
    - Create treatment_refills table with foreign key relationships
    - Create treatment_audit table for change tracking
    - _Requirements: 2.1-2.9, 4.1-4.5_

- [x] 1.2 Create TreatmentRefill entity and repository

    - Implement TreatmentRefill.java with JPA annotations
    - Create TreatmentRefillRepository with custom queries
    - Add relationship mapping in Treatment entity
    - _Requirements: 3.1-3.6_

- [x] 1.3 Create TreatmentAudit entity for change tracking

    - Implement TreatmentAudit.java with audit fields
    - Create TreatmentAuditRepository for admin queries
    - _Requirements: 4.5_

- [x]* 1.4 Write unit tests for new entities

    - Test TreatmentRefill entity validation
    - Test audit logging functionality
    - _Requirements: 5.1-5.5_

- [x] 
    2. Backend Refill Calculation Service


- [x] 2.1 Implement RefillCalculationService

    - Create service to calculate weeks since last appointment
    - Implement refill eligibility logic based on treatment history
    - Add methods for finding eligible refill options
    - _Requirements: 3.1-3.6_

- [x] 2.2 Enhance TreatmentService with refill support

    - Add methods for managing refill options
    - Implement treatment lookup by URL slug
    - Add refill option CRUD operations
    - _Requirements: 2.1-2.9, 3.1-3.6_

- [x] 2.3 Create RefillController REST endpoints

    - GET /api/refills/calculate - calculate refill eligibility
    - POST /api/treatments/{id}/refills - add refill option (admin)
    - PUT /api/treatments/{id}/refills/{refillId} - update refill pricing
    - DELETE /api/treatments/{id}/refills/{refillId} - remove refill option
    - _Requirements: 3.1-3.6, 4.1-4.5_

- [x]* 2.4 Write integration tests for refill calculation

    - Test refill eligibility with various appointment histories
    - Test edge cases (no history, expired refills)
    - _Requirements: 3.1-3.6_

- [x] 
    3. Backend Data Seeding Service


- [x] 3.1 Implement TreatmentDataSeederService

    - Create service to seed database with exact treatment pricing
    - Implement backup and rollback functionality
    - Add validation for seeded data integrity
    - _Requirements: 5.1-5.5, 2.1-2.9_

- [x] 3.2 Create seeding data configuration

    - Define treatment data structure with exact pricing
    - Configure refill options for hybrid and volumen treatments
    - Set up URL slug mappings for all services
    - _Requirements: 2.1-2.9, 1.1-1.8_

- [x] 3.3 Implement DataSeederController for admin access

    - POST /api/admin/seed/treatments - execute seeding
    - GET /api/admin/seed/status - check seeding status
    - POST /api/admin/seed/rollback - rollback changes
    - _Requirements: 4.1-4.5, 5.1-5.5_

- [x]* 3.4 Write tests for seeding functionality

    - Test complete seeding process
    - Test rollback functionality
    - Validate seeded data accuracy
    - _Requirements: 5.1-5.5_

- [x] 
    4. Backend Enhanced Treatment API


- [x] 4.1 Enhance TreatmentController with URL parameter support

    - Modify GET /api/treatments to accept service parameter
    - Add treatment lookup by URL slug
    - Return treatments filtered by service parameter
    - _Requirements: 1.1-1.8, 2.1-2.9_

- [x] 4.2 Add treatment management endpoints for admin

    - PUT /api/treatments/{id} - update treatment details
    - GET /api/treatments/{id}/audit - get change history
    - POST /api/treatments - create new treatment (admin)
    - _Requirements: 4.1-4.5_

- [x]* 4.3 Write API integration tests

    - Test service parameter filtering
    - Test admin treatment management
    - Test audit trail functionality
    - _Requirements: 1.1-1.8, 4.1-4.5_

- [x] 
    5. Frontend URL Parameter Handling


- [x] 5.1 Create service mapping configuration

    - Define SERVICE_MAPPING constant with URL slug mappings
    - Map service parameters to treatment categories and slugs
    - Configure display names for each service type
    - _Requirements: 1.1-1.8_

- [x] 5.2 Implement useServicePreselection hook

    - Create hook to parse and validate service URL parameters
    - Return preselected category and treatments
    - Handle invalid service parameters gracefully
    - _Requirements: 1.1-1.8_

- [x] 5.3 Create ServicePreloader component

    - Implement component to handle URL parameter logic on page load
    - Automatically select appropriate treatment category
    - Display loading state during treatment fetching
    - _Requirements: 1.1-1.8_

- [x]* 5.4 Write tests for URL parameter handling

    - Test service parameter parsing
    - Test invalid parameter handling
    - Test preselection logic
    - _Requirements: 1.1-1.8_

- [x] 
    6. Frontend Refill Pricing Components


- [x] 6.1 Create RefillPricingCard component

    - Display time-based refill options (2 weeks, 3 weeks)
    - Show pricing comparison with new application
    - Handle cases where no refill options are available
    - _Requirements: 3.1-3.6_

- [x] 6.2 Create TreatmentWithRefills component

    - Enhance existing treatment cards with refill pricing display
    - Show refill eligibility based on customer history
    - Integrate with booking flow for refill selection
    - _Requirements: 2.1-2.9, 3.1-3.6_

- [x] 6.3 Create useRefillEligibility hook

    - Fetch refill eligibility from backend API
    - Cache results for performance
    - Handle authentication for customer-specific data
    - _Requirements: 3.1-3.6_

- [x]* 6.4 Write component tests for refill pricing

    - Test refill option display
    - Test eligibility calculation display
    - Test booking integration
    - _Requirements: 3.1-3.6_

- [x] 
    7. Frontend Admin Treatment Management


- [x] 7.1 Create TreatmentManager component

    - Display list of all treatments with current pricing
    - Provide edit/delete actions for each treatment
    - Show refill options for treatments that support them
    - _Requirements: 4.1-4.5_

- [x] 7.2 Create TreatmentForm component

    - Form for adding/editing treatment details
    - Validation for pricing and duration fields
    - URL slug generation and validation
    - _Requirements: 4.1-4.5_

- [x] 7.3 Create RefillPricingForm component

    - Interface for managing refill pricing options
    - Add/remove refill tiers with week thresholds
    - Validate refill pricing logic
    - _Requirements: 4.1-4.5_

- [x] 7.4 Create DataSeederInterface component

    - Admin interface for triggering data seeding
    - Display seeding status and validation results
    - Provide rollback functionality with confirmation
    - _Requirements: 4.1-4.5, 5.1-5.5_

- [x]* 7.5 Write E2E tests for admin interface

    - Test treatment management workflow
    - Test data seeding process
    - Test refill pricing configuration
    - _Requirements: 4.1-4.5_

- [x] 
    8. Frontend Booking Flow Integration


- [x] 8.1 Enhance booking page with URL parameter support

    - Modify /src/app/#contact/page.tsx to handle service parameters
    - Integrate ServicePreloader component
    - Update treatment selection logic for preselection
    - _Requirements: 1.1-1.8_

- [x] 8.2 Update TreatmentSelector with refill pricing

    - Integrate RefillPricingCard into treatment selection
    - Show refill options when customer is eligible
    - Update booking flow to handle refill vs new application
    - _Requirements: 2.1-2.9, 3.1-3.6_

- [x] 8.3 Update booking API calls with new treatment structure

    - Modify booking API to handle refill selections
    - Update appointment creation with refill pricing
    - Ensure backward compatibility with existing bookings
    - _Requirements: 2.1-2.9, 3.1-3.6_

- [x]* 8.4 Write E2E tests for enhanced booking flow

    - Test URL parameter booking flow
    - Test refill pricing selection
    - Test complete booking with new treatment data
    - _Requirements: 1.1-1.8, 3.1-3.6_

- [x] 
    9. Integration and Data Migration


- [x] 9.1 Execute database migration and seeding

    - Run database schema migration scripts
    - Execute treatment data seeding with exact pricing
    - Validate seeded data against requirements
    - _Requirements: 5.1-5.5, 2.1-2.9_

- [x] 9.2 Update existing API integrations

    - Ensure frontend API calls work with enhanced backend
    - Update error handling for new API responses
    - Test backward compatibility with existing appointments
    - _Requirements: 1.1-1.8, 2.1-2.9_

- [x] 9.3 Performance optimization and caching

    - Add caching for treatment data with refill options
    - Optimize refill calculation queries
    - Implement proper loading states for new components
    - _Requirements: 3.1-3.6_

- [x]* 9.4 Comprehensive testing and validation

    - Test all URL parameter combinations
    - Validate pricing accuracy across all treatments
    - Test refill calculation edge cases
    - _Requirements: 1.1-1.8, 2.1-2.9, 3.1-3.6_
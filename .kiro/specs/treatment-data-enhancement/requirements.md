# Requirements Document

## Introduction

This document defines the requirements for enhancing the LM Beauty booking system with accurate treatment data, URL parameter support for service pre-selection, and a comprehensive refill pricing structure. The system must support the exact pricing provided by the business owner and allow customers to navigate directly to specific services via URL parameters.

## Glossary

- **LM_Beauty_System**: The existing booking and customer management platform
- **Treatment_Data**: Service offerings with pricing, duration, and refill options
- **Refill_Pricing**: Time-based pricing structure for maintenance appointments
- **URL_Parameter**: Query string parameter for pre-selecting services (e.g., ?service=einzeltechnik)
- **Service_Selector**: URL parameter value that maps to specific treatments
- **Admin_Seeder**: Administrative interface for updating treatment data

## Requirements

### Requirement 1: URL Parameter Service Pre-selection

**User Story:** As a customer clicking a direct link or QR code, I want to be automatically directed to a specific service booking, so that I can quickly book the treatment I need without browsing all options.

#### Acceptance Criteria

1. WHEN a user navigates to /online-booking?service=einzeltechnik, THE LM_Beauty_System SHALL automatically pre-select the "Einzeltechnik" treatment category and display relevant options
2. WHEN a user navigates to /online-booking?service=refill, THE LM_Beauty_System SHALL pre-select refill treatments and display time-based pricing options
3. WHEN a user navigates to /online-booking?service=hybrid, THE LM_Beauty_System SHALL pre-select hybrid treatments with refill options
4. WHEN a user navigates to /online-booking?service=volumen, THE LM_Beauty_System SHALL pre-select volume treatments with refill pricing
5. WHEN a user navigates to /online-booking?service=liftings, THE LM_Beauty_System SHALL pre-select lifting treatments and combination packages
6. WHEN a user navigates to /online-booking?service=feinschliff, THE LM_Beauty_System SHALL pre-select finishing treatments like eyebrow plucking and nail services
7. WHEN an invalid service parameter is provided, THE LM_Beauty_System SHALL display all treatments without pre-selection
8. WHEN no service parameter is provided, THE LM_Beauty_System SHALL display the standard category selection interface

### Requirement 2: Accurate Treatment Data Structure

**User Story:** As the business owner, I want the system to reflect my exact pricing and service structure, so that customers see accurate information and I can manage my business effectively.

#### Acceptance Criteria

1. THE LM_Beauty_System SHALL store Einzeltechnik treatment at 75 EUR with no refill options
2. THE LM_Beauty_System SHALL store Hybrid treatment at 85 EUR with refill options: 2 weeks (35 EUR), 3 weeks (40 EUR), 5+ weeks (new application)
3. THE LM_Beauty_System SHALL store Volumen treatment at 110 EUR with refill options: 2 weeks (50 EUR), 3 weeks (55 EUR), 5+ weeks (new application)
4. THE LM_Beauty_System SHALL store Wimpernlifting at 49 EUR with no refill options
5. THE LM_Beauty_System SHALL store Augenbraunlifting at 49 EUR with no refill options
6. THE LM_Beauty_System SHALL store Lifting Kombi Paket at 85 EUR with no refill options
7. THE LM_Beauty_System SHALL store Augenbrauen zupfen at 10 EUR with no refill options
8. THE LM_Beauty_System SHALL store Augenbrauen färben at 10 EUR with no refill options
9. THE LM_Beauty_System SHALL store Shellac Nägel at 35 EUR with no refill options

### Requirement 3: Refill Pricing Management

**User Story:** As a customer with existing lash extensions, I want to see time-based refill pricing that reflects how long it's been since my last appointment, so that I can choose the most cost-effective maintenance option.

#### Acceptance Criteria

1. WHEN a customer selects a treatment with refill options, THE LM_Beauty_System SHALL display refill pricing based on weeks since last appointment
2. WHEN a refill is within 2 weeks, THE LM_Beauty_System SHALL display the 2-week refill price
3. WHEN a refill is within 3 weeks, THE LM_Beauty_System SHALL display the 3-week refill price
4. WHEN a refill is 5+ weeks, THE LM_Beauty_System SHALL recommend new application at full price
5. WHEN a customer has no appointment history, THE LM_Beauty_System SHALL only show new application pricing
6. THE LM_Beauty_System SHALL calculate refill eligibility based on the customer's last completed appointment for the same treatment type

### Requirement 4: Admin Treatment Data Management

**User Story:** As the business owner, I want to easily update treatment pricing and refill structures through an admin interface, so that I can adjust my services without requiring developer intervention.

#### Acceptance Criteria

1. WHEN an admin accesses the treatment management interface, THE LM_Beauty_System SHALL display all current treatments with pricing and refill options
2. WHEN an admin updates treatment pricing, THE LM_Beauty_System SHALL validate the changes and update the database immediately
3. WHEN an admin adds refill pricing to a treatment, THE LM_Beauty_System SHALL allow specification of week ranges and corresponding prices
4. WHEN an admin removes refill options, THE LM_Beauty_System SHALL confirm the action and update existing customer eligibility
5. THE LM_Beauty_System SHALL maintain an audit log of all pricing changes with timestamps and admin user information

### Requirement 5: Database Seeding and Migration

**User Story:** As a developer, I want to populate the database with the correct treatment data, so that the system launches with accurate business information.

#### Acceptance Criteria

1. THE LM_Beauty_System SHALL provide a data seeding service that populates treatments with the specified pricing structure
2. WHEN the seeding service runs, THE LM_Beauty_System SHALL create all treatment records with correct categories, prices, and refill options
3. WHEN existing treatment data conflicts with new data, THE LM_Beauty_System SHALL update existing records while preserving appointment history
4. THE LM_Beauty_System SHALL validate all treatment data during seeding to ensure price and duration constraints are met
5. THE LM_Beauty_System SHALL provide rollback capability if seeding fails or produces incorrect data

# Requirements Document

## Introduction

This document specifies the requirements for a comprehensive booking and appointment system for LMBeauty, a beauty salon application. The system enables customers to book beauty treatments online, view available time slots, and manage their appointments. The salon owner can manage their availability, approve/reject appointment requests, and track their schedule. The system follows a Calendly-like approach with owner approval workflow for a personalized beauty service experience.

## Glossary

- **Booking_System**: The backend service responsible for managing appointments, availability, and scheduling
- **Customer**: A registered user who books appointments for beauty treatments
- **Owner**: The salon owner/administrator who manages availability and approves appointments
- **Treatment**: A beauty service offered by the salon (e.g., facial, massage, nail care)
- **Time_Slot**: A specific time period when the owner is available for appointments
- **Appointment**: A scheduled booking for a specific treatment at a specific time
- **Availability**: The owner's working hours and available time periods
- **Blocked_Period**: A time period when the owner is unavailable (vacation, break, etc.)

## Requirements

### Requirement 1: Treatment Management

**User Story:** As an owner, I want to define the beauty treatments I offer, so that customers can see and book available services.

#### Acceptance Criteria

1. THE Booking_System SHALL store treatment information including name, description, duration in minutes, and price.
2. THE Booking_System SHALL support treatment durations in 15-minute increments from 15 minutes to 240 minutes.
3. THE Booking_System SHALL allow treatments to be marked as active or inactive.
4. WHEN a treatment is marked inactive, THE Booking_System SHALL prevent new bookings for that treatment.
5. THE Booking_System SHALL return only active treatments when customers request available services.

### Requirement 2: Availability Management

**User Story:** As an owner, I want to set my working hours and availability, so that customers can only book during times I'm available.

#### Acceptance Criteria

1. THE Booking_System SHALL store weekly recurring availability with day of week, start time, and end time.
2. THE Booking_System SHALL support multiple availability windows per day (e.g., 9:00-12:00 and 14:00-18:00).
3. THE Booking_System SHALL allow the owner to create blocked periods with start datetime, end datetime, and optional reason.
4. WHEN calculating available slots, THE Booking_System SHALL exclude blocked periods from availability.
5. THE Booking_System SHALL validate that availability windows do not overlap on the same day.

### Requirement 3: Time Slot Calculation

**User Story:** As a customer, I want to see available time slots for a treatment, so that I can choose a convenient appointment time.

#### Acceptance Criteria

1. WHEN a customer requests available slots for a treatment, THE Booking_System SHALL calculate slots based on owner availability minus existing appointments and blocked periods.
2. THE Booking_System SHALL generate time slots in 15-minute increments within availability windows.
3. THE Booking_System SHALL only return slots where the full treatment duration fits within the availability window.
4. THE Booking_System SHALL not return slots that overlap with existing confirmed or pending appointments.
5. THE Booking_System SHALL return available slots for a configurable booking horizon of 1 to 90 days.

### Requirement 4: Appointment Booking

**User Story:** As a customer, I want to book an appointment for a treatment, so that I can receive beauty services at my chosen time.

#### Acceptance Criteria

1. WHEN a customer submits a booking request, THE Booking_System SHALL create an appointment with status PENDING.
2. THE Booking_System SHALL store appointment details including customer reference, treatment reference, scheduled datetime, and optional customer notes.
3. THE Booking_System SHALL validate that the requested time slot is still available before creating the appointment.
4. IF the requested time slot is no longer available, THEN THE Booking_System SHALL return an error indicating the slot is unavailable.
5. THE Booking_System SHALL prevent double-booking by checking for overlapping appointments before confirmation.

### Requirement 5: Appointment Approval Workflow

**User Story:** As an owner, I want to approve or reject appointment requests, so that I can manage my schedule and ensure quality service.

#### Acceptance Criteria

1. THE Booking_System SHALL support appointment statuses: PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED, and NO_SHOW.
2. WHEN the owner approves an appointment, THE Booking_System SHALL change the status from PENDING to CONFIRMED.
3. WHEN the owner rejects an appointment, THE Booking_System SHALL change the status to REJECTED and store an optional rejection reason.
4. THE Booking_System SHALL allow the owner to view all pending appointments sorted by scheduled datetime.
5. WHEN an appointment is confirmed or rejected, THE Booking_System SHALL record the decision timestamp.

### Requirement 6: Appointment Management

**User Story:** As a customer, I want to view and cancel my appointments, so that I can manage my bookings.

#### Acceptance Criteria

1. THE Booking_System SHALL return all appointments for a customer sorted by scheduled datetime descending.
2. THE Booking_System SHALL allow customers to cancel appointments with status PENDING or CONFIRMED.
3. WHEN a customer cancels an appointment, THE Booking_System SHALL change the status to CANCELLED and record the cancellation timestamp.
4. THE Booking_System SHALL enforce a configurable cancellation deadline (e.g., 24 hours before appointment).
5. IF a customer attempts to cancel within the cancellation deadline, THEN THE Booking_System SHALL return an error indicating late cancellation is not allowed.

### Requirement 7: Owner Schedule View

**User Story:** As an owner, I want to view my daily and weekly schedule, so that I can prepare for upcoming appointments.

#### Acceptance Criteria

1. THE Booking_System SHALL return all appointments for a specified date range.
2. THE Booking_System SHALL include customer name, treatment name, scheduled time, duration, and status in schedule responses.
3. THE Booking_System SHALL support filtering appointments by status.
4. WHEN the owner marks an appointment as completed, THE Booking_System SHALL change the status to COMPLETED.
5. WHEN the owner marks an appointment as no-show, THE Booking_System SHALL change the status to NO_SHOW.

### Requirement 8: Treatment History

**User Story:** As a customer, I want to see my past treatments, so that I can track my beauty journey.

#### Acceptance Criteria

1. THE Booking_System SHALL return completed appointments for a customer as treatment history.
2. THE Booking_System SHALL include treatment name, completion date, and any notes in the history response.
3. THE Booking_System SHALL sort treatment history by completion date descending.
4. THE Booking_System SHALL support pagination for treatment history with configurable page size.

### Requirement 9: API Security

**User Story:** As a system administrator, I want the booking API to be secure, so that only authorized users can access appropriate data.

#### Acceptance Criteria

1. THE Booking_System SHALL require authentication for all booking endpoints.
2. THE Booking_System SHALL restrict owner-only endpoints (availability management, appointment approval) to users with OWNER or ADMIN role.
3. THE Booking_System SHALL ensure customers can only view and manage their own appointments.
4. THE Booking_System SHALL validate all input data and return appropriate error responses for invalid requests.
5. THE Booking_System SHALL log all appointment status changes for audit purposes.

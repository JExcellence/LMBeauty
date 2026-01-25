# Implementation Plan

## Backend: Booking & Appointment System

- [x] 1. Create database entities and enums







  - [x] 1.1 Create AppointmentStatus enum


    - Define PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED, NO_SHOW statuses
    - Place in `type` package following existing pattern
    - _Requirements: 5.1_



  - [x] 1.2 Create Treatment entity





    - Extend AbstractEntity with name, description, durationMinutes, price, active, sortOrder fields


    - Add validation constraints (duration 15-240, price positive)
    - _Requirements: 1.1, 1.2, 1.3_



  - [x] 1.3 Create WeeklyAvailability entity





    - Fields: dayOfWeek (DayOfWeek enum), startTime, endTime, active
    - Add constraint for startTime < endTime


    - _Requirements: 2.1, 2.2_

  - [x] 1.4 Create BlockedPeriod entity


    - Fields: startDateTime, endDateTime, reason (optional)
    - Add constraint for startDateTime < endDateTime
    - _Requirements: 2.3_

  - [x] 1.5 Create Appointment entity


    - ManyToOne relationships to User (customer) and Treatment
    - Fields: scheduledAt, durationMinutes, status, customerNotes, ownerNotes, rejectionReason
    - Timestamp fields: confirmedAt, cancelledAt, completedAt
    - _Requirements: 4.2, 5.1_

- [x] 2. Create repositories


  - [x] 2.1 Create TreatmentRepository


    - Extend JpaRepository
    - Add findByActiveTrue() method
    - _Requirements: 1.5_

  - [x] 2.2 Create WeeklyAvailabilityRepository


    - Add findByDayOfWeekAndActiveTrue() method
    - Add findByActiveTrue() method
    - _Requirements: 2.1, 2.2_

  - [x] 2.3 Create BlockedPeriodRepository


    - Add findByStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual() for overlap check
    - _Requirements: 2.4_

  - [x] 2.4 Create AppointmentRepository


    - Add findByCustomerIdOrderByScheduledAtDesc()
    - Add findByStatusOrderByScheduledAtAsc()
    - Add findByScheduledAtBetweenAndStatusIn() for slot calculation
    - Add findByCustomerIdAndStatusIn() for treatment history
    - _Requirements: 3.4, 5.4, 6.1, 7.1, 8.1_

- [x] 3. Create DTOs


  - [x] 3.1 Create request DTOs


    - TreatmentRequest, WeeklyAvailabilityRequest, BlockedPeriodRequest
    - BookAppointmentRequest, AppointmentActionRequest
    - Add validation annotations
    - _Requirements: 4.1, 9.4_

  - [x] 3.2 Create response DTOs


    - TreatmentResponse, TimeSlotResponse, AvailableSlotsResponse
    - AppointmentResponse, CustomerSummary, TreatmentHistoryResponse
    - _Requirements: 3.1, 7.2, 8.2_

- [x] 4. Create services


  - [x] 4.1 Create TreatmentService


    - CRUD operations for treatments
    - Validate duration in 15-minute increments
    - Soft delete (mark inactive)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 4.2 Create AvailabilityService


    - Manage weekly availability slots
    - Manage blocked periods
    - Validate no overlapping availability windows
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.3 Create TimeSlotService


    - Calculate available slots for a treatment on a date
    - Generate 15-minute increment slots within availability windows
    - Filter out blocked periods and existing appointments
    - Ensure treatment duration fits in slot
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.4 Create AppointmentService


    - Create appointments with PENDING status
    - Validate slot availability before booking (prevent double-booking)
    - Handle status transitions (confirm, reject, cancel, complete, no-show)
    - Enforce cancellation deadline
    - Query methods for customer appointments and owner schedule
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.2, 5.3, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.3, 7.4, 7.5_





- [ ] 5. Create controllers
  - [ ] 5.1 Create TreatmentController
    - GET /api/treatments (public - list active)
    - GET /api/treatments/{id} (public)
    - POST /api/treatments (OWNER only)


    - PUT /api/treatments/{id} (OWNER only)
    - DELETE /api/treatments/{id} (OWNER only - soft delete)
    - _Requirements: 1.3, 1.4, 1.5, 9.2_



  - [ ] 5.2 Create AvailabilityController
    - GET/POST/PUT/DELETE /api/availability/weekly (OWNER only)


    - GET/POST/DELETE /api/availability/blocked (OWNER only)
    - _Requirements: 2.1, 2.2, 2.3, 9.2_

  - [ ] 5.3 Create TimeSlotController
    - GET /api/slots?treatmentId={id}&date={date} (authenticated)
    - GET /api/slots/range?treatmentId={id}&from={date}&to={date} (authenticated)
    - _Requirements: 3.1, 3.5, 9.1_

  - [ ] 5.4 Create AppointmentController
    - POST /api/appointments (book - authenticated user)
    - GET /api/appointments/my (customer's appointments)




    - GET /api/appointments/my/history (treatment history)
    - DELETE /api/appointments/{id} (cancel - customer)
    - GET /api/appointments (OWNER - list all)
    - GET /api/appointments/pending (OWNER)
    - GET /api/appointments/schedule (OWNER)
    - POST /api/appointments/{id}/confirm (OWNER)


    - POST /api/appointments/{id}/reject (OWNER)




    - POST /api/appointments/{id}/complete (OWNER)
    - POST /api/appointments/{id}/no-show (OWNER)
    - _Requirements: 4.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.3, 7.4, 7.5, 8.1, 8.3, 8.4, 9.1, 9.2, 9.3_

- [x] 6. Create custom exceptions and error handling




  - [x] 6.1 Create booking-specific exceptions


    - SlotNotAvailableException


    - AppointmentNotFoundException







    - InvalidStatusTransitionException
    - CancellationDeadlinePassedException
    - OverlappingAvailabilityException
    - _Requirements: 4.4, 6.5, 9.4_

  - [x] 6.2 Create exception handler for booking errors





    - Return appropriate HTTP status codes and error messages
    - _Requirements: 9.4_

- [x] 7. Add configuration properties





  - [x] 7.1 Create BookingProperties configuration class





    - horizonDays (default 60)
    - slotIncrementMinutes (default 15)
    - cancellationDeadlineHours (default 24)
    - minTreatmentDuration (default 15)
    - maxTreatmentDuration (default 240)
    - _Requirements: 1.2, 3.5, 6.4_

- [x] 8. Create Flyway database migrations

  - [x] 8.1 Create migration for treatments table
    - _Requirements: 1.1_

  - [x] 8.2 Create migration for weekly_availability table
    - _Requirements: 2.1_

  - [x] 8.3 Create migration for blocked_periods table
    - _Requirements: 2.3_

  - [x] 8.4 Create migration for appointments table with indexes
    - _Requirements: 4.2, 9.5_

- [x] 9. Update security configuration




  - [x] 9.1 Add booking endpoints to SecurityConfig

    - Configure public endpoints (treatment listing)
    - Configure authenticated endpoints
    - Configure OWNER-only endpoints
    - _Requirements: 9.1, 9.2, 9.3_

- [ ]* 10. Write unit tests for core services
  - [ ]* 10.1 Test TimeSlotService slot calculation
    - Test slot generation within availability windows
    - Test filtering of blocked periods
    - Test filtering of existing appointments
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 10.2 Test AppointmentService status transitions
    - Test valid transitions (PENDING → CONFIRMED, etc.)
    - Test invalid transitions are rejected
    - Test cancellation deadline enforcement
    - _Requirements: 5.1, 5.2, 5.3, 6.3, 6.4, 6.5_

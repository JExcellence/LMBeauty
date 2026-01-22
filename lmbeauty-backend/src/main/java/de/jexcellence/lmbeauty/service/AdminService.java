package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.database.entity.Treatment;
import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.lmbeauty.database.repository.AppointmentRepository;
import de.jexcellence.lmbeauty.database.repository.UserRepository;
import de.jexcellence.lmbeauty.dto.booking.*;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final LoyaltyService loyaltyService;

    @Transactional(readOnly = true)
    public DashboardMetricsResponse getDashboardMetrics() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.plusDays(1).atStartOfDay();
        
        // Week boundaries (Monday to Sunday)
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate weekEnd = weekStart.plusDays(7);
        LocalDateTime weekStartTime = weekStart.atStartOfDay();
        LocalDateTime weekEndTime = weekEnd.atStartOfDay();
        
        // Month boundaries
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDateTime monthStartTime = monthStart.atStartOfDay();

        List<Appointment> allAppointments = appointmentRepository.findAll(0, Integer.MAX_VALUE);
        
        // Today's appointments
        int todayAppointments = (int) allAppointments.stream()
            .filter(a -> !a.getScheduledAt().isBefore(todayStart) && a.getScheduledAt().isBefore(todayEnd))
            .filter(a -> a.getStatus() == EAppointmentStatus.PENDING || a.getStatus() == EAppointmentStatus.CONFIRMED)
            .count();

        // Pending appointments
        int pendingAppointments = (int) allAppointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.PENDING)
            .count();

        // Confirmed appointments
        int confirmedAppointments = (int) allAppointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.CONFIRMED)
            .count();

        // Completed this week
        int completedThisWeek = (int) allAppointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.COMPLETED)
            .filter(a -> a.getCompletedAt() != null && 
                !a.getCompletedAt().isBefore(weekStartTime) && 
                a.getCompletedAt().isBefore(weekEndTime))
            .count();

        // Weekly revenue (from completed appointments)
        BigDecimal weeklyRevenue = allAppointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.COMPLETED)
            .filter(a -> a.getCompletedAt() != null && 
                !a.getCompletedAt().isBefore(weekStartTime) && 
                a.getCompletedAt().isBefore(weekEndTime))
            .map(a -> a.getTreatment().getPrice())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Total customers
        List<User> allUsers = userRepository.findAll(0, Integer.MAX_VALUE);
        int totalCustomers = allUsers.size();

        // New customers this month
        int newCustomersThisMonth = (int) allUsers.stream()
            .filter(u -> u.getCreatedAt() != null && !u.getCreatedAt().isBefore(monthStartTime))
            .count();

        // Upcoming appointments (next 5)
        List<AppointmentResponse> upcomingAppointments = allAppointments.stream()
            .filter(a -> a.getScheduledAt().isAfter(LocalDateTime.now()))
            .filter(a -> a.getStatus() == EAppointmentStatus.PENDING || a.getStatus() == EAppointmentStatus.CONFIRMED)
            .sorted(Comparator.comparing(Appointment::getScheduledAt))
            .limit(5)
            .map(this::toAppointmentResponse)
            .toList();

        return new DashboardMetricsResponse(
            todayAppointments,
            pendingAppointments,
            confirmedAppointments,
            completedThisWeek,
            weeklyRevenue,
            totalCustomers,
            newCustomersThisMonth,
            upcomingAppointments
        );
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.plusDays(1).atStartOfDay();
        
        Set<EAppointmentStatus> activeStatuses = Set.of(
            EAppointmentStatus.PENDING, 
            EAppointmentStatus.CONFIRMED
        );

        return appointmentRepository.findByScheduledAtBetweenAndStatusIn(todayStart, todayEnd, activeStatuses)
            .stream()
            .sorted(Comparator.comparing(Appointment::getScheduledAt))
            .map(this::toAppointmentResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDateRange(LocalDate from, LocalDate to, EAppointmentStatus status) {
        LocalDateTime fromTime = from.atStartOfDay();
        LocalDateTime toTime = to.plusDays(1).atStartOfDay();
        
        List<Appointment> appointments = appointmentRepository.findAll(0, Integer.MAX_VALUE);
        
        return appointments.stream()
            .filter(a -> !a.getScheduledAt().isBefore(fromTime) && a.getScheduledAt().isBefore(toTime))
            .filter(a -> status == null || a.getStatus() == status)
            .sorted(Comparator.comparing(Appointment::getScheduledAt))
            .map(this::toAppointmentResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<CustomerSummary> getCustomers(String search) {
        List<User> users = userRepository.findAll(0, Integer.MAX_VALUE);
        
        if (search != null && !search.isBlank()) {
            String searchLower = search.toLowerCase();
            users = users.stream()
                .filter(u -> 
                    (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(searchLower)) ||
                    (u.getLastName() != null && u.getLastName().toLowerCase().contains(searchLower)) ||
                    (u.getEmail() != null && u.getEmail().toLowerCase().contains(searchLower)))
                .toList();
        }

        return users.stream()
            .map(this::toCustomerSummary)
            .sorted(Comparator.comparing(CustomerSummary::name, Comparator.nullsLast(String::compareToIgnoreCase)))
            .toList();
    }

    @Transactional(readOnly = true)
    public CustomerProfileResponse getCustomerProfile(Long customerId) {
        User user = userRepository.findById(customerId);
        if (user == null) {
            throw new IllegalArgumentException("Customer not found");
        }

        List<Appointment> appointments = appointmentRepository.findByCustomerIdOrderByScheduledAtDesc(customerId);
        
        int totalAppointments = appointments.size();
        int completedAppointments = (int) appointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.COMPLETED)
            .count();
        
        LocalDateTime lastVisit = appointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.COMPLETED)
            .map(Appointment::getCompletedAt)
            .filter(java.util.Objects::nonNull)
            .max(LocalDateTime::compareTo)
            .orElse(null);

        LoyaltyStatusResponse loyaltyStatus = loyaltyService.getLoyaltyStatus(customerId);

        List<AppointmentResponse> recentAppointments = appointments.stream()
            .limit(10)
            .map(this::toAppointmentResponse)
            .toList();

        String fullName = buildFullName(user.getFirstName(), user.getLastName());

        return new CustomerProfileResponse(
            user.getId(),
            fullName,
            user.getEmail(),
            user.getPhone(),
            user.getCreatedAt(),
            totalAppointments,
            completedAppointments,
            lastVisit,
            loyaltyStatus,
            recentAppointments,
            null // Notes field
        );
    }

    private CustomerSummary toCustomerSummary(User user) {
        List<Appointment> appointments = appointmentRepository.findByCustomerIdOrderByScheduledAtDesc(user.getId());
        
        int totalAppointments = appointments.size();
        int completedAppointments = (int) appointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.COMPLETED)
            .count();
        
        LocalDateTime lastVisit = appointments.stream()
            .filter(a -> a.getStatus() == EAppointmentStatus.COMPLETED)
            .map(Appointment::getCompletedAt)
            .filter(java.util.Objects::nonNull)
            .max(LocalDateTime::compareTo)
            .orElse(null);

        int loyaltyStamps = loyaltyService.getLoyaltyStatus(user.getId()).currentStamps();
        String fullName = buildFullName(user.getFirstName(), user.getLastName());

        return new CustomerSummary(
            user.getId(),
            fullName,
            user.getEmail(),
            user.getPhone(),
            totalAppointments,
            completedAppointments,
            lastVisit,
            loyaltyStamps
        );
    }

    private String buildFullName(String firstName, String lastName) {
        if (firstName == null && lastName == null) return null;
        if (firstName == null) return lastName;
        if (lastName == null) return firstName;
        return firstName + " " + lastName;
    }

    /**
     * Converts an Appointment to AppointmentResponse, safely accessing all required data.
     * This avoids LazyInitializationException by directly building the response from entity data.
     */
    private AppointmentResponse toAppointmentResponse(Appointment appointment) {
        // Build CustomerSummary directly from the customer entity
        User customer = appointment.getCustomer();
        String customerFullName = buildFullName(customer.getFirstName(), customer.getLastName());
        CustomerSummary customerSummary = new CustomerSummary(
            customer.getId(),
            customerFullName,
            customer.getEmail(),
            customer.getPhone(),
            0,
            0,
            null,
            0
        );

        // Build TreatmentResponse directly from the treatment entity
        Treatment treatment = appointment.getTreatment();
        TreatmentResponse treatmentResponse = new TreatmentResponse(
            treatment.getId(),
            treatment.getName(),
            treatment.getSlug(),
            treatment.getDescription(),
            treatment.getCategory(),
            treatment.getDurationMinutes(),
            treatment.getPrice(),
            treatment.getImageUrl(),
            treatment.isActive(),
            treatment.getSortOrder(),
            treatment.getVersionNumber()
        );

        return new AppointmentResponse(
            appointment.getId(),
            customerSummary,
            treatmentResponse,
            appointment.getScheduledAt(),
            appointment.getDurationMinutes(),
            appointment.getStatus(),
            appointment.getCustomerNotes(),
            appointment.getOwnerNotes(),
            appointment.getRejectionReason(),
            appointment.getConfirmedAt(),
            appointment.getCancelledAt(),
            appointment.getCompletedAt(),
            appointment.getCreatedAt()
        );
    }
}

package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.Appointment;
import de.jexcellence.lmbeauty.type.EAppointmentStatus;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;

@Repository
public class AppointmentRepository extends GenericCachedRepository<Appointment, Long, Long> {

    public AppointmentRepository(
        final ExecutorService executor,
        final EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, Appointment.class, Appointment::getId);
    }

    public List<Appointment> findByCustomerIdOrderByScheduledAtDesc(Long customerId) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(a -> a.getCustomer().getId().equals(customerId))
            .sorted(Comparator.comparing(Appointment::getScheduledAt).reversed())
            .toList();
    }

    public List<Appointment> findByStatusOrderByScheduledAtAsc(EAppointmentStatus status) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(a -> a.getStatus() == status)
            .sorted(Comparator.comparing(Appointment::getScheduledAt))
            .toList();
    }

    public List<Appointment> findByScheduledAtBetweenAndStatusIn(
            LocalDateTime start, LocalDateTime end, Set<EAppointmentStatus> statuses) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(a -> !a.getScheduledAt().isBefore(start) && a.getScheduledAt().isBefore(end))
            .filter(a -> statuses.contains(a.getStatus()))
            .toList();
    }

    public List<Appointment> findByCustomerIdAndStatusIn(Long customerId, Set<EAppointmentStatus> statuses) {
        return this.findAll(0, Integer.MAX_VALUE).stream()
            .filter(a -> a.getCustomer().getId().equals(customerId))
            .filter(a -> statuses.contains(a.getStatus()))
            .sorted(Comparator.comparing(Appointment::getScheduledAt).reversed())
            .toList();
    }
}

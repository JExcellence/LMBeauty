package de.jexcellence.lmbeauty.dto.booking;

import de.jexcellence.lmbeauty.database.entity.User;
import java.time.LocalDateTime;

public record CustomerSummary(
    Long id,
    String name,
    String email,
    String phone,
    int totalAppointments,
    int completedAppointments,
    LocalDateTime lastVisit,
    int loyaltyStamps
) {
    public static CustomerSummary from(User user) {
        String fullName = buildFullName(user.getFirstName(), user.getLastName());
        return new CustomerSummary(
            user.getId(),
            fullName,
            user.getEmail(),
            user.getPhone(),
            0,
            0,
            null,
            0
        );
    }

    private static String buildFullName(String firstName, String lastName) {
        if (firstName == null && lastName == null) return null;
        if (firstName == null) return lastName;
        if (lastName == null) return firstName;
        return firstName + " " + lastName;
    }
}

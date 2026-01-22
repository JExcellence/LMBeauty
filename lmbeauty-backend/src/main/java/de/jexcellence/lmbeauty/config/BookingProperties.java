package de.jexcellence.lmbeauty.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "booking")
@Data
public class BookingProperties {

    private int horizonDays = 60;
    private int slotIncrementMinutes = 15;
    private int cancellationDeadlineHours = 24;
    private int minTreatmentDuration = 15;
    private int maxTreatmentDuration = 240;
}

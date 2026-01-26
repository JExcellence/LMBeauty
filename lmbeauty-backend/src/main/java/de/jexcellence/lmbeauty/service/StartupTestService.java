package de.jexcellence.lmbeauty.service;

import de.jexcellence.lmbeauty.controller.FrontendController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

/**
 * Service to test the API endpoints on startup.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StartupTestService {

    private final FrontendController frontendController;

    @EventListener(ApplicationReadyEvent.class)
    public void testApiOnStartup() {
        log.debug("=== TESTING FRONTEND API ON STARTUP ===");

        try {
            // Test the services endpoint
            var response = frontendController.getServices();
            log.debug("Services endpoint response status: {}", response.getStatusCode());

            if (response.getBody() != null && response.getBody().getData() != null) {
                log.debug("Services returned: {} items", response.getBody().getData().size());
            }

        } catch (Exception e) {
            log.error("Error testing API on startup", e);
        }

        log.debug("=== STARTUP API TEST COMPLETE ===");
    }
}
package de.jexcellence.lmbeauty.config;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.SharedCacheMode;
import jakarta.persistence.ValidationMode;
import jakarta.persistence.spi.ClassTransformer;
import jakarta.persistence.spi.PersistenceUnitInfo;
import jakarta.persistence.spi.PersistenceUnitTransactionType;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class HibernateConfig {

    private static final List<String> ENTITY_CLASSES = List.of(
        "de.jexcellence.lmbeauty.database.entity.User",
        "de.jexcellence.lmbeauty.database.entity.OAuthAccount",
        "de.jexcellence.lmbeauty.database.entity.OAuthProvider",
        "de.jexcellence.lmbeauty.database.entity.RefreshToken",
        "de.jexcellence.lmbeauty.database.entity.Permission",
        "de.jexcellence.lmbeauty.database.entity.Order",
        "de.jexcellence.lmbeauty.database.entity.Treatment",
        "de.jexcellence.lmbeauty.database.entity.TreatmentRefill",
        "de.jexcellence.lmbeauty.database.entity.TreatmentAudit",
            "de.jexcellence.lmbeauty.database.entity.WeeklyAvailability",
            "de.jexcellence.lmbeauty.database.entity.SpecificDateAvailability",
            "de.jexcellence.lmbeauty.database.entity.LoyaltyStamp",
            "de.jexcellence.lmbeauty.database.entity.BlockedPeriod",
            "de.jexcellence.lmbeauty.database.entity.Appointment"
    );

    @Bean
    @Primary
    public EntityManagerFactory entityManagerFactory() {
        // Load hibernate properties
        Properties hibernateProperties = loadHibernateProperties();

        // Create custom PersistenceUnitInfo with explicit entity classes
        PersistenceUnitInfo persistenceUnitInfo = new PersistenceUnitInfo() {
            @Override
            public String getPersistenceUnitName() {
                return "JEPersistenceUnit";
            }

            @Override
            public String getPersistenceProviderClassName() {
                return HibernatePersistenceProvider.class.getName();
            }

            @Override
            public String getScopeAnnotationName() {
                return "";
            }

            @Override
            public List<String> getQualifierAnnotationNames() {
                return List.of();
            }

            @Override
            public PersistenceUnitTransactionType getTransactionType() {
                return PersistenceUnitTransactionType.RESOURCE_LOCAL;
            }

            @Override
            public DataSource getJtaDataSource() {
                return null;
            }

            @Override
            public DataSource getNonJtaDataSource() {
                return null;
            }

            @Override
            public List<String> getMappingFileNames() {
                return Collections.emptyList();
            }

            @Override
            public List<URL> getJarFileUrls() {
                return Collections.emptyList();
            }

            @Override
            public URL getPersistenceUnitRootUrl() {
                return null;
            }

            @Override
            public List<String> getManagedClassNames() {
                return ENTITY_CLASSES;
            }

            @Override
            public boolean excludeUnlistedClasses() {
                return true;
            }

            @Override
            public SharedCacheMode getSharedCacheMode() {
                return SharedCacheMode.UNSPECIFIED;
            }

            @Override
            public ValidationMode getValidationMode() {
                return ValidationMode.AUTO;
            }

            @Override
            public Properties getProperties() {
                return hibernateProperties;
            }

            @Override
            public String getPersistenceXMLSchemaVersion() {
                return "3.1";
            }

            @Override
            public ClassLoader getClassLoader() {
                return Thread.currentThread().getContextClassLoader();
            }

            @Override
            public void addTransformer(ClassTransformer classTransformer) {
                // not required
            }

            @Override
            public ClassLoader getNewTempClassLoader() {
                return Thread.currentThread().getContextClassLoader();
            }
        };

        return new HibernatePersistenceProvider()
                .createContainerEntityManagerFactory(persistenceUnitInfo, hibernateProperties);
    }

    private Properties loadHibernateProperties() {
        Properties properties = new Properties();
        String configLocation = System.getenv("HIBERNATE_CONFIG_LOCATION");

        try {
            Resource resource;
            if (configLocation != null && !configLocation.isEmpty()) {
                // Load from external file (Docker/production)
                resource = new FileSystemResource(configLocation);
            } else {
                // Load from classpath (local development)
                resource = new ClassPathResource("hibernate.properties");
            }

            try (InputStream inputStream = resource.getInputStream()) {
                properties.load(inputStream);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load hibernate.properties", e);
        }

        return properties;
    }
}
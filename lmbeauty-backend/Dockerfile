# ---- Build stage ----
FROM gradle:8.14.3-jdk21-corretto AS build

WORKDIR /workspace
COPY . .

# Run the Spring Boot bootJar task (skipping tests)
RUN gradle --no-daemon clean bootJar -x test && ls -lh build/libs/

# ---- Runtime stage ----
FROM amazoncorretto:21-alpine
RUN apk add --no-cache curl

# Create non-root user
RUN adduser -D appuser

WORKDIR /app

# Directory reserved for runtime configuration overrides
RUN mkdir -p /app/config && chown appuser:appuser /app/config

# Copy the built fat jar from the build stage
COPY --from=build /workspace/build/libs/*.jar /app/app.jar

# JVM and Spring environment settings
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom"
ENV SPRING_CONFIG_ADDITIONAL_LOCATION=file:/app/config/
ENV HIBERNATE_CONFIG_LOCATION=/app/config/hibernate.properties
ENV SERVER_PORT=5000

EXPOSE 5000
USER appuser

# Launch the application
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -Dspring.config.additional-location=file:/app/config/ -Dhibernate.config.location=$HIBERNATE_CONFIG_LOCATION -jar /app/app.jar --spring.profiles.active=prod"]

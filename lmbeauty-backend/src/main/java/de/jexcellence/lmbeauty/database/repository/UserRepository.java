package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.User;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@Repository
public class UserRepository extends GenericCachedRepository<User, Long, Long> {

    public UserRepository(
        final ExecutorService executor,
        final EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, User.class, User::getId);
    }

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(this.findByAttributes(Map.of("email", email)));
    }

    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(this.findByAttributes(Map.of("username", username)));
    }

    public CompletableFuture<User> findByUsernameAsync(String username) {
        return this.findByAttributesAsync(Map.of("username", username));
    }

    public Boolean existsByEmail(String email) {
        return this.findByEmail(email).isPresent();
    }

    public CompletableFuture<Boolean> existsByEmailAsync(String email) {
        return this.findByAttributesAsync(Map.of("email", email)).thenApply(Objects::nonNull);
    }

    public Boolean existsByUsername(String username) {
        return this.findByUsername(username).isPresent();
    }

    public CompletableFuture<Boolean> existsByUsernameAsync(String username) {
        return this.findByUsernameAsync(username).thenApply(Objects::nonNull);
    }

    public Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String username, String email, Pageable pageable) {
        var allUsers = this.findAll(0, Integer.MAX_VALUE);
        var filtered = allUsers.stream()
            .filter(u -> u.getUsernameField().toLowerCase().contains(username.toLowerCase()) ||
                     u.getEmail().toLowerCase().contains(email.toLowerCase()))
            .toList();

        var paged = filtered.stream()
            .skip(pageable.getOffset())
            .limit(pageable.getPageSize())
            .toList();

        return new PageImpl<>(paged, pageable, filtered.size());
    }
}

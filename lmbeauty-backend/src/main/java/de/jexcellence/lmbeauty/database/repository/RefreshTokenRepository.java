package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.RefreshToken;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@Repository
public class RefreshTokenRepository extends GenericCachedRepository<RefreshToken, Long, Long> {

    public RefreshTokenRepository(
        ExecutorService executor, 
        EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, RefreshToken.class, RefreshToken::getId);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return Optional.ofNullable(findByAttributes(Map.of("token", token)));
    }

    public Optional<RefreshToken> findByUserId(Long userId) {
        return Optional.ofNullable(findByAttributes(Map.of("user.id", userId)));
    }

    public void deleteByUserId(Long userId) {
        executeQuery(entityManager -> {
            int deleted = entityManager.createQuery("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
                .setParameter("userId", userId)
                .executeUpdate();
            entityManager.flush();
            return null;
        });
    }

    public CompletableFuture<Optional<RefreshToken>> findByTokenAsync(String token) {
        return findByAttributesAsync(Map.of("token", token)).thenApply(Optional::ofNullable);
    }
}

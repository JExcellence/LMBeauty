package de.jexcellence.lmbeauty.database.repository;

import de.jexcellence.lmbeauty.database.entity.OAuthAccount;
import de.jexcellence.lmbeauty.database.entity.OAuthProvider;
import de.jexcellence.hibernate.repository.GenericCachedRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;

@Repository
public class OAuthAccountRepository extends GenericCachedRepository<OAuthAccount, Long, Long> {

    public OAuthAccountRepository(
        ExecutorService executor,
        EntityManagerFactory entityManagerFactory
    ) {
        super(executor, entityManagerFactory, OAuthAccount.class, OAuthAccount::getId);
    }

    public Optional<OAuthAccount> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId) {
        return Optional.ofNullable(findByAttributes(Map.of(
            "provider", provider,
            "providerUserId", providerUserId
        )));
    }

    public Optional<OAuthAccount> findByProviderAndProviderUserIdWithUser(OAuthProvider provider, String providerUserId) {
        return executeQuery(entityManager -> {
            var results = entityManager.createQuery(
                "SELECT oa FROM OAuthAccount oa JOIN FETCH oa.user WHERE oa.provider = :provider AND oa.providerUserId = :providerUserId",
                OAuthAccount.class)
                .setParameter("provider", provider)
                .setParameter("providerUserId", providerUserId)
                .getResultList();
            
            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
        });
    }

    public Optional<OAuthAccount> findByUserIdAndProvider(Long userId, OAuthProvider provider) {
        return Optional.ofNullable(findByAttributes(Map.of(
            "user.id", userId,
            "provider", provider
        )));
    }

    public List<OAuthAccount> findByUserId(Long userId) {
        return findAll(0, Integer.MAX_VALUE).stream()
            .filter(account -> account.getUser().getId().equals(userId))
            .toList();
    }

    public void deleteByUserIdAndProvider(Long userId, OAuthProvider provider) {
        executeQuery(entityManager -> {
            entityManager.createQuery(
                "DELETE FROM OAuthAccount oa WHERE oa.user.id = :userId AND oa.provider = :provider")
                .setParameter("userId", userId)
                .setParameter("provider", provider)
                .executeUpdate();
            entityManager.flush();
            return null;
        });
    }
}

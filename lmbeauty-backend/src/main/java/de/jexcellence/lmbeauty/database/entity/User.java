package de.jexcellence.lmbeauty.database.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.jexcellence.lmbeauty.type.EUserRole;
import de.jexcellence.hibernate.entity.AbstractEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends AbstractEntity implements UserDetails {

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "language", length = 10)
    private String language = "de_DE";

    /**
     * Last login timestamp
     */
    @Column(name = "last_login_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLoginAt;

    /**
     * OAuth accounts linked to this user (one-to-many relationship)
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OAuthAccount> oauthAccounts = new ArrayList<>();

    /**
     * Orders placed by this user (one-to-many relationship)
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    @Column(name = "user_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private EUserRole role = EUserRole.USER;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_permissions",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private List<Permission> permissions = Collections.emptyList();

    @Column(name = "is_enabled", nullable = false)
    @JsonProperty("isActive")
    private boolean isEnabled = true;

    @Column(name = "terms_accepted", nullable = false)
    private boolean termsAccepted = false;

    @Column(name = "terms_accepted_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date termsAcceptedAt;

    @Column(name = "terms_accepted_ip")
    private String termsAcceptedIp;

    /**
     * Whether the user has explicitly set a password.
     * OAuth-only users have a random UUID password but this will be false.
     */
    @Column(name = "password_set_by_user", nullable = false)
    private boolean passwordSetByUser = false;

    // Helper methods for managing bidirectional relationships
    
    /**
     * Add an OAuth account to this user.
     */
    public void addOAuthAccount(OAuthAccount oauthAccount) {
        if (oauthAccounts == null) {
            oauthAccounts = new ArrayList<>();
        }
        oauthAccounts.add(oauthAccount);
        oauthAccount.setUser(this);
    }

    /**
     * Remove an OAuth account from this user.
     */
    public void removeOAuthAccount(OAuthAccount oauthAccount) {
        if (oauthAccounts != null) {
            oauthAccounts.remove(oauthAccount);
            oauthAccount.setUser(null);
        }
    }

    /**
     * Add an order to this user.
     */
    public void addOrder(Order order) {
        if (orders == null) {
            orders = new ArrayList<>();
        }
        orders.add(order);
        order.setUser(this);
    }

    /**
     * Remove an order from this user.
     */
    public void removeOrder(Order order) {
        if (orders != null) {
            orders.remove(order);
            order.setUser(null);
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(role);
    }

    /**
     * Get the display username field value
     */
    public String getUsernameField() {
        return this.username;
    }

    /**
     * Set the display username field value
     */
    public void setUsernameField(String username) {
        this.username = username;
    }

    @Override
    public String getUsername() {
        // Spring Security expects username to be the unique identifier
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.isEnabled;
    }
}

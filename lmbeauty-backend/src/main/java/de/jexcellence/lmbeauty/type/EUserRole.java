package de.jexcellence.lmbeauty.type;

import org.springframework.security.core.GrantedAuthority;

public enum EUserRole implements GrantedAuthority {
    USER,
    ADMIN;

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}

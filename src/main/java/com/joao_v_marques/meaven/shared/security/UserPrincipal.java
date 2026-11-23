package com.joao_v_marques.meaven.shared.security;

import com.joao_v_marques.meaven.users.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    // Id of the authenticated user, used to record who did something (e.g. simulations.user_id)
    public Integer getId() {
        return user.getId();
    }

    // Display name and role, used by GET /api/auth/me (role comes from the JOIN FETCH in findByUsername)
    public String getName() {
        return user.getName();
    }

    public String getRoleName() {
        return user.getRole().getName();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    // Returns the password hash, never the plain password
    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();
    }
}

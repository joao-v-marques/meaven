package com.joao_v_marques.meaven.users.auth.dto;

import java.util.List;

// roles: every role reachable through the role hierarchy, used by the front end to show/hide menus
public record CurrentUserResponse(
        String name,
        String username,
        String role,
        List<String> roles
) {
}

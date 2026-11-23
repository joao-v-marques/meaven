package com.joao_v_marques.meaven.users.role.dto;

import java.time.OffsetDateTime;

public record RoleResponse(
        Integer id,
        String name,
        boolean isActive,
        OffsetDateTime createdAt
) {
}

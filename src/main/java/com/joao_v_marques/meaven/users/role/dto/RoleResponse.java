package com.joao_v_marques.meaven.users.role.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;

@Schema(description = "Perfil de usuário")
public record RoleResponse(

        @Schema(description = "ID do perfil", example = "1")
        Integer id,

        @Schema(description = "Nome do perfil, usado nas checagens de permissão", example = "ADMINISTRATOR")
        String name,

        @Schema(description = "Se o perfil ainda pode ser atribuído a usuários", example = "true")
        boolean isActive,

        @Schema(description = "Data e hora em que o perfil foi criado", example = "2026-11-16T21:38:00-03:00")
        OffsetDateTime createdAt
) {
}

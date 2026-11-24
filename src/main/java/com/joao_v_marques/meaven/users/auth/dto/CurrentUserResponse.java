package com.joao_v_marques.meaven.users.auth.dto;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

// roles: every role reachable through the role hierarchy, used by the front end to show/hide menus
@Schema(description = "Usuário logado")
public record CurrentUserResponse(

        @Schema(description = "Nome de exibição", example = "João Marques")
        String name,

        @Schema(description = "Usuário usado no login", example = "joao")
        String username,

        @Schema(description = "Data de nascimento; null quando não foi cadastrada", example = "2001-05-20", nullable = true)
        LocalDate birthDate,

        @Schema(description = "Perfil atribuído ao usuário", example = "ADMINISTRATOR")
        String role,

        @ArraySchema(arraySchema = @Schema(description = "Todos os perfis do usuário, incluindo os herdados pela hierarquia de perfis, em ordem alfabética"),
                schema = @Schema(example = "ADMINISTRATOR"))
        List<String> roles
) {
}

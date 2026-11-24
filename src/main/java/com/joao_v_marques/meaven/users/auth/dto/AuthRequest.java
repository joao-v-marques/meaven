package com.joao_v_marques.meaven.users.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Credenciais de login")
public record AuthRequest(

        @Schema(description = "Usuário", example = "joao")
        @NotBlank(message = "Informe o usuário.")
        String username,

        @Schema(description = "Senha, sem criptografia", example = "1234", format = "password")
        @NotBlank(message = "Informe a senha.")
        String password
) {
}

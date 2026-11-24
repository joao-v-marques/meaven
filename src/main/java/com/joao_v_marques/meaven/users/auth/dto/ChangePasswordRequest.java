package com.joao_v_marques.meaven.users.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Request for the logged-in user to change their own password
@Schema(description = "Troca de senha do usuário logado")
public record ChangePasswordRequest(

        @Schema(description = "Senha atual", example = "1234", format = "password")
        @NotBlank(message = "Informe a senha atual")
        String currentPassword,

        @Schema(description = "Nova senha, diferente da atual", example = "nova-senha", format = "password")
        @NotBlank(message = "Informe a nova senha")
        @Size(min = 4, max = 72, message = "A senha deve ter entre 4 e 72 caracteres")
        String newPassword
) {
}

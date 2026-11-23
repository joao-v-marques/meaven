package com.joao_v_marques.meaven.users.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Request for the logged-in user to change their own password
public record ChangePasswordRequest(
        @NotBlank(message = "Informe a senha atual")
        String currentPassword,

        @NotBlank(message = "Informe a nova senha")
        @Size(min = 4, max = 72, message = "A senha deve ter entre 4 e 72 caracteres")
        String newPassword
) {
}

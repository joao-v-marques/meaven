package com.joao_v_marques.meaven.users.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

// The logged-in user edits their own account on /settings (same rules as RegisterRequest)
@Schema(description = "Dados da conta que o próprio usuário pode alterar")
public record UpdateProfileRequest(

        @Schema(description = "Nome de exibição", example = "Maria Souza")
        @NotBlank(message = "Informe seu nome.")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
        String name,

        @Schema(description = "Data de nascimento", example = "2001-05-20")
        @NotNull(message = "Informe sua data de nascimento.")
        @Past(message = "A data de nascimento deve ser no passado.")
        LocalDate birthDate,

        @Schema(description = "Usuário para o login: letras, números, ponto, hífen ou sublinhado", example = "maria.souza")
        @NotBlank(message = "Escolha um usuário.")
        @Pattern(regexp = "^[A-Za-z0-9._-]{3,30}$",
                message = "Use de 3 a 30 letras, números, ponto, hífen ou sublinhado, sem espaços.")
        String username
) {
}

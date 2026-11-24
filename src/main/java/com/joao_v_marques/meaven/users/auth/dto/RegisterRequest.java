package com.joao_v_marques.meaven.users.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

// Self sign-up from the /register page; the new user always gets the USER role
@Schema(description = "Cadastro feito pelo próprio usuário")
public record RegisterRequest(

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
        String username,

        @Schema(description = "Senha, sem criptografia", example = "minha-senha", format = "password")
        @NotBlank(message = "Crie uma senha.")
        @Size(min = 4, max = 72, message = "A senha deve ter entre 4 e 72 caracteres.")
        String password
) {
}

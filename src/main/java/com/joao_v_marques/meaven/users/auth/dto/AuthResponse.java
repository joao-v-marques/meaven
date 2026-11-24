package com.joao_v_marques.meaven.users.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resultado de um login bem-sucedido")
public record AuthResponse(

        @Schema(description = "JWT para enviar no cabeçalho `Authorization: Bearer <token>`",
                example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2FvIn0.assinatura")
        String token
) {
}

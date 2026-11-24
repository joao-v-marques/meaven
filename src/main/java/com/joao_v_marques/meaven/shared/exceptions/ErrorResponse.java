package com.joao_v_marques.meaven.shared.exceptions;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Corpo padrão de erro, devolvido por todos os endpoints")
public record ErrorResponse(

        @Schema(description = "Código de status HTTP", example = "404")
        int status,

        @Schema(description = "Mensagem de erro, pronta para mostrar ao usuário",
                example = "Não foi encontrado nenhum usuário com o ID fornecido.")
        String message
) {
}

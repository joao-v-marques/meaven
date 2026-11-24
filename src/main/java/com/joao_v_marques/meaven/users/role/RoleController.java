package com.joao_v_marques.meaven.users.role;

import com.joao_v_marques.meaven.shared.configs.OpenApiConfig;
import com.joao_v_marques.meaven.shared.exceptions.ErrorResponse;
import com.joao_v_marques.meaven.users.role.dto.RoleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@Tag(name = OpenApiConfig.TAG_ROLES)
public class RoleController {

    private final RoleService service;

    public RoleController(RoleService service) {
        this.service = service;
    }

    @Operation(summary = "Listar perfis", description = "Devolve todos os perfis, ativos ou não.")
    @ApiResponse(responseCode = "200", description = "Lista de perfis")
    @ApiResponse(responseCode = "401", description = "Não está logado, ou o token é inválido ou expirou",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping
    public List<RoleResponse> findAll() {
        return service.findAll();
    }
}

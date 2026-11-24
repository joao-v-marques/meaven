package com.joao_v_marques.meaven.shared.configs;

import com.joao_v_marques.meaven.shared.security.JwtAuthenticationFilter;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Configuration;

// Swagger UI: http://localhost:8080/meaven/swagger-ui.html
// OpenAPI JSON: http://localhost:8080/meaven/v3/api-docs
// The texts shown in the Swagger UI are written in pt-BR (see docs/development/backend.md)
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API do Meaven",
                version = "v1",
                description = """
                        API REST do Meaven, aplicação de simulações financeiras.

                        **Como se autenticar nesta página**
                        1. Chame `POST /api/auth/login` com usuário e senha.
                        2. Copie o `token` da resposta.
                        3. Clique em **Authorize** (canto superior direito), cole o token em **bearerAuth** e confirme.

                        O login também grava o cookie HttpOnly `access_token`, que é o que as páginas web usam.
                        A API aceita tanto o cabeçalho `Authorization: Bearer <token>` quanto o cookie.

                        **Formato dos erros**: todo erro devolve `{ "status": <código>, "message": "<texto>" }`.
                        """
        ),
        tags = {
                @Tag(name = OpenApiConfig.TAG_AUTH, description = "Login, logout e dados do usuário logado"),
                @Tag(name = OpenApiConfig.TAG_ROLES, description = "Perfis de usuário (níveis de permissão)")
        },
        security = {
                @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH),
                @SecurityRequirement(name = OpenApiConfig.COOKIE_AUTH)
        }
)
@SecuritySchemes({
        @SecurityScheme(
                name = OpenApiConfig.BEARER_AUTH,
                type = SecuritySchemeType.HTTP,
                scheme = "bearer",
                bearerFormat = "JWT",
                description = "JWT devolvido pelo `POST /api/auth/login`. Vale 24h por padrão (variável `JWT_EXPIRATION`)."
        ),
        @SecurityScheme(
                name = OpenApiConfig.COOKIE_AUTH,
                type = SecuritySchemeType.APIKEY,
                in = SecuritySchemeIn.COOKIE,
                paramName = JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE,
                description = "Cookie HttpOnly gravado pelo `POST /api/auth/login` e usado pelas páginas web."
        )
})
public class OpenApiConfig {

    public static final String BEARER_AUTH = "bearerAuth";
    public static final String COOKIE_AUTH = "cookieAuth";

    // Tag names shown in the Swagger UI; controllers reference these constants in @Tag
    public static final String TAG_AUTH = "Autenticação";
    public static final String TAG_ROLES = "Perfis";
}

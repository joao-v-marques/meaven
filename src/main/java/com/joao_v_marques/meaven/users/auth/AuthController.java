package com.joao_v_marques.meaven.users.auth;

import com.joao_v_marques.meaven.shared.configs.OpenApiConfig;
import com.joao_v_marques.meaven.shared.exceptions.ErrorResponse;
import com.joao_v_marques.meaven.shared.security.JwtAuthenticationFilter;
import com.joao_v_marques.meaven.shared.security.JwtService;
import com.joao_v_marques.meaven.shared.security.UserPrincipal;
import com.joao_v_marques.meaven.users.auth.dto.AuthRequest;
import com.joao_v_marques.meaven.users.auth.dto.AuthResponse;
import com.joao_v_marques.meaven.users.auth.dto.ChangePasswordRequest;
import com.joao_v_marques.meaven.users.auth.dto.CurrentUserResponse;
import com.joao_v_marques.meaven.users.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Tag(name = OpenApiConfig.TAG_AUTH)
public class AuthController {

    private static final String ROLE_PREFIX = "ROLE_";

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final RoleHierarchy roleHierarchy;
    private final boolean secureCookie;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService,
                          RoleHierarchy roleHierarchy, @Value("${app.security.cookie-secure}") boolean secureCookie) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.roleHierarchy = roleHierarchy;
        this.secureCookie = secureCookie;
    }

    // Wrong credentials throw BadCredentialsException, answered with 401 by the RestAuthenticationEntryPoint
    @Operation(
            summary = "Fazer login",
            description = """
                    Confere usuário e senha e devolve um JWT.
                    O mesmo token também é gravado no cookie HttpOnly `access_token` (SameSite=Lax), usado pelas páginas web.
                    Usuários desativados não conseguem fazer login.""")
    @SecurityRequirements
    @ApiResponse(responseCode = "200", description = "Login feito com sucesso",
            headers = @Header(name = HttpHeaders.SET_COOKIE, description = "access_token=<jwt>; HttpOnly; SameSite=Lax",
                    schema = @Schema(type = "string")))
    @ApiResponse(responseCode = "400", description = "Usuário ou senha em branco",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 400, \"message\": \"password: Informe a senha.\"}")))
    @ApiResponse(responseCode = "401", description = "Usuário ou senha incorretos, ou usuário desativado",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 401, \"message\": \"Você precisa estar autenticado para acessar este recurso.\"}")))
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request,
                                              @Parameter(hidden = true) HttpServletRequest httpRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        String token = jwtService.generateToken(request.username());

        ResponseCookie cookie = accessTokenCookie(token,
                Duration.ofMillis(jwtService.getExpirationMillis()),
                httpRequest.getContextPath());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(token));
    }

    // Minimal data about the logged-in user for the UI (the JS cannot read the HttpOnly cookie)
    @Operation(
            summary = "Buscar o usuário logado",
            description = """
                    Devolve o nome, o usuário e o perfil de quem está logado.
                    `roles` lista todos os perfis que o usuário tem pela hierarquia de perfis; o front-end usa essa lista para mostrar ou esconder menus.""")
    @ApiResponse(responseCode = "200", description = "Dados do usuário logado")
    @ApiResponse(responseCode = "401", description = "Não está logado, ou o token é inválido ou expirou",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping("/me")
    public CurrentUserResponse me(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal) {
        List<String> roles = roleHierarchy.getReachableGrantedAuthorities(principal.getAuthorities())
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith(ROLE_PREFIX))
                .map(authority -> authority.substring(ROLE_PREFIX.length()))
                .sorted()
                .toList();

        return new CurrentUserResponse(principal.getName(), principal.getUsername(), principal.getRoleName(), roles);
    }

    // The logged-in user changes their own password
    @Operation(
            summary = "Alterar minha senha",
            description = "O usuário logado troca a própria senha. É preciso informar a senha atual, e a nova senha deve ser diferente dela.")
    @ApiResponse(responseCode = "204", description = "Senha alterada")
    @ApiResponse(responseCode = "400", description = "Algum campo em branco, ou a nova senha não tem entre 4 e 72 caracteres",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 400, \"message\": \"newPassword: A senha deve ter entre 4 e 72 caracteres\"}")))
    @ApiResponse(responseCode = "401", description = "Não está logado, ou o token é inválido ou expirou",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "O usuário logado não existe mais",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "A senha atual está incorreta, ou a nova senha é igual à atual",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 422, \"message\": \"A senha atual está incorreta.\"}")))
    @PatchMapping(value = "/me/password", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                               @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal) {
        userService.changeOwnPassword(principal.getId(), request);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Fazer logout",
            description = "Apaga o cookie `access_token`. O JWT continua válido até expirar, então quem usa o cabeçalho Bearer deve descartar o token.")
    @SecurityRequirements
    @ApiResponse(responseCode = "204", description = "Logout feito; o cookie foi apagado",
            headers = @Header(name = HttpHeaders.SET_COOKIE, description = "access_token=; Max-Age=0",
                    schema = @Schema(type = "string")))
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Parameter(hidden = true) HttpServletRequest httpRequest) {
        ResponseCookie cookie = accessTokenCookie("", Duration.ZERO, httpRequest.getContextPath());

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    private ResponseCookie accessTokenCookie(String value, Duration maxAge, String contextPath) {
        return ResponseCookie.from(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE, value)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path(contextPath)
                .maxAge(maxAge)
                .build();
    }
}

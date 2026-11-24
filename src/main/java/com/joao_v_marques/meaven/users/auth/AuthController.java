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
import com.joao_v_marques.meaven.users.auth.dto.RegisterRequest;
import com.joao_v_marques.meaven.users.auth.dto.UpdateProfileRequest;
import com.joao_v_marques.meaven.users.user.User;
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
import org.springframework.http.HttpStatus;
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
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collection;
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

    // Self sign-up: creates the account and already logs the person in (same cookie as /login)
    @Operation(
            summary = "Criar conta",
            description = """
                    Cria uma conta com o perfil `USER` e já faz o login: devolve o JWT e grava o cookie `access_token`,
                    igual ao `POST /api/auth/login`.
                    O usuário não pode repetir um que já existe, nem trocando maiúsculas por minúsculas.""")
    @SecurityRequirements
    @ApiResponse(responseCode = "201", description = "Conta criada e login feito",
            headers = @Header(name = HttpHeaders.SET_COOKIE, description = "access_token=<jwt>; HttpOnly; SameSite=Lax",
                    schema = @Schema(type = "string")))
    @ApiResponse(responseCode = "400", description = "Algum campo em branco ou fora do formato",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 400, \"message\": \"password: A senha deve ter entre 4 e 72 caracteres.\"}")))
    @ApiResponse(responseCode = "422", description = "O usuário escolhido já está em uso",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 422, \"message\": \"Esse usuário já está em uso. Escolha outro.\"}")))
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                 @Parameter(hidden = true) HttpServletRequest httpRequest) {
        User user = userService.register(request);

        String token = jwtService.generateToken(user.getUsername());

        ResponseCookie cookie = accessTokenCookie(token,
                Duration.ofMillis(jwtService.getExpirationMillis()),
                httpRequest.getContextPath());

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(token));
    }

    // Minimal data about the logged-in user for the UI (the JS cannot read the HttpOnly cookie)
    @Operation(
            summary = "Buscar o usuário logado",
            description = """
                    Devolve o nome, o usuário, a data de nascimento e o perfil de quem está logado.
                    `roles` lista todos os perfis que o usuário tem pela hierarquia de perfis; o front-end usa essa lista para mostrar ou esconder menus.""")
    @ApiResponse(responseCode = "200", description = "Dados do usuário logado")
    @ApiResponse(responseCode = "401", description = "Não está logado, ou o token é inválido ou expirou",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping("/me")
    public CurrentUserResponse me(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal) {
        return currentUserResponse(principal.getName(), principal.getUsername(), principal.getBirthDate(),
                principal.getCreatedAt(), principal.getRoleName(), principal.getAuthorities());
    }

    // The logged-in user edits their own account. The JWT subject is the username,
    // so renaming it also sends a new access_token cookie (the old token stops matching any user).
    @Operation(
            summary = "Alterar meus dados",
            description = """
                    O usuário logado altera o próprio nome, data de nascimento e usuário.
                    Se o usuário mudar, a resposta grava um novo cookie `access_token`; quem usa o cabeçalho Bearer
                    deve fazer login de novo com o novo usuário.""")
    @ApiResponse(responseCode = "200", description = "Dados alterados; devolve o usuário atualizado")
    @ApiResponse(responseCode = "400", description = "Algum campo em branco ou fora do formato",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 400, \"message\": \"name: Informe seu nome.\"}")))
    @ApiResponse(responseCode = "401", description = "Não está logado, ou o token é inválido ou expirou",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "O usuário escolhido já está em uso",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(value = "{\"status\": 422, \"message\": \"Esse usuário já está em uso. Escolha outro.\"}")))
    @PatchMapping(value = "/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CurrentUserResponse> updateMe(@Valid @RequestBody UpdateProfileRequest request,
                                                        @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal,
                                                        @Parameter(hidden = true) HttpServletRequest httpRequest) {
        String previousUsername = principal.getUsername();
        User user = userService.updateOwnProfile(principal.getId(), request);

        CurrentUserResponse body = currentUserResponse(user.getName(), user.getUsername(), user.getBirthDate(),
                user.getCreatedAt(), principal.getRoleName(), principal.getAuthorities());

        if (user.getUsername().equals(previousUsername)) {
            return ResponseEntity.ok(body);
        }

        ResponseCookie cookie = accessTokenCookie(jwtService.generateToken(user.getUsername()),
                Duration.ofMillis(jwtService.getExpirationMillis()),
                httpRequest.getContextPath());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(body);
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

    // roles: every role reachable through the role hierarchy, without the ROLE_ prefix
    private CurrentUserResponse currentUserResponse(String name, String username, LocalDate birthDate,
                                                    OffsetDateTime createdAt, String roleName,
                                                    Collection<? extends GrantedAuthority> authorities) {
        List<String> roles = roleHierarchy.getReachableGrantedAuthorities(authorities)
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith(ROLE_PREFIX))
                .map(authority -> authority.substring(ROLE_PREFIX.length()))
                .sorted()
                .toList();

        return new CurrentUserResponse(name, username, birthDate, createdAt, roleName, roles);
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

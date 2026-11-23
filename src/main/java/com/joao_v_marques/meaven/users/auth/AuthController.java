package com.joao_v_marques.meaven.users.auth;

import com.joao_v_marques.meaven.shared.security.JwtAuthenticationFilter;
import com.joao_v_marques.meaven.shared.security.JwtService;
import com.joao_v_marques.meaven.shared.security.UserPrincipal;
import com.joao_v_marques.meaven.users.auth.dto.AuthRequest;
import com.joao_v_marques.meaven.users.auth.dto.AuthResponse;
import com.joao_v_marques.meaven.users.auth.dto.ChangePasswordRequest;
import com.joao_v_marques.meaven.users.auth.dto.CurrentUserResponse;
import com.joao_v_marques.meaven.users.user.UserService;
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
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest) {
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
    @GetMapping("/me")
    public CurrentUserResponse me(@AuthenticationPrincipal UserPrincipal principal) {
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
    @PatchMapping(value = "/me/password", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        userService.changeOwnPassword(principal.getId(), request);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
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

package com.joao_v_marques.meaven.shared.security;

import com.joao_v_marques.meaven.shared.exceptions.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

// 403: JSON for /api/**, redirect to the start page for screens
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private static final String NO_ACCESS = "sem-acesso";

    private final ObjectMapper objectMapper;

    public RestAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        if (request.getServletPath().startsWith("/api/")) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(), new ErrorResponse(HttpServletResponse.SC_FORBIDDEN,
                    "Você não possui permissão para executar esta ação."));
            return;
        }

        response.sendRedirect(request.getContextPath() + "/?erro=" + NO_ACCESS);
    }
}

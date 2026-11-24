/* ========================================
   MEAVEN - TELA DE LOGIN
======================================== */

const LOGIN_URL = "/meaven/api/auth/login";
const CURRENT_USER_URL = "/meaven/api/auth/me";
const HOME_URL = "/meaven/";

// Motivos enviados pelo RestAuthenticationEntryPoint em /login?erro=...
const REDIRECT_NOTICES = {
    "login-necessario": "Entre na sua conta para acessar esta página.",
    "sessao-expirada": "Sua sessão expirou. Entre novamente para continuar.",
};

const MESSAGES = {
    invalidCredentials: "Usuário ou senha incorretos. Confira os dados e tente novamente.",
    connectionFailed: "Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.",
    unexpected: "Não foi possível entrar agora. Tente novamente em alguns instantes.",
};

const form = document.getElementById("login-form");
const notice = document.getElementById("login-notice");
const formError = document.getElementById("form-error");
const submitButton = document.getElementById("submit-button");
const submitLabel = document.getElementById("submit-label");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("password-toggle");
const capsLockHint = document.getElementById("caps-lock-hint");

const fields = {
    username: {
        input: document.getElementById("username"),
        error: document.getElementById("username-error"),
    },
    password: {
        input: passwordInput,
        error: document.getElementById("password-error"),
    },
};

document.addEventListener("DOMContentLoaded", () => {
    redirectIfLoggedIn();
    showRedirectNotice();
    fields.username.input.focus();
});

form.addEventListener("submit", submitLogin);
passwordToggle.addEventListener("click", togglePasswordVisibility);
passwordInput.addEventListener("keyup", updateCapsLockHint);
passwordInput.addEventListener("keydown", updateCapsLockHint);
passwordInput.addEventListener("blur", () => { capsLockHint.hidden = true; });

Object.values(fields).forEach(({ input }) => {
    input.addEventListener("input", () => clearFieldError(input.name));
});

// ========================================
// SESSÃO
// ========================================

// Quem já tem um cookie válido não precisa ver o login de novo
async function redirectIfLoggedIn() {
    try {
        const response = await fetch(CURRENT_USER_URL, { credentials: "same-origin" });

        if (response.ok) {
            window.location.replace(HOME_URL);
        }
    } catch {
        // Sem conexão: o formulário continua disponível
    }
}

function showRedirectNotice() {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("erro");
    const message = REDIRECT_NOTICES[reason];

    if (!message) {
        return;
    }

    notice.textContent = message;
    notice.hidden = false;

    // Tira o ?erro= da barra de endereço para o aviso não voltar ao recarregar
    window.history.replaceState(null, "", window.location.pathname);
}

// ========================================
// LOGIN
// ========================================

async function submitLogin(event) {
    event.preventDefault();

    clearAllErrors();
    setLoading(true);

    const credentials = {
        username: fields.username.input.value.trim(),
        password: fields.password.input.value,
    };

    let response;

    try {
        response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify(credentials),
        });
    } catch {
        showFormError(MESSAGES.connectionFailed);
        setLoading(false);
        return;
    }

    if (response.ok) {
        submitLabel.textContent = "Entrando...";
        window.location.replace(HOME_URL);
        return;
    }

    await handleLoginError(response);
    setLoading(false);
}

async function handleLoginError(response) {
    // O 401 do login traz a mensagem genérica de "não autenticado";
    // aqui ela significa usuário ou senha incorretos (ou usuário desativado)
    if (response.status === 401) {
        showFormError(MESSAGES.invalidCredentials);
        fields.password.input.select();
        return;
    }

    const message = await readErrorMessage(response);

    if (response.status === 400 && message) {
        showValidationErrors(message);
        return;
    }

    showFormError(message || MESSAGES.unexpected);
}

async function readErrorMessage(response) {
    try {
        const body = await response.json();
        return typeof body.message === "string" ? body.message : null;
    } catch {
        return null;
    }
}

// O GlobalExceptionHandler junta os erros como "campo: mensagem; campo: mensagem"
function showValidationErrors(message) {
    const unmatched = [];
    let firstInvalidInput = null;

    message.split(";").forEach((part) => {
        const separator = part.indexOf(":");
        const fieldName = part.slice(0, separator).trim();
        const fieldMessage = part.slice(separator + 1).trim();
        const field = fields[fieldName];

        if (separator === -1 || !field) {
            unmatched.push(part.trim());
            return;
        }

        setFieldError(fieldName, fieldMessage);
        firstInvalidInput = firstInvalidInput || field.input;
    });

    if (unmatched.length > 0) {
        showFormError(unmatched.join(" "));
    }

    if (firstInvalidInput) {
        firstInvalidInput.focus();
    }
}

// ========================================
// MENSAGENS NA TELA
// ========================================

function setFieldError(fieldName, message) {
    const { input, error } = fields[fieldName];

    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
}

function clearFieldError(fieldName) {
    const { input, error } = fields[fieldName];

    error.textContent = "";
    input.removeAttribute("aria-invalid");
}

function showFormError(message) {
    formError.textContent = message;
}

function clearAllErrors() {
    Object.keys(fields).forEach(clearFieldError);
    formError.textContent = "";
    notice.hidden = true;
}

function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.classList.toggle("is-loading", isLoading);
    submitLabel.textContent = isLoading ? "Entrando..." : "Entrar";
}

// ========================================
// SENHA
// ========================================

function togglePasswordVisibility() {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    passwordToggle.textContent = isHidden ? "Ocultar" : "Mostrar";
    passwordToggle.setAttribute("aria-pressed", String(isHidden));
    passwordInput.focus();
}

function updateCapsLockHint(event) {
    if (typeof event.getModifierState !== "function") {
        return;
    }

    capsLockHint.hidden = !event.getModifierState("CapsLock");
}

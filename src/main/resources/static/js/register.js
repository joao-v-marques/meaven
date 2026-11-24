/* ========================================
   MEAVEN - TELA DE CADASTRO
======================================== */

const REGISTER_URL = "/meaven/api/auth/register";
const CURRENT_USER_URL = "/meaven/api/auth/me";
const HOME_URL = "/meaven/";

// Same rules as RegisterRequest on the server
const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,30}$/;
const PASSWORD_RULES = { min: 4, max: 72 };
const OLDEST_BIRTH_DATE = "1900-01-01";

const MESSAGES = {
    nameRequired: "Informe seu nome.",
    birthDateRequired: "Informe sua data de nascimento.",
    birthDateInvalid: "Confira a data de nascimento: ela deve ser no passado.",
    usernameRequired: "Escolha um usuário.",
    usernameInvalid: "Use de 3 a 30 letras, números, ponto, hífen ou sublinhado, sem espaços.",
    passwordRequired: "Crie uma senha.",
    passwordLength: `A senha deve ter entre ${PASSWORD_RULES.min} e ${PASSWORD_RULES.max} caracteres.`,
    confirmRequired: "Repita a senha.",
    confirmMismatch: "As senhas não são iguais. Digite de novo.",
    connectionFailed: "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.",
    unexpected: "Não foi possível criar a conta agora. Tente de novo em alguns instantes.",
};

const form = document.getElementById("register-form");
const formError = document.getElementById("form-error");
const submitButton = document.getElementById("submit-button");
const submitLabel = document.getElementById("submit-label");
const passwordToggle = document.getElementById("password-toggle");

const fields = {
    name: document.getElementById("name"),
    birthDate: document.getElementById("birthDate"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
};

document.addEventListener("DOMContentLoaded", () => {
    redirectIfLoggedIn();
    fields.birthDate.max = todayAsIsoDate();
    fields.name.focus();
});

form.addEventListener("submit", submitRegistration);
passwordToggle.addEventListener("click", togglePasswordVisibility);

Object.values(fields).forEach((input) => {
    input.addEventListener("input", () => {
        setFieldError(input, "");
        formError.textContent = "";
    });
});

// ========================================
// SESSÃO
// ========================================

// Quem já está logado não precisa criar outra conta
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

// ========================================
// CADASTRO
// ========================================

async function submitRegistration(event) {
    event.preventDefault();

    formError.textContent = "";

    if (!validateForm()) {
        return;
    }

    setLoading(true);

    const account = {
        name: fields.name.value.trim(),
        birthDate: fields.birthDate.value,
        username: fields.username.value.trim(),
        password: fields.password.value,
    };

    let response;

    try {
        response = await fetch(REGISTER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify(account),
        });
    } catch {
        formError.textContent = MESSAGES.connectionFailed;
        setLoading(false);
        return;
    }

    // 201: the server already set the session cookie
    if (response.ok) {
        submitLabel.textContent = "Entrando...";
        window.location.replace(HOME_URL);
        return;
    }

    await showApiError(response);
    setLoading(false);
}

// Returns true when every field is valid; focuses the first invalid one
function validateForm() {
    const errors = new Map();

    const name = fields.name.value.trim();
    const birthDate = fields.birthDate.value;
    const username = fields.username.value.trim();
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;

    if (!name) {
        errors.set(fields.name, MESSAGES.nameRequired);
    }

    // An incomplete date (e.g. only the day typed) makes the input report "badInput" with an empty value
    if (!birthDate && !fields.birthDate.validity.badInput) {
        errors.set(fields.birthDate, MESSAGES.birthDateRequired);
    } else if (!birthDate || birthDate < OLDEST_BIRTH_DATE || birthDate >= todayAsIsoDate()) {
        errors.set(fields.birthDate, MESSAGES.birthDateInvalid);
    }

    if (!username) {
        errors.set(fields.username, MESSAGES.usernameRequired);
    } else if (!USERNAME_PATTERN.test(username)) {
        errors.set(fields.username, MESSAGES.usernameInvalid);
    }

    if (!password) {
        errors.set(fields.password, MESSAGES.passwordRequired);
    } else if (password.length < PASSWORD_RULES.min || password.length > PASSWORD_RULES.max) {
        errors.set(fields.password, MESSAGES.passwordLength);
    }

    if (!confirmPassword) {
        errors.set(fields.confirmPassword, MESSAGES.confirmRequired);
    } else if (password && confirmPassword !== password) {
        errors.set(fields.confirmPassword, MESSAGES.confirmMismatch);
    }

    errors.forEach((message, input) => setFieldError(input, message));

    const firstInvalid = Object.values(fields).find((input) => errors.has(input));

    if (firstInvalid) {
        firstInvalid.focus();
        return false;
    }

    return true;
}

// 400 -> "field: message; other: message" (validation); 422 -> username already taken
async function showApiError(response) {
    let message = MESSAGES.unexpected;

    try {
        const body = await response.json();
        message = body.message || message;
    } catch {
        // Body is not JSON: keep the generic message
    }

    if (response.status === 422) {
        setFieldError(fields.username, message);
        fields.username.focus();
        fields.username.select();
        return;
    }

    let firstField = null;

    message.split("; ").forEach((part) => {
        const [field, fieldMessage] = part.split(/:\s(.+)/);

        if (fields[field] && fieldMessage) {
            setFieldError(fields[field], fieldMessage);
            firstField = firstField || fields[field];
        }
    });

    if (firstField) {
        firstField.focus();
        return;
    }

    formError.textContent = message;
}

// ========================================
// AUXILIARES
// ========================================

function setFieldError(input, message) {
    document.getElementById(`${input.id}-error`).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
}

function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.classList.toggle("is-loading", isLoading);
    submitLabel.textContent = isLoading ? "Criando conta..." : "Criar conta";
}

// One toggle shows or hides both password fields
function togglePasswordVisibility() {
    const show = fields.password.type === "password";

    fields.password.type = show ? "text" : "password";
    fields.confirmPassword.type = show ? "text" : "password";

    passwordToggle.textContent = show ? "Ocultar" : "Mostrar";
    passwordToggle.setAttribute("aria-pressed", String(show));
}

// Local date as YYYY-MM-DD (toISOString would use UTC and can be off by one day)
function todayAsIsoDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;
}

/* ========================================
   MEAVEN - MENU LATERAL
   Logged-in user, password change and logout.
   Loaded first on every app page; other scripts read the user
   through window.MeavenSession.currentUser.
======================================== */

// Wrapped so its names never clash with the page scripts loaded after it
(() => {

    const SESSION_URLS = {
        currentUser: "/meaven/api/auth/me",
        changePassword: "/meaven/api/auth/me/password",
        logout: "/meaven/api/auth/logout",
        login: "/meaven/login",
    };

    const ROLE_LABELS = {
        ADMINISTRATOR: "Administrador",
        USER: "Participante",
    };

    const PASSWORD_RULES = { min: 4, max: 72 };

    const PASSWORD_MESSAGES = {
        currentRequired: "Informe a senha atual.",
        newRequired: "Informe a nova senha.",
        newLength: `A nova senha deve ter de ${PASSWORD_RULES.min} a ${PASSWORD_RULES.max} caracteres.`,
        newSameAsCurrent: "A nova senha deve ser diferente da atual.",
        confirmRequired: "Repita a nova senha.",
        confirmMismatch: "As senhas não são iguais. Digite a nova senha de novo.",
        connectionFailed: "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.",
        unexpected: "Não foi possível alterar a senha agora. Tente de novo em alguns instantes.",
        saved: "Senha alterada.",
    };

    const LOGOUT_FAILED = "Não foi possível sair agora. Tente de novo.";

    // ========================================
    // SESSÃO
    // ========================================

    window.MeavenSession = {
        currentUser: loadCurrentUser(),
        getInitials,
        calculateAge,
    };

    async function loadCurrentUser() {
        let response;

        try {
            response = await fetch(SESSION_URLS.currentUser, { credentials: "same-origin" });
        } catch {
            showSidebarUserError();
            return null;
        }

        if (response.status === 401) {
            redirectToLogin("erro", "sessao-expirada");
            return null;
        }

        if (!response.ok) {
            showSidebarUserError();
            return null;
        }

        const user = await response.json();
        renderSidebarUser(user);
        return user;
    }

    function renderSidebarUser(user) {
        document.getElementById("sidebar-avatar").textContent = getInitials(user.name);
        document.getElementById("sidebar-user-name").textContent = user.name;
        document.getElementById("sidebar-user-role").textContent = getRoleLabel(user.role);
        document.querySelector(".account").title = `${user.name} (${user.username})`;
    }

    function showSidebarUserError() {
        document.getElementById("sidebar-avatar").textContent = "?";
        document.getElementById("sidebar-user-name").textContent = "Conta indisponível";
        document.getElementById("sidebar-user-role").textContent = "Recarregue a página";
    }

    // "João Vitor Marques" -> "JM"; "Ana" -> "A"
    function getInitials(name) {
        const parts = (name || "").trim().split(/\s+/).filter(Boolean);

        if (parts.length === 0) {
            return "?";
        }

        const first = parts[0].charAt(0);
        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";

        return (first + last).toUpperCase();
    }

    function getRoleLabel(role) {
        if (ROLE_LABELS[role]) {
            return ROLE_LABELS[role];
        }

        const text = (role || "").toLowerCase().replaceAll("_", " ");
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // birthDate comes as "YYYY-MM-DD"; returns null when it is missing
    function calculateAge(birthDate) {
        if (!birthDate) {
            return null;
        }

        const [year, month, day] = birthDate.split("-").map(Number);
        const today = new Date();
        let age = today.getFullYear() - year;

        const birthdayNotReached = today.getMonth() + 1 < month
            || (today.getMonth() + 1 === month && today.getDate() < day);

        if (birthdayNotReached) {
            age -= 1;
        }

        return age;
    }

    function redirectToLogin(param, value) {
        window.location.replace(`${SESSION_URLS.login}?${param}=${value}`);
    }

    // ========================================
    // SAIR
    // ========================================

    const logoutButton = document.getElementById("logout-button");

    logoutButton.addEventListener("click", logout);

    async function logout() {
        logoutButton.disabled = true;

        try {
            const response = await fetch(SESSION_URLS.logout, { method: "POST", credentials: "same-origin" });

            if (!response.ok) {
                throw new Error(`Logout failed with status ${response.status}`);
            }
        } catch {
            logoutButton.disabled = false;
            showToast(LOGOUT_FAILED, "error");
            return;
        }

        redirectToLogin("aviso", "saiu");
    }

    // ========================================
    // ALTERAR SENHA
    // ========================================

    const passwordDialog = document.getElementById("password-dialog");
    const passwordForm = document.getElementById("password-form");
    const passwordSubmit = document.getElementById("password-submit");
    const passwordFormError = document.getElementById("password-form-error");
    const showPasswords = document.getElementById("show-passwords");

    const passwordFields = {
        currentPassword: document.getElementById("current-password"),
        newPassword: document.getElementById("new-password"),
        confirmPassword: document.getElementById("confirm-password"),
    };

    document.getElementById("change-password-button").addEventListener("click", openPasswordDialog);
    document.getElementById("password-dialog-close").addEventListener("click", closePasswordDialog);
    document.getElementById("password-dialog-cancel").addEventListener("click", closePasswordDialog);

    passwordForm.addEventListener("submit", submitPasswordChange);
    showPasswords.addEventListener("change", togglePasswordVisibility);

    // Clicking the dimmed backdrop (the dialog element itself, outside the form) closes it
    passwordDialog.addEventListener("click", (event) => {
        if (event.target === passwordDialog) {
            closePasswordDialog();
        }
    });

    // Esc closes the dialog natively; keep the form clean for next time
    passwordDialog.addEventListener("close", resetPasswordForm);

    Object.values(passwordFields).forEach((input) => {
        input.addEventListener("input", () => {
            setFieldError(input, "");
            passwordFormError.textContent = "";
        });
    });

    function openPasswordDialog() {
        resetPasswordForm();
        passwordDialog.showModal();
        passwordFields.currentPassword.focus();
    }

    function closePasswordDialog() {
        if (passwordDialog.open) {
            passwordDialog.close();
        }
    }

    function resetPasswordForm() {
        passwordForm.reset();
        togglePasswordVisibility();
        Object.values(passwordFields).forEach((input) => setFieldError(input, ""));
        passwordFormError.textContent = "";
        setPasswordLoading(false);
    }

    function togglePasswordVisibility() {
        const type = showPasswords.checked ? "text" : "password";
        Object.values(passwordFields).forEach((input) => { input.type = type; });
    }

    async function submitPasswordChange(event) {
        event.preventDefault();

        passwordFormError.textContent = "";

        if (!validatePasswordForm()) {
            return;
        }

        setPasswordLoading(true);

        let response;

        try {
            response = await fetch(SESSION_URLS.changePassword, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({
                    currentPassword: passwordFields.currentPassword.value,
                    newPassword: passwordFields.newPassword.value,
                }),
            });
        } catch {
            passwordFormError.textContent = PASSWORD_MESSAGES.connectionFailed;
            setPasswordLoading(false);
            return;
        }

        if (response.ok) {
            closePasswordDialog();
            showToast(PASSWORD_MESSAGES.saved, "success");
            return;
        }

        if (response.status === 401) {
            redirectToLogin("erro", "sessao-expirada");
            return;
        }

        await showPasswordApiError(response);
        setPasswordLoading(false);
    }

    // Returns true when every field is valid; marks the first invalid one
    function validatePasswordForm() {
        const current = passwordFields.currentPassword.value;
        const next = passwordFields.newPassword.value;
        const confirm = passwordFields.confirmPassword.value;

        const errors = new Map();

        if (!current) {
            errors.set(passwordFields.currentPassword, PASSWORD_MESSAGES.currentRequired);
        }

        if (!next) {
            errors.set(passwordFields.newPassword, PASSWORD_MESSAGES.newRequired);
        } else if (next.length < PASSWORD_RULES.min || next.length > PASSWORD_RULES.max) {
            errors.set(passwordFields.newPassword, PASSWORD_MESSAGES.newLength);
        } else if (next === current) {
            errors.set(passwordFields.newPassword, PASSWORD_MESSAGES.newSameAsCurrent);
        }

        if (!confirm) {
            errors.set(passwordFields.confirmPassword, PASSWORD_MESSAGES.confirmRequired);
        } else if (next && confirm !== next) {
            errors.set(passwordFields.confirmPassword, PASSWORD_MESSAGES.confirmMismatch);
        }

        errors.forEach((message, input) => setFieldError(input, message));

        const firstInvalid = Object.values(passwordFields).find((input) => errors.has(input));

        if (firstInvalid) {
            firstInvalid.focus();
            return false;
        }

        return true;
    }

    // 400 -> "newPassword: ..." (validation); 422 -> wrong current password or same password
    async function showPasswordApiError(response) {
        let message = PASSWORD_MESSAGES.unexpected;

        try {
            const body = await response.json();
            message = body.message || message;
        } catch {
            // Body is not JSON: keep the generic message
        }

        const [field, fieldMessage] = message.split(/:\s(.+)/);

        if (passwordFields[field] && fieldMessage) {
            setFieldError(passwordFields[field], fieldMessage);
            passwordFields[field].focus();
            return;
        }

        if (response.status === 422 && /atual/i.test(message) && !/diferente/i.test(message)) {
            setFieldError(passwordFields.currentPassword, message);
            passwordFields.currentPassword.select();
            return;
        }

        if (response.status === 422) {
            setFieldError(passwordFields.newPassword, message);
            passwordFields.newPassword.focus();
            return;
        }

        passwordFormError.textContent = message;
    }

    function setFieldError(input, message) {
        const error = document.getElementById(`${input.id}-error`);

        error.textContent = message;
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function setPasswordLoading(isLoading) {
        passwordSubmit.disabled = isLoading;
        passwordSubmit.textContent = isLoading ? "Salvando..." : "Salvar nova senha";
        passwordForm.setAttribute("aria-busy", String(isLoading));
    }

    // ========================================
    // AVISO RÁPIDO (TOAST)
    // ========================================

    const toast = document.getElementById("app-toast");
    let toastTimer;

    function showToast(message, kind) {
        clearTimeout(toastTimer);

        toast.textContent = message;
        toast.dataset.kind = kind;
        toast.hidden = false;

        toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
    }

})();

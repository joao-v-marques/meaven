/* ========================================
   MEAVEN - CONFIGURAÇÕES DA CONTA
   Identity summary, account info (PATCH /api/auth/me),
   password (PATCH /api/auth/me/password) and logout.
   Uses window.MeavenSession from sidebar.js.
======================================== */

const SETTINGS_URLS = {
    profile: "/meaven/api/auth/me",
    password: "/meaven/api/auth/me/password",
    sessionExpired: "/meaven/login?erro=sessao-expirada",
};

// Same rules as UpdateProfileRequest / ChangePasswordRequest on the server
const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,30}$/;
const PASSWORD_RULES = { min: 4, max: 72 };
const OLDEST_BIRTH_DATE = "1900-01-01";
const USERNAME_HINT = "Letras, números, ponto, hífen ou _";

const MESSAGES = {
    nameRequired: "Informe seu nome.",
    birthDateRequired: "Informe sua data de nascimento.",
    birthDateInvalid: "Confira a data de nascimento: ela deve ser no passado.",
    usernameRequired: "Escolha um usuário.",
    usernameInvalid: "Use de 3 a 30 letras, números, ponto, hífen ou sublinhado, sem espaços.",
    currentRequired: "Informe a senha atual.",
    newRequired: "Informe a nova senha.",
    newLength: `A nova senha deve ter de ${PASSWORD_RULES.min} a ${PASSWORD_RULES.max} caracteres.`,
    newSameAsCurrent: "A nova senha deve ser diferente da atual.",
    confirmRequired: "Repita a nova senha.",
    confirmMismatch: "As senhas não são iguais. Digite a nova senha de novo.",
    connectionFailed: "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.",
    profileUnexpected: "Não foi possível salvar agora. Tente de novo em alguns instantes.",
    passwordUnexpected: "Não foi possível alterar a senha agora. Tente de novo em alguns instantes.",
    profileSaved: "Alterações salvas.",
    passwordSaved: "Senha alterada.",
    loadFailed: "Não foi possível carregar seus dados. Recarregue a página.",
};

const monthYear = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

const session = window.MeavenSession;

// ========================================
// IDENTIDADE
// ========================================

const identity = {
    avatar: document.getElementById("identity-avatar"),
    name: document.getElementById("identity-name"),
    username: document.getElementById("identity-username"),
    role: document.getElementById("identity-role"),
    age: document.getElementById("identity-age"),
    since: document.getElementById("identity-since"),
};

function renderIdentity(user) {
    const age = session.calculateAge(user.birthDate);

    identity.avatar.textContent = session.getInitials(user.name);
    identity.name.textContent = user.name;
    identity.username.textContent = `@${user.username}`;
    identity.role.textContent = session.getRoleLabel(user.role);
    identity.age.textContent = age !== null ? `${age} anos` : "Não informada";
    identity.since.textContent = user.createdAt ? monthYear.format(new Date(user.createdAt)) : "-";
}

// ========================================
// INFORMAÇÕES DA CONTA
// ========================================

const profileForm = document.getElementById("profile-form");
const profileFieldset = document.getElementById("profile-fieldset");
const profileSubmit = document.getElementById("profile-submit");
const profileUndo = document.getElementById("profile-undo");
const profileFormError = document.getElementById("profile-form-error");
const usernameHint = document.getElementById("profile-username-hint");

// Keys match the API field names, so 400 messages ("username: ...") land on the right input
const profileFields = {
    name: document.getElementById("profile-name"),
    birthDate: document.getElementById("profile-birth-date"),
    username: document.getElementById("profile-username"),
};

// Values the form came with: "Desfazer" goes back to them; saving replaces them
let savedProfile = null;

profileForm.addEventListener("submit", saveProfile);
profileUndo.addEventListener("click", undoProfileChanges);

Object.values(profileFields).forEach((input) => {
    input.addEventListener("input", () => {
        setFieldError(input, "");
        profileFormError.textContent = "";
        updateProfileState();
    });
});

function fillProfileForm(user) {
    savedProfile = {
        name: user.name,
        birthDate: user.birthDate || "",
        username: user.username,
    };

    Object.entries(savedProfile).forEach(([key, value]) => {
        profileFields[key].value = value;
        setFieldError(profileFields[key], "");
    });

    profileFields.birthDate.max = todayAsIsoDate();
    profileFieldset.disabled = false;
    updateProfileState();
}

function readProfileForm() {
    return {
        name: profileFields.name.value.trim(),
        birthDate: profileFields.birthDate.value,
        username: profileFields.username.value.trim(),
    };
}

// Buttons only wake up when something changed; a new username gets a heads-up
function updateProfileState() {
    if (!savedProfile) {
        return;
    }

    const current = readProfileForm();
    const changed = Object.keys(savedProfile).some((key) => current[key] !== savedProfile[key]);
    const usernameChanged = current.username !== savedProfile.username && current.username !== "";

    profileSubmit.disabled = !changed;
    profileUndo.disabled = !changed;

    usernameHint.textContent = usernameChanged
        ? `Depois de salvar, você vai entrar com "${current.username}".`
        : USERNAME_HINT;
    usernameHint.dataset.kind = usernameChanged ? "notice" : "";
}

function undoProfileChanges() {
    profileFormError.textContent = "";
    fillProfileForm(savedProfile);
    profileFields.name.focus();
}

async function saveProfile(event) {
    event.preventDefault();

    profileFormError.textContent = "";

    if (!validateProfile()) {
        return;
    }

    setBusy(profileSubmit, true, "Salvando...");

    let response;

    try {
        response = await fetch(SETTINGS_URLS.profile, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify(readProfileForm()),
        });
    } catch {
        profileFormError.textContent = MESSAGES.connectionFailed;
        setBusy(profileSubmit, false, "Salvar alterações");
        updateProfileState();
        return;
    }

    if (response.status === 401) {
        window.location.replace(SETTINGS_URLS.sessionExpired);
        return;
    }

    setBusy(profileSubmit, false, "Salvar alterações");

    if (!response.ok) {
        await showApiError(response, profileFields, profileFormError, MESSAGES.profileUnexpected, "username");
        updateProfileState();
        return;
    }

    // The server also renews the session cookie when the username changed
    const user = await response.json();

    session.renderUser(user);
    renderIdentity(user);
    fillProfileForm(user);
    session.showToast(MESSAGES.profileSaved, "success");
}

function validateProfile() {
    const { name, birthDate, username } = readProfileForm();
    const errors = new Map();

    if (!name) {
        errors.set(profileFields.name, MESSAGES.nameRequired);
    }

    if (!birthDate && !profileFields.birthDate.validity.badInput) {
        errors.set(profileFields.birthDate, MESSAGES.birthDateRequired);
    } else if (!birthDate || birthDate < OLDEST_BIRTH_DATE || birthDate >= todayAsIsoDate()) {
        errors.set(profileFields.birthDate, MESSAGES.birthDateInvalid);
    }

    if (!username) {
        errors.set(profileFields.username, MESSAGES.usernameRequired);
    } else if (!USERNAME_PATTERN.test(username)) {
        errors.set(profileFields.username, MESSAGES.usernameInvalid);
    }

    return applyErrors(errors, profileFields);
}

// ========================================
// SENHA
// ========================================

const passwordForm = document.getElementById("password-form");
const passwordSubmit = document.getElementById("password-submit");
const passwordFormError = document.getElementById("password-form-error");
const showPasswords = document.getElementById("show-passwords");

const passwordFields = {
    currentPassword: document.getElementById("current-password"),
    newPassword: document.getElementById("new-password"),
    confirmPassword: document.getElementById("confirm-password"),
};

passwordForm.addEventListener("submit", changePassword);
showPasswords.addEventListener("change", togglePasswordVisibility);

Object.values(passwordFields).forEach((input) => {
    input.addEventListener("input", () => {
        setFieldError(input, "");
        passwordFormError.textContent = "";
    });
});

function togglePasswordVisibility() {
    const type = showPasswords.checked ? "text" : "password";
    Object.values(passwordFields).forEach((input) => { input.type = type; });
}

async function changePassword(event) {
    event.preventDefault();

    passwordFormError.textContent = "";

    if (!validatePassword()) {
        return;
    }

    setBusy(passwordSubmit, true, "Alterando...");

    let response;

    try {
        response = await fetch(SETTINGS_URLS.password, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                currentPassword: passwordFields.currentPassword.value,
                newPassword: passwordFields.newPassword.value,
            }),
        });
    } catch {
        passwordFormError.textContent = MESSAGES.connectionFailed;
        setBusy(passwordSubmit, false, "Alterar senha");
        return;
    }

    if (response.status === 401) {
        window.location.replace(SETTINGS_URLS.sessionExpired);
        return;
    }

    setBusy(passwordSubmit, false, "Alterar senha");

    if (!response.ok) {
        await showPasswordApiError(response);
        return;
    }

    passwordForm.reset();
    togglePasswordVisibility();
    session.showToast(MESSAGES.passwordSaved, "success");
}

function validatePassword() {
    const current = passwordFields.currentPassword.value;
    const next = passwordFields.newPassword.value;
    const confirm = passwordFields.confirmPassword.value;
    const errors = new Map();

    if (!current) {
        errors.set(passwordFields.currentPassword, MESSAGES.currentRequired);
    }

    if (!next) {
        errors.set(passwordFields.newPassword, MESSAGES.newRequired);
    } else if (next.length < PASSWORD_RULES.min || next.length > PASSWORD_RULES.max) {
        errors.set(passwordFields.newPassword, MESSAGES.newLength);
    } else if (next === current) {
        errors.set(passwordFields.newPassword, MESSAGES.newSameAsCurrent);
    }

    if (!confirm) {
        errors.set(passwordFields.confirmPassword, MESSAGES.confirmRequired);
    } else if (next && confirm !== next) {
        errors.set(passwordFields.confirmPassword, MESSAGES.confirmMismatch);
    }

    return applyErrors(errors, passwordFields);
}

// 422 is either a wrong current password or a new one equal to it
async function showPasswordApiError(response) {
    if (response.status !== 422) {
        await showApiError(response, passwordFields, passwordFormError, MESSAGES.passwordUnexpected, null);
        return;
    }

    const message = await readErrorMessage(response, MESSAGES.passwordUnexpected);
    const field = /diferente/i.test(message) ? passwordFields.newPassword : passwordFields.currentPassword;

    setFieldError(field, message);
    field.focus();
    field.select();
}

// ========================================
// SESSÃO
// ========================================

const logoutButton = document.getElementById("settings-logout");

logoutButton.addEventListener("click", () => session.logout(logoutButton));

// ========================================
// AUXILIARES
// ========================================

// errors: Map(input -> message). Shows them, focuses the first; true when there is none
function applyErrors(errors, fields) {
    errors.forEach((message, input) => setFieldError(input, message));

    const firstInvalid = Object.values(fields).find((input) => errors.has(input));

    if (firstInvalid) {
        firstInvalid.focus();
        return false;
    }

    return true;
}

// 400 -> "field: message; other: message"; 422 -> goes to conflictField when given
async function showApiError(response, fields, formError, fallback, conflictField) {
    const message = await readErrorMessage(response, fallback);

    if (response.status === 422 && conflictField) {
        setFieldError(fields[conflictField], message);
        fields[conflictField].focus();
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

async function readErrorMessage(response, fallback) {
    try {
        const body = await response.json();
        return body.message || fallback;
    } catch {
        return fallback;
    }
}

function setFieldError(input, message) {
    document.getElementById(`${input.id}-error`).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
}

function setBusy(button, isBusy, label) {
    button.disabled = isBusy;
    button.textContent = label;
    button.setAttribute("aria-busy", String(isBusy));
}

// Local date as YYYY-MM-DD (toISOString would use UTC and can be off by one day)
function todayAsIsoDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;
}

// ========================================
// INÍCIO
// ========================================

loadSettings();

async function loadSettings() {
    const user = await session.currentUser;

    if (!user) {
        profileFormError.textContent = MESSAGES.loadFailed;
        return;
    }

    renderIdentity(user);
    fillProfileForm(user);
}

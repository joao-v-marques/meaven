/* ========================================
   MEAVEN - MENU LATERAL
   Logged-in user (link to /settings) and logout.
   Loaded first on every app page; other scripts use window.MeavenSession:
   currentUser (promise), getInitials, calculateAge, getRoleLabel,
   renderUser, logout and showToast.
======================================== */

// Wrapped so its names never clash with the page scripts loaded after it
(() => {

    const SESSION_URLS = {
        currentUser: "/meaven/api/auth/me",
        logout: "/meaven/api/auth/logout",
        login: "/meaven/login",
    };

    const ROLE_LABELS = {
        ADMINISTRATOR: "Administrador",
        USER: "Participante",
    };

    const LOGOUT_FAILED = "Não foi possível sair agora. Tente de novo.";

    // ========================================
    // SESSÃO
    // ========================================

    window.MeavenSession = {
        currentUser: loadCurrentUser(),
        getInitials,
        calculateAge,
        getRoleLabel,
        renderUser,
        logout,
        showToast,
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

    // Called by the settings page after the user edits their account
    function renderUser(user) {
        window.MeavenSession.currentUser = Promise.resolve(user);
        renderSidebarUser(user);
    }

    function renderSidebarUser(user) {
        document.getElementById("sidebar-avatar").textContent = getInitials(user.name);
        document.getElementById("sidebar-user-name").textContent = user.name;
        document.getElementById("sidebar-user-role").textContent = getRoleLabel(user.role);
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

    logoutButton.addEventListener("click", () => logout(logoutButton));

    // trigger: the button that was clicked, disabled while the request runs
    async function logout(trigger) {
        if (trigger) {
            trigger.disabled = true;
        }

        try {
            const response = await fetch(SESSION_URLS.logout, { method: "POST", credentials: "same-origin" });

            if (!response.ok) {
                throw new Error(`Logout failed with status ${response.status}`);
            }
        } catch {
            if (trigger) {
                trigger.disabled = false;
            }
            showToast(LOGOUT_FAILED, "error");
            return;
        }

        redirectToLogin("aviso", "saiu");
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

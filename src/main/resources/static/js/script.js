
/* ========================================
   MEAVEN - CADASTRO DO PARTICIPANTE
======================================== */

// Elementos do formulário
const profileForm = document.getElementById("profileForm");

const participantName = document.getElementById("participantName");
const participantAge = document.getElementById("participantAge");
const participantCapital = document.getElementById("participantCapital");

// Elementos do cabeçalho
const headerName = document.getElementById("headerName");
const headerAge = document.getElementById("headerAge");
const headerCapital = document.getElementById("headerCapital");
const headerLevel = document.getElementById("headerLevel");

// Avatares
const headerAvatar = document.getElementById("headerAvatar");
const profileAvatar = document.getElementById("profileAvatar");


// ========================================
// USUÁRIO LOGADO
// Comes from GET /api/auth/me, loaded once by sidebar.js
// ========================================

const PROFILE_DEFAULTS = {
    name: "Participante",
    age: "Idade não informada",
    capital: "Capital não informado",
    level: "Nível não informado"
};

let currentUser = null;

fillCurrentUser();

async function fillCurrentUser() {

    const session = window.MeavenSession;

    currentUser = session ? await session.currentUser : null;

    applyCurrentUser();

}

// Puts the logged-in user's data in the header and in the profile form
function applyCurrentUser() {

    const name = currentUser ? currentUser.name : PROFILE_DEFAULTS.name;
    const age = currentUser ? window.MeavenSession.calculateAge(currentUser.birthDate) : null;

    setText(headerName, name);
    setText(headerAge, age !== null ? age + " anos" : PROFILE_DEFAULTS.age);
    setAvatars(name);

    // defaultValue makes the form's "Cancelar" (reset) return to these values
    if (participantName) {
        participantName.defaultValue = currentUser ? currentUser.name : "";
    }

    if (participantAge) {
        participantAge.defaultValue = age !== null ? String(age) : "";
    }

}

function setText(element, text) {

    if (element) {
        element.textContent = text;
    }

}

function setAvatars(name) {

    const session = window.MeavenSession;
    const initials = session ? session.getInitials(name) : name.charAt(0).toUpperCase();

    setText(headerAvatar, initials);
    setText(profileAvatar, initials);

}


// ========================================
// SALVAR PERFIL
// ========================================

if (profileForm) {

    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Captura os valores
        const name = participantName.value.trim();
        const age = Number(participantAge.value);
        const capital = Number(participantCapital.value);

        // Captura o nível selecionado
        const selectedLevel = document.querySelector(
            'input[name="nivel"]:checked'
        );

        // ========================================
        // VALIDAÇÕES
        // ========================================

        if (
            !name ||
            !participantAge.value ||
            !participantCapital.value ||
            !selectedLevel
        ) {

            alert("Por favor, preencha todos os campos.");

            return;
        }

        if (age < 1 || age > 120 || !Number.isInteger(age)) {

            alert("Informe uma idade válida.");

            participantAge.focus();

            return;
        }

        if (!Number.isFinite(capital) || capital < 0) {

            alert("Informe um valor de capital válido.");

            participantCapital.focus();

            return;
        }

        // ========================================
        // IDENTIFICAR NÍVEL FINANCEIRO
        // ========================================

        const levels = {

            iniciante: "Iniciante",

            intermediario: "Intermediário",

            avancado: "Avançado"

        };

        const levelText = levels[selectedLevel.value];

        // ========================================
        // ATUALIZAR CABEÇALHO
        // ========================================

        if (headerName) {
            headerName.textContent = name;
        }

        if (headerAge) {
            headerAge.textContent = age + " anos";
        }

        if (headerCapital) {
            headerCapital.textContent = capital.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }

        if (headerLevel) {
            headerLevel.textContent = levelText;
        }

        // ========================================
        // ATUALIZAR AVATARES
        // ========================================

        setAvatars(name);

        // ========================================
        // CONFIRMAÇÃO
        // ========================================

        alert("Perfil cadastrado com sucesso!");

    });


    // ========================================
    // CANCELAR CADASTRO
    // ========================================

    profileForm.addEventListener("reset", function () {

        // Back to the logged-in user's data (the form fields reset to their defaultValue)
        setTimeout(function () {

            applyCurrentUser();
            setText(headerCapital, PROFILE_DEFAULTS.capital);
            setText(headerLevel, PROFILE_DEFAULTS.level);

        }, 0);

    });

}


// ========================================
// MEAVEN - TELA 2: SIMULAÇÕES
// ========================================

// Seleciona os cards de simulação
const simulationCards = document.querySelectorAll(".simulation-card");

// Identifica quando uma simulação é selecionada
simulationCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const simulationTitle = this.querySelector("h3");

        if (simulationTitle) {

            const simulationName = simulationTitle.textContent.trim();

            console.log("Simulação selecionada:", simulationName);

        }

    });

});

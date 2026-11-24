/* ========================================
   MEAVEN - CABEÇALHO DAS PÁGINAS DE SIMULAÇÃO
   Fills the header with the logged-in user
   (GET /api/auth/me, loaded once by sidebar.js).
   Account editing will live on its own page.
======================================== */

const headerName = document.getElementById("headerName");
const headerAge = document.getElementById("headerAge");
const headerAvatar = document.getElementById("headerAvatar");

const HEADER_DEFAULTS = {
    name: "Participante",
    age: "Idade não informada"
};

fillHeaderWithCurrentUser();

async function fillHeaderWithCurrentUser() {

    const session = window.MeavenSession;
    const user = session ? await session.currentUser : null;

    const name = user ? user.name : HEADER_DEFAULTS.name;
    const age = user ? session.calculateAge(user.birthDate) : null;

    setText(headerName, name);
    setText(headerAge, age !== null ? age + " anos" : HEADER_DEFAULTS.age);
    setText(headerAvatar, session ? session.getInitials(name) : name.charAt(0).toUpperCase());

}

function setText(element, text) {

    if (element) {
        element.textContent = text;
    }

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


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

        const initial = name.charAt(0).toUpperCase();

        if (headerAvatar) {
            headerAvatar.textContent = initial;
        }

        if (profileAvatar) {
            profileAvatar.textContent = initial;
        }

        // ========================================
        // CONFIRMAÇÃO
        // ========================================

        alert("Perfil cadastrado com sucesso!");

    });


    // ========================================
    // CANCELAR CADASTRO
    // ========================================

    profileForm.addEventListener("reset", function () {

        setTimeout(function () {

            if (headerName) {
                headerName.textContent = "Novo participante";
            }

            if (headerAge) {
                headerAge.textContent = "Complete seu perfil";
            }

            if (headerCapital) {
                headerCapital.textContent = "R$ 0,00";
            }

            if (headerLevel) {
                headerLevel.textContent = "Não informado";
            }

            if (headerAvatar) {
                headerAvatar.textContent = "?";
            }

            if (profileAvatar) {
                profileAvatar.textContent = "?";
            }

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

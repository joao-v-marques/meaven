/* ========================================
   MEAVEN - ABA INVESTIMENTOS
   Simulador, comparador e quiz
======================================== */


/* ========================================
   FUNÇÕES AUXILIARES
======================================== */

const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};

function obterNumero(id) {
    return Number(document.getElementById(id).value);
}

function validarNumero(valor, minimo = 0, maximo = Infinity) {
    return Number.isFinite(valor) &&
        valor >= minimo &&
        valor <= maximo;
}


/*
    Calcula o valor futuro usando juros compostos.

    A taxa informada é anual.
    Ela é convertida para uma taxa mensal equivalente.

    Os aportes são considerados no final de cada mês.
*/

function calcularInvestimento(valorInicial, aporteMensal, taxaAnual, anos) {

    const quantidadeMeses = anos * 12;

    const taxaMensal = Math.pow(
        1 + taxaAnual / 100,
        1 / 12
    ) - 1;

    let saldo = valorInicial;

    for (let mes = 0; mes < quantidadeMeses; mes++) {

        saldo = saldo * (1 + taxaMensal);

        saldo += aporteMensal;

    }

    const totalInvestido =
        valorInicial + aporteMensal * quantidadeMeses;

    const rendimento = saldo - totalInvestido;

    return {
        saldo,
        totalInvestido,
        rendimento,
        quantidadeMeses
    };
}


/* ========================================
   SIMULADOR DE INVESTIMENTOS
======================================== */

const investmentForm = document.getElementById("investmentForm");

const resultPlaceholder = document.getElementById("resultPlaceholder");
const resultContent = document.getElementById("resultContent");

investmentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const valorInicial = obterNumero("initialAmount");
    const aporteMensal = obterNumero("monthlyContribution");
    const taxaAnual = obterNumero("annualRate");
    const anos = obterNumero("investmentPeriod");

    const dadosValidos =
        validarNumero(valorInicial) &&
        validarNumero(aporteMensal) &&
        validarNumero(taxaAnual, 0, 100) &&
        Number.isInteger(anos) &&
        validarNumero(anos, 1, 50);

    if (!dadosValidos) {
        alert("Confira os valores informados. Verifique os campos e tente novamente.");
        return;
    }

    const resultado = calcularInvestimento(
        valorInicial,
        aporteMensal,
        taxaAnual,
        anos
    );

    exibirResultado(resultado, anos);

});


function exibirResultado(resultado, anos) {

    resultPlaceholder.hidden = true;
    resultContent.hidden = false;

    document.getElementById("futureValue").textContent =
        formatarMoeda(resultado.saldo);

    document.getElementById("totalInvested").textContent =
        formatarMoeda(resultado.totalInvestido);

    document.getElementById("estimatedEarnings").textContent =
        formatarMoeda(resultado.rendimento);

    document.getElementById("resultPeriod").textContent =
        `${anos} ${anos === 1 ? "ano" : "anos"}`;

    const proporcaoInvestido = resultado.saldo > 0
        ? (resultado.totalInvestido / resultado.saldo) * 100
        : 0;

    const proporcaoRendimento = resultado.saldo > 0
        ? (Math.max(0, resultado.rendimento) / resultado.saldo) * 100
        : 0;

    document.getElementById("investedBar").style.width =
        `${proporcaoInvestido}%`;

    document.getElementById("earningsBar").style.width =
        `${proporcaoRendimento}%`;

    document.getElementById("resultExplanation").textContent =
        `Ao longo de ${anos} ${anos === 1 ? "ano" : "anos"}, ` +
        `você teria investido ${formatarMoeda(resultado.totalInvestido)}. ` +
        `Na simulação, o rendimento estimado seria de ` +
        `${formatarMoeda(resultado.rendimento)}.`;

}


// Restaurar o formulário

investmentForm.addEventListener("reset", function () {

    resultContent.hidden = true;
    resultPlaceholder.hidden = false;

});


/* ========================================
   COMPARADOR DE INVESTIMENTOS
======================================== */

const compareButton = document.getElementById("compareButton");

compareButton.addEventListener("click", function () {

    const inicialA = obterNumero("compareInitialA");
    const mensalA = obterNumero("compareMonthlyA");
    const taxaA = obterNumero("compareRateA");

    const inicialB = obterNumero("compareInitialB");
    const mensalB = obterNumero("compareMonthlyB");
    const taxaB = obterNumero("compareRateB");

    const anos = obterNumero("compareYears");

    const valoresValidos =
        validarNumero(inicialA) &&
        validarNumero(mensalA) &&
        validarNumero(taxaA, 0, 100) &&
        validarNumero(inicialB) &&
        validarNumero(mensalB) &&
        validarNumero(taxaB, 0, 100) &&
        Number.isInteger(anos) &&
        validarNumero(anos, 1, 50);

    if (!valoresValidos) {
        alert("Confira os valores dos dois cenários e o período informado.");
        return;
    }

    const resultadoA = calcularInvestimento(
        inicialA,
        mensalA,
        taxaA,
        anos
    );

    const resultadoB = calcularInvestimento(
        inicialB,
        mensalB,
        taxaB,
        anos
    );

    document.getElementById("comparisonValueA").textContent =
        formatarMoeda(resultadoA.saldo);

    document.getElementById("comparisonValueB").textContent =
        formatarMoeda(resultadoB.saldo);

    document.getElementById("comparisonInvestedA").textContent =
        `Investido: ${formatarMoeda(resultadoA.totalInvestido)}`;

    document.getElementById("comparisonInvestedB").textContent =
        `Investido: ${formatarMoeda(resultadoB.totalInvestido)}`;

    const conclusao = document.getElementById("comparisonConclusion");

    const diferenca = Math.abs(resultadoA.saldo - resultadoB.saldo);

    if (Math.abs(resultadoA.saldo - resultadoB.saldo) < 0.01) {

        conclusao.textContent =
            "Os dois cenários apresentam resultados praticamente iguais.";

    } else if (resultadoA.saldo > resultadoB.saldo) {

        conclusao.textContent =
            `O cenário A apresenta um valor final aproximadamente ` +
            `${formatarMoeda(diferenca)} maior que o cenário B.`;

    } else {

        conclusao.textContent =
            `O cenário B apresenta um valor final aproximadamente ` +
            `${formatarMoeda(diferenca)} maior que o cenário A.`;

    }

    document.getElementById("comparisonResult").hidden = false;

});


/* ========================================
   QUIZ DE INVESTIMENTOS
======================================== */

const perguntas = [

    {
        pergunta: "O que caracteriza um investimento de renda fixa?",

        alternativas: [
            "O preço nunca muda.",
            "As regras de remuneração são estabelecidas na aplicação.",
            "Não existe possibilidade de risco.",
            "O investidor sempre recebe o mesmo valor."
        ],

        correta: 1,

        explicacao:
            "Na renda fixa, as regras de remuneração são conhecidas no momento da aplicação. Isso não significa ausência de riscos ou de oscilações."
    },

    {
        pergunta: "O que é diversificação de investimentos?",

        alternativas: [
            "Investir todo o dinheiro em uma única empresa.",
            "Retirar os rendimentos todos os meses.",
            "Distribuir recursos entre diferentes investimentos.",
            "Escolher sempre o investimento com maior taxa."
        ],

        correta: 2,

        explicacao:
            "A diversificação distribui os recursos entre diferentes ativos e pode ajudar a administrar riscos, embora não elimine a possibilidade de perdas."
    },

    {
        pergunta: "O que significa liquidez de um investimento?",

        alternativas: [
            "A facilidade de transformar o investimento em dinheiro.",
            "O valor mínimo para começar a investir.",
            "O lucro garantido de uma aplicação.",
            "O tempo necessário para aprender sobre investimentos."
        ],

        correta: 0,

        explicacao:
            "Liquidez é a facilidade e a rapidez com que um investimento pode ser convertido em dinheiro, respeitando suas condições de resgate."
    },

    {
        pergunta: "Qual é uma característica da renda variável?",

        alternativas: [
            "O rendimento é sempre conhecido antecipadamente.",
            "Não existe possibilidade de perda.",
            "O retorno pode variar conforme o mercado.",
            "Todos os ativos possuem vencimento fixo."
        ],

        correta: 2,

        explicacao:
            "Na renda variável, os preços e resultados podem oscilar. O investidor pode ter ganhos ou perdas."
    },

    {
        pergunta: "O que são juros compostos?",

        alternativas: [
            "Juros calculados apenas sobre o valor inicial.",
            "Juros calculados sobre o valor inicial e os juros acumulados.",
            "Uma taxa que nunca muda.",
            "Um tipo de imposto sobre investimentos."
        ],

        correta: 1,

        explicacao:
            "Nos juros compostos, os juros acumulados também passam a render nos períodos seguintes. É o chamado efeito dos juros sobre juros."
    }

];

let perguntaAtual = 0;
let pontuacao = 0;
let perguntaRespondida = false;

const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");

const quizProgress = document.getElementById("quizProgress");
const quizScore = document.getElementById("quizScore");
const quizProgressFill = document.getElementById("quizProgressFill");

const nextQuestionButton = document.getElementById("nextQuestionButton");

const quizCard = document.getElementById("quizCard");
const quizFinish = document.getElementById("quizFinish");


function carregarPergunta() {

    perguntaRespondida = false;

    const pergunta = perguntas[perguntaAtual];

    quizQuestion.textContent = pergunta.pergunta;

    quizOptions.innerHTML = "";

    quizFeedback.hidden = true;
    quizFeedback.className = "quiz-feedback";

    nextQuestionButton.disabled = true;

    nextQuestionButton.textContent =
        perguntaAtual === perguntas.length - 1
            ? "Ver resultado"
            : "Próxima pergunta";

    quizProgress.textContent =
        `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

    quizScore.textContent = `Acertos: ${pontuacao}`;

    quizProgressFill.style.width =
        `${((perguntaAtual + 1) / perguntas.length) * 100}%`;

    pergunta.alternativas.forEach((alternativa, indice) => {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "quiz-option";
        botao.textContent = alternativa;

        botao.addEventListener("click", function () {
            responderPergunta(indice, botao);
        });

        quizOptions.appendChild(botao);

    });

}


function responderPergunta(indiceSelecionado, botaoSelecionado) {

    if (perguntaRespondida) {
        return;
    }

    perguntaRespondida = true;

    const pergunta = perguntas[perguntaAtual];

    const acertou = indiceSelecionado === pergunta.correta;

    if (acertou) {
        pontuacao++;
    }

    const botoes = quizOptions.querySelectorAll(".quiz-option");

    botoes.forEach((botao, indice) => {

        botao.disabled = true;

        if (indice === pergunta.correta) {
            botao.classList.add("correct");
        }

        if (
            indice === indiceSelecionado &&
            !acertou
        ) {
            botao.classList.add("incorrect");
        }

    });

    quizFeedback.hidden = false;

    if (acertou) {

        quizFeedback.classList.add("correct-feedback");

        quizFeedback.innerHTML =
            `<strong>Resposta correta!</strong><br>${pergunta.explicacao}`;

    } else {

        quizFeedback.classList.add("incorrect-feedback");

        quizFeedback.innerHTML =
            `<strong>Não foi dessa vez.</strong><br>${pergunta.explicacao}`;

    }

    quizScore.textContent = `Acertos: ${pontuacao}`;

    nextQuestionButton.disabled = false;

}


nextQuestionButton.addEventListener("click", function () {

    if (!perguntaRespondida) {
        return;
    }

    perguntaAtual++;

    if (perguntaAtual < perguntas.length) {

        carregarPergunta();

    } else {

        finalizarQuiz();

    }

});


function finalizarQuiz() {

    quizCard.hidden = true;
    quizFinish.hidden = false;

    document.getElementById("quizFinalScore").textContent =
        `Você acertou ${pontuacao} de ${perguntas.length} perguntas. ` +
        obterMensagemResultado();

}


function obterMensagemResultado() {

    if (pontuacao === perguntas.length) {
        return "Excelente! Você demonstrou um ótimo conhecimento sobre os conceitos apresentados.";
    }

    if (pontuacao >= 3) {
        return "Muito bem! Você já conhece vários conceitos. Continue estudando para avançar ainda mais.";
    }

    return "Continue aprendendo! Revise os conceitos e tente novamente para melhorar seu resultado.";

}


document.getElementById("restartQuizButton").addEventListener("click", function () {

    perguntaAtual = 0;
    pontuacao = 0;

    quizFinish.hidden = true;
    quizCard.hidden = false;

    carregarPergunta();

});


/* ========================================
   INICIALIZAÇÃO
======================================== */

carregarPergunta();

// ============================================
// MEAVEN - SIMULAÇÃO COMPRAR CARRO
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const etapas = document.querySelectorAll(".carro-step");

    const voltar = document.getElementById("carroVoltar");
    const avancar = document.getElementById("carroAvancar");
    const finalizar = document.getElementById("carroFinalizar");

    const barra = document.getElementById("carroProgressBar");
    const legenda = document.getElementById("carroStepLabel");
    const percentual = document.getElementById("carroProgressPercent");

    const erro = document.getElementById("carroErro");
    const resultado = document.getElementById("carroResultado");

    const TOTAL_ETAPAS = 4;

    let etapaAtual = 1;
    let resultadoCalculado = null;
    let historicoRegistrado = false;

    // ----------------------------------------
    // FUNÇÕES AUXILIARES
    // ----------------------------------------

    function numero(id) {
        return Number(document.getElementById(id).value);
    }

    function campo(id) {
        return document.getElementById(id).value.trim();
    }

    function dinheiro(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function mostrarErro(mensagem) {
        erro.textContent = mensagem;
        erro.classList.add("visible");
    }

    function limparErro() {
        erro.textContent = "";
        erro.classList.remove("visible");
    }

    // ----------------------------------------
    // NAVEGAÇÃO ENTRE ETAPAS
    // ----------------------------------------

    function mostrarEtapa(numeroEtapa) {

        etapaAtual = numeroEtapa;

        etapas.forEach(etapa => {
            etapa.classList.toggle(
                "active",
                Number(etapa.dataset.step) === etapaAtual
            );
        });

        const progresso = (etapaAtual / TOTAL_ETAPAS) * 100;

        barra.style.width = `${progresso}%`;
        legenda.textContent = `Etapa ${etapaAtual} de ${TOTAL_ETAPAS}`;
        percentual.textContent = `${progresso}%`;

        voltar.hidden = etapaAtual === 1;
        avancar.hidden = etapaAtual === TOTAL_ETAPAS;
        finalizar.hidden = etapaAtual !== TOTAL_ETAPAS;

        limparErro();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // ----------------------------------------
    // VALIDAÇÃO
    // ----------------------------------------

    function validarEtapa(numeroEtapa) {

        if (numeroEtapa === 1) {

            if (numero("carroValor") <= 0) {
                mostrarErro("Informe um valor válido para o veículo.");
                return false;
            }

            if (!campo("carroModelo")) {
                mostrarErro("Informe o modelo do veículo.");
                return false;
            }

            if (!campo("carroCondicao")) {
                mostrarErro("Selecione se o veículo é novo ou usado.");
                return false;
            }

            return true;
        }

        if (numeroEtapa === 2) {

            const renda = numero("carroRenda");
            const despesas = numero("carroDespesas");
            const entrada = numero("carroEntrada");

            if (renda <= 0) {
                mostrarErro("Informe uma renda mensal válida.");
                return false;
            }

            if (despesas < 0 || despesas >= renda) {
                mostrarErro("As despesas devem ser menores que sua renda.");
                return false;
            }

            if (entrada < 0) {
                mostrarErro("Informe um valor válido para a entrada.");
                return false;
            }

            if (entrada > numero("carroValor")) {
                mostrarErro("A entrada não pode ser maior que o valor do veículo.");
                return false;
            }

            return true;
        }

        if (numeroEtapa === 3) {

            const juros = numero("carroJuros");
            const combustivel = numero("carroCombustivel");
            const outrosCustos = numero("carroOutrosCustos");

            if (juros < 0 || juros > 100) {
                mostrarErro("Informe uma taxa anual entre 0 e 100%.");
                return false;
            }

            if (combustivel < 0 || outrosCustos < 0) {
                mostrarErro("Os custos mensais não podem ser negativos.");
                return false;
            }

            return true;
        }

        return true;
    }

    // ----------------------------------------
    // CÁLCULO PRICE
    // ----------------------------------------

    function calcularPrice(principal, taxa, meses) {

        if (principal <= 0) {
            return {
                parcela: 0,
                total: 0,
                juros: 0
            };
        }

        let parcela;

        if (taxa === 0) {
            parcela = principal / meses;
        } else {
            parcela =
                principal *
                (taxa * Math.pow(1 + taxa, meses)) /
                (Math.pow(1 + taxa, meses) - 1);
        }

        const total = parcela * meses;

        return {
            parcela,
            total,
            juros: total - principal
        };
    }

    // ----------------------------------------
    // CÁLCULO SAC
    // ----------------------------------------

    function calcularSAC(principal, taxa, meses) {

        if (principal <= 0) {
            return {
                primeira: 0,
                ultima: 0,
                total: 0,
                juros: 0
            };
        }

        const amortizacao = principal / meses;

        let saldo = principal;
        let total = 0;
        let primeira = 0;
        let ultima = 0;

        for (let i = 1; i <= meses; i++) {

            const juros = saldo * taxa;
            const parcela = amortizacao + juros;

            if (i === 1) {
                primeira = parcela;
            }

            ultima = parcela;
            total += parcela;

            saldo -= amortizacao;
        }

        return {
            primeira,
            ultima,
            total,
            juros: total - principal
        };
    }

    // ----------------------------------------
    // GERAÇÃO DO RESULTADO
    // ----------------------------------------

    function calcularResultado() {

        const valorVeiculo = numero("carroValor");
        const entrada = numero("carroEntrada");

        const renda = numero("carroRenda");
        const despesas = numero("carroDespesas");

        const meses = numero("carroPrazo");

        const taxaAnual = numero("carroJuros") / 100;
        const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

        const combustivel = numero("carroCombustivel");
        const outrosCustos = numero("carroOutrosCustos");

        const sistema = campo("carroSistema");

        const valorFinanciado = Math.max(0, valorVeiculo - entrada);

        let calculo;

        if (sistema === "PRICE") {

            const price = calcularPrice(
                valorFinanciado,
                taxaMensal,
                meses
            );

            calculo = {
                primeira: price.parcela,
                ultima: price.parcela,
                total: price.total,
                juros: price.juros
            };

        } else {

            calculo = calcularSAC(
                valorFinanciado,
                taxaMensal,
                meses
            );

            calculo = {
                primeira: calculo.primeira,
                ultima: calculo.ultima,
                total: calculo.total,
                juros: calculo.juros
            };
        }

        const custosMensais = combustivel + outrosCustos;

        const custoMensalInicial =
            calculo.primeira + custosMensais;

        const custoMensalFinal =
            calculo.ultima + custosMensais;

        const comprometimento =
            renda > 0
                ? (custoMensalInicial / renda) * 100
                : 0;

        const rendaLivre = renda - despesas;

        let analise;

        if (valorFinanciado === 0) {

            analise =
                "O valor disponível para entrada cobre o preço informado do veículo. " +
                "Não há financiamento nesta simulação. Ainda será necessário " +
                "considerar os custos de utilização do carro.";

        } else if (comprometimento <= 30) {

            analise =
                "O custo mensal estimado do veículo representa até 30% da sua renda. " +
                "Isso indica um comprometimento menor, mas não elimina a necessidade " +
                "de manter uma reserva para imprevistos.";

        } else if (comprometimento <= 40) {

            analise =
                "O custo mensal estimado representa uma parcela significativa da sua renda. " +
                "Avalie aumentar a entrada, reduzir o preço do veículo ou rever os custos.";

        } else {

            analise =
                "O custo mensal estimado compromete uma parte elevada da sua renda. " +
                "Considere adiar a compra ou buscar um veículo mais econômico.";
        }

        if (rendaLivre <= custoMensalInicial) {

            analise +=
                " Atenção: após suas despesas atuais, sua renda disponível " +
                "não cobre o custo mensal inicial estimado do veículo.";

        }

        resultadoCalculado = {

            modelo: campo("carroModelo"),
            condicao: campo("carroCondicao"),

            valorVeiculo,
            entrada,
            valorFinanciado,

            renda,
            despesas,
            rendaLivre,

            meses,
            taxaAnual: taxaAnual * 100,
            sistema,

            primeiraParcela: calculo.primeira,
            ultimaParcela: calculo.ultima,

            totalParcelas: calculo.total,
            jurosTotais: calculo.juros,

            combustivel,
            outrosCustos,
            custosMensais,

            custoMensalInicial,
            custoMensalFinal,

            totalComEntrada: entrada + calculo.total,

            comprometimento,
            analise
        };

        renderizarResultado(resultadoCalculado);
    }

    // ----------------------------------------
    // APRESENTAÇÃO DO RESULTADO
    // ----------------------------------------

    function renderizarResultado(dados) {

        resultado.innerHTML = `

            <div class="carro-result-grid">

                <div class="carro-result-card highlight">
                    <span>Valor do veículo</span>
                    <strong>${dinheiro(dados.valorVeiculo)}</strong>
                </div>

                <div class="carro-result-card">
                    <span>Valor da entrada</span>
                    <strong>${dinheiro(dados.entrada)}</strong>
                </div>

                <div class="carro-result-card highlight">
                    <span>Valor financiado</span>
                    <strong>${dinheiro(dados.valorFinanciado)}</strong>
                </div>

                <div class="carro-result-card">
                    <span>Primeira parcela</span>
                    <strong>${dinheiro(dados.primeiraParcela)}</strong>
                </div>

                <div class="carro-result-card">
                    <span>Última parcela</span>
                    <strong>${dinheiro(dados.ultimaParcela)}</strong>
                </div>

                <div class="carro-result-card">
                    <span>Total estimado de juros</span>
                    <strong>${dinheiro(dados.jurosTotais)}</strong>
                </div>

                <div class="carro-result-card">
                    <span>Custos mensais adicionais</span>
                    <strong>${dinheiro(dados.custosMensais)}</strong>
                </div>

                <div class="carro-result-card highlight">
                    <span>Custo mensal inicial estimado</span>
                    <strong>${dinheiro(dados.custoMensalInicial)}</strong>
                </div>

                <div class="carro-result-card">
                    <span>Total das parcelas</span>
                    <strong>${dinheiro(dados.totalParcelas)}</strong>
                </div>

                <div class="carro-result-card highlight">
                    <span>Entrada + parcelas</span>
                    <strong>${dinheiro(dados.totalComEntrada)}</strong>
                </div>

            </div>

            <div class="carro-analysis">

                <h3>Análise do seu planejamento</h3>

                <p>
                    O custo mensal inicial estimado representa
                    <strong>${dados.comprometimento.toFixed(1)}%</strong>
                    da sua renda.
                </p>

                <p>${dados.analise}</p>

                <p>
                    Sua renda após as despesas informadas é de
                    <strong>${dinheiro(dados.rendaLivre)}</strong>.
                </p>

                <p>
                    Veículo: <strong>${dados.modelo}</strong>
                    (${dados.condicao}).
                </p>

                <p>
                    Sistema: <strong>${dados.sistema}</strong>.
                    Prazo: <strong>${dados.meses} meses</strong>.
                </p>

            </div>
        `;
    }

    // ----------------------------------------
    // REGISTRO NO HISTÓRICO
    // ----------------------------------------

    function salvarHistorico() {

        if (!resultadoCalculado || historicoRegistrado) {
            return;
        }

        const dados = {
            categoria: "Comprar carro",
            ...resultadoCalculado
        };

        if (
            window.Meaven &&
            typeof window.Meaven.registrarSimulacao === "function"
        ) {

            window.Meaven.registrarSimulacao(
                "Comprar carro",
                "Planejamento para comprar carro",
                dados
            );

        } else {

            // Fallback temporário para o protótipo.
            const historico = JSON.parse(
                localStorage.getItem("meaven_historico") || "[]"
            );

            historico.push({
                id: Date.now(),
                tipo: "Comprar carro",
                titulo: "Planejamento para comprar carro",
                data: new Date().toISOString(),
                dados
            });

            localStorage.setItem(
                "meaven_historico",
                JSON.stringify(historico)
            );
        }

        historicoRegistrado = true;
    }

    // ----------------------------------------
    // EVENTOS
    // ----------------------------------------

    avancar.addEventListener("click", () => {

        if (!validarEtapa(etapaAtual)) {
            return;
        }

        if (etapaAtual < TOTAL_ETAPAS) {
            mostrarEtapa(etapaAtual + 1);
        }
    });

    voltar.addEventListener("click", () => {

        if (etapaAtual > 1) {
            mostrarEtapa(etapaAtual - 1);
        }
    });

    finalizar.addEventListener("click", () => {

        limparErro();

        if (!validarEtapa(3)) {
            return;
        }

        calcularResultado();
        salvarHistorico();

        finalizar.disabled = true;
        finalizar.textContent = "Simulação salva";
    });

    // Inicialização
    mostrarEtapa(1);

});

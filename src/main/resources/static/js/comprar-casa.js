// ============================================
// MEAVEN - SIMULAÇÃO COMPRAR CASA
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const etapas = document.querySelectorAll(".simulation-step");

    const previousButton = document.getElementById("previousButton");
    const nextButton = document.getElementById("nextButton");
    const finishButton = document.getElementById("finishButton");

    const progressBar = document.getElementById("progressBar");
    const stepLabel = document.getElementById("stepLabel");
    const progressPercent = document.getElementById("progressPercent");

    const formError = document.getElementById("formError");
    const resultContent = document.getElementById("resultContent");

    let etapaAtual = 1;
    const totalEtapas = 4;

    let resultadoFinal = null;

    function valor(id) {
        return Number(document.getElementById(id).value);
    }

    function texto(id) {
        return document.getElementById(id).value.trim();
    }

    function moeda(numero) {
        return Number(numero).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function mostrarErro(mensagem) {
        formError.textContent = mensagem;
        formError.classList.add("visible");
    }

    function limparErro() {
        formError.textContent = "";
        formError.classList.remove("visible");
    }

    function mostrarEtapa(numero) {

        etapaAtual = numero;

        etapas.forEach(etapa => {
            etapa.classList.toggle(
                "active",
                Number(etapa.dataset.step) === numero
            );
        });

        const percentual = (numero / totalEtapas) * 100;

        progressBar.style.width = `${percentual}%`;
        stepLabel.textContent = `Etapa ${numero} de ${totalEtapas}`;
        progressPercent.textContent = `${percentual}%`;

        previousButton.hidden = numero === 1;
        nextButton.hidden = numero === totalEtapas;
        finishButton.hidden = numero !== totalEtapas;

        limparErro();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function validarEtapa(numero) {

        if (numero === 1) {

            if (valor("propertyValue") <= 0) {
                mostrarErro("Informe um valor válido para o imóvel.");
                return false;
            }

            if (!texto("propertyType")) {
                mostrarErro("Selecione o tipo de imóvel.");
                return false;
            }

            return true;
        }

        if (numero === 2) {

            const renda = valor("monthlyIncome");
            const despesas = valor("monthlyExpenses");
            const entrada = valor("availableEntry");

            if (renda <= 0) {
                mostrarErro("Informe uma renda mensal válida.");
                return false;
            }

            if (despesas < 0 || despesas >= renda) {
                mostrarErro("As despesas devem ser menores que a renda.");
                return false;
            }

            if (entrada < 0) {
                mostrarErro("Informe uma entrada válida.");
                return false;
            }

            return true;
        }

        if (numero === 3) {

            const taxa = valor("interestRate");

            if (taxa < 0 || taxa > 100) {
                mostrarErro("Informe uma taxa anual entre 0 e 100%.");
                return false;
            }

            return true;
        }

        return true;
    }

    function calcularPrice(principal, taxaMensal, quantidade) {

        if (principal <= 0) return {
            parcela: 0,
            total: 0,
            juros: 0
        };

        let parcela;

        if (taxaMensal === 0) {
            parcela = principal / quantidade;
        } else {
            parcela = principal *
                (taxaMensal * Math.pow(1 + taxaMensal, quantidade)) /
                (Math.pow(1 + taxaMensal, quantidade) - 1);
        }

        const total = parcela * quantidade;

        return {
            parcela,
            total,
            juros: total - principal
        };
    }

    function calcularSAC(principal, taxaMensal, quantidade) {

        if (principal <= 0) return {
            primeiraParcela: 0,
            ultimaParcela: 0,
            total: 0,
            juros: 0
        };

        const amortizacao = principal / quantidade;

        let saldo = principal;
        let total = 0;
        let primeiraParcela = 0;
        let ultimaParcela = 0;

        for (let i = 1; i <= quantidade; i++) {

            const juros = saldo * taxaMensal;
            const parcela = amortizacao + juros;

            if (i === 1) primeiraParcela = parcela;

            ultimaParcela = parcela;
            total += parcela;

            saldo -= amortizacao;
        }

        return {
            primeiraParcela,
            ultimaParcela,
            total,
            juros: total - principal
        };
    }

    function gerarResultado() {

        const imovel = valor("propertyValue");
        const entrada = valor("availableEntry");
        const renda = valor("monthlyIncome");
        const despesas = valor("monthlyExpenses");

        const anos = valor("financingMonths");
        const meses = anos * 12;

        const taxaAnual = valor("interestRate") / 100;
        const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

        const financiado = Math.max(0, imovel - entrada);

        const sistema = texto("financingSystem");

        let calculo;

        if (sistema === "PRICE") {
            const price = calcularPrice(
                financiado,
                taxaMensal,
                meses
            );

            calculo = {
                primeiraParcela: price.parcela,
                ultimaParcela: price.parcela,
                total: price.total,
                juros: price.juros
            };

        } else {
            calculo = calcularSAC(
                financiado,
                taxaMensal,
                meses
            );
        }

        const totalGeral = entrada + calculo.total;

        const comprometimento =
            renda > 0
                ? (calculo.primeiraParcela / renda) * 100
                : 0;

        const rendaDisponivel = renda - despesas;

        let analise;

        if (comprometimento <= 30) {
            analise = "A primeira parcela representa até 30% da sua renda mensal. Mesmo assim, considere despesas imprevistas e outros custos do imóvel.";
        } else if (comprometimento <= 40) {
            analise = "A parcela representa uma parte significativa da sua renda. Avalie reduzir o valor financiado, aumentar a entrada ou ampliar seu planejamento.";
        } else {
            analise = "A parcela estimada compromete uma parcela elevada da sua renda. É recomendável rever o orçamento antes de assumir esse financiamento.";
        }

        if (financiado === 0) {
            analise = "Sua entrada cobre o valor informado do imóvel. Não há saldo a financiar nesta simulação. Lembre-se de considerar documentação e outros custos da compra.";
        }

        if (rendaDisponivel <= 0) {
            analise += " Suas despesas atuais consomem toda a renda informada, portanto é importante reorganizar o orçamento.";
        }

        resultadoFinal = {
            imovel,
            entrada,
            financiado,
            renda,
            despesas,
            rendaDisponivel,
            anos,
            meses,
            taxaAnual: taxaAnual * 100,
            sistema,
            primeiraParcela: calculo.primeiraParcela,
            ultimaParcela: calculo.ultimaParcela,
            juros: calculo.juros,
            totalParcelas: calculo.total,
            totalGeral,
            comprometimento,
            analise,
            tipoImovel: texto("propertyType"),
            localizacao: texto("propertyLocation")
        };

        resultContent.innerHTML = `

            <div class="result-grid">

                <div class="result-card highlight">
                    <span>Valor do imóvel</span>
                    <strong>${moeda(imovel)}</strong>
                </div>

                <div class="result-card">
                    <span>Valor da entrada</span>
                    <strong>${moeda(entrada)}</strong>
                </div>

                <div class="result-card highlight">
                    <span>Valor financiado</span>
                    <strong>${moeda(financiado)}</strong>
                </div>

                <div class="result-card">
                    <span>Primeira parcela estimada</span>
                    <strong>${moeda(calculo.primeiraParcela)}</strong>
                </div>

                <div class="result-card">
                    <span>Última parcela estimada</span>
                    <strong>${moeda(calculo.ultimaParcela)}</strong>
                </div>

                <div class="result-card">
                    <span>Total estimado de juros</span>
                    <strong>${moeda(calculo.juros)}</strong>
                </div>

                <div class="result-card">
                    <span>Total das parcelas</span>
                    <strong>${moeda(calculo.total)}</strong>
                </div>

                <div class="result-card highlight">
                    <span>Entrada + parcelas</span>
                    <strong>${moeda(totalGeral)}</strong>
                </div>

            </div>

            <div class="result-analysis">

                <h3>Como está seu planejamento?</h3>

                <p>
                    A primeira parcela representa
                    <strong>${comprometimento.toFixed(1)}%</strong>
                    da sua renda mensal.
                </p>

                <p>${analise}</p>

                <p>
                    Sua renda após as despesas informadas é de
                    <strong>${moeda(rendaDisponivel)}</strong>.
                </p>

                <p>
                    Sistema utilizado: <strong>${sistema}</strong>.
                    Prazo: <strong>${anos} anos (${meses} meses)</strong>.
                </p>

            </div>
        `;

    }

    function salvarHistorico() {

        if (!resultadoFinal) return;

        const dados = {
            categoria: "Comprar casa",
            ...resultadoFinal
        };

        if (window.Meaven &&
            typeof window.Meaven.registrarSimulacao === "function") {

            window.Meaven.registrarSimulacao(
                "Comprar casa",
                "Planejamento para comprar casa",
                dados
            );

        } else {

            // Fallback temporário para o protótipo front-end.
            const historico = JSON.parse(
                localStorage.getItem("meaven_historico") || "[]"
            );

            historico.push({
                id: Date.now(),
                tipo: "Comprar casa",
                titulo: "Planejamento para comprar casa",
                data: new Date().toISOString(),
                dados
            });

            localStorage.setItem(
                "meaven_historico",
                JSON.stringify(historico)
            );
        }
    }

    nextButton.addEventListener("click", () => {

        if (!validarEtapa(etapaAtual)) return;

        if (etapaAtual < totalEtapas) {
            mostrarEtapa(etapaAtual + 1);
        }
    });

    previousButton.addEventListener("click", () => {

        if (etapaAtual > 1) {
            mostrarEtapa(etapaAtual - 1);
        }
    });

    finishButton.addEventListener("click", () => {

        limparErro();

        if (!validarEtapa(3)) return;

        gerarResultado();
        salvarHistorico();

        finishButton.disabled = true;
        finishButton.textContent = "Simulação salva";

    });

    mostrarEtapa(1);

});

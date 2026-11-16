
// ========================================
// MEAVEN - SIMULACAO: ABRIR UM NEGOCIO
// ========================================

(() => {
    "use strict";

    const form = document.getElementById("formNegocio");

    if (!form) return;

    const etapas = Array.from(
        document.querySelectorAll(".negocio-etapa")
    );

    const indicadores = Array.from(
        document.querySelectorAll("[data-indicador]")
    );

    const btnAnterior = document.getElementById("btnNegocioAnterior");
    const btnProximo = document.getElementById("btnNegocioProximo");

    const erro = document.getElementById("negocioErro");
    const resultado = document.getElementById("negocioResultado");

    const campos = {
        nomeNegocio: document.getElementById("nomeNegocio"),
        segmentoNegocio: document.getElementById("segmentoNegocio"),
        tipoNegocio: document.getElementById("tipoNegocio"),
        descricaoNegocio: document.getElementById("descricaoNegocio"),

        equipamentos: document.getElementById("equipamentos"),
        estrutura: document.getElementById("estrutura"),
        estoqueInicial: document.getElementById("estoqueInicial"),
        documentacao: document.getElementById("documentacao"),
        outrosInvestimentos: document.getElementById("outrosInvestimentos"),
        mesesReserva: document.getElementById("mesesReserva"),

        capitalDisponivel: document.getElementById("capitalDisponivel"),
        faturamentoMensal: document.getElementById("faturamentoMensal"),
        custosVariaveis: document.getElementById("custosVariaveis"),
        custosFixos: document.getElementById("custosFixos"),
        prolabore: document.getElementById("prolabore"),
        impostosPercentual: document.getElementById("impostosPercentual")
    };

    const idsPorEtapa = [
        ["nomeNegocio", "segmentoNegocio", "tipoNegocio"],
        [
            "equipamentos",
            "estrutura",
            "estoqueInicial",
            "documentacao",
            "outrosInvestimentos",
            "mesesReserva"
        ],
        [
            "capitalDisponivel",
            "faturamentoMensal",
            "custosVariaveis",
            "custosFixos",
            "prolabore",
            "impostosPercentual"
        ]
    ];

    let etapaAtual = 0;
    let simulacaoRegistrada = false;

    // ========================================
    // FUNCOES AUXILIARES
    // ========================================

    function numero(campo) {
        const valor = Number(campo.value);

        return Number.isFinite(valor) ? valor : 0;
    }

    function moeda(valor) {
        if (
            window.Meaven &&
            typeof window.Meaven.moeda === "function"
        ) {
            return window.Meaven.moeda(valor);
        }

        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function escaparHTML(valor) {
        return String(valor).replace(/[&<>"']/g, function (caractere) {
            const substituicoes = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return substituicoes[caractere];
        });
    }

    function percentual(valor) {
        return valor.toFixed(2).replace(".", ",") + "%";
    }

    // ========================================
    // NAVEGACAO
    // ========================================

    function mostrarEtapa(indice) {
        etapaAtual = indice;

        etapas.forEach(function (etapa, i) {
            const ativa = i === indice;

            etapa.hidden = !ativa;
            etapa.classList.toggle("ativa", ativa);
        });

        indicadores.forEach(function (indicador, i) {
            indicador.classList.toggle("ativo", i === indice);
        });

        const progresso = Math.round(
            ((indice + 1) / etapas.length) * 100
        );

        document.getElementById("negocioEtapaTexto").textContent =
            "Etapa " + (indice + 1) + " de " + etapas.length;

        document.getElementById("negocioPercentual").textContent =
            progresso + "%";

        document.getElementById("negocioProgressoBarra").style.width =
            progresso + "%";

        btnAnterior.disabled = indice === 0;

        btnProximo.textContent =
            indice === etapas.length - 1
                ? "Nova simulacao"
                : indice === 2
                    ? "Ver resultado →"
                    : "Continuar →";

        erro.textContent = "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // ========================================
    // VALIDACAO
    // ========================================

    function validarEtapa(indice) {
        const ids = idsPorEtapa[indice];

        for (const id of ids) {
            const campo = campos[id];
            const valor = campo.value.trim();

            if (valor === "") {
                erro.textContent =
                    "Preencha todos os campos obrigatorios desta etapa.";

                campo.focus();
                return false;
            }

            if (campo.type === "number") {
                const valorNumerico = Number(valor);

                if (
                    !Number.isFinite(valorNumerico) ||
                    valorNumerico < 0
                ) {
                    erro.textContent =
                        "Informe valores numericos iguais ou maiores que zero.";

                    campo.focus();
                    return false;
                }
            }
        }

        if (indice === 1) {
            const meses = numero(campos.mesesReserva);

            if (
                !Number.isInteger(meses) ||
                meses < 1 ||
                meses > 6
            ) {
                erro.textContent =
                    "Selecione um periodo de reserva entre 1 e 6 meses.";

                campos.mesesReserva.focus();
                return false;
            }
        }

        if (indice === 2) {
            const variaveis = numero(campos.custosVariaveis);
            const impostos = numero(campos.impostosPercentual);

            if (variaveis > 100) {
                erro.textContent =
                    "Os custos variaveis nao podem ultrapassar 100%.";

                campos.custosVariaveis.focus();
                return false;
            }

            if (impostos > 100) {
                erro.textContent =
                    "Os impostos e taxas estimados nao podem ultrapassar 100%.";

                campos.impostosPercentual.focus();
                return false;
            }

            if (variaveis + impostos >= 100) {
                erro.textContent =
                    "A soma dos custos variaveis e impostos precisa ser menor que 100%.";

                campos.custosVariaveis.focus();
                return false;
            }
        }

        return true;
    }

    // ========================================
    // CALCULO PRINCIPAL
    // ========================================

    function calcularNegocio() {
        // Identificacao
        const nome = campos.nomeNegocio.value.trim();
        const segmento = campos.segmentoNegocio.value;
        const tipo = campos.tipoNegocio.value;
        const descricao = campos.descricaoNegocio.value.trim();

        // Investimento inicial
        const equipamentos = numero(campos.equipamentos);
        const estrutura = numero(campos.estrutura);
        const estoque = numero(campos.estoqueInicial);
        const documentacao = numero(campos.documentacao);
        const outrosInvestimentos = numero(campos.outrosInvestimentos);

        const mesesReserva = numero(campos.mesesReserva);

        const investimentoInicial =
            equipamentos +
            estrutura +
            estoque +
            documentacao +
            outrosInvestimentos;

        // Planejamento mensal
        const capitalDisponivel = numero(campos.capitalDisponivel);
        const faturamento = numero(campos.faturamentoMensal);

        const percentualVariavel =
            numero(campos.custosVariaveis) / 100;

        const custosFixos = numero(campos.custosFixos);
        const prolabore = numero(campos.prolabore);

        const percentualImpostos =
            numero(campos.impostosPercentual) / 100;

        const totalCustosFixos = custosFixos + prolabore;

        const valorCustosVariaveis =
            faturamento * percentualVariavel;

        const valorImpostos =
            faturamento * percentualImpostos;

        // Capital de giro calculado com base nos custos fixos informados.
        const capitalGiro =
            totalCustosFixos * mesesReserva;

        const investimentoTotal =
            investimentoInicial + capitalGiro;

        // Resultado mensal estimado
        const resultadoMensal =
            faturamento -
            valorCustosVariaveis -
            valorImpostos -
            totalCustosFixos;

        const margemContribuicao =
            1 - percentualVariavel - percentualImpostos;

        const pontoEquilibrio =
            margemContribuicao > 0
                ? totalCustosFixos / margemContribuicao
                : null;

        const faltaCapital = Math.max(
            0,
            investimentoTotal - capitalDisponivel
        );

        const sobraCapital = Math.max(
            0,
            capitalDisponivel - investimentoTotal
        );

        const capitalSuficiente =
            capitalDisponivel >= investimentoTotal;

        const retornoMeses =
            resultadoMensal > 0
                ? investimentoTotal / resultadoMensal
                : null;

        let status;

        if (resultadoMensal < 0) {
            status = {
                classe: "negativo",
                titulo: "A previsao mensal apresenta prejuizo.",
                texto: "Com o faturamento e os custos informados, as receitas nao cobrem todas as despesas. Revise os precos, os custos ou a previsao de vendas antes de iniciar."
            };
        } else if (resultadoMensal === 0) {
            status = {
                classe: "atencao",
                titulo: "O negocio esta no limite do equilibrio.",
                texto: "A previsao indica que o faturamento cobre os custos informados, mas nao gera resultado positivo. Uma margem para imprevistos seria importante."
            };
        } else if (!capitalSuficiente) {
            status = {
                classe: "atencao",
                titulo: "A previsao mensal e positiva, mas falta capital para comecar.",
                texto: "O negocio apresenta resultado mensal positivo na estimativa, porem o capital disponivel nao cobre o investimento inicial e a reserva de capital de giro."
            };
        } else {
            status = {
                classe: "positivo",
                titulo: "O planejamento apresenta uma perspectiva positiva.",
                texto: "O capital informado cobre o investimento estimado e a previsao mensal apresenta resultado positivo. Ainda sera necessario validar as vendas, os custos e a demanda do mercado."
            };
        }

        return {
            negocio: {
                nome: nome,
                segmento: segmento,
                tipo: tipo,
                descricao: descricao
            },

            investimento: {
                equipamentos: equipamentos,
                estrutura: estrutura,
                estoqueInicial: estoque,
                documentacao: documentacao,
                outros: outrosInvestimentos,
                investimentoInicial: investimentoInicial,
                mesesReserva: mesesReserva,
                capitalGiro: capitalGiro,
                investimentoTotal: investimentoTotal
            },

            financeiro: {
                capitalDisponivel: capitalDisponivel,
                faturamentoMensal: faturamento,
                percentualCustosVariaveis: percentualVariavel * 100,
                valorCustosVariaveis: valorCustosVariaveis,
                custosFixos: custosFixos,
                prolabore: prolabore,
                totalCustosFixos: totalCustosFixos,
                percentualImpostos: percentualImpostos * 100,
                valorImpostos: valorImpostos,
                resultadoMensal: resultadoMensal,
                margemContribuicao: margemContribuicao * 100,
                pontoEquilibrio: pontoEquilibrio
            },

            analise: {
                capitalSuficiente: capitalSuficiente,
                faltaCapital: faltaCapital,
                sobraCapital: sobraCapital,
                retornoEstimadoMeses: retornoMeses,
                status: status
            }
        };
    }

    // ========================================
    // EXIBICAO DO RESULTADO
    // ========================================

    function exibirResultado(dados) {
        const investimento = dados.investimento;
        const financeiro = dados.financeiro;
        const analise = dados.analise;

        const resultadoPositivo =
            financeiro.resultadoMensal > 0;

        const pontoEquilibrioTexto =
            financeiro.pontoEquilibrio === null
                ? "Nao calculado"
                : moeda(financeiro.pontoEquilibrio);

        const retornoTexto =
            analise.retornoEstimadoMeses === null
                ? "Nao estimado"
                : analise.retornoEstimadoMeses.toFixed(1).replace(".", ",") +
                    " meses";

        let capitalHTML = "";

        if (analise.capitalSuficiente) {
            capitalHTML = `
                <div class="negocio-destaque-financeiro">
                    <strong>Capital suficiente para o investimento estimado</strong>
                    <p>
                        Depois de cobrir o investimento e a reserva de capital
                        de giro, sobrariam ${moeda(analise.sobraCapital)}.
                    </p>
                </div>
            `;
        } else {
            capitalHTML = `
                <div class="negocio-status atencao">
                    <strong>Capital insuficiente para o planejamento atual</strong>
                    Faltariam ${moeda(analise.faltaCapital)} para cobrir
                    o investimento e a reserva de capital de giro.
                </div>
            `;
        }

        resultado.innerHTML = `
            <div class="negocio-status ${analise.status.classe}">
                <strong>${escaparHTML(analise.status.titulo)}</strong>
                ${escaparHTML(analise.status.texto)}
            </div>

            <div class="negocio-resultados-grade">

                <div class="negocio-card-resultado">
                    <span>Investimento inicial</span>
                    <strong>${moeda(investimento.investimentoInicial)}</strong>
                    <small>Estrutura, equipamentos, estoque e demais custos iniciais.</small>
                </div>

                <div class="negocio-card-resultado">
                    <span>Capital de giro</span>
                    <strong>${moeda(investimento.capitalGiro)}</strong>
                    <small>Reserva de ${investimento.mesesReserva} meses de custos fixos e retirada.</small>
                </div>

                <div class="negocio-card-resultado destaque">
                    <span>Capital total necessário</span>
                    <strong>${moeda(investimento.investimentoTotal)}</strong>
                    <small>Investimento inicial somado ao capital de giro.</small>
                </div>

                <div class="negocio-card-resultado destaque">
                    <span>Resultado mensal estimado</span>
                    <strong>${moeda(financeiro.resultadoMensal)}</strong>
                    <small>Faturamento menos os custos e despesas informados.</small>
                </div>

            </div>

            ${capitalHTML}

            <div class="negocio-bloco">
                <h3>Detalhamento do investimento</h3>

                <table class="negocio-tabela">
                    <tbody>
                        <tr>
                            <th>Equipamentos e ferramentas</th>
                            <td>${moeda(investimento.equipamentos)}</td>
                        </tr>

                        <tr>
                            <th>Estrutura, reforma e instalações</th>
                            <td>${moeda(investimento.estrutura)}</td>
                        </tr>

                        <tr>
                            <th>Estoque ou materiais iniciais</th>
                            <td>${moeda(investimento.estoqueInicial)}</td>
                        </tr>

                        <tr>
                            <th>Documentação e regularização</th>
                            <td>${moeda(investimento.documentacao)}</td>
                        </tr>

                        <tr>
                            <th>Outros custos iniciais</th>
                            <td>${moeda(investimento.outros)}</td>
                        </tr>

                        <tr>
                            <th>Investimento inicial</th>
                            <td><strong>${moeda(investimento.investimentoInicial)}</strong></td>
                        </tr>

                        <tr>
                            <th>Reserva de capital de giro</th>
                            <td>${moeda(investimento.capitalGiro)}</td>
                        </tr>

                        <tr>
                            <th>Capital total necessário</th>
                            <td><strong>${moeda(investimento.investimentoTotal)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="negocio-bloco">
                <h3>Projeção financeira mensal</h3>

                <table class="negocio-tabela">
                    <tbody>
                        <tr>
                            <th>Faturamento esperado</th>
                            <td>${moeda(financeiro.faturamentoMensal)}</td>
                        </tr>

                        <tr>
                            <th>Custos variáveis (${percentual(financeiro.percentualCustosVariaveis)})</th>
                            <td>${moeda(financeiro.valorCustosVariaveis)}</td>
                        </tr>

                        <tr>
                            <th>Custos fixos</th>
                            <td>${moeda(financeiro.custosFixos)}</td>
                        </tr>

                        <tr>
                            <th>Retirada do proprietário</th>
                            <td>${moeda(financeiro.prolabore)}</td>
                        </tr>

                        <tr>
                            <th>Impostos e taxas estimados (${percentual(financeiro.percentualImpostos)})</th>
                            <td>${moeda(financeiro.valorImpostos)}</td>
                        </tr>

                        <tr>
                            <th>Resultado mensal estimado</th>
                            <td><strong>${moeda(financeiro.resultadoMensal)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="negocio-bloco">
                <h3>Indicadores para sua decisão</h3>

                <table class="negocio-tabela">
                    <tbody>
                        <tr>
                            <th>Capital disponível</th>
                            <td>${moeda(financeiro.capitalDisponivel)}</td>
                        </tr>

                        <tr>
                            <th>Capital que falta</th>
                            <td>${moeda(analise.faltaCapital)}</td>
                        </tr>

                        <tr>
                            <th>Ponto de equilíbrio mensal</th>
                            <td>${pontoEquilibrioTexto}</td>
                        </tr>

                        <tr>
                            <th>Prazo estimado para recuperar o capital</th>
                            <td>${retornoTexto}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="negocio-destaque-financeiro">
                <strong>O que esses números significam?</strong>
                <p>
                    ${
                        resultadoPositivo
                            ? "A previsao indica que o negocio pode gerar um resultado mensal positivo. O prazo de retorno e uma estimativa simplificada, considerando que esse resultado se mantenha constante."
                            : "A previsao nao apresenta resultado mensal positivo. Antes de investir, avalie como aumentar o faturamento ou reduzir os custos."
                    }
                </p>
            </div>
        `;
    }

    // ========================================
    // HISTORICO
    // ========================================

    function salvarHistorico(dados) {
        if (simulacaoRegistrada) return;

        const registro = {
            negocio: dados.negocio,
            investimento: dados.investimento,
            financeiro: dados.financeiro,
            analise: dados.analise
        };

        try {
            if (
                window.Meaven &&
                typeof window.Meaven.registrarSimulacao === "function"
            ) {
                window.Meaven.registrarSimulacao(
                    "abrir-negocio",
                    "Simulacao para abrir um negocio",
                    registro
                );
            } else {
                const chave = "meaven_historico";

                const historico = JSON.parse(
                    localStorage.getItem(chave) || "[]"
                );

                historico.push({
                    id: Date.now(),
                    tipo: "abrir-negocio",
                    titulo: "Simulacao para abrir um negocio",
                    data: new Date().toISOString(),
                    dados: registro
                });

                localStorage.setItem(
                    chave,
                    JSON.stringify(historico)
                );
            }

            simulacaoRegistrada = true;

        } catch (erroHistorico) {
            console.error(
                "Erro ao salvar a simulacao no historico:",
                erroHistorico
            );

            erro.textContent =
                "O resultado foi calculado, mas nao foi possivel salvar no historico.";
        }
    }

    // ========================================
    // FINALIZAR E REINICIAR
    // ========================================

    function finalizarSimulacao() {
        const dados = calcularNegocio();

        exibirResultado(dados);
        mostrarEtapa(3);
        salvarHistorico(dados);
    }

    function reiniciarSimulacao() {
        form.reset();

        campos.equipamentos.value = "0";
        campos.estrutura.value = "0";
        campos.estoqueInicial.value = "0";
        campos.documentacao.value = "0";
        campos.outrosInvestimentos.value = "0";
        campos.mesesReserva.value = "2";
        campos.prolabore.value = "0";
        campos.impostosPercentual.value = "0";

        resultado.innerHTML = "";

        simulacaoRegistrada = false;

        mostrarEtapa(0);
    }

    // ========================================
    // EVENTOS
    // ========================================

    btnAnterior.addEventListener("click", function () {
        if (etapaAtual > 0) {
            mostrarEtapa(etapaAtual - 1);
        }
    });

    btnProximo.addEventListener("click", function () {
        if (etapaAtual === etapas.length - 1) {
            reiniciarSimulacao();
            return;
        }

        if (!validarEtapa(etapaAtual)) {
            return;
        }

        if (etapaAtual === 2) {
            finalizarSimulacao();
            return;
        }

        mostrarEtapa(etapaAtual + 1);
    });

    // ========================================
    // INICIALIZACAO
    // ========================================

    if (
        window.Meaven &&
        typeof window.Meaven.atualizarCabecalho === "function"
    ) {
        window.Meaven.atualizarCabecalho();
    }

    mostrarEtapa(0);

})();


// ========================================
// MEAVEN - SIMULACAO: QUITAR UMA DIVIDA
// ========================================

(() => {
    "use strict";

    const form = document.getElementById("formDivida");

    if (!form) return;

    const etapas = Array.from(
        document.querySelectorAll(".divida-etapa")
    );

    const indicadores = Array.from(
        document.querySelectorAll("[data-indicador]")
    );

    const btnAnterior = document.getElementById("btnDividaAnterior");
    const btnProximo = document.getElementById("btnDividaProximo");

    const erro = document.getElementById("dividaErro");
    const resultado = document.getElementById("dividaResultado");

    const campos = {
        nomeCredor: document.getElementById("nomeCredor"),
        tipoDivida: document.getElementById("tipoDivida"),
        saldoDevedor: document.getElementById("saldoDevedor"),
        jurosMensais: document.getElementById("jurosMensais"),
        pagamentoMinimo: document.getElementById("pagamentoMinimo"),
        rendaMensal: document.getElementById("rendaMensal"),
        despesasMensais: document.getElementById("despesasMensais"),
        outrasDividas: document.getElementById("outrasDividas"),
        valorAdicional: document.getElementById("valorAdicional")
    };

    const idsPorEtapa = [
        [
            "nomeCredor",
            "tipoDivida",
            "saldoDevedor",
            "jurosMensais",
            "pagamentoMinimo"
        ],
        [
            "rendaMensal",
            "despesasMensais",
            "outrasDividas"
        ],
        [
            "valorAdicional"
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

        const percentual = Math.round(
            ((indice + 1) / etapas.length) * 100
        );

        document.getElementById("dividaEtapaTexto").textContent =
            "Etapa " + (indice + 1) + " de " + etapas.length;

        document.getElementById("dividaPercentual").textContent =
            percentual + "%";

        document.getElementById("dividaProgressoBarra").style.width =
            percentual + "%";

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

        if (indice === 0) {
            if (numero(campos.saldoDevedor) <= 0) {
                erro.textContent =
                    "O saldo devedor precisa ser maior que zero.";

                campos.saldoDevedor.focus();
                return false;
            }

            if (numero(campos.pagamentoMinimo) <= 0) {
                erro.textContent =
                    "O pagamento minimo precisa ser maior que zero.";

                campos.pagamentoMinimo.focus();
                return false;
            }

            if (numero(campos.jurosMensais) > 100) {
                erro.textContent =
                    "Informe uma taxa mensal de ate 100%.";

                campos.jurosMensais.focus();
                return false;
            }
        }

        if (indice === 1) {
            const renda = numero(campos.rendaMensal);
            const despesas = numero(campos.despesasMensais);
            const outrasDividas = numero(campos.outrasDividas);

            if (renda <= 0) {
                erro.textContent =
                    "A renda mensal precisa ser maior que zero.";

                campos.rendaMensal.focus();
                return false;
            }

            if (despesas + outrasDividas > renda) {
                erro.textContent =
                    "Suas despesas e outras dividas ultrapassam a renda informada. Confira os valores.";

                campos.despesasMensais.focus();
                return false;
            }
        }

        return true;
    }

    // ========================================
    // SIMULACAO DE UM PLANO DE PAGAMENTO
    // ========================================

    function simularPagamento(saldoInicial, taxa, pagamentoMensal) {
        let saldo = saldoInicial;
        let totalPago = 0;
        let totalJuros = 0;
        const parcelas = [];

        for (let mes = 1; mes <= 600; mes++) {
            const juros = saldo * taxa;

            // O pagamento precisa superar os juros para reduzir a divida.
            if (pagamentoMensal <= juros) {
                return {
                    quitada: false,
                    motivo: "O pagamento mensal nao cobre os juros da divida.",
                    meses: null,
                    totalPago: null,
                    totalJuros: null,
                    parcelas: parcelas
                };
            }

            const valorTotalDevido = saldo + juros;
            const pagamento = Math.min(
                pagamentoMensal,
                valorTotalDevido
            );

            const amortizacao = pagamento - juros;

            saldo = Math.max(0, saldo - amortizacao);
            totalPago += pagamento;
            totalJuros += juros;

            parcelas.push({
                mes: mes,
                pagamento: pagamento,
                juros: juros,
                amortizacao: amortizacao,
                saldoRestante: saldo
            });

            if (saldo <= 0.01) {
                saldo = 0;

                return {
                    quitada: true,
                    meses: mes,
                    totalPago: totalPago,
                    totalJuros: totalJuros,
                    parcelas: parcelas
                };
            }
        }

        return {
            quitada: false,
            motivo: "O prazo ultrapassou o limite de 600 meses.",
            meses: null,
            totalPago: null,
            totalJuros: null,
            parcelas: parcelas
        };
    }

    // ========================================
    // ATUALIZAR RESUMO DA ETAPA 3
    // ========================================

    function atualizarResumoPlano() {
        const minimo = numero(campos.pagamentoMinimo);
        const adicional = numero(campos.valorAdicional);

        document.getElementById("resumoPagamentoMinimo").textContent =
            moeda(minimo);

        document.getElementById("resumoPagamentoTotal").textContent =
            moeda(minimo + adicional);
    }

    campos.valorAdicional.addEventListener("input", atualizarResumoPlano);

    // ========================================
    // CALCULO PRINCIPAL
    // ========================================

    function calcularSimulacao() {
        const saldo = numero(campos.saldoDevedor);
        const taxaPercentual = numero(campos.jurosMensais);
        const taxa = taxaPercentual / 100;

        const pagamentoMinimo = numero(campos.pagamentoMinimo);
        const valorAdicional = numero(campos.valorAdicional);
        const pagamentoPlanejado = pagamentoMinimo + valorAdicional;

        const renda = numero(campos.rendaMensal);
        const despesas = numero(campos.despesasMensais);
        const outrasDividas = numero(campos.outrasDividas);

        const saldoDisponivel =
            renda - despesas - outrasDividas;

        const cenarioMinimo = simularPagamento(
            saldo,
            taxa,
            pagamentoMinimo
        );

        const cenarioPlanejado = simularPagamento(
            saldo,
            taxa,
            pagamentoPlanejado
        );

        let economiaJuros = null;
        let mesesEconomizados = null;

        if (cenarioMinimo.quitada && cenarioPlanejado.quitada) {
            economiaJuros =
                cenarioMinimo.totalJuros - cenarioPlanejado.totalJuros;

            mesesEconomizados =
                cenarioMinimo.meses - cenarioPlanejado.meses;
        }

        let status;

        if (pagamentoMinimo > saldoDisponivel) {
            status = {
                classe: "negativo",
                titulo: "O pagamento minimo ultrapassa seu saldo disponivel.",
                texto: "Com a renda, as despesas e outras dividas informadas, nao sobra dinheiro suficiente para o pagamento minimo. Reavalie seu orcamento e considere conversar com o credor."
            };
        } else if (!cenarioPlanejado.quitada) {
            status = {
                classe: "atencao",
                titulo: "O valor planejado nao consegue quitar a divida.",
                texto: "O pagamento informado nao supera os juros mensais ou o prazo calculado ultrapassa o limite da simulacao. Procure negociar melhores condicoes com o credor."
            };
        } else if (pagamentoPlanejado > saldoDisponivel) {
            status = {
                classe: "atencao",
                titulo: "Seu plano ultrapassa o saldo disponivel.",
                texto: "Embora o valor planejado permita quitar a divida na simulacao, ele e maior do que o dinheiro que sobra depois das despesas e outras dividas."
            };
        } else {
            status = {
                classe: "positivo",
                titulo: "Seu plano cabe no saldo informado.",
                texto: "O pagamento planejado cabe no saldo mensal informado e permite quitar a divida dentro do prazo estimado. Mantenha uma reserva para imprevistos."
            };
        }

        return {
            credor: campos.nomeCredor.value.trim(),
            tipoDivida: campos.tipoDivida.value,
            saldoDevedor: saldo,
            taxaMensalPercentual: taxaPercentual,
            pagamentoMinimo: pagamentoMinimo,
            valorAdicional: valorAdicional,
            pagamentoPlanejado: pagamentoPlanejado,
            rendaMensal: renda,
            despesasMensais: despesas,
            outrasDividas: outrasDividas,
            saldoDisponivel: saldoDisponivel,
            cenarioMinimo: cenarioMinimo,
            cenarioPlanejado: cenarioPlanejado,
            economiaJuros: economiaJuros,
            mesesEconomizados: mesesEconomizados,
            status: status
        };
    }

    // ========================================
    // FORMATACAO DE CENARIOS
    // ========================================

    function textoPrazo(cenario) {
        if (!cenario.quitada) {
            return "Nao sera quitada";
        }

        if (cenario.meses === 1) {
            return "1 mes";
        }

        return cenario.meses + " meses";
    }

    function textoValor(cenario, propriedade) {
        if (!cenario.quitada) {
            return "Nao calculado";
        }

        return moeda(cenario[propriedade]);
    }

    // ========================================
    // EXIBIR RESULTADO
    // ========================================

    function exibirResultado(dados) {
        const minimo = dados.cenarioMinimo;
        const planejado = dados.cenarioPlanejado;

        let economiaHTML = "";

        if (dados.economiaJuros !== null) {
            if (dados.economiaJuros > 0) {
                economiaHTML = `
                    <div class="divida-economia">
                        <strong>Voce pode economizar ${moeda(dados.economiaJuros)} em juros</strong>
                        <p>
                            Pagando o valor adicional, a estimativa e de
                            quitar a divida ${Math.max(0, dados.mesesEconomizados)}
                            ${dados.mesesEconomizados === 1 ? "mes" : "meses"}
                            antes do cenario de pagamento minimo.
                        </p>
                    </div>
                `;
            } else {
                economiaHTML = `
                    <div class="divida-economia">
                        <strong>Compare as condicoes antes de decidir</strong>
                        <p>
                            Com os valores informados, nao houve economia
                            de juros no cenario adicional.
                        </p>
                    </div>
                `;
            }
        } else {
            economiaHTML = `
                <div class="divida-status atencao">
                    <strong>Comparacao incompleta</strong>
                    Nao foi possivel calcular os dois cenarios ate a quitacao.
                    Verifique o pagamento minimo e a taxa de juros.
                </div>
            `;
        }

        resultado.innerHTML = `
            <div class="divida-status ${dados.status.classe}">
                <strong>${escaparHTML(dados.status.titulo)}</strong>
                ${escaparHTML(dados.status.texto)}
            </div>

            <div class="divida-resultados-grade">

                <div class="divida-card-resultado">
                    <span>Divida atual</span>
                    <strong>${moeda(dados.saldoDevedor)}</strong>
                    <small>${escaparHTML(dados.credor)} - ${escaparHTML(dados.tipoDivida)}</small>
                </div>

                <div class="divida-card-resultado destaque">
                    <span>Pagamento mensal planejado</span>
                    <strong>${moeda(dados.pagamentoPlanejado)}</strong>
                    <small>Pagamento minimo mais valor adicional</small>
                </div>

                <div class="divida-card-resultado">
                    <span>Prazo com pagamento minimo</span>
                    <strong>${textoPrazo(minimo)}</strong>
                    <small>Total de juros: ${textoValor(minimo, "totalJuros")}</small>
                </div>

                <div class="divida-card-resultado destaque">
                    <span>Prazo com pagamento planejado</span>
                    <strong>${textoPrazo(planejado)}</strong>
                    <small>Total de juros: ${textoValor(planejado, "totalJuros")}</small>
                </div>

            </div>

            ${economiaHTML}

            <div class="divida-comparacao">
                <h3>Comparacao dos cenarios</h3>

                <table class="divida-tabela">
                    <thead>
                        <tr>
                            <th>Informacao</th>
                            <th>Pagamento minimo</th>
                            <th>Pagamento planejado</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Valor mensal</td>
                            <td>${moeda(dados.pagamentoMinimo)}</td>
                            <td>${moeda(dados.pagamentoPlanejado)}</td>
                        </tr>

                        <tr>
                            <td>Tempo estimado</td>
                            <td>${textoPrazo(minimo)}</td>
                            <td>${textoPrazo(planejado)}</td>
                        </tr>

                        <tr>
                            <td>Total de juros</td>
                            <td>${textoValor(minimo, "totalJuros")}</td>
                            <td>${textoValor(planejado, "totalJuros")}</td>
                        </tr>

                        <tr>
                            <td>Total pago</td>
                            <td>${textoValor(minimo, "totalPago")}</td>
                            <td>${textoValor(planejado, "totalPago")}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="divida-detalhamento">
                <h3>Seu orcamento mensal</h3>

                <table class="divida-tabela">
                    <tbody>
                        <tr>
                            <th>Renda mensal</th>
                            <td>${moeda(dados.rendaMensal)}</td>
                        </tr>

                        <tr>
                            <th>Despesas mensais</th>
                            <td>${moeda(dados.despesasMensais)}</td>
                        </tr>

                        <tr>
                            <th>Outras dividas</th>
                            <td>${moeda(dados.outrasDividas)}</td>
                        </tr>

                        <tr>
                            <th>Saldo disponivel antes desta divida</th>
                            <td>${moeda(dados.saldoDisponivel)}</td>
                        </tr>

                        <tr>
                            <th>Saldo apos pagamento planejado</th>
                            <td>${moeda(dados.saldoDisponivel - dados.pagamentoPlanejado)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p class="divida-orientacao">
                Os resultados consideram a taxa mensal informada e pagamentos
                realizados uma vez por mes. Os juros sao calculados sobre o
                saldo devedor de cada periodo. Os valores sao estimativas
                educativas e podem diferir do saldo apresentado pelo credor.
            </p>
        `;
    }

    // ========================================
    // HISTORICO
    // ========================================

    function salvarHistorico(dados) {
        if (simulacaoRegistrada) return;

        const registro = {
            credor: dados.credor,
            tipoDivida: dados.tipoDivida,
            saldoDevedor: dados.saldoDevedor,
            taxaMensalPercentual: dados.taxaMensalPercentual,
            pagamentoMinimo: dados.pagamentoMinimo,
            valorAdicional: dados.valorAdicional,
            pagamentoPlanejado: dados.pagamentoPlanejado,
            rendaMensal: dados.rendaMensal,
            despesasMensais: dados.despesasMensais,
            outrasDividas: dados.outrasDividas,
            saldoDisponivel: dados.saldoDisponivel,
            cenarioMinimo: {
                quitada: dados.cenarioMinimo.quitada,
                meses: dados.cenarioMinimo.meses,
                totalPago: dados.cenarioMinimo.totalPago,
                totalJuros: dados.cenarioMinimo.totalJuros
            },
            cenarioPlanejado: {
                quitada: dados.cenarioPlanejado.quitada,
                meses: dados.cenarioPlanejado.meses,
                totalPago: dados.cenarioPlanejado.totalPago,
                totalJuros: dados.cenarioPlanejado.totalJuros
            },
            economiaJuros: dados.economiaJuros,
            mesesEconomizados: dados.mesesEconomizados,
            status: dados.status.titulo
        };

        try {
            if (
                window.Meaven &&
                typeof window.Meaven.registrarSimulacao === "function"
            ) {
                window.Meaven.registrarSimulacao(
                    "quitar-divida",
                    "Simulacao para quitar uma divida",
                    registro
                );
            } else {
                const chave = "meaven_historico";

                const historico = JSON.parse(
                    localStorage.getItem(chave) || "[]"
                );

                historico.push({
                    id: Date.now(),
                    tipo: "quitar-divida",
                    titulo: "Simulacao para quitar uma divida",
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
        const dados = calcularSimulacao();

        exibirResultado(dados);
        mostrarEtapa(3);
        salvarHistorico(dados);
    }

    function reiniciarSimulacao() {
        form.reset();

        campos.outrasDividas.value = "0";
        campos.valorAdicional.value = "0";

        resultado.innerHTML = "";

        simulacaoRegistrada = false;

        atualizarResumoPlano();
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

        if (etapaAtual === 1) {
            atualizarResumoPlano();
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

    atualizarResumoPlano();
    mostrarEtapa(0);

})();

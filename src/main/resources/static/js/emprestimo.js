
// ========================================
// MEAVEN - SIMULACAO: EMPRESTIMO
// ========================================

(() => {
    "use strict";

    const form = document.getElementById("formEmprestimo");

    if (!form) return;

    const etapas = Array.from(
        document.querySelectorAll(".emprestimo-etapa")
    );

    const indicadores = Array.from(
        document.querySelectorAll("[data-indicador]")
    );

    const btnAnterior = document.getElementById("btnAnterior");
    const btnProximo = document.getElementById("btnProximo");
    const erro = document.getElementById("emprestimoErro");
    const resultado = document.getElementById("emprestimoResultado");

    let etapaAtual = 0;
    let simulacaoRegistrada = false;

    const campos = {
        valorEmprestimo: document.getElementById("valorEmprestimo"),
        finalidade: document.getElementById("finalidade"),
        taxaMensal: document.getElementById("taxaMensal"),
        prazoMeses: document.getElementById("prazoMeses"),
        metodoPagamento: document.getElementById("metodoPagamento"),
        tarifas: document.getElementById("tarifas"),
        rendaMensal: document.getElementById("rendaMensal"),
        despesasMensais: document.getElementById("despesasMensais"),
        outrasDividas: document.getElementById("outrasDividas")
    };

    const idsPorEtapa = [
        ["valorEmprestimo", "finalidade"],
        ["taxaMensal", "prazoMeses", "metodoPagamento", "tarifas"],
        ["rendaMensal", "despesasMensais", "outrasDividas"]
    ];

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
    // NAVEGACAO ENTRE ETAPAS
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

        document.getElementById("emprestimoEtapaTexto").textContent =
            "Etapa " + (indice + 1) + " de " + etapas.length;

        document.getElementById("emprestimoPercentual").textContent =
            percentual + "%";

        document.getElementById("emprestimoProgressoBarra").style.width =
            percentual + "%";

        btnAnterior.disabled = indice === 0;

        btnProximo.textContent =
            indice === etapas.length - 1
                ? "Nova simulacao"
                : "Continuar →";

        erro.textContent = "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // ========================================
    // VALIDACAO DOS CAMPOS
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

                if (!Number.isFinite(valorNumerico) || valorNumerico < 0) {
                    erro.textContent =
                        "Informe valores numericos iguais ou maiores que zero.";

                    campo.focus();
                    return false;
                }
            }
        }

        if (indice === 0 && numero(campos.valorEmprestimo) <= 0) {
            erro.textContent =
                "O valor do emprestimo precisa ser maior que zero.";

            campos.valorEmprestimo.focus();
            return false;
        }

        if (indice === 1) {
            const taxa = numero(campos.taxaMensal);
            const prazo = numero(campos.prazoMeses);

            if (taxa > 100) {
                erro.textContent =
                    "Informe uma taxa mensal de ate 100% para esta simulacao.";

                campos.taxaMensal.focus();
                return false;
            }

            if (
                !Number.isInteger(prazo) ||
                prazo < 1 ||
                prazo > 600
            ) {
                erro.textContent =
                    "O prazo deve ser um numero inteiro entre 1 e 600 meses.";

                campos.prazoMeses.focus();
                return false;
            }
        }

        return true;
    }

    // ========================================
    // CALCULO PRICE
    // ========================================

    function calcularPrice(valor, taxa, prazo) {
        let parcela;

        if (taxa === 0) {
            parcela = valor / prazo;
        } else {
            const fator = Math.pow(1 + taxa, prazo);

            parcela =
                valor * (taxa * fator) / (fator - 1);
        }

        const parcelas = [];
        let saldo = valor;
        let totalJuros = 0;

        for (let mes = 1; mes <= prazo; mes++) {
            const juros = saldo * taxa;
            let amortizacao = parcela - juros;

            if (mes === prazo) {
                amortizacao = saldo;
            }

            const valorParcela = amortizacao + juros;

            saldo = Math.max(0, saldo - amortizacao);
            totalJuros += juros;

            parcelas.push({
                mes: mes,
                parcela: valorParcela,
                juros: juros,
                amortizacao: amortizacao,
                saldoDevedor: saldo
            });
        }

        return {
            parcelas: parcelas,
            totalJuros: totalJuros,
            totalParcelas: parcelas.reduce(function (soma, item) {
                return soma + item.parcela;
            }, 0),
            primeiraParcela: parcelas[0].parcela,
            ultimaParcela: parcelas[parcelas.length - 1].parcela
        };
    }

    // ========================================
    // CALCULO SAC
    // ========================================

    function calcularSAC(valor, taxa, prazo) {
        const amortizacaoBase = valor / prazo;

        let saldo = valor;
        let totalJuros = 0;

        const parcelas = [];

        for (let mes = 1; mes <= prazo; mes++) {
            const juros = saldo * taxa;

            const amortizacao =
                mes === prazo ? saldo : amortizacaoBase;

            const valorParcela = amortizacao + juros;

            saldo = Math.max(0, saldo - amortizacao);
            totalJuros += juros;

            parcelas.push({
                mes: mes,
                parcela: valorParcela,
                juros: juros,
                amortizacao: amortizacao,
                saldoDevedor: saldo
            });
        }

        return {
            parcelas: parcelas,
            totalJuros: totalJuros,
            totalParcelas: parcelas.reduce(function (soma, item) {
                return soma + item.parcela;
            }, 0),
            primeiraParcela: parcelas[0].parcela,
            ultimaParcela: parcelas[parcelas.length - 1].parcela
        };
    }

    // ========================================
    // CALCULO PRINCIPAL
    // ========================================

    function calcularEmprestimo() {
        const valor = numero(campos.valorEmprestimo);
        const taxaPercentual = numero(campos.taxaMensal);
        const taxa = taxaPercentual / 100;
        const prazo = numero(campos.prazoMeses);
        const tarifas = numero(campos.tarifas);

        const metodo = campos.metodoPagamento.value;

        const calculo = metodo === "sac"
            ? calcularSAC(valor, taxa, prazo)
            : calcularPrice(valor, taxa, prazo);

        const renda = numero(campos.rendaMensal);
        const despesas = numero(campos.despesasMensais);
        const outrasDividas = numero(campos.outrasDividas);

        const saldoAntes = renda - despesas - outrasDividas;

        const saldoDepois =
            saldoAntes - calculo.primeiraParcela;

        const comprometimento = renda > 0
            ? ((outrasDividas + calculo.primeiraParcela) / renda) * 100
            : null;

        let status;

        if (renda === 0) {
            status = {
                classe: "atencao",
                titulo: "Nao foi possivel avaliar seu orcamento.",
                texto: "Como a renda informada e zero, nao podemos calcular o comprometimento da renda."
            };
        } else if (saldoDepois < 0) {
            status = {
                classe: "negativo",
                titulo: "A parcela ultrapassa seu orcamento disponivel.",
                texto: "Considerando suas despesas e outras dividas, a primeira parcela deixaria seu orcamento negativo. Avalie reduzir o valor solicitado ou rever as condicoes."
            };
        } else if (comprometimento > 30) {
            status = {
                classe: "atencao",
                titulo: "Atencao ao comprometimento da renda.",
                texto: "As parcelas de outras dividas somadas a nova parcela representam mais de 30% da sua renda. Esse percentual e apenas uma referencia educativa."
            };
        } else {
            status = {
                classe: "positivo",
                titulo: "A parcela cabe no saldo informado.",
                texto: "Com os dados fornecidos, a primeira parcela cabe no valor que sobra apos as despesas e outras dividas. Isso nao garante aprovacao do credito."
            };
        }

        return {
            valorSolicitado: valor,
            finalidade: campos.finalidade.value,
            taxaMensalPercentual: taxaPercentual,
            prazoMeses: prazo,
            metodo: metodo,
            tarifas: tarifas,
            totalJuros: calculo.totalJuros,
            totalParcelas: calculo.totalParcelas,
            totalComTarifas: calculo.totalParcelas + tarifas,
            primeiraParcela: calculo.primeiraParcela,
            ultimaParcela: calculo.ultimaParcela,
            parcelas: calculo.parcelas,
            rendaMensal: renda,
            despesasMensais: despesas,
            outrasDividas: outrasDividas,
            saldoAntesEmprestimo: saldoAntes,
            saldoDepoisEmprestimo: saldoDepois,
            comprometimento: comprometimento,
            status: status
        };
    }

    // ========================================
    // EXIBICAO DO RESULTADO
    // ========================================

    function exibirResultado(dados) {
        const metodoTexto = dados.metodo === "sac"
            ? "SAC - parcelas decrescentes"
            : "Price - parcelas fixas";

        const comprometimentoTexto =
            dados.comprometimento === null
                ? "Nao calculado (renda zero)"
                : dados.comprometimento.toFixed(1).replace(".", ",") + "%";

        resultado.innerHTML = `
            <div class="emprestimo-resumo">

                <div class="emprestimo-indicador">
                    <span>Primeira parcela</span>
                    <strong>${moeda(dados.primeiraParcela)}</strong>
                </div>

                <div class="emprestimo-indicador">
                    <span>Total de juros</span>
                    <strong>${moeda(dados.totalJuros)}</strong>
                </div>

                <div class="emprestimo-indicador">
                    <span>Total das parcelas</span>
                    <strong>${moeda(dados.totalParcelas)}</strong>
                </div>

                <div class="emprestimo-indicador">
                    <span>Total com tarifas informadas</span>
                    <strong>${moeda(dados.totalComTarifas)}</strong>
                </div>

            </div>

            <div class="emprestimo-status ${dados.status.classe}">
                <strong>${escaparHTML(dados.status.titulo)}</strong>
                ${escaparHTML(dados.status.texto)}
            </div>

            <h3>Detalhamento do emprestimo</h3>

            <table class="emprestimo-tabela">
                <tbody>

                    <tr>
                        <th>Valor solicitado</th>
                        <td>${moeda(dados.valorSolicitado)}</td>
                    </tr>

                    <tr>
                        <th>Finalidade</th>
                        <td>${escaparHTML(dados.finalidade)}</td>
                    </tr>

                    <tr>
                        <th>Taxa mensal informada</th>
                        <td>${dados.taxaMensalPercentual.toFixed(2).replace(".", ",")}%</td>
                    </tr>

                    <tr>
                        <th>Prazo</th>
                        <td>${dados.prazoMeses} meses</td>
                    </tr>

                    <tr>
                        <th>Sistema de pagamento</th>
                        <td>${metodoTexto}</td>
                    </tr>

                    <tr>
                        <th>Tarifas adicionais informadas</th>
                        <td>${moeda(dados.tarifas)}</td>
                    </tr>

                    <tr>
                        <th>Ultima parcela</th>
                        <td>${moeda(dados.ultimaParcela)}</td>
                    </tr>

                    <tr>
                        <th>Comprometimento da renda</th>
                        <td>${comprometimentoTexto}</td>
                    </tr>

                </tbody>
            </table>

            <div class="emprestimo-detalhe-parcela">

                <h3>Impacto no seu orcamento mensal</h3>

                <p>
                    Renda mensal:
                    <strong>${moeda(dados.rendaMensal)}</strong>
                </p>

                <p>
                    Despesas mensais:
                    <strong>${moeda(dados.despesasMensais)}</strong>
                </p>

                <p>
                    Outras parcelas de dividas:
                    <strong>${moeda(dados.outrasDividas)}</strong>
                </p>

                <p>
                    Saldo antes do novo emprestimo:
                    <strong>${moeda(dados.saldoAntesEmprestimo)}</strong>
                </p>

                <p>
                    Saldo apos a primeira parcela:
                    <strong>${moeda(dados.saldoDepoisEmprestimo)}</strong>
                </p>

            </div>

            <p class="emprestimo-orientacao">
                ${
                    dados.metodo === "sac"
                        ? "No sistema SAC, a amortizacao e constante e os juros diminuem conforme o saldo devedor e reduzido. Por isso, as parcelas tendem a diminuir ao longo do tempo."
                        : "No sistema Price, as parcelas sao calculadas para permanecer constantes durante o prazo, considerando a taxa mensal informada."
                }
            </p>
        `;
    }

    // ========================================
    // SALVAR NO HISTORICO
    // ========================================

    function salvarHistorico(dados) {
        if (simulacaoRegistrada) return;

        const registro = {
            valorSolicitado: dados.valorSolicitado,
            finalidade: dados.finalidade,
            taxaMensalPercentual: dados.taxaMensalPercentual,
            prazoMeses: dados.prazoMeses,
            metodo: dados.metodo,
            tarifas: dados.tarifas,
            totalJuros: dados.totalJuros,
            totalParcelas: dados.totalParcelas,
            totalComTarifas: dados.totalComTarifas,
            primeiraParcela: dados.primeiraParcela,
            ultimaParcela: dados.ultimaParcela,
            rendaMensal: dados.rendaMensal,
            despesasMensais: dados.despesasMensais,
            outrasDividas: dados.outrasDividas,
            saldoDepoisEmprestimo: dados.saldoDepoisEmprestimo,
            comprometimento: dados.comprometimento,
            status: dados.status.titulo
        };

        try {
            if (
                window.Meaven &&
                typeof window.Meaven.registrarSimulacao === "function"
            ) {
                window.Meaven.registrarSimulacao(
                    "emprestimo",
                    "Simulacao de emprestimo",
                    registro
                );
            } else {
                const chave = "meaven_historico";

                const historico = JSON.parse(
                    localStorage.getItem(chave) || "[]"
                );

                historico.push({
                    id: Date.now(),
                    tipo: "emprestimo",
                    titulo: "Simulacao de emprestimo",
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
                "Nao foi possivel salvar a simulacao no historico:",
                erroHistorico
            );

            erro.textContent =
                "O resultado foi calculado, mas nao foi possivel salvar no historico deste navegador.";
        }
    }

    // ========================================
    // FINALIZAR E REINICIAR
    // ========================================

    function finalizarSimulacao() {
        const dados = calcularEmprestimo();

        exibirResultado(dados);
        mostrarEtapa(3);
        salvarHistorico(dados);
    }

    function reiniciarSimulacao() {
        form.reset();

        campos.tarifas.value = "0";
        campos.outrasDividas.value = "0";
        campos.metodoPagamento.value = "price";

        resultado.innerHTML = "";

        simulacaoRegistrada = false;

        mostrarEtapa(0);
    }

    // ========================================
    // EVENTOS DOS BOTOES
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
        } else {
            mostrarEtapa(etapaAtual + 1);
        }
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

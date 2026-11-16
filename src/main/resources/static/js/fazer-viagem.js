// ========================================
// MEAVEN - SIMULAÇÃO: FAZER UMA VIAGEM
// ========================================

(() => {
    "use strict";

    const form = document.getElementById("formViagem");

    if (!form) return;

    const etapas = Array.from(
        document.querySelectorAll(".viagem-etapa")
    );

    const indicadores = Array.from(
        document.querySelectorAll("[data-indicador]")
    );

    const btnAnterior = document.getElementById("btnAnterior");
    const btnProximo = document.getElementById("btnProximo");
    const erro = document.getElementById("viagemErro");
    const custoParcial = document.getElementById("viagemCustoParcial");
    const resultado = document.getElementById("viagemResultado");

    let etapaAtual = 0;
    let simulacaoRegistrada = false;

    const campos = {
        destino: document.getElementById("destino"),
        pessoas: document.getElementById("pessoas"),
        duracao: document.getElementById("duracao"),
        dataViagem: document.getElementById("dataViagem"),

        transporte: document.getElementById("transporte"),
        hospedagem: document.getElementById("hospedagem"),
        alimentacao: document.getElementById("alimentacao"),
        passeios: document.getElementById("passeios"),
        outrosCustos: document.getElementById("outrosCustos"),

        valorGuardado: document.getElementById("valorGuardado"),
        rendaMensal: document.getElementById("rendaMensal"),
        despesasMensais: document.getElementById("despesasMensais"),
        economiaMensal: document.getElementById("economiaMensal"),
        mesesAteViagem: document.getElementById("mesesAteViagem")
    };

    const idsPorEtapa = [
        ["destino", "pessoas", "duracao"],

        [
            "transporte",
            "hospedagem",
            "alimentacao",
            "passeios",
            "outrosCustos"
        ],

        [
            "valorGuardado",
            "rendaMensal",
            "despesasMensais",
            "economiaMensal",
            "mesesAteViagem"
        ]
    ];

    // ========================================
    // FUNÇÕES AUXILIARES
    // ========================================

    const obterNumero = (campo) => {
        const valor = Number(campo.value);

        return Number.isFinite(valor) ? valor : 0;
    };

    const formatarMoeda = (valor) => {
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
    };

    const escaparHTML = (valor) => {
        return String(valor).replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[caractere]));
    };

    // ========================================
    // ATUALIZAÇÃO DOS CUSTOS
    // ========================================

    function atualizarCustoParcial() {
        const total = [
            "transporte",
            "hospedagem",
            "alimentacao",
            "passeios",
            "outrosCustos"
        ].reduce((soma, id) => {
            return soma + obterNumero(campos[id]);
        }, 0);

        custoParcial.textContent = formatarMoeda(total);
    }

    // ========================================
    // NAVEGAÇÃO ENTRE ETAPAS
    // ========================================

    function mostrarEtapa(indice) {
        etapaAtual = indice;

        etapas.forEach((etapa, i) => {
            const ativa = i === indice;

            etapa.hidden = !ativa;
            etapa.classList.toggle("ativa", ativa);
        });

        indicadores.forEach((indicador, i) => {
            indicador.classList.toggle(
                "ativo",
                i === indice
            );
        });

        const percentual = Math.round(
            ((indice + 1) / etapas.length) * 100
        );

        document.getElementById("viagemEtapaTexto").textContent =
            `Etapa ${indice + 1} de ${etapas.length}`;

        document.getElementById("viagemPercentual").textContent =
            `${percentual}%`;

        document.getElementById("viagemProgressoBarra").style.width =
            `${percentual}%`;

        btnAnterior.disabled = indice === 0;

        btnProximo.textContent =
            indice === etapas.length - 1
                ? "Nova simulação"
                : "Continuar →";

        erro.textContent = "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // ========================================
    // VALIDAÇÃO
    // ========================================

    function validarEtapa(indice) {
        const ids = idsPorEtapa[indice];

        for (const id of ids) {
            const campo = campos[id];
            const valor = campo.value.trim();

            if (valor === "") {
                erro.textContent =
                    "Preencha todos os campos obrigatórios desta etapa.";

                campo.focus();
                return false;
            }

            const numero = Number(valor);

            if (
                id !== "destino" &&
                (!Number.isFinite(numero) || numero < 0)
            ) {
                erro.textContent =
                    "Informe valores numéricos iguais ou maiores que zero.";

                campo.focus();
                return false;
            }

            if (
                ["pessoas", "duracao", "mesesAteViagem"].includes(id) &&
                (!Number.isInteger(numero) || numero < 1)
            ) {
                erro.textContent =
                    "Quantidade de pessoas, dias e meses deve ser um número inteiro maior que zero.";

                campo.focus();
                return false;
            }
        }

        // Validações específicas da primeira etapa
        if (indice === 0) {
            if (
                obterNumero(campos.pessoas) > 30 ||
                obterNumero(campos.duracao) > 365
            ) {
                erro.textContent =
                    "Confira os limites: até 30 pessoas e até 365 dias de viagem.";

                return false;
            }

            if (campos.dataViagem.value) {
                const dataInformada = new Date(
                    `${campos.dataViagem.value}T00:00:00`
                );

                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);

                if (dataInformada < hoje) {
                    erro.textContent =
                        "A data prevista para a viagem não pode estar no passado.";

                    campos.dataViagem.focus();
                    return false;
                }
            }
        }

        // Validações financeiras da terceira etapa
        if (indice === 2) {
            const renda = obterNumero(campos.rendaMensal);
            const despesas = obterNumero(campos.despesasMensais);
            const economia = obterNumero(campos.economiaMensal);

            if (despesas > renda) {
                erro.textContent =
                    "As despesas mensais não podem ser maiores que a renda mensal informada.";

                campos.despesasMensais.focus();
                return false;
            }

            if (economia > renda - despesas) {
                erro.textContent =
                    "A economia mensal informada ultrapassa o valor que sobra após as despesas.";

                campos.economiaMensal.focus();
                return false;
            }
        }

        return true;
    }

    // ========================================
    // CÁLCULO DO PLANEJAMENTO
    // ========================================

    function calcularPlanejamento() {
        const custos = {
            transporte: obterNumero(campos.transporte),
            hospedagem: obterNumero(campos.hospedagem),
            alimentacao: obterNumero(campos.alimentacao),
            passeios: obterNumero(campos.passeios),
            outros: obterNumero(campos.outrosCustos)
        };

        const total = Object.values(custos).reduce(
            (soma, valor) => soma + valor,
            0
        );

        const guardado = obterNumero(campos.valorGuardado);
        const falta = Math.max(0, total - guardado);

        const economia = obterNumero(campos.economiaMensal);
        const meses = obterNumero(campos.mesesAteViagem);

        const capacidadeNoPrazo = economia * meses;
        const totalDisponivel = guardado + capacidadeNoPrazo;

        const mensalNecessario = falta / meses;
        const saldoProjetado = totalDisponivel - total;

        const renda = obterNumero(campos.rendaMensal);
        const despesas = obterNumero(campos.despesasMensais);

        const sobraOrcamento = renda - despesas;

        const custoPorPessoa =
            total / obterNumero(campos.pessoas);

        let status;

        if (falta === 0) {
            status = {
                classe: "positivo",
                titulo: "Você já tem o valor estimado!",
                texto: "Pelo valor informado, o dinheiro guardado já cobre o custo previsto da viagem."
            };
        } else if (economia >= mensalNecessario) {
            status = {
                classe: "positivo",
                titulo: "O planejamento parece viável.",
                texto: "Mantendo a economia mensal informada, você consegue alcançar o valor estimado dentro do prazo escolhido."
            };
        } else if (economia > 0) {
            status = {
                classe: "atencao",
                titulo: "Será necessário ajustar o planejamento.",
                texto: "No ritmo atual de economia, o valor acumulado não será suficiente. Considere aumentar o prazo, reduzir custos ou guardar um pouco mais por mês."
            };
        } else {
            status = {
                classe: "negativo",
                titulo: "Ainda não há uma reserva mensal planejada.",
                texto: "Você informou que não consegue guardar um valor mensal. Revise o orçamento ou o prazo antes de assumir os custos da viagem."
            };
        }

        return {
            destino: campos.destino.value.trim(),
            pessoas: obterNumero(campos.pessoas),
            duracaoDias: obterNumero(campos.duracao),
            dataPrevista: campos.dataViagem.value || null,

            custos,
            custoTotal: total,

            valorGuardado: guardado,
            valorQueFalta: falta,

            economiaMensal: economia,
            mesesAteViagem: meses,
            valorMensalNecessario: mensalNecessario,

            totalDisponivelNoPrazo: totalDisponivel,
            saldoProjetado,

            rendaMensal: renda,
            despesasMensais: despesas,
            sobraMensalAposDespesas: sobraOrcamento,

            custoEstimadoPorPessoa: custoPorPessoa,
            status
        };
    }

    // ========================================
    // EXIBIÇÃO DO RESULTADO
    // ========================================

    function exibirResultado(dados) {
        const classeStatus = dados.status.classe;

        resultado.innerHTML = `
            <div class="viagem-resumo-topo">

                <div class="viagem-indicador">
                    <span>Custo total estimado</span>
                    <strong>${formatarMoeda(dados.custoTotal)}</strong>
                </div>

                <div class="viagem-indicador">
                    <span>Valor que ainda falta</span>
                    <strong>${formatarMoeda(dados.valorQueFalta)}</strong>
                </div>

                <div class="viagem-indicador">
                    <span>Economia mensal necessária</span>
                    <strong>${formatarMoeda(dados.valorMensalNecessario)}</strong>
                </div>

                <div class="viagem-indicador">
                    <span>Estimativa por pessoa</span>
                    <strong>${formatarMoeda(dados.custoEstimadoPorPessoa)}</strong>
                </div>

            </div>

            <div class="viagem-status ${classeStatus}">
                <strong>${escaparHTML(dados.status.titulo)}</strong>
                ${escaparHTML(dados.status.texto)}
            </div>

            <h3>Resumo dos custos</h3>

            <table class="viagem-detalhes">
                <tbody>
                    <tr>
                        <th>Transporte</th>
                        <td>${formatarMoeda(dados.custos.transporte)}</td>
                    </tr>

                    <tr>
                        <th>Hospedagem</th>
                        <td>${formatarMoeda(dados.custos.hospedagem)}</td>
                    </tr>

                    <tr>
                        <th>Alimentação</th>
                        <td>${formatarMoeda(dados.custos.alimentacao)}</td>
                    </tr>

                    <tr>
                        <th>Passeios e atrações</th>
                        <td>${formatarMoeda(dados.custos.passeios)}</td>
                    </tr>

                    <tr>
                        <th>Outros gastos</th>
                        <td>${formatarMoeda(dados.custos.outros)}</td>
                    </tr>

                    <tr>
                        <th><strong>Total</strong></th>
                        <td>${formatarMoeda(dados.custoTotal)}</td>
                    </tr>
                </tbody>
            </table>

            <p class="viagem-orientacao">
                Para ${dados.pessoas} pessoa(s), em ${dados.duracaoDias} dia(s),
                o destino informado é <strong>${escaparHTML(dados.destino)}</strong>.

                Você informou ${formatarMoeda(dados.valorGuardado)} já guardados
                e uma capacidade de economia de ${formatarMoeda(dados.economiaMensal)}
                por mês.

                Em ${dados.mesesAteViagem} mês(es), sua reserva projetada será de
                ${formatarMoeda(dados.totalDisponivelNoPrazo)}.

                ${
                    dados.saldoProjetado >= 0
                        ? `A projeção indica uma sobra de ${formatarMoeda(dados.saldoProjetado)}.`
                        : `A projeção indica que faltarão ${formatarMoeda(Math.abs(dados.saldoProjetado))}.`
                }
            </p>
        `;
    }

    // ========================================
    // SALVAR NO HISTÓRICO
    // ========================================

    function salvarHistorico(dados) {
        if (simulacaoRegistrada) return;

        const registro = {
            destino: dados.destino,
            pessoas: dados.pessoas,
            duracaoDias: dados.duracaoDias,
            dataPrevista: dados.dataPrevista,

            custos: dados.custos,
            custoTotal: dados.custoTotal,

            valorGuardado: dados.valorGuardado,
            valorQueFalta: dados.valorQueFalta,

            economiaMensal: dados.economiaMensal,
            mesesAteViagem: dados.mesesAteViagem,
            valorMensalNecessario: dados.valorMensalNecessario,

            saldoProjetado: dados.saldoProjetado,
            status: dados.status.titulo
        };

        try {
            if (
                window.Meaven &&
                typeof window.Meaven.registrarSimulacao === "function"
            ) {
                window.Meaven.registrarSimulacao(
                    "viagem",
                    `Viagem para ${dados.destino}`,
                    registro
                );
            } else {
                const chave = "meaven_historico";

                const historico = JSON.parse(
                    localStorage.getItem(chave) || "[]"
                );

                historico.push({
                    id: Date.now(),
                    tipo: "viagem",
                    titulo: `Viagem para ${dados.destino}`,
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
                "Não foi possível salvar a simulação no histórico:",
                erroHistorico
            );

            erro.textContent =
                "O resultado foi calculado, mas não foi possível salvar no histórico neste navegador.";
        }
    }

    // ========================================
    // FINALIZAR E REINICIAR
    // ========================================

    function finalizarSimulacao() {
        const dados = calcularPlanejamento();

        exibirResultado(dados);
        salvarHistorico(dados);

        mostrarEtapa(3);
    }

    function reiniciarSimulacao() {
        form.reset();

        campos.pessoas.value = "1";
        campos.valorGuardado.value = "0";

        custoParcial.textContent = formatarMoeda(0);
        resultado.innerHTML = "";

        simulacaoRegistrada = false;

        mostrarEtapa(0);
    }

    // ========================================
    // EVENTOS DOS BOTÕES
    // ========================================

    btnAnterior.addEventListener("click", () => {
        if (etapaAtual > 0) {
            mostrarEtapa(etapaAtual - 1);
        }
    });

    btnProximo.addEventListener("click", () => {
        // Na última etapa, inicia uma nova simulação.
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

    // Atualiza o total enquanto os custos são preenchidos.
    [
        "transporte",
        "hospedagem",
        "alimentacao",
        "passeios",
        "outrosCustos"
    ].forEach(id => {
        campos[id].addEventListener(
            "input",
            atualizarCustoParcial
        );
    });

    // Atualiza o cabeçalho com o perfil salvo, se disponível.
    if (
        window.Meaven &&
        typeof window.Meaven.atualizarCabecalho === "function"
    ) {
        window.Meaven.atualizarCabecalho();
    }

    // Estado inicial.
    atualizarCustoParcial();
    mostrarEtapa(0);

})();
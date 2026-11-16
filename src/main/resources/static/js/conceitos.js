/* ========================================
   MEAVEN - ABA CONCEITOS
   Navegação e conteúdos educativos
======================================== */

const categorias = [

    {
        id: "educacao",
        icone: "💰",
        titulo: "Educação financeira",
        descricao: "Aprenda a organizar seu dinheiro, controlar seus gastos e construir hábitos financeiros melhores.",
        topicos: [

            {
                titulo: "O que é educação financeira?",
                conteudo: `
                    <h2>O que é educação financeira?</h2>

                    <p>
                        Educação financeira é o conjunto de conhecimentos e
                        hábitos que ajudam uma pessoa a administrar melhor
                        seu dinheiro.
                    </p>

                    <p>
                        Ela envolve entender quanto você ganha, quanto gasta,
                        como economizar, como planejar objetivos e como tomar
                        decisões financeiras conscientes.
                    </p>

                    <h3>Por que ela é importante?</h3>

                    <ul>
                        <li>Ajuda a evitar gastos desnecessários.</li>
                        <li>Facilita a organização das contas.</li>
                        <li>Ajuda a planejar objetivos futuros.</li>
                        <li>Permite compreender melhor empréstimos e investimentos.</li>
                    </ul>

                    <div class="exemplo-conceito">
                        <strong>Exemplo prático</strong>
                        <p>
                            Uma pessoa recebe R$ 2.000 por mês. Ao registrar
                            suas despesas, percebe que gasta R$ 300 com compras
                            que não eram necessárias. Com essa informação,
                            pode reorganizar seu orçamento.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Receitas e despesas",
                conteudo: `
                    <h2>Receitas e despesas</h2>

                    <p>
                        Para organizar as finanças, primeiro é necessário
                        entender a diferença entre dinheiro que entra e
                        dinheiro que sai.
                    </p>

                    <h3>Receitas</h3>

                    <p>
                        São todos os valores recebidos, como salário,
                        bolsa de estudos, trabalhos extras e outras fontes
                        de renda.
                    </p>

                    <h3>Despesas</h3>

                    <p>
                        São os valores utilizados para pagar contas e
                        adquirir produtos ou serviços.
                    </p>

                    <ul>
                        <li><strong>Fixas:</strong> despesas recorrentes,
                        como aluguel e mensalidade.</li>
                        <li><strong>Variáveis:</strong> despesas que mudam
                        de valor, como energia e alimentação.</li>
                        <li><strong>Eventuais:</strong> gastos que não
                        acontecem todos os meses.</li>
                    </ul>

                    <div class="exemplo-conceito">
                        <strong>Exemplo</strong>
                        <p>
                            Se você recebe R$ 2.500 e gasta R$ 2.000,
                            sobram R$ 500 antes de considerar outras
                            despesas não registradas.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Como montar um orçamento",
                conteudo: `
                    <h2>Como montar um orçamento</h2>

                    <p>
                        Um orçamento financeiro é um planejamento que
                        organiza as receitas e despesas de determinado
                        período.
                    </p>

                    <h3>Como começar?</h3>

                    <ol>
                        <li>Anote todas as suas fontes de renda.</li>
                        <li>Registre suas despesas fixas.</li>
                        <li>Registre seus gastos variáveis.</li>
                        <li>Identifique despesas que podem ser reduzidas.</li>
                        <li>Defina quanto deseja guardar.</li>
                        <li>Acompanhe os resultados ao longo do mês.</li>
                    </ol>

                    <div class="exemplo-conceito">
                        <strong>Exemplo de orçamento mensal</strong>
                        <p>Renda mensal: R$ 2.500</p>
                        <p>Despesas: R$ 1.900</p>
                        <p>Valor restante: R$ 600</p>
                    </div>

                    <p>
                        O objetivo é fazer com que suas despesas estejam
                        dentro da sua realidade financeira.
                    </p>
                `
            },

            {
                titulo: "Como evitar dívidas",
                conteudo: `
                    <h2>Como evitar dívidas</h2>

                    <p>
                        Dívidas acontecem quando assumimos compromissos
                        financeiros que precisam ser pagos futuramente.
                        Elas podem fazer parte do planejamento, mas precisam
                        ser administradas com cuidado.
                    </p>

                    <h3>Alguns cuidados importantes</h3>

                    <ul>
                        <li>Conheça sua renda antes de assumir parcelas.</li>
                        <li>Evite comprometer todo o dinheiro disponível.</li>
                        <li>Compare juros e condições antes de contratar crédito.</li>
                        <li>Organize as datas de vencimento.</li>
                        <li>Evite utilizar crédito para cobrir gastos recorrentes
                        sem entender a causa do desequilíbrio.</li>
                    </ul>

                    <div class="alerta-conceito">
                        <strong>Atenção</strong>
                        <p>
                            Uma parcela aparentemente pequena pode representar
                            um compromisso importante quando somada a outras
                            despesas mensais.
                        </p>
                    </div>
                `
            }

        ]
    },

    {
        id: "planejamento",
        icone: "🎯",
        titulo: "Planejamento financeiro",
        descricao: "Entenda como estabelecer metas, organizar seu futuro e preparar-se para imprevistos.",
        topicos: [

            {
                titulo: "O que é planejamento financeiro?",
                conteudo: `
                    <h2>O que é planejamento financeiro?</h2>

                    <p>
                        É o processo de organizar o dinheiro para alcançar
                        objetivos e lidar com compromissos financeiros.
                    </p>

                    <p>
                        O planejamento permite visualizar sua situação atual
                        e decidir como utilizar os recursos disponíveis.
                    </p>

                    <h3>Exemplos de objetivos</h3>

                    <ul>
                        <li>Comprar um computador.</li>
                        <li>Fazer uma viagem.</li>
                        <li>Pagar uma dívida.</li>
                        <li>Construir uma reserva financeira.</li>
                        <li>Comprar um imóvel.</li>
                    </ul>
                `
            },

            {
                titulo: "Metas financeiras",
                conteudo: `
                    <h2>Metas financeiras</h2>

                    <p>
                        Uma meta financeira é um objetivo que envolve
                        planejamento e utilização de dinheiro.
                    </p>

                    <h3>Como definir uma meta?</h3>

                    <ol>
                        <li>Defina o que deseja alcançar.</li>
                        <li>Descubra quanto será necessário.</li>
                        <li>Estabeleça um prazo possível.</li>
                        <li>Calcule quanto precisará guardar.</li>
                        <li>Acompanhe seu progresso.</li>
                    </ol>

                    <div class="exemplo-conceito">
                        <strong>Exemplo</strong>
                        <p>
                            Uma pessoa deseja juntar R$ 3.000 em 10 meses.
                            Sem considerar rendimentos, precisará guardar
                            R$ 300 por mês.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Reserva de emergência",
                conteudo: `
                    <h2>Reserva de emergência</h2>

                    <p>
                        É uma quantia de dinheiro separada para situações
                        inesperadas, como perda de renda, problemas de saúde
                        ou reparos urgentes.
                    </p>

                    <h3>Como construir uma reserva?</h3>

                    <ul>
                        <li>Identifique suas despesas essenciais.</li>
                        <li>Defina um valor inicial para começar.</li>
                        <li>Guarde uma quantia regularmente.</li>
                        <li>Priorize segurança e facilidade de acesso.</li>
                    </ul>

                    <p>
                        O tamanho adequado depende da realidade de cada pessoa,
                        da estabilidade da renda e das responsabilidades
                        financeiras.
                    </p>

                    <div class="alerta-conceito">
                        <strong>Importante</strong>
                        <p>
                            A reserva de emergência deve priorizar liquidez
                            e baixo risco. Ela não deve ser confundida com
                            dinheiro destinado a investimentos de longo prazo.
                        </p>
                    </div>
                `
            }

        ]
    },

    {
        id: "renda-fixa",
        icone: "🏦",
        titulo: "Renda fixa",
        descricao: "Conheça investimentos em que as regras de remuneração são definidas no momento da aplicação ou seguem indicadores conhecidos.",
        topicos: [

            {
                titulo: "O que é renda fixa?",
                conteudo: `
                    <h2>O que é renda fixa?</h2>

                    <p>
                        Renda fixa é uma modalidade de investimento na qual
                        as regras de remuneração são conhecidas no momento
                        da aplicação.
                    </p>

                    <p>
                        Isso não significa necessariamente que você saberá
                        exatamente quanto receberá em qualquer situação.
                        O resultado pode depender de taxas, indicadores,
                        prazo e condições do produto.
                    </p>

                    <h3>Como funciona?</h3>

                    <p>
                        Em muitos investimentos de renda fixa, você empresta
                        dinheiro a uma instituição ou ao governo e recebe
                        uma remuneração conforme as condições contratadas.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo simplificado</strong>
                        <p>
                            Imagine investir R$ 1.000 em um produto que
                            promete uma remuneração definida. Ao final do
                            prazo, você recebe o valor aplicado acrescido
                            da remuneração, considerando as condições,
                            os impostos e eventuais custos aplicáveis.
                        </p>
                    </div>

                    <h3>Características da renda fixa</h3>

                    <ul>
                        <li>Regras de remuneração estabelecidas na aplicação.</li>
                        <li>Existência de diferentes prazos e condições.</li>
                        <li>Possibilidade de rentabilidade prefixada ou
                        vinculada a indicadores.</li>
                        <li>Riscos que variam conforme o emissor e o produto.</li>
                    </ul>

                    <div class="alerta-conceito">
                        <strong>Atenção</strong>
                        <p>
                            Renda fixa não significa ausência de risco.
                            É necessário avaliar o emissor, a liquidez,
                            o vencimento e as condições do investimento.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Prefixado, pós-fixado e híbrido",
                conteudo: `
                    <h2>Tipos de remuneração da renda fixa</h2>

                    <p>
                        Os investimentos de renda fixa podem apresentar
                        diferentes formas de remuneração.
                    </p>

                    <h3>Prefixado</h3>

                    <p>
                        A taxa de remuneração é definida no momento da
                        aplicação. Se mantidas as condições contratadas
                        até o vencimento, é possível conhecer a taxa
                        nominal acordada.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo ilustrativo</strong>
                        <p>
                            Um investimento oferece uma taxa de 10% ao ano.
                            Essa é a taxa contratada, antes de considerar
                            impostos e outros custos aplicáveis.
                        </p>
                    </div>

                    <h3>Pós-fixado</h3>

                    <p>
                        A remuneração acompanha um indicador, como o CDI
                        ou a taxa Selic, conforme as regras do produto.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo ilustrativo</strong>
                        <p>
                            Um CDB oferece 100% do CDI. Sua remuneração
                            acompanha a variação do indicador durante
                            o período da aplicação.
                        </p>
                    </div>

                    <h3>Híbrido</h3>

                    <p>
                        Combina uma taxa fixa com a variação de um indicador,
                        como a inflação medida pelo IPCA.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo ilustrativo</strong>
                        <p>
                            Um título oferece IPCA + 5% ao ano. A remuneração
                            combina a variação do índice de inflação com
                            uma taxa adicional contratada.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Tesouro Direto",
                conteudo: `
                    <h2>O que é o Tesouro Direto?</h2>

                    <p>
                        O Tesouro Direto é um programa que permite a pessoas
                        físicas investirem em títulos públicos federais.
                        Na prática, o investidor empresta dinheiro ao governo
                        federal e recebe remuneração conforme as condições
                        do título.
                    </p>

                    <h3>Principais tipos</h3>

                    <ul>
                        <li><strong>Tesouro Selic:</strong> acompanha a taxa
                        Selic e costuma ser utilizado por quem busca
                        acompanhar a taxa básica de juros.</li>

                        <li><strong>Tesouro Prefixado:</strong> possui uma
                        taxa definida no momento da compra, com condições
                        específicas de vencimento.</li>

                        <li><strong>Tesouro IPCA+:</strong> combina a variação
                        do IPCA com uma taxa prefixada.</li>
                    </ul>

                    <h3>Onde investir?</h3>

                    <p>
                        O acesso pode ser feito pelo site oficial do
                        Tesouro Direto ou por instituições financeiras
                        habilitadas, conforme as condições disponíveis.
                    </p>

                    <div class="alerta-conceito">
                        <strong>Importante</strong>
                        <p>
                            O preço de venda antecipada de determinados
                            títulos pode oscilar. O resultado pode ser
                            diferente do esperado para quem vende antes
                            do vencimento.
                        </p>
                    </div>
                `
            },

            {
                titulo: "CDB",
                conteudo: `
                    <h2>O que é CDB?</h2>

                    <p>
                        CDB significa Certificado de Depósito Bancário.
                        É um investimento emitido por bancos para captar
                        recursos.
                    </p>

                    <p>
                        Ao investir em um CDB, você empresta dinheiro ao
                        banco emissor e recebe uma remuneração conforme
                        as condições contratadas.
                    </p>

                    <h3>Como pode funcionar?</h3>

                    <ul>
                        <li>Com taxa prefixada.</li>
                        <li>Atrelado ao CDI.</li>
                        <li>Com outras condições de remuneração previstas
                        na emissão.</li>
                    </ul>

                    <h3>Onde encontrar?</h3>

                    <p>
                        CDBs podem ser encontrados em bancos e plataformas
                        de investimento que distribuem produtos de diferentes
                        instituições.
                    </p>

                    <div class="alerta-conceito">
                        <strong>O que observar?</strong>
                        <p>
                            Compare a taxa oferecida, o prazo, a possibilidade
                            de resgate antecipado, o banco emissor e a
                            cobertura aplicável do FGC, quando existente.
                        </p>
                    </div>
                `
            },

            {
                titulo: "LCI e LCA",
                conteudo: `
                    <h2>O que são LCI e LCA?</h2>

                    <p>
                        LCI significa Letra de Crédito Imobiliário.
                        LCA significa Letra de Crédito do Agronegócio.
                    </p>

                    <p>
                        São títulos emitidos por instituições financeiras
                        relacionados à captação de recursos para os setores
                        imobiliário e do agronegócio.
                    </p>

                    <h3>Quais são as diferenças?</h3>

                    <ul>
                        <li><strong>LCI:</strong> relacionada ao setor imobiliário.</li>
                        <li><strong>LCA:</strong> relacionada ao agronegócio.</li>
                    </ul>

                    <p>
                        Ambas podem apresentar remuneração prefixada,
                        pós-fixada ou outras condições previstas na emissão.
                    </p>

                    <h3>O que avaliar?</h3>

                    <ul>
                        <li>Taxa de remuneração.</li>
                        <li>Prazo e vencimento.</li>
                        <li>Condições de resgate.</li>
                        <li>Instituição emissora.</li>
                        <li>Regras tributárias e de garantia aplicáveis.</li>
                    </ul>

                    <div class="alerta-conceito">
                        <strong>Importante</strong>
                        <p>
                            As condições de prazo, tributação e cobertura
                            podem variar conforme a legislação e as regras
                            vigentes. Consulte as informações do produto
                            antes de investir.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Debêntures",
                conteudo: `
                    <h2>O que são debêntures?</h2>

                    <p>
                        Debêntures são títulos de dívida emitidos por
                        empresas para captar recursos.
                    </p>

                    <p>
                        Ao adquirir uma debênture, o investidor empresta
                        dinheiro à empresa emissora e recebe remuneração
                        conforme as condições estabelecidas.
                    </p>

                    <h3>O que avaliar?</h3>

                    <ul>
                        <li>Saúde financeira da empresa.</li>
                        <li>Prazo de vencimento.</li>
                        <li>Taxa de remuneração.</li>
                        <li>Possibilidade de negociar o título.</li>
                        <li>Risco de crédito da empresa emissora.</li>
                    </ul>

                    <div class="alerta-conceito">
                        <strong>Atenção ao risco</strong>
                        <p>
                            Debêntures são títulos de dívida privados e
                            não contam com a cobertura ordinária do FGC.
                            O investidor está exposto ao risco de crédito
                            da empresa emissora.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Liquidez e vencimento",
                conteudo: `
                    <h2>Liquidez e vencimento</h2>

                    <h3>O que é liquidez?</h3>

                    <p>
                        Liquidez é a facilidade e a rapidez com que um
                        investimento pode ser convertido em dinheiro.
                    </p>

                    <h3>O que é vencimento?</h3>

                    <p>
                        É a data prevista para o encerramento do investimento,
                        conforme as condições do título.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo</strong>
                        <p>
                            Um produto com resgate diário permite solicitar
                            o resgate em dias úteis, conforme suas regras.
                            Outro produto pode exigir que o investidor
                            aguarde até o vencimento.
                        </p>
                    </div>

                    <p>
                        Antes de investir, verifique se o prazo e as
                        condições de resgate combinam com o momento em
                        que você poderá precisar do dinheiro.
                    </p>
                `
            },

            {
                titulo: "Riscos da renda fixa",
                conteudo: `
                    <h2>Quais são os riscos da renda fixa?</h2>

                    <p>
                        Mesmo quando as regras de remuneração são conhecidas,
                        existem riscos que precisam ser considerados.
                    </p>

                    <ul>
                        <li><strong>Risco de crédito:</strong> possibilidade
                        de o emissor não cumprir suas obrigações.</li>

                        <li><strong>Risco de mercado:</strong> variações
                        de preço que podem afetar o valor de venda antecipada.</li>

                        <li><strong>Risco de liquidez:</strong> dificuldade
                        de transformar o investimento em dinheiro no momento
                        desejado.</li>

                        <li><strong>Risco de inflação:</strong> perda de
                        poder de compra quando o rendimento não acompanha
                        o aumento dos preços.</li>
                    </ul>

                    <p>
                        Avaliar esses riscos ajuda a escolher produtos
                        compatíveis com seus objetivos e prazos.
                    </p>
                `
            }

        ]
    },

    {
        id: "renda-variavel",
        icone: "📈",
        titulo: "Renda variável",
        descricao: "Conheça investimentos cujo retorno pode variar de acordo com o mercado e os resultados dos ativos.",
        topicos: [

            {
                titulo: "O que é renda variável?",
                conteudo: `
                    <h2>O que é renda variável?</h2>

                    <p>
                        Renda variável é uma modalidade de investimento
                        em que a rentabilidade não é conhecida previamente
                        e pode oscilar ao longo do tempo.
                    </p>

                    <p>
                        O preço dos ativos pode subir ou cair conforme
                        fatores econômicos, resultados das empresas,
                        expectativas do mercado e outros acontecimentos.
                    </p>

                    <h3>Características</h3>

                    <ul>
                        <li>Possibilidade de valorização e desvalorização.</li>
                        <li>Retorno não garantido.</li>
                        <li>Exposição a oscilações do mercado.</li>
                        <li>Necessidade de avaliar riscos e objetivos.</li>
                    </ul>

                    <div class="alerta-conceito">
                        <strong>Atenção</strong>
                        <p>
                            É possível perder parte ou até todo o capital
                            investido em determinados ativos.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Ações",
                conteudo: `
                    <h2>O que são ações?</h2>

                    <p>
                        Ações representam pequenas parcelas do capital
                        social de uma empresa. Ao comprar uma ação,
                        o investidor passa a ser acionista daquela empresa.
                    </p>

                    <h3>Como o investidor pode ganhar?</h3>

                    <ul>
                        <li>Com a valorização do preço da ação.</li>
                        <li>Com proventos distribuídos pela empresa,
                        quando houver.</li>
                    </ul>

                    <p>
                        O preço de uma ação pode variar bastante e não
                        existe garantia de valorização ou distribuição
                        de proventos.
                    </p>

                    <h3>Onde são negociadas?</h3>

                    <p>
                        No Brasil, ações são negociadas no mercado de
                        bolsa por meio de instituições intermediárias
                        autorizadas.
                    </p>
                `
            },

            {
                titulo: "Fundos imobiliários (FIIs)",
                conteudo: `
                    <h2>O que são fundos imobiliários?</h2>

                    <p>
                        Fundos de Investimento Imobiliário, conhecidos
                        como FIIs, reúnem recursos de diversos investidores
                        para investir em ativos relacionados ao mercado
                        imobiliário.
                    </p>

                    <h3>Em que podem investir?</h3>

                    <ul>
                        <li>Imóveis físicos, como galpões e shoppings.</li>
                        <li>Títulos e valores mobiliários ligados ao setor
                        imobiliário.</li>
                        <li>Outros ativos permitidos pela política do fundo.</li>
                    </ul>

                    <h3>Como o investidor pode ganhar?</h3>

                    <p>
                        O retorno pode ocorrer pela valorização das cotas
                        e pela distribuição de rendimentos, quando houver.
                    </p>

                    <div class="alerta-conceito">
                        <strong>Importante</strong>
                        <p>
                            O valor das cotas pode cair e os rendimentos
                            não são garantidos. É necessário analisar
                            os riscos e a carteira do fundo.
                        </p>
                    </div>
                `
            },

            {
                titulo: "ETFs",
                conteudo: `
                    <h2>O que são ETFs?</h2>

                    <p>
                        ETF é a sigla para Exchange Traded Fund.
                        São fundos negociados em bolsa que geralmente
                        buscam acompanhar o desempenho de um índice
                        de referência.
                    </p>

                    <h3>Como funcionam?</h3>

                    <p>
                        Ao comprar uma cota de um ETF, o investidor
                        adquire participação em um fundo que segue
                        uma estratégia definida.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo</strong>
                        <p>
                            Um ETF que acompanha um índice de ações
                            busca reproduzir o desempenho desse índice,
                            conforme sua metodologia.
                        </p>
                    </div>

                    <h3>O que observar?</h3>

                    <ul>
                        <li>Índice de referência.</li>
                        <li>Composição da carteira.</li>
                        <li>Taxa de administração.</li>
                        <li>Liquidez e riscos do fundo.</li>
                    </ul>
                `
            },

            {
                titulo: "Dividendos e proventos",
                conteudo: `
                    <h2>O que são dividendos?</h2>

                    <p>
                        Dividendos são parcelas do lucro de uma empresa
                        distribuídas aos acionistas, conforme as regras
                        e decisões aplicáveis.
                    </p>

                    <p>
                        Existem também outros tipos de proventos, com
                        características e tratamentos próprios.
                    </p>

                    <h3>É possível contar com pagamentos frequentes?</h3>

                    <p>
                        Não existe garantia de que uma empresa ou fundo
                        distribuirá rendimentos em todos os períodos.
                        Os pagamentos podem variar ou deixar de ocorrer.
                    </p>

                    <div class="alerta-conceito">
                        <strong>Cuidado com promessas</strong>
                        <p>
                            Dividendos passados não garantem pagamentos
                            futuros. Uma taxa de distribuição elevada
                            isoladamente não significa que um investimento
                            seja seguro ou vantajoso.
                        </p>
                    </div>
                `
            }

        ]
    },

    {
        id: "fundamentos",
        icone: "🧠",
        titulo: "Conceitos de investimentos",
        descricao: "Entenda os principais termos utilizados no mercado financeiro e saiba interpretar informações sobre investimentos.",
        topicos: [

            {
                titulo: "Juros simples e compostos",
                conteudo: `
                    <h2>Juros simples e juros compostos</h2>

                    <p>
                        Juros representam o valor cobrado ou recebido
                        pelo uso de dinheiro ao longo do tempo.
                    </p>

                    <h3>Juros simples</h3>

                    <p>
                        São calculados sempre sobre o valor inicial.
                    </p>

                    <h3>Juros compostos</h3>

                    <p>
                        São calculados sobre o valor inicial somado aos
                        juros acumulados nos períodos anteriores.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo ilustrativo</strong>
                        <p>
                            Imagine R$ 1.000 aplicados a uma taxa hipotética
                            de 10% por período.
                        </p>
                        <p>
                            Nos juros simples, o acréscimo é calculado
                            sempre sobre os R$ 1.000 iniciais.
                        </p>
                        <p>
                            Nos juros compostos, os juros de cada período
                            também passam a render nos períodos seguintes.
                        </p>
                    </div>
                `
            },

            {
                titulo: "Inflação",
                conteudo: `
                    <h2>O que é inflação?</h2>

                    <p>
                        Inflação é o aumento generalizado dos preços de
                        bens e serviços ao longo do tempo.
                    </p>

                    <p>
                        Quando os preços aumentam, o mesmo valor de dinheiro
                        pode comprar menos produtos e serviços.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo prático</strong>
                        <p>
                            Se uma cesta de produtos custava R$ 100 e passa
                            a custar R$ 110, houve um aumento de 10% nesse
                            exemplo simplificado.
                        </p>
                    </div>

                    <h3>Como ela afeta os investimentos?</h3>

                    <p>
                        Se um investimento rende menos do que a inflação
                        no período, o poder de compra do dinheiro pode
                        diminuir, mesmo que o saldo nominal tenha aumentado.
                    </p>
                `
            },

            {
                titulo: "CDI e Selic",
                conteudo: `
                    <h2>O que são CDI e Selic?</h2>

                    <h3>Taxa Selic</h3>

                    <p>
                        A Selic é a taxa básica de juros da economia
                        brasileira. Ela influencia diversas operações
                        financeiras e as condições de crédito e investimento.
                    </p>

                    <h3>CDI</h3>

                    <p>
                        CDI é uma referência muito utilizada no mercado
                        financeiro, especialmente em investimentos de
                        renda fixa.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo</strong>
                        <p>
                            Quando um CDB oferece 100% do CDI, sua
                            remuneração acompanha a variação do indicador,
                            de acordo com as regras do produto.
                        </p>
                    </div>

                    <p>
                        Selic e CDI são referências relacionadas,
                        mas não são exatamente a mesma taxa.
                    </p>
                `
            },

            {
                titulo: "Rentabilidade nominal e real",
                conteudo: `
                    <h2>Rentabilidade nominal e real</h2>

                    <p>
                        Rentabilidade nominal é o rendimento apresentado
                        sem descontar o efeito da inflação.
                    </p>

                    <p>
                        Rentabilidade real considera o efeito da inflação
                        sobre o ganho obtido.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo simplificado</strong>
                        <p>
                            Um investimento apresentou rendimento nominal
                            de 8% no período, enquanto a inflação foi de 4%.
                            O ganho real não é simplesmente o mesmo que
                            os 8% apresentados.
                        </p>
                    </div>

                    <p>
                        A relação exata pode ser calculada pela fórmula:
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Fórmula da rentabilidade real</strong>
                        <p>
                            (1 + rentabilidade nominal) ÷ (1 + inflação) - 1
                        </p>
                    </div>
                `
            },

            {
                titulo: "Prazo e liquidez",
                conteudo: `
                    <h2>Prazo e liquidez</h2>

                    <p>
                        Prazo é o período relacionado à manutenção
                        de um investimento.
                    </p>

                    <p>
                        Liquidez é a facilidade de transformar esse
                        investimento em dinheiro.
                    </p>

                    <p>
                        Um produto pode ter prazo longo e não permitir
                        resgate antecipado, enquanto outro pode oferecer
                        resgate em condições mais flexíveis.
                    </p>

                    <div class="alerta-conceito">
                        <strong>Antes de investir</strong>
                        <p>
                            Pense em quando você poderá precisar do dinheiro.
                            Um investimento pode não ser adequado para
                            objetivos de curto prazo se não oferecer
                            liquidez compatível.
                        </p>
                    </div>
                `
            }

        ]
    },

    {
        id: "riscos",
        icone: "⚖️",
        titulo: "Riscos e diversificação",
        descricao: "Aprenda a reconhecer riscos, compreender seu perfil de investidor e distribuir seus recursos com consciência.",
        topicos: [

            {
                titulo: "O que é risco financeiro?",
                conteudo: `
                    <h2>O que é risco financeiro?</h2>

                    <p>
                        Risco financeiro é a possibilidade de que o
                        resultado de uma decisão ou investimento seja
                        diferente do esperado.
                    </p>

                    <h3>Exemplos de riscos</h3>

                    <ul>
                        <li><strong>Crédito:</strong> possibilidade de
                        não receber o valor devido pelo emissor.</li>
                        <li><strong>Mercado:</strong> variação dos preços
                        dos ativos.</li>
                        <li><strong>Liquidez:</strong> dificuldade de
                        vender ou resgatar um investimento.</li>
                        <li><strong>Inflação:</strong> perda de poder
                        de compra.</li>
                    </ul>
                `
            },

            {
                titulo: "Perfil de investidor",
                conteudo: `
                    <h2>O que é perfil de investidor?</h2>

                    <p>
                        O perfil de investidor representa a relação de
                        uma pessoa com riscos, objetivos e prazos de
                        investimento.
                    </p>

                    <h3>Perfis geralmente utilizados</h3>

                    <ul>
                        <li><strong>Conservador:</strong> tende a priorizar
                        segurança e previsibilidade.</li>
                        <li><strong>Moderado:</strong> aceita determinados
                        riscos buscando equilibrar segurança e retorno.</li>
                        <li><strong>Arrojado:</strong> aceita oscilações
                        maiores em busca de possibilidades de retorno
                        mais elevado.</li>
                    </ul>

                    <p>
                        Esses perfis são referências gerais. A avaliação
                        adequada também considera objetivos, experiência,
                        situação financeira e capacidade de suportar perdas.
                    </p>
                `
            },

            {
                titulo: "Diversificação",
                conteudo: `
                    <h2>O que é diversificação?</h2>

                    <p>
                        Diversificar significa distribuir os recursos
                        entre diferentes investimentos, setores, emissores
                        ou classes de ativos.
                    </p>

                    <p>
                        A intenção é evitar que todo o resultado da carteira
                        dependa de um único investimento.
                    </p>

                    <div class="exemplo-conceito">
                        <strong>Exemplo ilustrativo</strong>
                        <p>
                            Em vez de colocar todo o dinheiro em um único
                            ativo, uma pessoa pode distribuir seus recursos
                            entre diferentes tipos de investimentos,
                            considerando seus objetivos e riscos.
                        </p>
                    </div>

                    <div class="alerta-conceito">
                        <strong>Importante</strong>
                        <p>
                            Diversificação pode ajudar a administrar riscos,
                            mas não elimina a possibilidade de perdas.
                        </p>
                    </div>
                `
            }

        ]
    }

];


// ========================================
// ELEMENTOS DA PÁGINA
// ========================================

const categoriasView = document.getElementById("categoriasView");
const conteudoView = document.getElementById("conteudoView");

const categoriasGrid = document.getElementById("categoriasGrid");
const buscaConceitos = document.getElementById("buscaConceitos");
const buscaVazia = document.getElementById("buscaVazia");

const voltarCategorias = document.getElementById("voltarCategorias");

const categoriaIcone = document.getElementById("categoriaIcone");
const categoriaTitulo = document.getElementById("categoriaTitulo");
const categoriaDescricao = document.getElementById("categoriaDescricao");

const listaTopicos = document.getElementById("listaTopicos");
const artigoConceito = document.getElementById("artigoConceito");


// ========================================
// RENDERIZAR CATEGORIAS
// ========================================

function renderizarCategorias(termo = "") {

    categoriasGrid.innerHTML = "";

    const pesquisa = termo.trim().toLocaleLowerCase("pt-BR");

    const categoriasFiltradas = categorias.filter(categoria => {

        const textoCategoria = `
            ${categoria.titulo}
            ${categoria.descricao}
            ${categoria.topicos.map(topico => topico.titulo).join(" ")}
        `.toLocaleLowerCase("pt-BR");

        return textoCategoria.includes(pesquisa);

    });

    buscaVazia.hidden = categoriasFiltradas.length > 0;

    categoriasFiltradas.forEach(categoria => {

        const card = document.createElement("button");

        card.type = "button";
        card.className = "categoria-card";

        card.innerHTML = `
            <span class="categoria-card-icone">
                ${categoria.icone}
            </span>

            <strong>${categoria.titulo}</strong>

            <p>${categoria.descricao}</p>

            <small>
                ${categoria.topicos.length} conteúdos disponíveis →
            </small>
        `;

        card.addEventListener("click", function () {
            abrirCategoria(categoria.id);
        });

        categoriasGrid.appendChild(card);

    });

}


// ========================================
// ABRIR CATEGORIA
// ========================================

function abrirCategoria(id) {

    const categoria = categorias.find(item => item.id === id);

    if (!categoria) {
        return;
    }

    categoriasView.hidden = true;
    conteudoView.hidden = false;

    categoriaIcone.textContent = categoria.icone;
    categoriaTitulo.textContent = categoria.titulo;
    categoriaDescricao.textContent = categoria.descricao;

    listaTopicos.innerHTML = "";

    artigoConceito.innerHTML = `
        <div class="artigo-placeholder">
            <span>📖</span>
            <h2>Escolha um conteúdo</h2>
            <p>
                Selecione um dos assuntos ao lado para começar
                sua aprendizagem.
            </p>
        </div>
    `;

    categoria.topicos.forEach((topico, indice) => {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "topico-button";
        botao.textContent = topico.titulo;

        botao.addEventListener("click", function () {

            selecionarTopico(categoria, indice, botao);

        });

        listaTopicos.appendChild(botao);

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// SELECIONAR TÓPICO
// ========================================

function selecionarTopico(categoria, indice, botaoSelecionado) {

    const topico = categoria.topicos[indice];

    if (!topico) {
        return;
    }

    document.querySelectorAll(".topico-button").forEach(botao => {
        botao.classList.remove("active");
    });

    botaoSelecionado.classList.add("active");

    artigoConceito.innerHTML = topico.conteudo;

    artigoConceito.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ========================================
// VOLTAR PARA CATEGORIAS
// ========================================

voltarCategorias.addEventListener("click", function () {

    conteudoView.hidden = true;
    categoriasView.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ========================================
// PESQUISA
// ========================================

buscaConceitos.addEventListener("input", function () {

    renderizarCategorias(this.value);

});


// ========================================
// IDENTIFICAÇÃO DO PARTICIPANTE
// ========================================

// Não cria dados fictícios.
// Aproveita o perfil somente se existir uma informação
// armazenada em uma das chaves reconhecidas.

function carregarNomeParticipante() {

    const nomeElemento = document.getElementById("conceitosNome");
    const avatarElemento = document.getElementById("conceitosAvatar");

    if (!nomeElemento || !avatarElemento) {
        return;
    }

    const chavesPerfil = [
        "meavenPerfil",
        "perfilParticipante",
        "participantProfile"
    ];

    for (const chave of chavesPerfil) {

        try {

            const dados = localStorage.getItem(chave);

            if (!dados) {
                continue;
            }

            const perfil = JSON.parse(dados);

            const nome = perfil.nome || perfil.name;

            if (nome) {

                nomeElemento.textContent = nome;
                avatarElemento.textContent = nome.charAt(0).toUpperCase();

                return;
            }

        } catch (erro) {

            console.warn(
                "Não foi possível carregar o perfil:",
                erro
            );

        }

    }

}


// ========================================
// INICIALIZAÇÃO
// ========================================

renderizarCategorias();
carregarNomeParticipante();
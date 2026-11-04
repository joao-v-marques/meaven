# Como contribuir com o Meaven

Ninguém envia código direto para a `main`. Toda alteração é feita em uma branch própria e entra no projeto por um Pull Request (PR) aprovado por um revisor.

## Passo a passo

#### APÓS CLONAR E CONFIGURAR O PROJETO

Ainda não configurou? Siga o guia [Como preparar o ambiente de desenvolvimento](docs/desenvolvimento/ambiente-local.md).

### 1. Atualize a `main`

```bash
git checkout main
git pull origin main
```

### 2. Crie sua branch

```bash
git checkout -b feature/nome-da-tarefa
```

Escolha o prefixo de acordo com a tarefa:

| Prefixo | Quando usar | Exemplo |
|---|---|---|
| `feature/` | Nova funcionalidade | `feature/tela-login` |
| `fix/` | Correção de erro | `fix/calculo-saldo` |
| `docs/` | Documentação | `docs/atualiza-readme` |
| `chore/` | Configuração e manutenção | `chore/atualiza-dependencias` |

### 3. Desenvolva e faça o commit

```bash
git status
git add .
git commit -m "feat: adiciona tela de login"
```

Antes do commit, confira no `git status` se nenhum arquivo indevido será enviado, como `.env` ou arquivos com senhas.

Comece a mensagem com `feat:`, `fix:`, `docs:` ou `chore:`, de acordo com a alteração.

### 4. Envie sua branch para o GitHub

```bash
git push -u origin feature/nome-da-tarefa
```

Nos próximos envios da mesma branch, use apenas `git push`.

### 5. Abra o Pull Request

1. No GitHub, clique em **Compare & pull request**.
2. Confira se está como `base: main` ← `compare: sua-branch`.
3. Explique o que mudou e como testar.
4. Clique em **Create pull request**.

### 6. Aguarde a revisão

- **Se pedirem alterações:** faça os ajustes na mesma branch, rode `git add`, `git commit` e `git push`. O PR será atualizado sozinho.
- **Se aprovarem:** clique em **Squash and merge**.

Enviar um novo commit depois da aprovação faz o PR precisar ser aprovado de novo.

### 7. Prepare-se para a próxima tarefa

Depois de confirmar que o merge foi feito no GitHub:

```bash
git checkout main
git pull origin main
git branch -D feature/nome-da-tarefa
```

## Como resolver conflitos

Um conflito acontece quando você e outra pessoa alteram o mesmo trecho de um arquivo. Isso é normal e não apaga o trabalho de ninguém. O GitHub avisa no PR quando há conflito e bloqueia o merge até ele ser resolvido.

### 1. Traga a `main` para a sua branch

Com todas as suas alterações já commitadas, rode:

```bash
git checkout feature/nome-da-tarefa
git fetch origin
git merge origin/main
```

O Git vai listar os arquivos com conflito. Você também pode vê-los com `git status`.

### 2. Corrija cada arquivo

Os trechos em conflito ficam marcados assim:

```text
<<<<<<< HEAD
Código da sua branch
=======
Código que veio da main
>>>>>>> origin/main
```

Edite o trecho para deixá-lo como deve ficar e apague as três linhas de marcação. Muitas vezes, o certo é manter as duas alterações.

Se não souber qual código manter, fale com a pessoa que fez a outra alteração. Nunca apague o código de um colega só para resolver o conflito.

### 3. Teste e finalize

Rode o projeto para ver se tudo continua funcionando. Depois:

```bash
git add .
git commit -m "chore: resolve conflitos com a main"
git push
```

O PR será atualizado sozinho e precisará de uma nova aprovação.

### Se algo der errado

Se ainda não fez o commit da resolução, volte para como estava antes do merge e tente de novo:

```bash
git merge --abort
```

## Como evitar conflitos

- Traga a `main` para sua branch pelo menos uma vez por dia, com `git fetch origin` e `git merge origin/main`.
- Faça PRs pequenos, com uma tarefa em cada um.
- Avise o grupo se for mexer em um arquivo que muitas pessoas usam.
- Não reformate nem reorganize arquivos sem relação com a sua tarefa.

## O que não fazer

- Não use `git push --force`.
- Não envie senhas, tokens ou arquivos `.env`.
- Não trabalhe em mais de uma tarefa na mesma branch.
- Não aprove um PR sem ler as alterações.

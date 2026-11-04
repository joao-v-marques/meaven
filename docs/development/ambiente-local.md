# Como preparar o ambiente de desenvolvimento

Este guia mostra o que fazer para rodar o Meaven na sua máquina. Siga os passos na ordem.

## O que você precisa ter instalado

| Programa | Versão | Como conferir |
|---|---|---|
| Git | qualquer versão recente | `git --version` |
| Java (JDK) | 21 | `java -version` |
| Docker com Docker Compose | qualquer versão recente | `docker compose version` |

Não precisa instalar o Maven nem o PostgreSQL. O projeto já traz o Maven (`mvnw`) e o banco roda dentro do Docker.

## 1. Clone o repositório

```bash
git clone https://github.com/joao-v-marques/meaven.git
cd meaven
```

## 2. Suba o banco de dados

Na pasta do projeto, rode:

```bash
docker compose up -d
```

Esse comando cria um PostgreSQL com tudo já configurado:

| Configuração | Valor |
|---|---|
| Host | `localhost` |
| Porta | `5434` |
| Banco | `meaven` |
| Usuário | `postgres` |
| Senha | `1234` |

Para conferir se o banco está pronto:

```bash
docker compose ps
```

O container `meaven-db` deve aparecer com o status `healthy`.

## 3. Rode o projeto

Você pode rodar pelo IntelliJ ou pelo terminal. A primeira execução demora mais, porque o Maven baixa as dependências.

### Pelo IntelliJ

1. Abra o IntelliJ e clique em **File > Open**.
2. Selecione a pasta `meaven` e clique em **OK**. O IntelliJ reconhece o projeto Maven sozinho. Espere ele terminar de baixar as dependências (barra de progresso no canto inferior direito).
3. Confira o Java do projeto em **File > Project Structure > Project > SDK**. Ele deve estar no **21**. Se não estiver, escolha o 21 na lista ou clique em **Download JDK**.
4. Abra a classe `src/main/java/com/joao_v_marques/meaven/MeavenApplication.java`.
5. Clique no botão verde ▶ ao lado de `public class MeavenApplication` e escolha **Run 'MeavenApplication'**.

Nas próximas vezes, basta clicar no ▶ verde no canto superior direito. Para parar, clique no ■ vermelho.

Se o IntelliJ perguntar sobre o Lombok ou sobre **annotation processing**, clique em **Enable**.

### Pelo terminal

No Linux ou macOS:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

Para parar, aperte `Ctrl + C` no terminal.

### Confira se funcionou

Quando aparecer `Started MeavenApplication` no console, abra no navegador:

```text
http://localhost:8080/meaven/home
```

## Configurações opcionais

Na maioria dos casos você não precisa configurar nada: o projeto já usa os mesmos dados do banco do Docker.

Se precisar usar outros valores, por exemplo porque a porta `5434` já está ocupada no seu computador, crie um arquivo `.env` na raiz do projeto:

```properties
DB_URL=jdbc:postgresql://localhost:5434/meaven
DB_USERNAME=postgres
DB_PASSWORD=1234
```

Altere só o que precisar. Se mudar a porta, mude também a linha `ports` do `docker-compose.yml` na sua máquina, sem enviar essa alteração no commit.

O arquivo `.env` é só seu. Nunca envie ele para o GitHub.

## Comandos úteis do banco

| O que fazer | Comando |
|---|---|
| Ligar o banco | `docker compose up -d` |
| Desligar o banco | `docker compose down` |
| Ver os logs do banco | `docker compose logs -f postgres` |
| Acessar o banco pelo terminal | `docker exec -it meaven-db psql -U postgres -d meaven` |
| Apagar o banco e começar do zero | `docker compose down -v` |

O `docker compose down` mantém os dados salvos. O `docker compose down -v` apaga tudo que estava no banco.

Para acessar o banco por um programa como DBeaver ou pela IDE, use os dados da tabela do passo 2.

## Problemas comuns

**`port is already allocated` ao subir o banco**
Outro programa já usa a porta `5434`. Desligue esse programa ou troque a porta, como explicado em [Configurações opcionais](#configurações-opcionais).

**`Connection refused` ao rodar o projeto**
O banco não está ligado. Rode `docker compose up -d` e espere o status `healthy` no `docker compose ps`.

**`permission denied` ao rodar `./mvnw`**
Dê permissão de execução ao arquivo:

```bash
chmod +x mvnw
```

**Erro de versão do Java (`release version 21 not supported`)**
O Java instalado é mais antigo que o 21. Instale o JDK 21 e confira com `java -version`.

## Próximo passo

Com o projeto rodando, leia o [CONTRIBUTING.md](../../CONTRIBUTING.md) para saber como criar sua branch e abrir um Pull Request.

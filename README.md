<div align="center">

# Meaven

Aplicação web feita com Spring Boot, PostgreSQL e páginas em HTML, CSS e JavaScript.

<br>

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Flyway](https://img.shields.io/badge/Flyway-CC0200?style=for-the-badge&logo=flyway&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)

![Thymeleaf](https://img.shields.io/badge/Thymeleaf-005F0F?style=for-the-badge&logo=thymeleaf&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Lombok](https://img.shields.io/badge/Lombok-BC4521?style=for-the-badge&logoColor=white)

<br>

[Começo rápido](#-começo-rápido) •
[Tecnologias](#-tecnologias) •
[Estrutura](#-estrutura-do-projeto) •
[Documentação](#-documentação) •
[Como contribuir](#-como-contribuir)

</div>

---

## 🚀 Começo rápido

> [!NOTE]
> Você precisa ter **Git**, **JDK 21** e **Docker** instalados. Não precisa instalar Maven nem PostgreSQL.

```bash
# 1. Clone o repositório
git clone https://github.com/joao-v-marques/meaven.git
cd meaven

# 2. Suba o banco de dados
docker compose up -d

# 3. Rode o projeto
./mvnw spring-boot:run
```

Depois, abra no navegador: **<http://localhost:8080/meaven/home>**

O passo a passo completo, inclusive como rodar pelo IntelliJ, está no guia [Como preparar o ambiente de desenvolvimento](docs/development/ambiente-local.md).

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| **Linguagem** | Java 21 |
| **Framework** | Spring Boot 4 (Web MVC, Data JPA, Security e Validation) |
| **Banco de dados** | PostgreSQL 18, rodando no Docker |
| **Migrations** | Flyway |
| **Front-end** | HTML, CSS e JavaScript puros, entregues pelo Thymeleaf |
| **Build** | Maven, via `mvnw` |
| **Outros** | Lombok |

## 📁 Estrutura do projeto

O projeto é organizado **por funcionalidade** (package-by-feature).

> [!IMPORTANT]
> **Todo o código é escrito em inglês**: pacotes, classes, métodos, variáveis, tabelas, colunas, URLs, arquivos, classes CSS e funções JS.

```text
src/main/java/com/joao_v_marques/meaven/
├── <feature>/          # uma pasta por funcionalidade (product, user, ...)
└── shared/             # configurações e código usado por várias funcionalidades

src/main/resources/
├── db/migration/       # migrations do Flyway
├── templates/          # um HTML por página
└── static/             # um CSS e um JS por página
```

Detalhes e exemplos estão em [Arquitetura e organização do projeto](docs/architecture/organizacao-do-projeto.md).

## 📚 Documentação

| Documento | Assunto |
|---|---|
| 💻 [Como preparar o ambiente de desenvolvimento](docs/development/ambiente-local.md) | Clonar, subir o banco e rodar o projeto |
| 🏛️ [Arquitetura e organização do projeto](docs/architecture/organizacao-do-projeto.md) | Pacotes, pastas, padrões de nomes e regras do Thymeleaf |
| 🤝 [Como contribuir](CONTRIBUTING.md) | Branches, commits, Pull Requests e conflitos |

## 🤝 Como contribuir

> [!WARNING]
> Ninguém envia código direto para a `main`. Toda alteração entra por um Pull Request aprovado.

1. Crie uma branch a partir da `main`, como `feature/nome-da-tarefa`.
2. Faça seus commits seguindo o padrão `feat:`, `fix:`, `docs:` ou `chore:`.
3. Abra um Pull Request e aguarde a revisão.

O fluxo completo está no [CONTRIBUTING.md](CONTRIBUTING.md).

# Front-end

Padrões para escrever as páginas do Meaven. A visão geral da arquitetura está em [Arquitetura e organização do projeto](../architecture/organizacao-do-projeto.md).

> [!IMPORTANT]
> Todo o código é escrito em **inglês**: nomes de arquivos, classes CSS, IDs, variáveis e funções JS. Só os textos que o usuário vê na tela ficam em português.

## Organização das pastas

Cada página tem **um HTML, um CSS e um JS**, com o mesmo nome e o mesmo caminho:

```text
src/main/resources/
├── templates/
│   └── product/
│       ├── list.html
│       └── form.html
└── static/
    ├── css/
    │   └── product/
    │       ├── list.css
    │       └── form.css
    ├── js/
    │   └── product/
    │       ├── list.js
    │       └── form.js
    └── images/
```

Cada página carrega **apenas o próprio CSS e o próprio JS**.

## Thymeleaf

> [!CAUTION]
> O Thymeleaf serve **unicamente** para entregar as páginas registradas no `ViewConfig`. Ele **nunca** monta componentes, fragmentos, layouts ou dados na página. Nenhum atributo `th:` deve aparecer no HTML.

Para registrar uma página nova, adicione uma linha no `shared/configs/ViewConfig.java`:

```java
registry.addViewController("/products").setViewName("product/list");
```

As regras completas estão em [Regras do Thymeleaf](../architecture/organizacao-do-projeto.md#regras-do-thymeleaf).

## HTML

Toda página começa com esta base:

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produtos</title>
    <link rel="stylesheet" href="/meaven/css/product/list.css">
    <script src="/meaven/js/product/list.js" defer></script>
</head>
<body>
    <main>
        <h1>Produtos</h1>
    </main>
</body>
</html>
```

- Os caminhos começam com `/meaven/`, que é o `context-path` do projeto.
- Carregue o JS no `<head>` com `defer`.
- Use as tags pelo que elas significam: `<main>`, `<header>`, `<nav>`, `<section>`, `<form>`, `<button>`, `<table>`.
- Todo campo de formulário tem um `<label>`.
- **Não** use `style="..."`, `<style>`, `<script>` sem `src` nem `onclick="..."` no HTML.

## CSS

- Classes em `kebab-case` e em inglês: `.products-table`, `.save-button`.
- Estilize por **classe**. Não estilize por ID nem por tag solta, como `div { }`.
- Evite `!important`.

```css
/* ✅ Certo */
.products-table {
    width: 100%;
}

/* ❌ Errado */
#tabelaProdutos {
    width: 100% !important;
}
```

## JavaScript

JavaScript puro, sem frameworks.

| Use | Evite |
|---|---|
| `const` e `let` | `var` |
| `async`/`await` com `fetch` | `.then()` encadeado |
| `textContent` para colocar dados na tela | `innerHTML` com dados da API (abre brecha para injeção de código) |
| `addEventListener` | `onclick="..."` no HTML |
| Funções pequenas com nome de verbo: `loadProducts`, `saveProduct` | Funções enormes que fazem tudo |

### Buscar dados

Sempre confira o `response.ok` e mostre uma mensagem quando der erro:

```javascript
document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
    const response = await fetch("/meaven/api/products");

    if (!response.ok) {
        showError("Não foi possível carregar os produtos.");
        return;
    }

    const products = await response.json();
    products.forEach(renderProductRow);
}
```

### Enviar formulários

Impeça o envio padrão do formulário e mande os dados em JSON:

```javascript
const form = document.getElementById("product-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const product = {
        name: form.elements.name.value,
        price: Number(form.elements.price.value),
    };

    const response = await fetch("/meaven/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        showError("Não foi possível salvar o produto.");
        return;
    }

    window.location.href = "/meaven/products";
});
```

## Checklist

- [ ] A página tem um HTML, um CSS e um JS, com o mesmo nome e o mesmo caminho.
- [ ] A página está registrada no `ViewConfig`.
- [ ] O HTML não tem nenhum `th:`, `style="..."` nem `onclick="..."`.
- [ ] Os caminhos de CSS, JS e da API começam com `/meaven/`.
- [ ] Os dados entram na tela com `textContent`.
- [ ] Os erros da API são tratados e mostrados ao usuário.
- [ ] Nomes de arquivos, classes CSS, IDs e funções estão em inglês.

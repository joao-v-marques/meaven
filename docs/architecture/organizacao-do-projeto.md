# Arquitetura e organização do projeto

Este guia mostra como o código do Meaven deve ser organizado. Siga esse padrão em toda nova funcionalidade.

## Regra principal: todo o código é em inglês

> **Tudo que faz parte do código é escrito em inglês. Sem exceções.**

Isso vale para:

- nomes de pacotes, pastas e arquivos;
- classes, interfaces, enums, métodos, variáveis e constantes;
- tabelas, colunas e arquivos de migration do banco;
- URLs e rotas (`/products`, não `/produtos`);
- nomes de arquivos HTML, CSS e JS, classes CSS, IDs de elementos e funções JavaScript;
- propriedades do `application.yaml`;
- comentários no código.

O que pode ficar em português:

- textos que o usuário vê na tela, como títulos, botões e mensagens de erro;
- os arquivos de documentação, como este.

| ❌ Errado | ✅ Certo |
|---|---|
| `produto/ProdutoController.java` | `product/ProductController.java` |
| `buscarPorId(Long id)` | `findById(Long id)` |
| `List<Produto> listaProdutos` | `List<Product> products` |
| `boolean ativo` | `boolean active` |
| tabela `usuarios`, coluna `data_criacao` | tabela `users`, coluna `created_at` |
| `@GetMapping("/produtos/novo")` | `@GetMapping("/products/new")` |
| `templates/produto/lista.html` | `templates/product/list.html` |
| `<button id="botao-salvar" class="botao">` | `<button id="save-button" class="button">` |
| `function carregarProdutos()` | `function loadProducts()` |
| `// busca os produtos ativos` | `// fetches active products` |

Se não souber como dizer algo em inglês, pergunte no grupo antes de inventar um nome. Um nome bom é mais importante que um nome rápido.

## Package-by-feature

O projeto é organizado **por funcionalidade**, não por tipo de classe. Cada funcionalidade tem o seu próprio pacote, com tudo que ela precisa: controller, service, repository, entidade e DTOs.

```text
❌ Por tipo de classe (NÃO usar)       ✅ Por funcionalidade (USAR)

controllers/                          product/
  ProductController.java                ProductController.java
  UserController.java                   ProductService.java
services/                               ProductRepository.java
  ProductService.java                   Product.java
  UserService.java                    user/
repositories/                           UserController.java
  ProductRepository.java                UserService.java
  UserRepository.java                   UserRepository.java
entities/                               User.java
  Product.java
  User.java
```

Por que assim:

- **Tudo de uma funcionalidade fica junto.** Para mexer em produtos, você abre só a pasta `product/`.
- **Menos conflitos.** Cada pessoa costuma trabalhar em uma pasta diferente.
- **Fácil de achar e de apagar.** Uma funcionalidade nova é uma pasta nova.

## Estrutura de pastas

Exemplo de como o projeto deve ficar com algumas funcionalidades:

```text
src/main/java/com/joao_v_marques/meaven/
├── MeavenApplication.java
│
├── product/                          # uma funcionalidade
│   ├── Product.java                  # entidade JPA
│   ├── ProductStatus.java            # enum da funcionalidade
│   ├── ProductRepository.java        # acesso ao banco
│   ├── ProductService.java           # regras de negócio
│   ├── ProductController.java        # API REST (/api/products)
│   └── dto/
│       ├── ProductRequest.java       # dados que chegam na API
│       └── ProductResponse.java      # dados que a API devolve
│
├── user/                             # outra funcionalidade
│   ├── User.java
│   ├── UserRepository.java
│   ├── UserService.java
│   ├── UserController.java
│   └── dto/
│       └── UserRequest.java
│
└── shared/                           # código usado por várias funcionalidades
    ├── configs/
    │   ├── SecurityConfig.java
    │   └── ViewConfig.java           # registro de TODAS as páginas HTML
    └── exceptions/
        ├── NotFoundException.java
        └── GlobalExceptionHandler.java

src/main/resources/
├── application.yaml
├── db/migration/                     # migrations do Flyway
│   ├── V1__create_users_table.sql
│   └── V2__create_products_table.sql
├── templates/                        # um HTML por página
│   ├── home.html
│   ├── product/
│   │   ├── list.html
│   │   └── form.html
│   └── user/
│       └── form.html
└── static/
    ├── css/                          # um CSS por página, mesmo caminho do HTML
    │   ├── home.css
    │   ├── product/
    │   │   ├── list.css
    │   │   └── form.css
    │   └── user/
    │       └── form.css
    ├── js/                           # um JS por página, mesmo caminho do HTML
    │   ├── home.js
    │   ├── product/
    │   │   ├── list.js
    │   │   └── form.js
    │   └── user/
    │       └── form.js
    └── images/

src/test/java/com/joao_v_marques/meaven/
├── product/                          # testes seguem o mesmo pacote do código
│   └── ProductServiceTest.java
└── user/
    └── UserServiceTest.java
```

## Regras do Thymeleaf

> **O Thymeleaf serve UNICAMENTE para entregar as páginas HTML registradas no `ViewConfig`. Ele NUNCA monta componentes, fragmentos, layouts ou dados na página.**

O HTML de cada página é um **HTML puro e completo**, com `<head>`, `<body>` e os links para o próprio CSS e JS. Nenhum atributo `th:` deve aparecer nos arquivos.

É **proibido**:

- `th:fragment`, `th:insert`, `th:replace` ou qualquer forma de reaproveitar pedaços de HTML;
- criar pastas como `fragments/`, `layouts/` ou `components/` em `templates/`;
- `th:text`, `th:each`, `th:if`, `th:object`, `th:field` ou qualquer atributo que coloque dados na página;
- controllers com `@Controller` que retornam o nome de uma view ou usam `Model`;
- usar `xmlns:th` no HTML.

Então, como os dados chegam na tela? **Pelo JavaScript.** O JS da página chama a API REST da funcionalidade com `fetch` e monta o conteúdo.

### Como registrar uma página nova

Toda página é registrada no `shared/configs/ViewConfig.java`. É o único lugar que liga uma URL a um HTML:

```java
@Configuration
public class ViewConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/home").setViewName("home");

        registry.addViewController("/products").setViewName("product/list");
        registry.addViewController("/products/new").setViewName("product/form");
        registry.addViewController("/products/{id}/edit").setViewName("product/form");
    }
}
```

Na página de edição, o JS lê o `id` da própria URL (`window.location.pathname`).

## O que cada arquivo faz

| Arquivo | Responsabilidade | Exemplo |
|---|---|---|
| `Product` | Entidade JPA que representa a tabela | `@Entity @Table(name = "products")` |
| `ProductRepository` | Consultas no banco | `extends JpaRepository<Product, Long>` |
| `ProductService` | Regras de negócio e validações | `create`, `update`, `findById` |
| `ProductController` | API REST: recebe a requisição, chama o service e devolve JSON | `@RestController @RequestMapping("/api/products")` |
| `dto/ProductRequest` | Dados que chegam na API, com validações | `@NotBlank String name` |
| `dto/ProductResponse` | Dados que a API devolve | `record ProductResponse(Long id, String name)` |
| `templates/product/list.html` | Estrutura HTML da página, sem Thymeleaf | `<table id="products-table">` |
| `static/css/product/list.css` | Estilo só dessa página | `.products-table { ... }` |
| `static/js/product/list.js` | Chama a API e preenche a página | `fetch("/meaven/api/products")` |

### Quem pode chamar quem

```text
Página (HTML + JS)  →  Controller (API)  →  Service  →  Repository  →  Banco
```

- O **JS da página** só conversa com o back-end pela **API** (`/api/...`).
- O **controller** só chama o **service** da própria funcionalidade. Ele não acessa o repository.
- O **service** pode chamar o próprio repository e o **service** de outra funcionalidade.
- Um service **nunca** acessa o repository de outra funcionalidade. Se `product` precisa de dados de `user`, ele chama o `UserService`.
- `shared/` não depende de nenhuma funcionalidade. As funcionalidades é que usam o `shared/`.

## Exemplo completo

Uma funcionalidade `product` mínima, do banco até a tela.

### Back-end

```java
// product/Product.java
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal price;

    private boolean active;
}
```

```java
// product/ProductRepository.java
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();
}
```

```java
// product/ProductService.java
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> findActiveProducts() {
        return productRepository.findByActiveTrue().stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setPrice(request.price());
        product.setActive(true);
        return ProductResponse.from(productRepository.save(product));
    }
}
```

```java
// product/dto/ProductRequest.java
public record ProductRequest(
        @NotBlank String name,
        @NotNull @Positive BigDecimal price
) {
}
```

```java
// product/dto/ProductResponse.java
public record ProductResponse(Long id, String name, BigDecimal price) {

    public static ProductResponse from(Product product) {
        return new ProductResponse(product.getId(), product.getName(), product.getPrice());
    }
}
```

```java
// product/ProductController.java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> list() {
        return productService.findActiveProducts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }
}
```

```sql
-- db/migration/V2__create_products_table.sql
CREATE TABLE products (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(150)   NOT NULL,
    price      NUMERIC(10, 2) NOT NULL,
    active     BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP      NOT NULL DEFAULT NOW()
);
```

### Front-end

```html
<!-- templates/product/list.html -->
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
    <h1>Produtos</h1>

    <a href="/meaven/products/new" class="new-product-link">Novo produto</a>

    <table class="products-table">
        <thead>
            <tr>
                <th>Nome</th>
                <th>Preço</th>
            </tr>
        </thead>
        <tbody id="products-table-body"></tbody>
    </table>
</body>
</html>
```

```css
/* static/css/product/list.css */
.products-table {
    width: 100%;
    border-collapse: collapse;
}

.products-table th,
.products-table td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}
```

```javascript
// static/js/product/list.js
document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
    const response = await fetch("/meaven/api/products");
    const products = await response.json();

    const tableBody = document.getElementById("products-table-body");

    products.forEach((product) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const priceCell = document.createElement("td");
        priceCell.textContent = formatPrice(product.price);

        row.append(nameCell, priceCell);
        tableBody.append(row);
    });
}

function formatPrice(price) {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
```

Use `textContent` para colocar dados na tela. Não use `innerHTML` com dados que vêm da API, porque isso abre brecha para injeção de código.

## Padrões de nomes

| O quê | Padrão | Exemplo |
|---|---|---|
| Pacote da funcionalidade | singular, minúsculo | `product`, `user`, `order` |
| Pacote com mais de uma palavra | tudo junto, minúsculo | `purchaseorder` |
| Classe, interface, enum | `PascalCase` | `ProductService`, `ProductStatus` |
| Método e variável (Java e JS) | `camelCase`, começando com verbo no caso dos métodos | `findById`, `loadProducts`, `totalPrice` |
| Constante | `UPPER_SNAKE_CASE` | `MAX_ITEMS_PER_PAGE` |
| Valores de enum | `UPPER_SNAKE_CASE` | `ACTIVE`, `OUT_OF_STOCK` |
| Tabela | plural, `snake_case` | `products`, `purchase_orders` |
| Coluna | `snake_case` | `created_at`, `user_id` |
| Migration | `V<número>__<descrição_em_inglês>.sql` | `V3__add_stock_to_products.sql` |
| URL de página | plural, minúsculo, com hífen | `/products`, `/purchase-orders/new` |
| URL da API | `/api/` + plural, minúsculo, com hífen | `/api/products`, `/api/purchase-orders` |
| Arquivos da página | pasta da funcionalidade + ação, iguais nos três | `product/list.html`, `product/list.css`, `product/list.js` |
| Classe CSS e ID | `kebab-case` | `products-table`, `save-button` |

Sufixos das classes:

| Sufixo | Uso |
|---|---|
| `Controller` | Classe com `@RestController` |
| `Service` | Classe com `@Service` |
| `Repository` | Interface do Spring Data |
| `Request` | DTO de entrada da API |
| `Response` | DTO de saída da API |
| `Config` | Classe de configuração, sempre em `shared/configs/` |
| `Exception` | Exceção customizada |

Entidades não levam sufixo: `Product`, e não `ProductEntity`.

## Checklist para uma nova funcionalidade

**Back-end**

- [ ] Criei um pacote novo com nome em inglês e no singular, como `product/`.
- [ ] Coloquei entidade, repository, service e controller dentro desse pacote.
- [ ] O controller é um `@RestController` em `/api/...` e só chama o service.
- [ ] Não acessei o repository de outra funcionalidade.
- [ ] Criei a migration em `db/migration/` com o próximo número livre.

**Front-end**

- [ ] Cada página nova tem um HTML, um CSS e um JS, com o mesmo nome e o mesmo caminho.
- [ ] Registrei a página no `ViewConfig`.
- [ ] O HTML não tem nenhum atributo `th:`.
- [ ] Os dados chegam na tela pelo JS, chamando a API.

**Sempre**

- [ ] **Todos os nomes de classes, métodos, variáveis, tabelas, colunas, URLs, arquivos, classes CSS, IDs e funções JS estão em inglês.**

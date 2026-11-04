# Banco de dados

Padrões para criar e alterar o banco do Meaven. Para subir o banco local, veja [Como preparar o ambiente de desenvolvimento](ambiente-local.md).

> [!IMPORTANT]
> Tabelas, colunas, constraints e arquivos de migration são escritos em **inglês**.

## Organização das pastas

```text
src/main/resources/db/migration/
├── V1__create_users_table.sql
├── V2__create_products_table.sql
└── V3__add_stock_to_products.sql
```

## Como o banco é criado

- O banco é **PostgreSQL 18**, rodando no Docker.
- Toda mudança no banco é feita por uma **migration do Flyway**. O Flyway roda as migrations novas sozinho quando o projeto sobe.
- O Hibernate está com `ddl-auto: validate`: ele **não cria nem altera tabelas**, só confere se as entidades batem com o banco. Se você criar uma entidade sem a migration, o projeto não sobe.

## Migrations

### Nome do arquivo

```text
V<número>__<descrição_em_inglês>.sql
```

- O número é sequencial: veja o maior número em `db/migration/` e use o próximo.
- São **dois** underlines (`__`) depois do número.
- A descrição diz o que a migration faz: `create_products_table`, `add_stock_to_products`, `create_index_on_products_name`.

### Regras

> [!WARNING]
> **Nunca altere uma migration que já está na `main`.** O Flyway guarda um checksum de cada arquivo e o projeto para de subir se ele mudar. Para corrigir algo, crie uma migration nova.

- Uma migration faz **uma** mudança: criar uma tabela, adicionar uma coluna, criar um índice.
- Antes de abrir o PR, traga a `main` para a sua branch e confira se ninguém usou o mesmo número. Se usou, renomeie a sua para o próximo número livre.
- Nunca apague uma migration.

## Padrões de nomes

| O quê | Padrão | Exemplo |
|---|---|---|
| Tabela | plural, `snake_case` | `products`, `purchase_orders` |
| Coluna | singular, `snake_case` | `name`, `created_at` |
| Chave primária | `id` | `id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY` |
| Chave estrangeira | `<tabela_no_singular>_id`, tipo `INT` | `user_id`, `product_id` |
| Booleano | adjetivo, sem `is_` | `active`, `visible` |
| Constraint de chave estrangeira | `fk_<tabela>_<tabela_referenciada>` | `fk_products_users` |
| Constraint de valor único | `uk_<tabela>_<coluna>` | `uk_users_email` |
| Índice | `idx_<tabela>_<coluna>` | `idx_products_name` |

Toda tabela tem as colunas `id`, `created_at` e `updated_at`.

Toda chave primária é criada assim:

```sql
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

O banco gera o `id` sozinho e **não aceita** que ele seja informado no `INSERT`. Na entidade, use `@GeneratedValue(strategy = GenerationType.IDENTITY)` com o tipo `Integer`.

## Tipos de dados

| Dado | Tipo no PostgreSQL | Tipo no Java |
|---|---|---|
| Chave primária | `INT GENERATED ALWAYS AS IDENTITY` | `Integer` |
| Chave estrangeira | `INT` | `Integer` (ou a entidade, com `@ManyToOne`) |
| Texto curto | `VARCHAR(n)` | `String` |
| Texto longo | `TEXT` | `String` |
| Número inteiro | `INT` | `Integer` |
| Dinheiro e valores exatos | `NUMERIC(10, 2)` | `BigDecimal` |
| Verdadeiro ou falso | `BOOLEAN` | `boolean` |
| Data | `DATE` | `LocalDate` |
| Data e hora | `TIMESTAMP` | `LocalDateTime` |
| Enum | `VARCHAR(30)` | `enum` com `@Enumerated(EnumType.STRING)` |

> [!CAUTION]
> Nunca use `REAL`, `FLOAT` ou `DOUBLE` para dinheiro. Esses tipos arredondam valores.

## Exemplo

```sql
-- V2__create_products_table.sql
CREATE TABLE products (
    id         INT            GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       VARCHAR(150)   NOT NULL,
    price      NUMERIC(10, 2) NOT NULL,
    status     VARCHAR(30)    NOT NULL,
    active     BOOLEAN        NOT NULL DEFAULT TRUE,
    user_id    INT            NOT NULL,
    created_at TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_products_users FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_products_user_id ON products (user_id);
```

A entidade correspondente:

```java
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    private boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

- O Spring converte `camelCase` para `snake_case` sozinho: `createdAt` vira `created_at`. Só use `@Column(name = ...)` quando o nome for diferente.
- Relacionamentos `@ManyToOne` usam sempre `fetch = FetchType.LAZY`.

## Comandos úteis

| O que fazer | Comando |
|---|---|
| Acessar o banco pelo terminal | `docker exec -it meaven-db psql -U postgres -d meaven` |
| Ver as migrations já aplicadas | `SELECT version, description, success FROM flyway_schema_history;` |
| Apagar o banco e recriar do zero | `docker compose down -v` e depois `docker compose up -d` |

## Checklist

- [ ] Criei uma migration nova, sem alterar nenhuma que já está na `main`.
- [ ] O nome do arquivo segue `V<número>__<descrição>.sql`, com o próximo número livre.
- [ ] Tabela no plural, colunas e constraints em `snake_case` e em inglês.
- [ ] A tabela tem `id`, `created_at` e `updated_at`.
- [ ] A chave primária é `id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY` e as chaves estrangeiras são `INT`.
- [ ] Dinheiro usa `NUMERIC`, nunca `FLOAT`.
- [ ] A entidade bate com a migration e o projeto sobe sem erro.

# Back-end

Padrões para escrever o código Java do Meaven. A visão geral da arquitetura está em [Arquitetura e organização do projeto](../architecture/organizacao-do-projeto.md).

> [!IMPORTANT]
> Todo o código é escrito em **inglês**: pacotes, classes, métodos, variáveis e comentários.

## Organização das pastas

```text
src/main/java/com/joao_v_marques/meaven/
├── product/                      # uma pasta por funcionalidade
│   ├── Product.java              # entidade
│   ├── ProductRepository.java
│   ├── ProductService.java
│   ├── ProductController.java    # API REST
│   └── dto/
│       ├── ProductRequest.java
│       └── ProductResponse.java
└── shared/
    ├── configs/                  # classes de configuração (*Config)
    └── exceptions/               # exceções e tratamento global de erros
```

## Camadas

```text
Controller  →  Service  →  Repository  →  Banco
```

| Camada | Faz | Não faz |
|---|---|---|
| **Controller** | Recebe a requisição, valida o DTO com `@Valid`, chama o service e devolve o JSON | Regra de negócio, acesso ao repository |
| **Service** | Regras de negócio, transações, conversão entre entidade e DTO | Lidar com HTTP (`HttpServletRequest`, status) |
| **Repository** | Consultas no banco | Regra de negócio |

- Um service **nunca** acessa o repository de outra funcionalidade. Se precisar de dados de `user`, chame o `UserService`.
- O controller **nunca** devolve uma entidade. Sempre devolva um DTO `Response`.

## Padrões de código

### Injeção de dependência pelo construtor

Use campos `private final` com `@RequiredArgsConstructor`. Não use `@Autowired` em campos.

```java
// ✅ Certo
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
}

// ❌ Errado
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
}
```

### DTOs são `record`

- `Request`: dados que chegam na API, com as validações.
- `Response`: dados que a API devolve, com um método `from` que converte a entidade.

```java
public record ProductRequest(
        @NotBlank @Size(max = 150) String name,
        @NotNull @Positive BigDecimal price
) {
}

public record ProductResponse(Integer id, String name, BigDecimal price) {

    public static ProductResponse from(Product product) {
        return new ProductResponse(product.getId(), product.getName(), product.getPrice());
    }
}
```

### Transações no service

Coloque `@Transactional` nos métodos do service que alteram dados e `@Transactional(readOnly = true)` nos que só leem.

```java
@Transactional(readOnly = true)
public ProductResponse findById(Integer id) {
    return productRepository.findById(id)
            .map(ProductResponse::from)
            .orElseThrow(() -> new NotFoundException("Product not found: " + id));
}

@Transactional
public ProductResponse create(ProductRequest request) {
    Product product = new Product();
    product.setName(request.name());
    product.setPrice(request.price());
    return ProductResponse.from(productRepository.save(product));
}
```

### Lombok

| Use | Evite |
|---|---|
| `@Getter`, `@Setter`, `@NoArgsConstructor` nas entidades | `@Data` em entidades: o `equals`, o `hashCode` e o `toString` gerados causam problemas com o JPA |
| `@RequiredArgsConstructor` em services e controllers | `@AllArgsConstructor` em services e controllers |
| `@Slf4j` para logs | `System.out.println` |

## API REST

Todas as rotas da API começam com `/api/` e usam o nome da funcionalidade no plural.

| Ação | Método | Rota | Status de sucesso |
|---|---|---|---|
| Listar | `GET` | `/api/products` | `200 OK` |
| Buscar um | `GET` | `/api/products/{id}` | `200 OK` |
| Criar | `POST` | `/api/products` | `201 Created` |
| Atualizar | `PUT` | `/api/products/{id}` | `200 OK` |
| Remover | `DELETE` | `/api/products/{id}` | `204 No Content` |

```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{id}")
    public ProductResponse findById(@PathVariable Integer id) {
        return productService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        productService.delete(id);
    }
}
```

## Tratamento de erros

- Lance exceções do `shared/exceptions/` no service, como `NotFoundException`.
- **Não** use `try/catch` no controller para montar a resposta de erro. O `GlobalExceptionHandler` (`@RestControllerAdvice`) cuida disso para a aplicação toda.
- Toda resposta de erro tem o mesmo formato:

```json
{
  "status": 404,
  "message": "Product not found: 10"
}
```

| Situação | Exceção | Status |
|---|---|---|
| Registro não encontrado | `NotFoundException` | `404 Not Found` |
| Regra de negócio violada | `BusinessException` | `422 Unprocessable Entity` |
| DTO inválido (`@Valid`) | `MethodArgumentNotValidException`, lançada pelo Spring | `400 Bad Request` |

## Configurações

- Configurações ficam no `application.yaml`.
- Valores que mudam por máquina ou são secretos (senhas, tokens) usam variável de ambiente, com um valor padrão para desenvolvimento: `${DB_PASSWORD:1234}`.
- Nunca coloque senha real ou token no código ou no `application.yaml`.

## Checklist

- [ ] A classe está no pacote da funcionalidade, com nome em inglês.
- [ ] Dependências injetadas pelo construtor (`private final` + `@RequiredArgsConstructor`).
- [ ] O controller recebe um `Request`, devolve um `Response` e só chama o service.
- [ ] O `Request` tem as validações (`@NotBlank`, `@NotNull`, ...) e o controller usa `@Valid`.
- [ ] Os métodos do service têm `@Transactional`.
- [ ] Os erros são exceções lançadas no service, sem `try/catch` no controller.

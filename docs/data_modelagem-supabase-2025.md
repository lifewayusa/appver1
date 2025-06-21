# Modelagem de Banco de Dados Supabase — Projeto Lifewayusa (2025)

## Visão Geral

- **Arquitetura descentralizada:** Cada ferramenta do sistema possui sua própria tabela.
- **Campos enxutos:** Apenas informações essenciais em cada tabela, evitando excesso de colunas.
- **Tabela central de conteúdo:** Toda página do site/app armazena seu conteúdo na tabela `content`.
- **Relacionamentos claros e simples:** Uso de chaves estrangeiras apenas quando necessário.

---

## Tabelas e Estruturas

### 1. `content`
Armazena o conteúdo dinâmico de todas as páginas do site/app.

| Campo         | Tipo         | Regras/Descrição                        |
|-------------- |-------------|-----------------------------------------|
| id            | uuid (PK)    | Gerado automaticamente                  |
| slug          | text         | Identificador único da página           |
| title         | text         | Título da página                        |
| body          | text         | Conteúdo em markdown ou HTML            |
| created_at    | timestamptz  | Default: now()                          |
| updated_at    | timestamptz  | Atualizado a cada modificação           |

- **Regra:** `slug` deve ser único.

---

### 2. `users`
Usuários do sistema (caso precise autenticação no futuro).

| Campo         | Tipo         | Regras/Descrição                        |
|-------------- |-------------|-----------------------------------------|
| id            | uuid (PK)    | Gerado automaticamente                  |
| email         | text         | Único                                   |
| full_name     | text         |                                         |
| created_at    | timestamptz  | Default: now()                          |

---

### 3. `project_usa`
Dados específicos da ferramenta Project USA.

| Campo         | Tipo         | Regras/Descrição                        |
|-------------- |-------------|-----------------------------------------|
| id            | uuid (PK)    | Gerado automaticamente                  |
| user_id       | uuid (FK)    | Referencia `users.id` (opcional)        |
| data          | jsonb        | Dados completos do formulário           |
| created_at    | timestamptz  | Default: now()                          |

---

### 4. `visa_match`
Dados da ferramenta Visa Match.

| Campo         | Tipo         | Regras/Descrição                        |
|-------------- |-------------|-----------------------------------------|
| id            | uuid (PK)    | Gerado automaticamente                  |
| user_id       | uuid (FK)    | Referencia `users.id` (opcional)        |
| answers       | jsonb        | Respostas do usuário                    |
| result        | jsonb        | Resultado da análise                    |
| created_at    | timestamptz  | Default: now()                          |

---

### 5. `family_planner`
Dados da ferramenta Family Planner.

| Campo         | Tipo         | Regras/Descrição                        |
|-------------- |-------------|-----------------------------------------|
| id            | uuid (PK)    | Gerado automaticamente                  |
| user_id       | uuid (FK)    | Referencia `users.id` (opcional)        |
| data          | jsonb        | Dados completos do formulário           |
| created_at    | timestamptz  | Default: now()                          |

---

### 6. `criador_sonhos`
Dados da ferramenta Criador de Sonhos.

| Campo         | Tipo         | Regras/Descrição                        |
|-------------- |-------------|-----------------------------------------|
| id            | uuid (PK)    | Gerado automaticamente                  |
| user_id       | uuid (FK)    | Referencia `users.id` (opcional)        |
| data          | jsonb        | Dados completos do formulário           |
| created_at    | timestamptz  | Default: now()                          |

---

### 7. `newsletter_leads`
Leads capturados pelo formulário de newsletter.

| Campo         | Tipo         | Regras/Descrição                        |
|-------------- |-------------|-----------------------------------------|
| id            | uuid (PK)    | Gerado automaticamente                  |
| email         | text         | Único                                   |
| created_at    | timestamptz  | Default: now()                          |

---

## Regras Gerais

- **Cada ferramenta tem sua própria tabela** para máxima flexibilidade e isolamento de dados.
- **Campos extras** podem ser adicionados em cada tabela conforme a evolução de cada ferramenta, mas sempre evitando excesso.
- **Relacionamentos:**
  - `user_id` é opcional, permitindo uso anônimo das ferramentas.
  - Não há dependência entre tabelas de ferramentas.
- **Tabela `content`** centraliza todo o conteúdo dinâmico do site/app, facilitando CMS e customização.

---

## Relacionamentos (Diagrama Simplificado)

```
users (1) ────< (N) project_usa
     │             (N) visa_match
     │             (N) family_planner
     │             (N) criador_sonhos
     │
     └────< (N) newsletter_leads

content (independente)
```

---

## Observações
- **Fácil expansão:** Para cada nova ferramenta, basta criar uma nova tabela específica.
- **Migração:** Importe apenas dados essenciais do banco antigo, se necessário, para as novas tabelas.
- **Segurança:** Use policies do Supabase para controlar acesso conforme necessidade futura.

---

*Gerado automaticamente por GitHub Copilot em 19/06/2025*

# CSV to Supabase Field Mapping and Import Script

## 1. Mapping for Each Table

### cities.csv → cities
| CSV Column           | Supabase Field         |
|----------------------|-----------------------|
| id                   | id                    |
| name                 | name                  |
| state                | state                 |
| country              | country               |
| population           | population            |
| image_url            | image_url             |
| cost_of_living       | cost_of_living        |
| job_market_rating    | job_market_rating     |
| education_rating     | education_rating      |
| business_rating      | business_rating       |
| description          | description           |
| latitude             | latitude              |
| longitude            | longitude             |
| is_main_destiny      | is_main_destiny       |
| education_highlights | education_highlights  |
| attractions          | attractions           |
| neighborhoods        | neighborhoods         |
| created_at           | created_at            |
| updated_at           | updated_at            |

### universities.csv → universities
| CSV Column   | Supabase Field |
|-------------|----------------|
| id          | id             |
| city_id     | city_id        |
| f1_certified| f1_certified   |
| m1_certified| m1_certified   |
| created_at  | created_at     |
| updated_at  | updated_at     |
| name        | name           |
| campus_name | campus_name    |
| campus_id   | campus_id      |
| url         | url            |

### english_courses.csv → english_courses
| CSV Column | Supabase Field |
|------------|---------------|
| id         | id            |
| city_id    | city_id       |
| created_at | created_at    |
| updated_at | updated_at    |
| url        | url           |
| address    | address       |
| phone      | phone         |
| name       | name          |
| description| description   |

### schools.csv → schools
| CSV Column           | Supabase Field         |
|----------------------|-----------------------|
| id                   | id                    |
| city_id              | city_id               |
| has_pre_kindergarten | has_pre_kindergarten  |
| has_kindergarten     | has_kindergarten      |
| created_at           | created_at            |
| updated_at           | updated_at            |
| phone                | phone                 |
| zip                  | zip                   |
| name                 | name                  |
| type                 | type                  |
| url                  | url                   |
| address              | address               |

---

## 2. Import Script (psql/CLI)

Execute no terminal, ajustando o caminho se necessário:

```bash
psql "postgresql://postgres:lWfNDt73tM8dGMVJ@db.oaxkqqamnppkeavunlgo.supabase.co:5432/postgres" -c "\copy cities FROM './csv/cities.csv' DELIMITER ',' CSV HEADER"
psql "postgresql://postgres:lWfNDt73tM8dGMVJ@db.oaxkqqamnppkeavunlgo.supabase.co:5432/postgres" -c "\copy universities FROM './csv/universities.csv' DELIMITER ',' CSV HEADER"
psql "postgresql://postgres:lWfNDt73tM8dGMVJ@db.oaxkqqamnppkeavunlgo.supabase.co:5432/postgres" -c "\copy english_courses FROM './csv/english_courses.csv' DELIMITER ',' CSV HEADER"
psql "postgresql://postgres:lWfNDt73tM8dGMVJ@db.oaxkqqamnppkeavunlgo.supabase.co:5432/postgres" -c "\copy schools FROM './csv/schools.csv' DELIMITER ',' CSV HEADER"
```

> Substitua `$SUPABASE_URL` pela sua string de conexão do Supabase (disponível no painel ou no `.env.local`).

---

Se algum campo do CSV não existir no banco, ajuste o cabeçalho do CSV ou adicione a coluna no Supabase antes de importar.

*Gerado automaticamente para facilitar a importação e garantir o mapeamento correto dos dados.*

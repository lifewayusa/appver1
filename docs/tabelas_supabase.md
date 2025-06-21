| table_name            | column_name                | data_type                | is_nullable |
| --------------------- | -------------------------- | ------------------------ | ----------- |
| ai_tools_analyses     | id                         | uuid                     | NO          |
| ai_tools_analyses     | prospect_id                | uuid                     | NO          |
| ai_tools_analyses     | tool_type                  | text                     | NO          |
| ai_tools_analyses     | analysis_output            | text                     | YES         |
| ai_tools_analyses     | parameters                 | jsonb                    | YES         |
| ai_tools_analyses     | model_version              | text                     | YES         |
| ai_tools_analyses     | created_at                 | timestamp with time zone | YES         |
| ai_tools_analyses     | updated_at                 | timestamp with time zone | YES         |
| cities                | id                         | uuid                     | NO          |
| cities                | name                       | text                     | NO          |
| cities                | state                      | text                     | NO          |
| cities                | country                    | text                     | NO          |
| cities                | population                 | integer                  | YES         |
| cities                | image_url                  | text                     | YES         |
| cities                | cost_of_living             | numeric                  | YES         |
| cities                | job_market_rating          | numeric                  | YES         |
| cities                | education_rating           | numeric                  | YES         |
| cities                | business_rating            | numeric                  | YES         |
| cities                | description                | text                     | YES         |
| cities                | latitude                   | numeric                  | YES         |
| cities                | longitude                  | numeric                  | YES         |
| cities                | created_at                 | timestamp with time zone | YES         |
| cities                | updated_at                 | timestamp with time zone | YES         |
| cities                | is_main_destiny            | boolean                  | YES         |
| cities                | education_highlights       | text                     | YES         |
| cities                | attractions                | text                     | YES         |
| cities                | neighborhoods              | text                     | YES         |
| cities_count_by_state | state                      | text                     | YES         |
| cities_count_by_state | count                      | bigint                   | YES         |
| documents             | id                         | uuid                     | NO          |
| documents             | user_id                    | uuid                     | NO          |
| documents             | title                      | text                     | NO          |
| documents             | description                | text                     | YES         |
| documents             | file_path                  | text                     | NO          |
| documents             | file_type                  | text                     | NO          |
| documents             | file_size                  | integer                  | NO          |
| documents             | created_at                 | timestamp with time zone | YES         |
| documents             | updated_at                 | timestamp with time zone | YES         |
| english_courses       | id                         | uuid                     | NO          |
| english_courses       | city_id                    | uuid                     | YES         |
| english_courses       | created_at                 | timestamp with time zone | YES         |
| english_courses       | updated_at                 | timestamp with time zone | YES         |
| english_courses       | url                        | text                     | YES         |
| english_courses       | address                    | text                     | YES         |
| english_courses       | phone                      | text                     | YES         |
| english_courses       | name                       | text                     | NO          |
| english_courses       | description                | text                     | YES         |
| financial_plans       | id                         | uuid                     | NO          |
| financial_plans       | user_id                    | uuid                     | NO          |
| financial_plans       | title                      | text                     | NO          |
| financial_plans       | description                | text                     | YES         |
| financial_plans       | budget                     | numeric                  | NO          |
| financial_plans       | currency                   | text                     | YES         |
| financial_plans       | data                       | jsonb                    | YES         |
| financial_plans       | created_at                 | timestamp with time zone | YES         |
| financial_plans       | updated_at                 | timestamp with time zone | YES         |
| membros_familia       | id                         | uuid                     | NO          |
| membros_familia       | familia_id                 | uuid                     | NO          |
| membros_familia       | nome                       | text                     | NO          |
| membros_familia       | parentesco                 | text                     | YES         |
| membros_familia       | idade                      | integer                  | YES         |
| membros_familia       | nacionalidade              | text                     | YES         |
| membros_familia       | escolaridade               | text                     | YES         |
| membros_familia       | profissao                  | text                     | YES         |
| membros_familia       | saude_condicoes            | text                     | YES         |
| membros_familia       | historico_imigratorio_eua  | text                     | YES         |
| membros_familia       | objetivo_eua               | text                     | YES         |
| membros_familia       | output_analise_ia          | text                     | YES         |
| membros_familia       | data_atualizacao_ia        | timestamp with time zone | YES         |
| payments              | id                         | uuid                     | NO          |
| payments              | user_id                    | uuid                     | YES         |
| payments              | prospect_id                | uuid                     | YES         |
| payments              | amount                     | numeric                  | NO          |
| payments              | currency                   | text                     | NO          |
| payments              | payment_method             | text                     | YES         |
| payments              | stripe_payment_id          | text                     | YES         |
| payments              | status                     | text                     | NO          |
| payments              | created_at                 | timestamp with time zone | YES         |
| professional_courses  | id                         | uuid                     | NO          |
| professional_courses  | city_id                    | uuid                     | YES         |
| professional_courses  | created_at                 | timestamp with time zone | YES         |
| professional_courses  | updated_at                 | timestamp with time zone | YES         |
| professional_courses  | field                      | text                     | YES         |
| professional_courses  | url                        | text                     | YES         |
| professional_courses  | address                    | text                     | YES         |
| professional_courses  | phone                      | text                     | YES         |
| professional_courses  | name                       | text                     | NO          |
| professional_courses  | description                | text                     | YES         |
| profiles              | id                         | uuid                     | NO          |
| profiles              | user_id                   | uuid                     | NO          |
| profiles              | full_name                  | text                     | NO          |
| profiles              | birth_date                | date                     | YES         |
| profiles              | phone                      | text                     | YES         |
| profiles              | cpf                        | text                     | YES         |
| profiles              | rg                         | text                     | YES         |
| profiles              | passport                   | text                     | YES         |
| profiles              | marital_status             | text                     | YES         |
| profiles              | spouse_name                | text                     | YES         |
| profiles              | spouse_birth              | date                     | YES         |
| profiles              | spouse_education           | text                     | YES         |
| profiles              | spouse_profession          | text                     | YES         |
| profiles              | children                   | jsonb                    | YES         |
| profiles              | education_level            | text                     | YES         |
| profiles              | education_institution      | text                     | YES         |
| profiles              | education_course           | text                     | YES         |
| profiles              | education_gpa             | numeric                  | YES         |
| profiles              | english_level              | text                     | YES         |
| profiles              | profession                 | text                     | YES         |
| profiles              | experience                 | integer                  | YES         |
| profiles              | current_salary             | numeric                  | YES         |
| profiles              | skills                     | text[]                   | YES         |
| profiles              | usa_objectives             | text[]                   | YES         |
| profiles              | target_states              | text[]                   | YES         |
| profiles              | timeline                   | text                     | YES         |
| profiles              | current_savings            | numeric                  | YES         |
| profiles              | monthly_income             | numeric                  | YES         |
| profiles              | investment_capacity         | numeric                  | YES         |
| profiles              | profile_type               | text                     | YES         |
| profiles              | bio                        | text                     | YES         |
| profiles              | avatar_url                 | text                     | YES         |
| profiles              | role                       | text                     | NO          |
| profiles              | created_at                 | timestamp with time zone | YES         |
| profiles              | updated_at                 | timestamp with time zone | YES         |
| documents             | id                         | uuid                     | NO          |
| documents             | title                      | text                     | NO          |
| documents             | description                | text                     | YES         |
| documents             | file_url                  | text                     | NO          |
| documents             | file_type                  | text                     | NO          |
| documents             | category                   | text                     | YES         |
| documents             | is_public                  | boolean                  | YES         |
| schools               | id                         | uuid                     | NO          |
| schools               | city_id                    | uuid                     | YES         |
| schools               | has_pre_kindergarten       | boolean                  | YES         |
| schools               | has_kindergarten           | boolean                  | YES         |
| schools               | created_at                 | timestamp with time zone | YES         |
| schools               | updated_at                 | timestamp with time zone | YES         |
| schools               | phone                      | text                     | YES         |
| schools               | zip                        | text                     | YES         |
| schools               | name                       | text                     | NO          |
| schools               | type                       | text                     | YES         |
| schools               | url                        | text                     | YES         |
| schools               | address                    | text                     | YES         |
| universities           | id                         | uuid                     | NO          |
| universities           | city_id                    | uuid                     | YES         |
| universities           | f1_certified              | boolean                  | YES         |
| universities           | m1_certified              | boolean                  | YES         |
| universities           | created_at                 | timestamp with time zone | YES         |
| universities           | updated_at                 | timestamp with time zone | YES         |
| universities           | name                       | text                     | NO          |
| universities           | campus_name                | text                     | YES         |
| universities           | campus_id                 | text                     | YES         |
| universities           | url                        | text                     | YES         |
| prospects              | id                         | uuid                     | NO          |
| prospects              | user_id                    | uuid                     | YES         |
| prospects              | created_at                 | timestamp with time zone | YES         |
| prospects              | updated_at                 | timestamp with time zone | YES         |
| prospects              | has_worked_abroad          | boolean                  | YES         |
| prospects              | profession                 | text                     | YES         |
| prospects              | years_experience           | text                     | YES         |
| prospects              | where_worked_abroad        | text                     | YES         |
| prospects              | how_long_worked_abroad     | text                     | YES         |
| prospects              | analysis_dream_creator     | text                     | YES         |
| prospects              | analysis_get_opportunity   | text                     | YES         |
| prospects              | analysis_family_planner    | text                     | YES         |
| prospects              | analysis_visa_match        | text                     | YES         |
| prospects              | linkedin_url               | text                     | YES         |
| prospects              | curriculum_text            | text                     | YES         |
| prospects              | name                       | text                     | NO          |
| prospects              | age                        | text                     | YES         |
| prospects              | nationality                | text                     | YES         |
| prospects              | marital_status             | text                     | YES         |
| profiles              | status                     | text                     | NO          |
| profiles              | cpf                        | text                     | YES         |
| profiles              | rg                         | text                     | YES         |
| profiles              | passport                   | text                     | YES         |
| profiles              | marital_status             | text                     | YES         |
| profiles              | spouse_name                | text                     | YES         |
| profiles              | spouse_birth              | date                     | YES         |
| profiles              | spouse_education           | text                     | YES         |
| profiles              | spouse_profession          | text                     | YES         |
| profiles              | children                   | jsonb                    | YES         |
| profiles              | education_level            | text                     | YES         |
| profiles              | education_institution      | text                     | YES         |
| profiles              | education_course           | text                     | YES         |
| profiles              | education_gpa             | numeric                  | YES         |
| profiles              | english_level              | text                     | YES         |
| profiles              | profession                 | text                     | YES         |
| profiles              | years_experience           | text                     | YES         |
| profiles              | current_salary             | numeric                  | YES         |
| profiles              | skills                     | text[]                   | YES         |
| profiles              | usa_objectives             | text[]                   | YES         |
| profiles              | target_states              | text[]                   | YES         |
| profiles              | timeline                   | text                     | YES         |
| profiles              | current_savings            | numeric                  | YES         |
| profiles              | monthly_income             | numeric                  | YES         |
| profiles              | investment_capacity         | numeric                  | YES         |
| profiles              | bio                        | text                     | YES         |
| profiles              | avatar_url                 | text                     | YES         |
| profiles              | plan                       | text                     | NO          |
| profiles              | has_worked_abroad          | boolean                  | YES         |
| profiles              | where_worked_abroad        | text                     | YES         |
| profiles              | how_long_worked_abroad     | text                     | YES         |
| profiles              | analysis_dream_creator     | text                     | YES         |
| profiles              | analysis_get_opportunity   | text                     | YES         |
| profiles              | analysis_family_planner    | text                     | YES         |
| profiles              | analysis_visa_match        | text                     | YES         |
| profiles              | linkedin_url               | text                     | YES         |
| profiles              | curriculum_text            | text                     | YES         |
| profiles              | nationality                | text                     | YES         |
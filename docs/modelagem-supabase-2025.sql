-- SQL completo para criação e configuração do banco Lifewayusa no Supabase (2025)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Usuários
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Perfis
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    status text NOT NULL DEFAULT 'lead',
    full_name text,
    birth_date date,
    phone text,
    cpf text,
    rg text,
    passport text,
    marital_status text,
    spouse_name text,
    spouse_birth date,
    spouse_education text,
    spouse_profession text,
    children jsonb,
    education_level text,
    education_institution text,
    education_course text,
    education_gpa numeric,
    english_level text,
    profession text,
    years_experience text,
    current_salary numeric,
    skills text[],
    usa_objectives text[],
    target_states text[],
    timeline text,
    current_savings numeric,
    monthly_income numeric,
    investment_capacity numeric,
    bio text,
    avatar_url text,
    role text NOT NULL DEFAULT 'user',
    plan text NOT NULL DEFAULT 'free',
    has_worked_abroad boolean,
    where_worked_abroad text,
    how_long_worked_abroad text,
    analysis_dream_creator text,
    analysis_get_opportunity text,
    analysis_family_planner text,
    analysis_visa_match text,
    linkedin_url text,
    curriculum_text text,
    nationality text
);

-- 3. MultiStepForm
CREATE TABLE IF NOT EXISTS multistep_forms (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id),
    data jsonb NOT NULL,
    is_completed boolean DEFAULT false,
    qualify boolean,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Content
CREATE TABLE IF NOT EXISTS content (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Blog
CREATE TABLE IF NOT EXISTS blog_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id uuid REFERENCES profiles(id),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    summary text,
    body text NOT NULL,
    published boolean NOT NULL DEFAULT false,
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS blog_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text UNIQUE NOT NULL,
    description text
);
CREATE TABLE IF NOT EXISTS blog_post_categories (
    post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- 6. Cities
CREATE TABLE IF NOT EXISTS cities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    population integer,
    image_url text,
    cost_of_living numeric,
    job_market_rating numeric,
    education_rating numeric,
    business_rating numeric,
    description text,
    latitude numeric,
    longitude numeric,
    is_main_destiny boolean DEFAULT false,
    education_highlights text,
    attractions text,
    neighborhoods text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. English Courses
CREATE TABLE IF NOT EXISTS english_courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    url text,
    address text,
    phone text,
    name text NOT NULL,
    description text
);

-- 8. Professional Courses
CREATE TABLE IF NOT EXISTS professional_courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    field text,
    url text,
    address text,
    phone text,
    name text NOT NULL,
    description text
);

-- 9. Schools
CREATE TABLE IF NOT EXISTS schools (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    has_pre_kindergarten boolean DEFAULT false,
    has_kindergarten boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    phone text,
    zip text,
    name text NOT NULL,
    type text,
    url text,
    address text
);

-- 10. Universities
CREATE TABLE IF NOT EXISTS universities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    f1_certified boolean DEFAULT false,
    m1_certified boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    campus_name text,
    campus_id text,
    url text
);

-- 11. Documents
CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    file_url text NOT NULL,
    file_type text,
    category text,
    is_public boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 12. Newsletter Leads
CREATE TABLE IF NOT EXISTS newsletter_leads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- POLICIES DE EXEMPLO (ajuste conforme necessidade)
-- Permitir leitura pública de conteúdo e blog
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read content" ON content;
CREATE POLICY "Public read content" ON content FOR SELECT USING (true);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read blog" ON blog_posts;
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (published = true);

-- Permitir que cada usuário acesse e edite apenas seus próprios dados
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can manage own profile" ON profiles;
CREATE POLICY "User can manage own profile" ON profiles
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE multistep_forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can manage own multistep_forms" ON multistep_forms;
CREATE POLICY "User can manage own multistep_forms" ON multistep_forms
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE project_usa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can manage own project_usa" ON project_usa;
CREATE POLICY "User can manage own project_usa" ON project_usa
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE visa_match ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can manage own visa_match" ON visa_match;
CREATE POLICY "User can manage own visa_match" ON visa_match
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE family_planner ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can manage own family_planner" ON family_planner;
CREATE POLICY "User can manage own family_planner" ON family_planner
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE criador_sonhos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can manage own criador_sonhos" ON criador_sonhos;
CREATE POLICY "User can manage own criador_sonhos" ON criador_sonhos
  FOR ALL USING (user_id = auth.uid());

-- Permitir inserção pública de leads de newsletter
ALTER TABLE newsletter_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert newsletter leads" ON newsletter_leads;
CREATE POLICY "Public insert newsletter leads" ON newsletter_leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read newsletter leads" ON newsletter_leads;
CREATE POLICY "Public read newsletter leads" ON newsletter_leads FOR SELECT USING (true);

-- Exemplo de query para inserir um multistep_form
-- INSERT INTO multistep_forms (user_id, data, is_completed, qualify) VALUES ('<user-uuid>', '{"fullName": "João"}', true, true);

-- Exemplo de query para buscar todos os posts publicados do blog
-- SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC;

-- Exemplo de query para buscar dados do MultiStepForm de um usuário
-- SELECT * FROM multistep_forms WHERE user_id = '<user-uuid>' ORDER BY created_at DESC;

-- Ajuste as policies conforme regras de negócio e privacidade desejadas.

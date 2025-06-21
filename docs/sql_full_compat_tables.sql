-- SQL para garantir que todas as tabelas essenciais mantenham TODOS os campos da estrutura antiga
-- Não remove nenhum campo, apenas cria ou ajusta para máxima compatibilidade

-- 1. Cities
CREATE TABLE IF NOT EXISTS cities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    state text NOT NULL,
    population integer,
    imagem text,
    average_temperature jsonb,
    cost_of_living_index numeric,
    job_market_score numeric,
    education_score numeric,
    business_opportunity_score numeric,
    description text,
    latitude text,
    longitude text,
    country text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    main_destiny boolean DEFAULT false,
    text_education text,
    text_attractions text,
    text_neighborhood text
);

-- 2. Universities
CREATE TABLE IF NOT EXISTS universities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    name text NOT NULL,
    campus_name text,
    f1_certified boolean,
    m1_certified boolean,
    campus_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    url text
);

-- 3. English Courses
CREATE TABLE IF NOT EXISTS english_courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    name text NOT NULL,
    url text,
    address text,
    phone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    description text
);

-- 4. Professional Courses
CREATE TABLE IF NOT EXISTS professional_courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    name text NOT NULL,
    field text,
    url text,
    address text,
    phone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    description text
);

-- 5. Schools
CREATE TABLE IF NOT EXISTS schools (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id uuid REFERENCES cities(id),
    name text NOT NULL,
    type text,
    url text,
    address text,
    phone text,
    zip text,
    has_pre_kindergarten boolean,
    has_kindergarten boolean,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

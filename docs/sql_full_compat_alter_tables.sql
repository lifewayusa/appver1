-- SQL para garantir que as tabelas cities, universities, english_courses, professional_courses e schools tenham TODOS os campos da estrutura antiga
-- Use ADD COLUMN IF NOT EXISTS para máxima segurança

-- 1. Cities
ALTER TABLE cities
    ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ADD COLUMN IF NOT EXISTS name text NOT NULL,
    ADD COLUMN IF NOT EXISTS state text NOT NULL,
    ADD COLUMN IF NOT EXISTS population integer,
    ADD COLUMN IF NOT EXISTS imagem text,
    ADD COLUMN IF NOT EXISTS average_temperature jsonb,
    ADD COLUMN IF NOT EXISTS cost_of_living_index numeric,
    ADD COLUMN IF NOT EXISTS job_market_score numeric,
    ADD COLUMN IF NOT EXISTS education_score numeric,
    ADD COLUMN IF NOT EXISTS business_opportunity_score numeric,
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS latitude text,
    ADD COLUMN IF NOT EXISTS longitude text,
    ADD COLUMN IF NOT EXISTS country text NOT NULL,
    ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS main_destiny boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS text_education text,
    ADD COLUMN IF NOT EXISTS text_attractions text,
    ADD COLUMN IF NOT EXISTS text_neighborhood text;

-- 2. Universities
ALTER TABLE universities
    ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES cities(id),
    ADD COLUMN IF NOT EXISTS name text NOT NULL,
    ADD COLUMN IF NOT EXISTS campus_name text,
    ADD COLUMN IF NOT EXISTS f1_certified boolean,
    ADD COLUMN IF NOT EXISTS m1_certified boolean,
    ADD COLUMN IF NOT EXISTS campus_id text,
    ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS url text;

-- 3. English Courses
ALTER TABLE english_courses
    ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES cities(id),
    ADD COLUMN IF NOT EXISTS name text NOT NULL,
    ADD COLUMN IF NOT EXISTS url text,
    ADD COLUMN IF NOT EXISTS address text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS description text;

-- 4. Professional Courses
ALTER TABLE professional_courses
    ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES cities(id),
    ADD COLUMN IF NOT EXISTS name text NOT NULL,
    ADD COLUMN IF NOT EXISTS field text,
    ADD COLUMN IF NOT EXISTS url text,
    ADD COLUMN IF NOT EXISTS address text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS description text;

-- 5. Schools
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES cities(id),
    ADD COLUMN IF NOT EXISTS name text NOT NULL,
    ADD COLUMN IF NOT EXISTS type text,
    ADD COLUMN IF NOT EXISTS url text,
    ADD COLUMN IF NOT EXISTS address text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS zip text,
    ADD COLUMN IF NOT EXISTS has_pre_kindergarten boolean,
    ADD COLUMN IF NOT EXISTS has_kindergarten boolean,
    ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

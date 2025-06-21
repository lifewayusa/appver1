-- SQL de criação das tabelas principais do LifeWayUSA (Supabase)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  birth_date DATE
);

CREATE TABLE public.prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  qualify BOOLEAN DEFAULT FALSE,
  pro BOOLEAN DEFAULT FALSE,
  analise_familyplanner TEXT,
  analise_visamatch TEXT,
  analise_getopportunity TEXT,
  plano_projectusa_output TEXT,
  simulador_entrevista_output TEXT
);

CREATE INDEX idx_prospects_user_id ON public.prospects(user_id);

CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE public.universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT
);

CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);

CREATE TABLE public.professional_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);

CREATE TABLE public.cursos_de_ingles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);


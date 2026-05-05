-- Local PostgreSQL setup for End_to_End_JSHWebsite
-- Run this only if the local database/table does not already exist.
--
-- Recommended usage from PowerShell:
--   psql -U postgres -f C:\Projects\End_to_End_JSHWebsite\LOCAL_DATABASE_SETUP.sql
--
-- The app expects:
--   database: hackathon2026_27
--   user:     postgres
--   password: JSHS2026
--   host:     localhost
--   port:     5432

SELECT 'CREATE DATABASE hackathon2026_27'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'hackathon2026_27'
)\gexec

\connect hackathon2026_27

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  password VARCHAR(128) NOT NULL DEFAULT '',
  last_login TIMESTAMPTZ NULL,

  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  mobile VARCHAR(20),

  state VARCHAR(255),
  district VARCHAR(255),
  city VARCHAR(255),
  pincode VARCHAR(10),
  gender VARCHAR(50),

  category VARCHAR(255),
  organization VARCHAR(255),
  organization_address TEXT,
  project_investigator_name VARCHAR(255),
  project_investigator_designation VARCHAR(255),

  partner_organization VARCHAR(255),
  partner_address TEXT,
  partner_investigator_name VARCHAR(255),
  partner_investigator_email VARCHAR(254),
  partner_investigator_mobile VARCHAR(20),

  proposal_title VARCHAR(500),
  problem_statement TEXT,
  additional_info TEXT,

  team_name VARCHAR(255),
  team_members TEXT,

  registration_step VARCHAR(20) NOT NULL DEFAULT '1',
  role VARCHAR(20) NOT NULL DEFAULT 'participant',
  dashboard_access BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  is_active BOOLEAN NOT NULL DEFAULT true,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  is_superuser BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT users_registration_step_check
    CHECK (registration_step IN ('1', '2', '3', '4', '5', 'completed')),
  CONSTRAINT users_role_check
    CHECK (role IN ('participant', 'admin', 'owner'))
);

CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);
CREATE INDEX IF NOT EXISTS users_registration_step_idx ON users (registration_step);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users (created_at DESC);

CREATE OR REPLACE FUNCTION set_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_users_updated_at();

-- Keep Django migration history in sync if you create the table manually.
CREATE TABLE IF NOT EXISTS django_migrations (
  id BIGSERIAL PRIMARY KEY,
  app VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  applied TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO django_migrations (app, name, applied)
SELECT 'api', '0001_initial', NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM django_migrations
  WHERE app = 'api' AND name = '0001_initial'
);

-- Optional sanity check:
SELECT current_database() AS database_name, COUNT(*) AS users_count FROM users;

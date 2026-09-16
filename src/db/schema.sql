BEGIN;

CREATE TABLE IF NOT EXISTS authors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL CHECK (char_length(trim(name)) >= 2),
  country VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS publishers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL CHECK (char_length(trim(name)) >= 2),
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL CHECK (char_length(trim(title)) >= 2),
  isbn VARCHAR(20) NOT NULL UNIQUE,
  publication_year INTEGER NOT NULL CHECK (publication_year BETWEEN 1450 AND 2100),
  author_id BIGINT NOT NULL REFERENCES authors(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  publisher_id BIGINT NOT NULL REFERENCES publishers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_author_id ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_publisher_id ON books(publisher_id);
CREATE INDEX IF NOT EXISTS idx_books_title_lower ON books(LOWER(title));

COMMIT;

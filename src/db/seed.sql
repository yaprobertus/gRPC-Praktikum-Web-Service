BEGIN;

INSERT INTO authors (name, country) VALUES
  ('Andrea Hirata', 'Indonesia'),
  ('Dee Lestari', 'Indonesia'),
  ('Pramoedya Ananta Toer', 'Indonesia')
ON CONFLICT DO NOTHING;

INSERT INTO publishers (name, city) VALUES
  ('Bentang Pustaka', 'Yogyakarta'),
  ('Kepustakaan Populer Gramedia', 'Jakarta'),
  ('Hasta Mitra', 'Jakarta')
ON CONFLICT DO NOTHING;

INSERT INTO books (title, isbn, publication_year, author_id, publisher_id)
SELECT data.title, data.isbn, data.publication_year, a.id, p.id
FROM (VALUES
  ('Laskar Pelangi', '9789793062792', 2005, 'Andrea Hirata', 'Bentang Pustaka'),
  ('Sang Pemimpi', '9789793062921', 2006, 'Andrea Hirata', 'Bentang Pustaka'),
  ('Supernova', '9786028811729', 2001, 'Dee Lestari', 'Kepustakaan Populer Gramedia'),
  ('Bumi Manusia', '9789799731234', 1980, 'Pramoedya Ananta Toer', 'Hasta Mitra')
) AS data(title, isbn, publication_year, author_name, publisher_name)
JOIN authors a ON a.name = data.author_name
JOIN publishers p ON p.name = data.publisher_name
ON CONFLICT (isbn) DO NOTHING;

COMMIT;

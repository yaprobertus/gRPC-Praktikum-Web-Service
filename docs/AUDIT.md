# Audit Final Sesi 04 dan Sesi 05

Tanggal verifikasi production: 14 September 2026 (Asia/Jakarta)

## Ringkasan

Project telah diimplementasikan dan dideploy pada `https://praktikumwebserviceweek4.vercel.app`. Endpoint GraphQL, REST, health check, koneksi Neon, nested resolver, mutation, counter N+1, DataLoader, introspection, dan CORS Apollo Studio telah diuji langsung pada deployment production.

## Hasil verifikasi production

| Pemeriksaan | Hasil | Status |
|---|---|---|
| Root Vercel | HTTP 200 | Lulus |
| Health database | `status: ok`, `database: connected` | Lulus |
| REST `/api/books` | 4 buku nyata, masing-masing 6 field | Lulus |
| GraphQL nested query | 3 author dan buku terkait | Lulus |
| Mutation schema | 9 mutation tersedia | Lulus |
| Introspection | Aktif | Lulus |
| CORS Apollo Studio | Preflight HTTP 204 dan origin diizinkan | Lulus |
| N+1 mode demo | N=3, relation calls=3, total query=4 | Lulus |
| DataLoader | relation calls=3, total query=2, batch query=1 | Lulus |
| Dependency audit | 0 vulnerability | Lulus |
| Automated tests | 5 lulus, 0 gagal | Lulus |
| Build Vercel | Next.js 16.3.5, seluruh route terbangun | Lulus |

## Sesi 04

- Apollo Server, GraphQL, `pg`, dan pooled connection Neon digunakan.
- Tiga tabel berelasi tersedia: `authors`, `publishers`, dan `books`.
- `books.author_id` dan `books.publisher_id` menjadi foreign key.
- Resolver relasi dua arah tersedia pada `Author.books`, `Publisher.books`, `Book.author`, dan `Book.publisher`.
- Query nested berhasil dijalankan melalui endpoint Vercel production.
- Endpoint REST pembanding mengembalikan enam field: `id`, `title`, `isbn`, `publication_year`, `author_name`, dan `publisher_name`.

## Sesi 05

- Schema menggunakan scalar, object, list, dan non-null sesuai GraphQL SDL.
- Query dan mutation CRUD tersedia untuk ketiga entity.
- Counter `relationResolverCallCount` bertambah pada setiap resolver relasi.
- Response GraphQL menampilkan counter di `extensions.resolverAudit`.
- Header `x-n-plus-one-demo: true` menonaktifkan DataLoader untuk demonstrasi N+1.
- Hasil production membuktikan `1 + N = 1 + 3 = 4` query database.
- Saat DataLoader aktif, tiga pemanggilan resolver dibatch menjadi satu query relasi sehingga total query menjadi 2.

## Tautan pengumpulan

- Vercel: https://praktikumwebserviceweek4.vercel.app
- GraphQL: https://praktikumwebserviceweek4.vercel.app/api/graphql
- Apollo Sandbox: https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fpraktikumwebserviceweek4.vercel.app%2Fapi%2Fgraphql
- REST: https://praktikumwebserviceweek4.vercel.app/api/books
- Health: https://praktikumwebserviceweek4.vercel.app/api/health

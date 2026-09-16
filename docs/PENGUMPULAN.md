# Pengumpulan Sesi 04–05

## Tautan

- Vercel: https://praktikumwebserviceweek4.vercel.app
- Endpoint GraphQL: https://praktikumwebserviceweek4.vercel.app/api/graphql
- Apollo Sandbox: https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fpraktikumwebserviceweek4.vercel.app%2Fapi%2Fgraphql
- REST pembanding: https://praktikumwebserviceweek4.vercel.app/api/books
- Health check: https://praktikumwebserviceweek4.vercel.app/api/health

## Refleksi over-fetching (5 kalimat)

Pada GraphQL, query `{ books { title } }` hanya mengembalikan satu field, yaitu `title`, untuk setiap buku. Endpoint REST `/api/books` pada proyek ini mengembalikan enam field: `id`, `title`, `isbn`, `publication_year`, `author_name`, dan `publisher_name`. Perbedaan ini berguna ketika aplikasi hanya membutuhkan sebagian kecil data karena GraphQL memungkinkan klien menentukan field yang diperlukan. Respons yang lebih kecil dapat mengurangi penggunaan bandwidth dan pekerjaan pemrosesan pada klien. REST tetap sesuai ketika seluruh representasi resource memang selalu dibutuhkan oleh klien.

## Bukti screenshot yang wajib diambil setelah deploy sehat

1. Jalankan `graphql/01-nested-query.graphql` di link Apollo Sandbox production; screenshot query, data nyata, dan `extensions.resolverAudit`.
2. Jalankan `graphql/05-n-plus-one-demo.graphql` dengan header `{ "x-n-plus-one-demo": "true" }`; screenshot nilai `totalDatabaseQueries = 1 + N`.
3. Hapus header, jalankan query yang sama, dan screenshot nilai optimasi DataLoader (`totalDatabaseQueries = 2`).

# Praktikum Web Service — GraphQL Sesi 04–05

Implementasi GraphQL untuk domain perpustakaan kelompok: **authors**, **publishers**, dan **books**. API memakai Apollo Server, Next.js, PostgreSQL/Neon, resolver relasi dua arah, mutation CRUD, DataLoader, dan counter N+1 per request.

## Menjalankan secara lokal

1. Salin `.env.example` menjadi `.env.local`.
2. Isi `DATABASE_URL` dengan **pooled connection string** Neon (hostname berisi `-pooler`). Jangan commit file environment.
3. Jalankan:

```bash
npm install
npm run db:setup
npm run dev
```

Endpoint lokal:

- GraphQL: `http://localhost:3000/api/graphql`
- REST pembanding: `http://localhost:3000/api/books`
- Health: `http://localhost:3000/api/health`

## Query bukti

File siap tempel ke Apollo Sandbox tersedia di folder `graphql/`:

- `01-nested-query.graphql`: author → books → publisher
- `02-reverse-nested-query.graphql`: books → author + publisher
- `03-overfetching.graphql`: hanya meminta satu field `title`
- `04-mutations.graphql`: mutation create untuk semua entity
- `05-n-plus-one-demo.graphql`: audit N+1 dan DataLoader

Setiap response GraphQL memiliki `extensions.resolverAudit`. Untuk membuktikan N+1, tambahkan header Apollo Sandbox berikut:

```json
{ "x-n-plus-one-demo": "true" }
```

Jika ada N author, hasilnya `totalDatabaseQueries = 1 + N`. Hapus header untuk mengaktifkan DataLoader; query author beserta buku menjadi dua query database: satu root dan satu batch.

## Deploy ke Vercel

1. Hubungkan repository ke project Vercel `praktikumwebserviceweek4`.
2. Tambahkan `DATABASE_URL` pada Settings → Environment Variables untuk Production, Preview, dan Development. Gunakan versi pooled Neon.
3. Tambahkan `USE_DATALOADER=true`.
4. Deploy dan pastikan `/api/health` memberi HTTP 200.
5. Jalankan nested query melalui Apollo Sandbox pada endpoint production.

Jangan menaruh connection string Neon di source, screenshot, atau commit Git.

## Verifikasi

```bash
npm test
npm run build
```

Audit pemenuhan tugas ada di `docs/AUDIT.md`; teks pengumpulan siap salin ada di `docs/PENGUMPULAN.md`.

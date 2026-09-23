# Lab 06 — Service dengan gRPC & Protocol Buffers

Panduan ini melengkapi `book.proto` (ditulis dan divalidasi pada tugas
mandiri Sesi 06) dengan server gRPC sungguhan yang membaca data `Book`
dari Neon PostgreSQL — database yang sama dipakai oleh GraphQL API pada
Lab 04–05.

## Apa yang ditambahkan

| File | Isi |
|---|---|
| `book.proto` | Sama persis dengan file yang sudah divalidasi pada tugas mandiri Sesi 06. Tidak diubah. |
| `grpc/server.js` | Server gRPC. Memuat `book.proto` lewat `@grpc/proto-loader`, mengimplementasikan `GetBook` dan `ListBooks` dengan query nyata ke tabel `books`. |
| `grpc/manual-client.js` | Bonus, opsional. Client kecil untuk mengecek server dari terminal sebelum membuka Postman. |
| `package.json` | Ditambah dependency `@grpc/grpc-js`, `@grpc/proto-loader`, dan script `grpc:dev`, `grpc:manual-client`. Baris lama tidak diubah. |
| `.env.example` | Ditambah `PORT=50051` untuk server gRPC lokal. Baris lama tidak diubah. |

Server ini memakai ulang `src/db/pool.js` (koneksi Neon) dan
`src/config.js` (`assertRuntimeConfig`) apa adanya, sama seperti yang
sudah dipakai `api/health.js`. Tidak ada perubahan pada schema GraphQL,
resolver, DataLoader, atau endpoint Apollo yang sudah ada.

### Pemetaan proto ke schema Neon

`GetBook` dan `ListBooks` mengambil kolom `id, title, isbn,
publication_year, author_id, publisher_id` langsung dari tabel `books`
(`src/db/schema.sql`). Nama field pada `book.proto` memang ditulis
`snake_case` agar sama persis dengan nama kolom, sehingga server tidak
perlu mengonversi nama field secara manual.

## 1. Menjalankan gRPC server secara lokal

```bash
npm install
npm run grpc:dev
```

Server akan membaca `DATABASE_URL` dari `.env.local` (file yang sama
dipakai `next dev`) dan berjalan di `localhost:50051`. Log yang muncul:

```
[grpc] BookService berjalan di 0.0.0.0:50051
```

> **Catatan:** `src/config.js` memuat environment lewat `dotenv/config`,
> yang secara default hanya membaca file `.env`. Karena `grpc/server.js`
> dijalankan langsung lewat `node` (bukan lewat `next dev`), file ini
> secara eksplisit memuat `.env.local` lebih dulu jika ada. Jadi tidak
> ada file environment baru yang perlu dibuat — `.env.local` yang sudah
> ada untuk GraphQL otomatis terpakai juga di sini.
>
> **Jika muncul error `DATABASE_URL belum diatur`:** project ini sudah
> ter-link ke Vercel (ada folder `.vercel/`). Jika selama ini Anda
> menjalankan GraphQL lewat `vercel dev`, `DATABASE_URL` kemungkinan
> dikelola langsung oleh Vercel CLI, bukan ditulis ke `.env.local`.
> Jalankan perintah berikut sekali agar `.env.local` benar-benar berisi
> `DATABASE_URL`, baru jalankan ulang `npm run grpc:dev`:
> ```bash
> vercel env pull .env.local
> ```
> Alternatif tanpa Vercel CLI: salin baris `DATABASE_URL=...` dari
> Vercel dashboard (Settings → Environment Variables) ke `.env.local`
> secara manual.

### (Opsional) Cek cepat lewat terminal sebelum ke Postman

Di terminal kedua, dengan server dari langkah di atas tetap berjalan:

```bash
npm run grpc:manual-client
```

Script ini memanggil `ListBooks`, lalu `GetBook` untuk buku pertama, dan
menampilkan hasilnya di terminal. Ini bukan pengganti pengujian Postman
yang diminta tugas — hanya sanity check cepat sebelum membuka Postman.

## 2. Menguji lewat Postman (lokal)

Bagian ini ditulis detail untuk yang baru pertama kali pakai fitur gRPC
di Postman.

1. Buka aplikasi Postman, lalu klik tombol **+** di sebelah tab yang
   sudah terbuka untuk membuat request baru.
2. Di pojok kiri atas jendela request baru, ada dropdown bertuliskan
   **GET** (atau metode HTTP lain). Klik dropdown itu, lalu pilih
   **gRPC** paling bawah pada daftar.
3. Di kolom alamat server (di sebelah dropdown tadi), ketik:
   `localhost:50051`
4. Klik tab **Service definition** tepat di bawah kolom alamat. Pilih
   **Import a .proto file**, lalu pilih file `book.proto` dari folder
   project. Postman akan membaca isinya dan menampilkan `BookService`
   beserta method `GetBook` dan `ListBooks`.
5. Masih di baris yang sama dengan alamat server, cari dropdown method
   (biasanya di sebelah kanan, bertuliskan "Select a method"). Pilih
   `library.BookService/ListBooks` dulu untuk percobaan pertama karena
   tidak perlu mengisi field apa pun.
6. Pastikan toggle **TLS** di dekat tombol Invoke dalam keadaan mati
   (off), karena server lokal belum memakai sertifikat TLS.
7. Klik tombol **Invoke**. Panel response di sebelah kanan akan
   menampilkan daftar buku dari Neon, sesuai struktur `ListBooksResponse`
   pada `book.proto`.
8. Ganti dropdown method ke `library.BookService/GetBook`. Di panel kiri
   bawah akan muncul editor pesan request (format JSON). Isi dengan id
   buku yang valid, misalnya:
   ```json
   { "id": 1 }
   ```
9. Klik **Invoke** lagi. Response akan berisi satu buku sesuai id
   tersebut. Coba juga id yang tidak ada (misalnya `999999`) untuk
   melihat Postman menampilkan status error `NOT_FOUND` — ini
   membuktikan penanganan error pada server berjalan, bukan hanya jalur
   sukses.

## 3. Deploy ke Render

1. Push seluruh perubahan (termasuk `book.proto`, folder `grpc/`, dan
   `package.json` yang sudah diperbarui) ke repository yang sama,
   `git-eng.ukwms.ac.id/2627-web-service/04_GraphQLAPI_JapRobertus`,
   branch `main`.
2. Buka dashboard Render, klik **New** → **Web Service**.
3. Hubungkan ke repository project ini.
4. Isi konfigurasi berikut:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node grpc/server.js`
   - **Instance Type:** Free sudah cukup untuk pengujian lab.
5. Pada bagian **Environment Variables**, tambahkan `DATABASE_URL`
   dengan pooled connection string Neon yang sama seperti yang dipakai
   di Vercel. Variabel `PORT` tidak perlu diisi manual; Render mengisinya
   sendiri secara otomatis.
6. Klik **Create Web Service** dan tunggu proses deploy selesai. Render
   akan menjalankan `node grpc/server.js`, dan trafik HTTP/2 yang
   dibutuhkan gRPC diteruskan otomatis ke port yang di-bind server.
7. Setelah status **Live**, catat alamat servicenya, contoh:
   `nama-app-anda.onrender.com`.

## 4. Menguji lewat Postman (URL publik Render)

1. Kembali ke request gRPC yang sama di Postman (tidak perlu membuat
   request baru; `book.proto` yang sudah di-import tetap terpakai).
2. Ganti kolom alamat server dari `localhost:50051` menjadi:
   `nama-app-anda.onrender.com:443`
3. Nyalakan toggle **TLS** di dekat tombol Invoke, karena Render
   melayani trafik lewat HTTPS/TLS, bukan koneksi polos seperti di
   lokal.
4. Klik **Invoke** untuk `ListBooks`, lalu untuk `GetBook` dengan id
   yang valid, sama seperti pengujian lokal di atas.
5. Pastikan data yang kembali sama dengan data di Neon (boleh
   dibandingkan dengan hasil query GraphQL `books` pada endpoint
   Vercel yang sudah ada).

## 5. Tugas yang dikumpulkan

Sesuai instruksi Lab 06:

- Screenshot request-response gRPC yang **berhasil lewat URL Render**
  (langkah 4 di atas), bukan `localhost`.
- Refleksi singkat 3–5 kalimat: bagian yang terasa lebih rumit
  dibangun dibanding REST/GraphQL yang sudah dibuat sebelumnya, dan
  skenario nyata yang menurut Anda benar-benar membutuhkan performa
  gRPC.

Kumpulkan sebelum Lab 07.

## 6. Yang sengaja tidak diubah

Schema GraphQL (`src/schema/typeDefs.js`, `src/schema/resolvers.js`),
endpoint Apollo (`api/graphql.js`, `pages/api/graphql.js`), DataLoader
(`src/loaders.js`), context dan counter N+1 (`src/context.js`), koneksi
database (`src/db/pool.js`, `src/db/schema.sql`, `src/db/seed.sql`),
serta seluruh file di folder `test/` tetap seperti semula. Server gRPC
berjalan sebagai proses Node terpisah di folder `grpc/`, memakai ulang
`src/db/pool.js` dan `src/config.js` tanpa mengubah isinya.

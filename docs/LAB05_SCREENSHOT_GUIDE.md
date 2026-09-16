# Panduan Screenshot Lab 05

Endpoint production:

`https://praktikumwebserviceweek4.vercel.app/api/graphql`

Apollo Sandbox:

`https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fpraktikumwebserviceweek4.vercel.app%2Fapi%2Fgraphql`

## Urutan bukti

Jalankan satu file per langkah dari folder `graphql/lab05`. Tidak perlu mengisi tab Variables atau Headers karena seluruh nilai uji sudah ditulis langsung di operation.

1. `01-create-book.graphql`: screenshot query dan response buku baru. Catat nilai `id` dari response.
2. `02-query-after-create.graphql`: screenshot hasil filter yang menampilkan buku baru.
3. `03-update-book.graphql`: ganti placeholder ID dengan ID langkah 1, lalu screenshot response yang sudah berubah.
4. `04-query-after-update.graphql`: screenshot hasil filter yang membuktikan perubahan tersimpan.
5. `05-delete-book.graphql`: ganti placeholder ID dengan ID langkah 1, lalu screenshot response `true`.
6. `06-query-after-delete.graphql`: screenshot response `books: []` sebagai bukti data sudah terhapus.

Untuk setiap screenshot, pastikan bagian berikut terlihat: endpoint di bagian atas, nama operation/query di panel kiri, status HTTP `200`, dan response di panel kanan. Screenshot tidak perlu menampilkan panel Variables atau Headers.

Jika `createBook` menyatakan ISBN sudah digunakan, selesaikan penghapusan data lama atau ganti ISBN pada langkah 1 dengan angka unik 10–20 digit. Jangan mengubah judul uji karena langkah query menggunakan judul tersebut sebagai filter.

## Refleksi untuk laporan

GraphQL menjalankan create, update, dan delete melalui satu endpoint dengan operation mutation yang berbeda, sedangkan REST biasanya menggunakan endpoint resource bersama metode POST, PUT/PATCH, dan DELETE. GraphQL juga memungkinkan klien menentukan field response mutation yang diperlukan dan mutation tetap dapat diverifikasi melalui query berikutnya. Namun, kedua pendekatan tetap harus memiliki validasi input dan benar-benar mengubah data pada database.

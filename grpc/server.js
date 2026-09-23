// grpc/server.js
// Lab 06 — Service dengan gRPC & Protocol Buffers.
// Mengimplementasikan book.proto (ditulis dan divalidasi pada tugas mandiri
// Sesi 06) sebagai server gRPC sungguhan yang membaca data Book dari Neon.
//
// File ini TIDAK mengubah logika GraphQL/Apollo yang sudah ada. Ia hanya
// memakai ulang koneksi database (src/db/pool.js) dan validasi environment
// (src/config.js) yang sudah dipakai oleh api/health.js.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.join(__dirname, '..', 'book.proto');

// src/config.js memuat variabel environment lewat `import 'dotenv/config'`,
// yang secara default hanya membaca file .env. Saat dijalankan lewat
// `next dev`, Next.js sudah memuat .env.local lebih dulu sehingga hal ini
// tidak terasa. Tapi grpc/server.js dijalankan langsung lewat `node`, tanpa
// Next.js, sehingga .env.local perlu dimuat secara eksplisit di sini dulu.
// Baris ini TIDAK mengubah src/config.js; ia hanya mengisi process.env
// sebelum src/config.js dibaca, lewat dynamic import + top-level await
// di bawah.
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // fallback ke .env biasa, mis. di server Render
}

const { assertRuntimeConfig } = await import('../src/config.js');
const { getPool } = await import('../src/db/pool.js');

// keepCase: true -> field JS memakai nama persis seperti di .proto
// (publication_year, author_id, publisher_id), sama dengan nama kolom
// di tabel books, sehingga baris hasil query bisa dipetakan langsung
// tanpa konversi nama. longs: String -> nilai int64 (id, author_id,
// publisher_id) direpresentasikan sebagai string, konsisten dengan
// node-postgres yang juga mengembalikan kolom BIGINT/BIGSERIAL sebagai
// string agar tidak kehilangan presisi.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);
const BookService = proto.library.BookService;

const BOOK_COLUMNS = 'id, title, isbn, publication_year, author_id, publisher_id';

function toBookMessage(row) {
  return {
    id: row.id,
    title: row.title,
    isbn: row.isbn,
    publication_year: row.publication_year,
    author_id: row.author_id,
    publisher_id: row.publisher_id,
  };
}

async function getBook(call, callback) {
  const { id } = call.request;
  if (!id || Number(id) <= 0) {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Field id wajib diisi dengan angka lebih besar dari 0.',
    });
    return;
  }

  try {
    const result = await getPool().query(
      `SELECT ${BOOK_COLUMNS} FROM books WHERE id = $1`,
      [id],
    );
    const row = result.rows[0];
    if (!row) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Book dengan id ${id} tidak ditemukan.`,
      });
      return;
    }
    callback(null, toBookMessage(row));
  } catch (error) {
    console.error('[grpc] GetBook error:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Terjadi kesalahan saat mengambil data buku dari database.',
    });
  }
}

async function listBooks(call, callback) {
  try {
    const result = await getPool().query(
      `SELECT ${BOOK_COLUMNS} FROM books ORDER BY id ASC`,
    );
    callback(null, { books: result.rows.map(toBookMessage) });
  } catch (error) {
    console.error('[grpc] ListBooks error:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Terjadi kesalahan saat mengambil daftar buku dari database.',
    });
  }
}

function main() {
  assertRuntimeConfig();

  const server = new grpc.Server();
  server.addService(BookService.service, {
    GetBook: getBook,
    ListBooks: listBooks,
  });

  const port = process.env.PORT || 50051;
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, boundPort) => {
      if (error) {
        console.error('[grpc] Gagal menjalankan server:', error);
        process.exit(1);
      }
      console.log(`[grpc] BookService berjalan di 0.0.0.0:${boundPort}`);
    },
  );

  const shutdown = () => {
    console.log('[grpc] Menerima sinyal berhenti, mematikan server...');
    server.tryShutdown(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main();

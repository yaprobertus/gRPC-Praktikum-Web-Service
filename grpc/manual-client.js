// grpc/manual-client.js
// Script BONUS, opsional. Bukan bagian dari checklist Lab 06 (yang wajib
// adalah pengujian lewat Postman), tapi berguna untuk mengecek dari
// terminal bahwa server sudah menjawab dengan benar sebelum membuka
// Postman. Jalankan server dulu (`npm run grpc:dev`) di terminal lain,
// baru jalankan script ini (`npm run grpc:manual-client`).

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.join(__dirname, '..', 'book.proto');
const target = process.argv[2] || 'localhost:50051';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition);
const client = new proto.library.BookService(
  target,
  grpc.credentials.createInsecure(),
);

function call(method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

async function main() {
  console.log(`[test-client] Menghubungi ${target} ...`);

  const list = await call('ListBooks', {});
  console.log(`[test-client] ListBooks -> ${list.books.length} buku ditemukan`);
  console.table(list.books);

  if (list.books.length > 0) {
    const firstId = list.books[0].id;
    const book = await call('GetBook', { id: firstId });
    console.log(`[test-client] GetBook(${firstId}) ->`, book);
  }

  const notFoundId = '999999';
  try {
    await call('GetBook', { id: notFoundId });
  } catch (error) {
    console.log(`[test-client] GetBook(${notFoundId}) -> error yang diharapkan: ${error.code} ${error.details}`);
  }
}

main().catch((error) => {
  console.error('[test-client] Gagal:', error.message || error);
  process.exit(1);
});

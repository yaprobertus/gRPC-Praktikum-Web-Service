import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { assertRuntimeConfig } from '../config.js';
import { createPool } from './pool.js';

assertRuntimeConfig();
const pool = createPool();
try {
  const sql = await readFile(fileURLToPath(new URL('./seed.sql', import.meta.url)), 'utf8');
  await pool.query(sql);
  console.log('Seed berhasil: data penulis, penerbit, dan buku telah tersedia.');
} catch (error) {
  console.error('Seed gagal:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { assertRuntimeConfig } from '../config.js';
import { createPool } from './pool.js';

assertRuntimeConfig();
const pool = createPool();
try {
  const sql = await readFile(fileURLToPath(new URL('./schema.sql', import.meta.url)), 'utf8');
  await pool.query(sql);
  console.log('Migrasi berhasil: tabel authors, publishers, dan books siap digunakan.');
} catch (error) {
  console.error('Migrasi gagal:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}

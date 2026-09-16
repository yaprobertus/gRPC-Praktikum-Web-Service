import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

export function createPool(connectionString = config.databaseUrl) {
  if (!connectionString) throw new Error('DATABASE_URL diperlukan untuk membuat koneksi PostgreSQL.');
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  pool.on('error', (error) => console.error('[database] Koneksi idle bermasalah:', error));
  return pool;
}

export function getPool() {
  if (!globalThis.__praktikumNeonPool) globalThis.__praktikumNeonPool = createPool();
  return globalThis.__praktikumNeonPool;
}

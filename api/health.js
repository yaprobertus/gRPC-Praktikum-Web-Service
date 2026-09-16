import { assertRuntimeConfig } from '../src/config.js';
import { getPool } from '../src/db/pool.js';

export default async function healthHandler(_request, response) {
  try {
    assertRuntimeConfig();
    await getPool().query('SELECT 1');
    return response.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('[api/health]', error);
    return response.status(503).json({ status: 'error', database: 'disconnected' });
  }
}

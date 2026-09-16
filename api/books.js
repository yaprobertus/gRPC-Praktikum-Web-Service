import { assertRuntimeConfig, config } from '../src/config.js';
import { getPool } from '../src/db/pool.js';

export default async function booksHandler(request, response) {
  const origin = request.headers.origin;
  if (origin && config.corsOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }
  try {
    assertRuntimeConfig();
    const result = await getPool().query(`
      SELECT b.id, b.title, b.isbn, b.publication_year,
             a.name AS author_name, p.name AS publisher_name
      FROM books b
      JOIN authors a ON a.id = b.author_id
      JOIN publishers p ON p.id = b.publisher_id
      ORDER BY b.id
    `);
    return response.status(200).json(result.rows);
  } catch (error) {
    console.error('[api/books]', error);
    return response.status(500).json({ error: 'Gagal mengambil data buku' });
  }
}

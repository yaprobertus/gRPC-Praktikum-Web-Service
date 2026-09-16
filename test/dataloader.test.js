import assert from 'node:assert/strict';
import test from 'node:test';
import { createApolloServer } from '../src/apollo.js';
import { createRequestContext } from '../src/context.js';

const authors = [
  { id: '1', name: 'Andrea Hirata', country: 'Indonesia' },
  { id: '2', name: 'Dee Lestari', country: 'Indonesia' },
];
const books = [
  { id: '20', title: 'Laskar Pelangi', author_id: '1' },
  { id: '21', title: 'Supernova', author_id: '2' },
];

const pool = {
  async query(text, values = []) {
    if (text.includes('FROM authors ORDER BY')) return { rows: authors };
    if (text.includes('FROM books WHERE author_id = ANY')) {
      return { rows: books.filter((row) => values[0].map(String).includes(row.author_id)) };
    }
    throw new Error(`SQL tidak terduga: ${text}`);
  },
};

test('DataLoader mengurangi query database dari 1 + N menjadi 2', async () => {
  const server = createApolloServer();
  const context = createRequestContext(pool, { headers: {} });
  const response = await server.executeOperation(
    { query: 'query Optimized { authors { name books { title } } }' },
    { contextValue: context },
  );
  await server.stop();
  const result = response.body.singleResult;
  assert.equal(result.errors, undefined);
  assert.equal(result.extensions.resolverAudit.relationResolverCalls, 2);
  assert.equal(result.extensions.resolverAudit.totalDatabaseQueries, 2);
  assert.equal(result.extensions.resolverAudit.dataLoaderBatchQueries, 1);
  assert.equal(result.extensions.resolverAudit.dataLoaderEnabled, true);
});

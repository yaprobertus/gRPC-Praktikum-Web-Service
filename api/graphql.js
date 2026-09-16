import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { createApolloServer } from '../src/apollo.js';
import { assertRuntimeConfig, config } from '../src/config.js';
import { createRequestContext } from '../src/context.js';
import { getPool } from '../src/db/pool.js';

const apollo = createApolloServer();
const handler = startServerAndCreateNextHandler(apollo, {
  context: async (request) => {
    assertRuntimeConfig();
    return createRequestContext(getPool(), request);
  },
});

export default async function graphqlHandler(request, response) {
  const origin = request.headers.origin;
  if (origin && config.corsOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Apollo-Require-Preflight, X-N-Plus-One-Demo',
  );
  if (request.method === 'OPTIONS') return response.status(204).end();
  return handler(request, response);
}

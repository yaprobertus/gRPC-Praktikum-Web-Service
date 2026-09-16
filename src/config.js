import 'dotenv/config';

function parseBoolean(value, fallback) {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL,
  useDataLoader: parseBoolean(process.env.USE_DATALOADER, true),
  corsOrigins: [
    'https://studio.apollographql.com',
    'http://localhost:3000',
    ...(process.env.CORS_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean),
  ],
};

export function assertRuntimeConfig() {
  if (!config.databaseUrl) {
    throw new Error(
      'DATABASE_URL belum diatur. Isi dengan pooled connection string Neon di .env.local atau Vercel.',
    );
  }
  if (config.nodeEnv === 'production') {
    try {
      const hostname = new URL(config.databaseUrl).hostname;
      if (!hostname.includes('-pooler.')) {
        console.warn('[config] Gunakan pooled connection string Neon (-pooler) pada Vercel.');
      }
    } catch {
      throw new Error('DATABASE_URL bukan URL PostgreSQL yang valid.');
    }
  }
}

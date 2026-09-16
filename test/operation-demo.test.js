import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequestContext } from '../src/context.js';

test('operation NPlusOneAudit otomatis menonaktifkan DataLoader', () => {
  const pool = { query() { throw new Error('tidak dipanggil'); } };
  const context = createRequestContext(pool, {
    headers: {},
    body: { operationName: 'NPlusOneAudit' },
  });
  assert.equal(context.useDataLoader, false);
});

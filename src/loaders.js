import DataLoader from 'dataloader';

function byIdLoader(pool, metrics, table) {
  return new DataLoader(async (ids) => {
    metrics.databaseQueryCount += 1;
    metrics.loaderBatchQueryCount += 1;
    const result = await pool.query(`SELECT * FROM ${table} WHERE id = ANY($1::bigint[])`, [ids]);
    const indexed = new Map(result.rows.map((row) => [String(row.id), row]));
    return ids.map((id) => indexed.get(String(id)) ?? null);
  });
}

function booksByForeignKeyLoader(pool, metrics, foreignKey) {
  return new DataLoader(async (ids) => {
    metrics.databaseQueryCount += 1;
    metrics.loaderBatchQueryCount += 1;
    const result = await pool.query(
      `SELECT * FROM books WHERE ${foreignKey} = ANY($1::bigint[]) ORDER BY id`,
      [ids],
    );
    const grouped = new Map(ids.map((id) => [String(id), []]));
    for (const row of result.rows) grouped.get(String(row[foreignKey]))?.push(row);
    return ids.map((id) => grouped.get(String(id)) ?? []);
  });
}

export function createLoaders(pool, metrics) {
  return {
    authorById: byIdLoader(pool, metrics, 'authors'),
    publisherById: byIdLoader(pool, metrics, 'publishers'),
    booksByAuthorId: booksByForeignKeyLoader(pool, metrics, 'author_id'),
    booksByPublisherId: booksByForeignKeyLoader(pool, metrics, 'publisher_id'),
  };
}

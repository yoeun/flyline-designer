// Where shares are kept: Postgres when DATABASE_URL is set, else memory (local dev and tests).
// Every write names the owner's token hash, so a write without the right token changes nothing.

export function memoryStore() {
  const shares = new Map();
  const owned = (id, ownerHash) => shares.get(id)?.ownerHash === ownerHash;
  return {
    async create(id, ownerHash, rack) {
      shares.set(id, { ownerHash, rack, updatedAt: new Date() });
    },
    async get(id) {
      const share = shares.get(id);
      return share ? { rack: share.rack, updatedAt: share.updatedAt } : null;
    },
    async update(id, ownerHash, rack) {
      if (!owned(id, ownerHash)) return false;
      shares.set(id, { ownerHash, rack, updatedAt: new Date() });
      return true;
    },
    async rename(id, ownerHash, newId) {
      if (!owned(id, ownerHash)) return false;
      shares.set(newId, shares.get(id));
      shares.delete(id);
      return true;
    },
    async remove(id, ownerHash) {
      return owned(id, ownerHash) && shares.delete(id);
    },
  };
}

// Copies every share from another Postgres database (the old flyline-designer-db) into this one, keeping
// any that are already here. Used once while moving to the shared instance; safe to run again.
export async function copyShares(fromUrl, toUrl) {
  const { default: pg } = await import('pg');
  const from = new pg.Client({ connectionString: fromUrl });
  const to = new pg.Client({ connectionString: toUrl });
  await from.connect();
  try {
    await to.connect();
    const { rows } = await from.query('SELECT id, owner_hash, rack, created_at, updated_at FROM shares');
    let copied = 0;
    for (const r of rows) {
      const { rowCount } = await to.query(
        'INSERT INTO shares (id, owner_hash, rack, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        [r.id, r.owner_hash, JSON.stringify(r.rack), r.created_at, r.updated_at],
      );
      copied += rowCount;
    }
    return { found: rows.length, copied };
  } finally {
    await from.end();
    await to.end();
  }
}

export async function postgresStore(connectionString) {
  const { default: pg } = await import('pg');
  const pool = new pg.Pool({ connectionString });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shares (
      id text PRIMARY KEY,
      owner_hash text NOT NULL,
      rack jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
  return {
    async create(id, ownerHash, rack) {
      await pool.query('INSERT INTO shares (id, owner_hash, rack) VALUES ($1, $2, $3)', [id, ownerHash, JSON.stringify(rack)]);
    },
    async get(id) {
      const { rows } = await pool.query('SELECT rack, updated_at FROM shares WHERE id = $1', [id]);
      return rows[0] ? { rack: rows[0].rack, updatedAt: rows[0].updated_at } : null;
    },
    async update(id, ownerHash, rack) {
      const { rowCount } = await pool.query('UPDATE shares SET rack = $3, updated_at = now() WHERE id = $1 AND owner_hash = $2', [id, ownerHash, JSON.stringify(rack)]);
      return rowCount > 0;
    },
    async rename(id, ownerHash, newId) {
      const { rowCount } = await pool.query('UPDATE shares SET id = $3, updated_at = now() WHERE id = $1 AND owner_hash = $2', [id, ownerHash, newId]);
      return rowCount > 0;
    },
    async remove(id, ownerHash) {
      const { rowCount } = await pool.query('DELETE FROM shares WHERE id = $1 AND owner_hash = $2', [id, ownerHash]);
      return rowCount > 0;
    },
  };
}

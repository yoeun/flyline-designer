// Starts the shares API. Without DATABASE_URL (local dev) shares live in memory until it stops.
import { createServer } from 'node:http';
import { createApp } from './app.js';
import { copyShares, memoryStore, postgresStore } from './store.js';

const port = Number(process.env.PORT) || 8787;
// The site origins allowed to call the API from a browser, comma-separated.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',').map((o) => o.trim()).filter(Boolean);

const store = process.env.DATABASE_URL ? await postgresStore(process.env.DATABASE_URL) : memoryStore();
if (!process.env.DATABASE_URL) console.log('No DATABASE_URL: shares are kept in memory.');

// Moving to the shared Postgres: OLD_DATABASE_URL names the database the shares were in before. Copy
// them over at start. A failure (for example the old free database has expired) is logged, not fatal.
if (process.env.DATABASE_URL && process.env.OLD_DATABASE_URL && process.env.OLD_DATABASE_URL !== process.env.DATABASE_URL) {
  try {
    const { found, copied } = await copyShares(process.env.OLD_DATABASE_URL, process.env.DATABASE_URL);
    console.log(`Copied ${copied} of ${found} shares from the old database.`);
  } catch (err) {
    console.error(`Could not copy shares from the old database: ${err.message}`);
  }
}

createServer(createApp({ store, allowedOrigins })).listen(port, () => console.log(`Shares API on port ${port}`));

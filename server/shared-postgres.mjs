#!/usr/bin/env node
// Gives this app its own role and database on the shared Render Postgres instance.
//   node scripts/shared-postgres.mjs        create them if missing, sync the password (preDeployCommand)
//   node scripts/shared-postgres.mjs --url  print this app's DATABASE_URL (start command)
// Needs POSTGRES_ADMIN_URL (from the shared-db environment group). Without it, it does nothing,
// and --url prints DATABASE_URL as it is, so local development is unaffected.
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import pg from 'pg';

const adminUrl = process.env.POSTGRES_ADMIN_URL;
const rawName = process.env.APP_DB_NAME || JSON.parse(readFileSync('package.json', 'utf8')).name;
// A safe identifier: lowercase letters, digits and _, starting with a letter, at most 63 bytes.
const name = `app_${String(rawName).toLowerCase().replace(/^@[^/]*\//, '').replace(/[^a-z0-9]+/g, '_')}`
  .replace(/_+$/, '')
  .slice(0, 63);

function appUrl(admin, app) {
  const url = new URL(admin);
  // Derived, never stored: rotating the admin password rotates every app password on its next deploy.
  url.password = createHmac('sha256', decodeURIComponent(url.password)).update(app).digest('hex');
  url.username = app;
  url.pathname = `/${app}`;
  return url.toString();
}

if (process.argv.includes('--url')) {
  process.stdout.write(adminUrl ? appUrl(adminUrl, name) : (process.env.DATABASE_URL ?? ''));
} else if (!adminUrl) {
  console.log('shared-postgres: POSTGRES_ADMIN_URL is not set, nothing to do');
} else {
  const client = new pg.Client({ connectionString: adminUrl });
  await client.connect();
  const id = client.escapeIdentifier(name);
  const password = client.escapeLiteral(new URL(appUrl(adminUrl, name)).password);
  const exists = async (table, column) =>
    (await client.query(`SELECT 1 FROM ${table} WHERE ${column} = $1`, [name])).rowCount > 0;

  if (await exists('pg_roles', 'rolname')) {
    await client.query(`ALTER ROLE ${id} WITH LOGIN PASSWORD ${password}`);
  } else {
    await client.query(`CREATE ROLE ${id} WITH LOGIN PASSWORD ${password}`);
    console.log(`shared-postgres: created role ${name}`);
  }
  // The admin isn't a superuser, so it must be a member of the role to make it a database owner.
  await client.query(`GRANT ${id} TO CURRENT_USER`);
  if (!(await exists('pg_database', 'datname'))) {
    await client.query(`CREATE DATABASE ${id} OWNER ${id}`);
    console.log(`shared-postgres: created database ${name}`);
  }
  await client.query(`REVOKE CONNECT, TEMPORARY ON DATABASE ${id} FROM PUBLIC`);
  await client.end();
  console.log(`shared-postgres: ${name} is ready`);
}

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// This project is SQLite-only. A value like `postgresql://…` or `mysql://…`
// is almost always a stray global env var (e.g. exported in ~/.zshrc) shadowing
// this project's .env. Fail loudly instead of letting better-sqlite3 treat the
// connection string as a file path and silently `mkdir` a junk directory tree.
if (/^[a-z]+:\/\//i.test(env.DATABASE_URL)) {
	throw new Error(
		`DATABASE_URL looks like a remote DB URL ("${env.DATABASE_URL.split('://')[0]}://…"), ` +
			`but this app uses SQLite. A global shell export is probably shadowing .env — ` +
			`run \`echo $DATABASE_URL\` and unset it, or move it into the owning project's .env.`
	);
}

// Drizzle uses `file:…` URLs; better-sqlite3 expects a plain filesystem path.
const databasePath = env.DATABASE_URL.replace(/^file:/, '');

if (databasePath !== ':memory:') {
	mkdirSync(dirname(databasePath), { recursive: true });
}

const client = new Database(databasePath);

export const db = drizzle(client, { schema });

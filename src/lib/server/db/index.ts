import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Drizzle uses `file:…` URLs; better-sqlite3 expects a plain filesystem path.
const databasePath = env.DATABASE_URL.replace(/^file:/, '');

if (databasePath !== ':memory:') {
	mkdirSync(dirname(databasePath), { recursive: true });
}

const client = new Database(databasePath);

export const db = drizzle(client, { schema });

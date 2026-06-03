import { defineConfig } from 'drizzle-kit';
import { config as loadEnv } from 'dotenv';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

loadEnv({ override: true });

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const databaseUrl = process.env.DATABASE_URL;
const databasePath = databaseUrl.replace(/^file:/, '');

if (databasePath !== ':memory:' && !databasePath.includes('://')) {
	mkdirSync(dirname(databasePath), { recursive: true });
}

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: databaseUrl },
	verbose: true,
	strict: true
});

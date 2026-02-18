/**
 * Database migration runner.
 * Runs all SQL migration files in order.
 * Usage: npm run migrate
 */
import fs from 'fs';
import path from 'path';
import { pool } from './database';
import { logger } from '../utils/logger';

// Ensure env is loaded
import './env';

async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id        SERIAL      PRIMARY KEY,
        filename  VARCHAR(255) NOT NULL UNIQUE,
        run_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsDir = path.resolve(__dirname, '../../migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const { rows } = await client.query(
        'SELECT id FROM _migrations WHERE filename = $1',
        [file]
      );
      if (rows.length > 0) {
        logger.info(`Migration already applied: ${file}`);
        continue;
      }

      logger.info(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        logger.info(`Migration completed: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    logger.info('All migrations applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  logger.error('Migration failed', { error: err.message });
  process.exit(1);
});

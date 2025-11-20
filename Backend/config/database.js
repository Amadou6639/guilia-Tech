/**
 * Database pool configuration
 *
 * Notes:
 * - This project uses PostgreSQL-style queries (placeholders $1, result.rows).
 * - When deploying to Render with a managed Postgres database, set the
 *   DATABASE_URL environment variable in the Render dashboard to the provided
 *   postgres://... connection string.
 * - Many managed Postgres providers require SSL. Leaving ssl.rejectUnauthorized
 *   set to false here covers common Render/provisioned DB setups. If you run
 *   a local Postgres without SSL you can remove the `ssl` option or set it to
 *   false.
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Render / managed Postgres instances that require SSL. Keep as-is
  // for deployment. If you have a local Postgres without SSL, remove this
  // block (or set ssl: false).
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 60000,
  max: 10,
});

module.exports = pool;

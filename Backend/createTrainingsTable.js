const pool = require('./config/database');

const createTrainingsTable = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS trainings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "trainings" créée avec succès.');
  } catch (err) {
    console.error('Erreur lors de la création de la table "trainings":', err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
};

createTrainingsTable();

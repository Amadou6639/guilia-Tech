const pool = require("./config/database");

const addDescriptionToFunctions = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      ALTER TABLE functions
      ADD COLUMN description TEXT DEFAULT NULL;
    `);
    console.log("Colonne 'description' ajoutée à la table 'functions'.");
  } catch (err) {
    console.error("Erreur lors de l'ajout de la colonne 'description':", err);
  } finally {
    if (conn) conn.release();
  }
};

addDescriptionToFunctions();

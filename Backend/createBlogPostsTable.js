const mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "amadou",
  password: process.env.DB_PASSWORD || "66396816",
  database: process.env.DB_NAME || "guilla_tech",
  connectionLimit: 5,
});

async function createBlogPostsTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("🔧 Connexion à la base de données...");

    console.log("🔧 Création de la table blog_posts...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        image_url VARCHAR(255),
        author VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        category VARCHAR(100) NOT NULL DEFAULT 'Général'
      )
    `);
    console.log("✅ Table blog_posts créée avec succès !");

    const tables = await conn.query("SHOW TABLES LIKE 'blog_posts'");
    if (tables.length > 0) {
      console.log("📊 Table blog_posts vérifiée");
    }
  } catch (err) {
    console.error("❌ Erreur:", err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
    console.log("🔚 Connexion fermée");
  }
}

createBlogPostsTable();

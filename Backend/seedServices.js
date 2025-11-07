const pool = require("./config/database");

const servicesToSeed = [
  {
    title: "Courtage en solutions numériques",
    description:
      "Nous trouvons pour vous les meilleurs outils et logiciels (CRM, ERP, etc.) adaptés à vos besoins et à votre budget.",
    icon: "🔎",
  },
  {
    title: "Intermédiation et mise en relation",
    description:
      "Nous vous mettons en contact avec des experts et prestataires qualifiés pour réaliser vos projets techniques.",
    icon: "🤝",
  },
  {
    title: "Initiation au numérique",
    description:
      "Maîtrisez les bases de l’informatique et des outils digitaux pour gagner en autonomie.",
    icon: "🖥️",
  },
  {
    title: "Maintenance informatique",
    description:
      "Apprenez à diagnostiquer, réparer et entretenir vos équipements pour une performance optimale.",
    icon: "🛠️",
  },
  {
    title: "Sécurité et bonnes pratiques",
    description:
      "Protégez vos données personnelles et professionnelles et adoptez les bons réflexes en ligne.",
    icon: "🛡️",
  },
];

const seedServices = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("🌱 Démarrage du seeding des services...");

    // Vider la table pour éviter les doublons lors de re-seed
    await conn.query("SET FOREIGN_KEY_CHECKS=0");
    await conn.query("TRUNCATE TABLE services");
    await conn.query("SET FOREIGN_KEY_CHECKS=1");
    console.log("🗑️ Table 'services' vidée.");

    for (const service of servicesToSeed) {
      await conn.query(
        "INSERT INTO services (title, description, icon) VALUES (?, ?, ?)",
        [service.title, service.description, service.icon]
      );
      console.log(`✨ Service '${service.title}' inséré.`);
    }

    console.log("✅ Seeding des services terminé avec succès.");
  } catch (err) {
    console.error("❌ Erreur lors du seeding des services:", err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
};

seedServices();

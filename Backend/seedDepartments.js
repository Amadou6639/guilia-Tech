const pool = require("./config/database");

const departmentsToSeed = [
  {
    name: "Direction",
    description: "Département de la direction générale de l'entreprise."
  },
  {
    name: "Commercial",
    description: "Département en charge de la stratégie commerciale et des ventes."
  },
  {
    name: "Technique",
    description: "Département responsable du développement et de la maintenance technique."
  },
  {
    name: "Marketing",
    description: "Département en charge de la promotion des produits et services."
  },
  {
    name: "Ressources Humaines",
    description: "Département qui gère le personnel de l'entreprise."
  },
  {
    name: "Finance",
    description: "Département qui gère les finances de l'entreprise."
  },
  {
    name: "Technologies de l'Information",
    description: "Département qui gère l'infrastructure informatique."
  },
  {
    name: "Support Client",
    description: "Département qui fournit une assistance à la clientèle."
  },
  {
    name: "Juridique",
    description: "Département qui s'occupe des questions juridiques."
  },
  {
    name: "Qualité",
    description: "Département qui assure la qualité des produits et services."
  }
];

const seedDepartments = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("🌱 Démarrage du seeding des départements...");

    for (const department of departmentsToSeed) {
      const [existing] = await conn.query(
        "SELECT id FROM departments WHERE name = ?",
        [department.name]
      );

      if (existing.length === 0) {
        await conn.query(
          "INSERT INTO departments (name, description) VALUES (?, ?)",
          [department.name, department.description]
        );
        console.log(`✨ Département '${department.name}' inséré.`);
      } else {
        console.log(`🟡 Département '${department.name}' existe déjà.`);
      }
    }

    console.log("✅ Seeding des départements terminé avec succès.");
  } catch (err) {
    console.error("❌ Erreur lors du seeding des départements:", err);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
};

seedDepartments();

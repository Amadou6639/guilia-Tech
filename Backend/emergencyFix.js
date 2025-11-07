const pool = require("./config/database");

async function emergencyFix() {
  const connection = await pool.getConnection();

  try {
    console.log("🚨 DÉBUT DE LA RÉPARATION URGENTE...\n");

    // Étape CRITIQUE : Désactiver temporairement les triggers
    console.log("1. 🔄 Désactivation des triggers...");
    await connection.query(
      "SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO'"
    );

    // Supprimer TOUS les triggers problématiques
    console.log("2. 🔄 Suppression de tous les triggers employees...");
    await connection.query("DROP TRIGGER IF EXISTS after_employee_insert");
    await connection.query("DROP TRIGGER IF EXISTS after_employee_update");
    await connection.query("DROP TRIGGER IF EXISTS after_employee_delete");
    console.log("   ✅ Tous les triggers supprimés\n");

    // Étape 3: Vérifier la structure de la table employees
    console.log("3. 🔄 Vérification des colonnes de la table employees...");
    const employeesColumns = await connection.query("DESCRIBE employees");
    const columns = employeesColumns.map((c) => c.Field);

    // Vérifier et supprimer les anciennes colonnes 'first_name' et 'last_name'
    if (columns.includes("first_name")) {
      console.log("   ➖ Suppression de l'ancienne colonne 'first_name'...");
      await connection.query("ALTER TABLE employees DROP COLUMN first_name");
      console.log("   ✅ Colonne 'first_name' supprimée.");
    }
    if (columns.includes("last_name")) {
      console.log("   ➖ Suppression de l'ancienne colonne 'last_name'...");
      await connection.query("ALTER TABLE employees DROP COLUMN last_name");
      console.log("   ✅ Colonne 'last_name' supprimée.");
    }

    // Vérifier 'name'
    if (!columns.includes("name")) {
      console.log("   ➕ Ajout de la colonne 'name'...");
      await connection.query(
        "ALTER TABLE employees ADD COLUMN name VARCHAR(255) NOT NULL AFTER id"
      );
      console.log("   ✅ Colonne 'name' ajoutée.");
    } else {
      console.log("   ✅ Colonne 'name' déjà présente.");
    }

    // Vérifier 'position'
    if (!columns.includes("position")) {
      console.log("   ➕ Ajout de la colonne 'position'...");
      await connection.query(
        "ALTER TABLE employees ADD COLUMN position VARCHAR(255) NULL AFTER email"
      );
      console.log("   ✅ Colonne 'position' ajoutée.");
    } else {
      console.log("   ✅ Colonne 'position' déjà présente.");
    }

    // Vérifier 'service_id'
    const hasServiceId = columns.includes("service_id");

    if (!hasServiceId) {
      console.log("   ➕ Ajout de la colonne 'service_id'...");
      await connection.query(
        "ALTER TABLE employees ADD COLUMN service_id INT NULL"
      );
      console.log("   ✅ Colonne 'service_id' ajoutée.\n");
    } else {
      console.log("   ✅ Colonne service_id déjà présente\n");
    }

    // Étape 4: Créer la table services si elle n'existe pas
    console.log("4. 🔄 Vérification de la table services...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT '💼',
        employee_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("   ✅ Table services vérifiée\n");

    // Étape 5: Recréer les triggers CORRECTEMENT
    console.log("5. 🔄 Recréation des triggers...");

    // Trigger pour l'insertion
    await connection.query(`
      CREATE TRIGGER after_employee_insert
      AFTER INSERT ON employees
      FOR EACH ROW
      BEGIN
        IF NEW.service_id IS NOT NULL THEN
          UPDATE services SET employee_count = employee_count + 1 WHERE id = NEW.service_id;
        END IF;
      END
    `);
    console.log("   ✅ Trigger after_employee_insert créé");

    // Trigger pour la suppression
    await connection.query(`
      CREATE TRIGGER after_employee_delete
      AFTER DELETE ON employees
      FOR EACH ROW
      BEGIN
        IF OLD.service_id IS NOT NULL THEN
          UPDATE services SET employee_count = employee_count - 1 WHERE id = OLD.service_id;
        END IF;
      END
    `);
    console.log("   ✅ Trigger after_employee_delete créé");

    // Trigger pour la mise à jour
    await connection.query(`
      CREATE TRIGGER after_employee_update
      AFTER UPDATE ON employees
      FOR EACH ROW
      BEGIN
        -- Si l'employé change de service, ou est désaffecté
        IF OLD.service_id IS NOT NULL AND OLD.service_id != NEW.service_id THEN
          UPDATE services SET employee_count = employee_count - 1 WHERE id = OLD.service_id;
        END IF;
        -- Si l'employé est affecté à un nouveau service
        IF NEW.service_id IS NOT NULL AND OLD.service_id != NEW.service_id THEN
          UPDATE services SET employee_count = employee_count + 1 WHERE id = NEW.service_id;
        END IF;
      END
    `);
    console.log("   ✅ Trigger after_employee_update créé\n");

    // Étape 6: Réactiver les paramètres normaux
    await connection.query("SET SQL_MODE=@OLD_SQL_MODE");

    console.log("🎉 RÉPARATION URGENTE TERMINÉE AVEC SUCCÈS !");
    console.log("🚀 Redémarrez votre serveur maintenant !\n");
  } catch (error) {
    console.error("❌ ERREUR CRITIQUE:", error);

    // Essayer une solution alternative
    console.log("\n🔄 Tentative de solution alternative...");
    try {
      await connection.query("DROP TRIGGER IF EXISTS after_employee_insert");
      console.log("✅ Trigger supprimé en mode secours");
    } catch (err) {
      console.error("❌ Échec de la solution alternative:", err);
    }
  } finally {
    connection.release();
    pool.end();
  }
}

// Exécuter IMMÉDIATEMENT
emergencyFix();

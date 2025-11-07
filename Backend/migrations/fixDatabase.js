const pool = require('./config/database');

async function fixDatabaseIssues() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔧 Début de la correction des problèmes de base de données...\n');

    // Étape 1: Supprimer le trigger problématique
    console.log('1. 🔄 Suppression du trigger problématique...');
    await connection.query("DROP TRIGGER IF EXISTS after_employee_insert");
    console.log('   ✅ Trigger after_employee_insert supprimé\n');

    // Étape 2: Créer la table services si elle n'existe pas
    console.log('2. 🔄 Vérification/création de la table services...');
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
    console.log('   ✅ Table services prête\n');

    // Étape 3: Vérifier la table employees
    console.log('3. 🔄 Vérification de la table employees...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        position VARCHAR(255) NOT NULL,
        service_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
      )
    `);
    console.log('   ✅ Table employees vérifiée\n');

    // Étape 4: Insérer des données de test dans services
    console.log('4. 🔄 Insertion de données de test...');
    const existingServices = await connection.query('SELECT COUNT(*) as count FROM services');
    
    if (existingServices[0].count === 0) {
      await connection.query(`
        INSERT INTO services (title, description, icon) VALUES 
        ('Développement Web', 'Création de sites et applications web', '💻'),
        ('Design Graphique', 'Conception d\'identités visuelles', '🎨'),
        ('Marketing Digital', 'Stratégies de marketing en ligne', '📱'),
        ('Consulting IT', 'Conseil en technologies de l\'information', '🔧'),
        ('Formation', 'Formations professionnelles en informatique', '📚')
      `);
      console.log('   ✅ Données de test insérées dans services\n');
    } else {
      console.log('   ⏭️  Données déjà présentes dans services\n');
    }

    // Étape 5: Recréer le trigger correctement
    console.log('5. 🔄 Création du trigger corrigé...');
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
    console.log('   ✅ Trigger after_employee_insert créé avec succès\n');

    // Étape 6: Créer un trigger pour la suppression
    console.log('6. 🔄 Création du trigger pour la suppression...');
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
    console.log('   ✅ Trigger after_employee_delete créé avec succès\n');

    // Étape 7: Créer un trigger pour la mise à jour
    console.log('7. 🔄 Création du trigger pour la mise à jour...');
    await connection.query(`
      CREATE TRIGGER after_employee_update
      AFTER UPDATE ON employees
      FOR EACH ROW
      BEGIN
        -- Si le service a changé
        IF OLD.service_id != NEW.service_id OR (OLD.service_id IS NULL AND NEW.service_id IS NOT NULL) OR (OLD.service_id IS NOT NULL AND NEW.service_id IS NULL) THEN
          -- Décrémenter l'ancien service
          IF OLD.service_id IS NOT NULL THEN
            UPDATE services SET employee_count = employee_count - 1 WHERE id = OLD.service_id;
          END IF;
          -- Incrémenter le nouveau service
          IF NEW.service_id IS NOT NULL THEN
            UPDATE services SET employee_count = employee_count + 1 WHERE id = NEW.service_id;
          END IF;
        END IF;
      END
    `);
    console.log('   ✅ Trigger after_employee_update créé avec succès\n');

    // Étape 8: Vérification finale
    console.log('8. 🔄 Vérification finale...');
    const employeesColumns = await connection.query('DESCRIBE employees');
    const servicesColumns = await connection.query('DESCRIBE services');
    const triggers = await connection.query(`
      SELECT TRIGGER_NAME 
      FROM INFORMATION_SCHEMA.TRIGGERS 
      WHERE EVENT_OBJECT_SCHEMA = DATABASE()
    `);

    console.log('   📊 RÉSUMÉ FINAL:');
    console.log(`   - Colonnes employees: ${employeesColumns.length}`);
    console.log(`   - Colonnes services: ${servicesColumns.length}`);
    console.log(`   - Triggers actifs: ${triggers.length}`);
    
    console.log('\n🎉 TOUS LES PROBLÈMES ONT ÉTÉ RÉSOLUS !');
    console.log('🚀 Votre application devrait maintenant fonctionner sans erreurs\n');

  } catch (error) {
    console.error('❌ ERREUR lors de la correction:', error);
  } finally {
    connection.release();
    pool.end();
  }
}

// Exécuter la correction
fixDatabaseIssues();
const pool = require('./config/database');

async function fixEmployeesTable() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔧 CORRECTION DE LA TABLE EMPLOYEES...\n');

    // 1. Supprimer les triggers problématiques
    console.log('1. Suppression des triggers...');
    await connection.query("DROP TRIGGER IF EXISTS after_employee_insert");
    await connection.query("DROP TRIGGER IF EXISTS after_employee_delete");
    await connection.query("DROP TRIGGER IF EXISTS after_employee_update");
    console.log('✅ Triggers supprimés\n');

    // 2. Vérifier si service_id existe
    console.log('2. Vérification de la colonne service_id...');
    const columns = await connection.query("DESCRIBE employees");
    const hasServiceId = columns.some(col => col.Field === 'service_id');
    
    if (!hasServiceId) {
      console.log('   ➕ Ajout de la colonne service_id...');
      await connection.query("ALTER TABLE employees ADD COLUMN service_id INT NULL");
      console.log('   ✅ service_id ajouté\n');
    } else {
      console.log('   ✅ service_id déjà présent\n');
    }

    // 3. Recréer les triggers MAINTENANT que service_id existe
    console.log('3. Recréation des triggers...');
    
    await connection.query(`
      CREATE TRIGGER after_employee_insert
      AFTER INSERT ON employees
      FOR EACH ROW
      BEGIN
        IF NEW.service_id IS NOT NULL THEN
          UPDATE services SET employee_count = employee_count + 1 WHERE id = NEW.service_id;
        END IF;
      END;
    `);
    console.log('   ✅ after_employee_insert créé');

    await connection.query(`
      CREATE TRIGGER after_employee_delete
      AFTER DELETE ON employees
      FOR EACH ROW
      BEGIN
        IF OLD.service_id IS NOT NULL THEN
          UPDATE services SET employee_count = GREATEST(0, employee_count - 1) WHERE id = OLD.service_id;
        END IF;
      END;
    `);
    console.log('   ✅ after_employee_delete créé');

    await connection.query(`
      CREATE TRIGGER after_employee_update
      AFTER UPDATE ON employees
      FOR EACH ROW
      BEGIN
        -- Si le service a changé (gère correctement les NULLs)
        IF NOT (OLD.service_id <=> NEW.service_id) THEN
          -- Décrémenter le compteur de l'ancien service s'il existait
          IF OLD.service_id IS NOT NULL THEN
            UPDATE services SET employee_count = GREATEST(0, employee_count - 1) WHERE id = OLD.service_id;
          END IF;
          -- Incrémenter le compteur du nouveau service s'il existe
          IF NEW.service_id IS NOT NULL THEN
            UPDATE services SET employee_count = employee_count + 1 WHERE id = NEW.service_id;
          END IF;
        END IF;
      END;
    `);
    console.log('   ✅ after_employee_update créé\n');

    console.log('🎉 CORRECTION TERMINÉE AVEC SUCCÈS !');
    console.log('🚀 Vous pouvez maintenant redémarrer votre serveur principal');

  } catch (error) {
    console.error('❌ ERREUR:', error);
  } finally {
    connection.release();
    pool.end();
  }
}

// Exécuter la fonction
fixEmployeesTable();
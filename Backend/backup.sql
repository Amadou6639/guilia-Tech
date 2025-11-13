/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: guilla_tech
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

USE guilla_tech_v2;

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `role` varchar(50) NOT NULL DEFAULT 'manager',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;


/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
REPLACE INTO `admins` VALUES
(2,'Nouvel Admin','admin@guilla.com','$2a$12$K9Qc8zRl5s7W6XbY8vJZ0.9V2rL3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z','2025-09-14 12:39:00','manager'),
(3,'Mon Admin','admin@test.com','$2b$10$Z6HSuCC2HRC9245qO8cLU.hkjlQQAaqEPAwBGqlDx9sHiR3EyOdua','2025-09-14 13:06:14','super-admin'),
(4,'Test Admin','admin@guilla-tech.com','$2b$12$zwApukbjeoHf5TGO0a1ow.W128N5wTljouvDB2Fs9dUUWYpC3fz8q','2025-10-06 05:05:25','super-admin'),
(5,'Test Admin','test@admin.com','$2b$12$69Oga6UDhElKXRF945rZFuSN4RSbJvBqa1kRSTR2ZaYeHyetNPCP6','2025-10-06 06:26:32','manager'),
(6,'Admin User','admin@example.com','$2b$10$mtBQbT.ZQlSNXozRilqbWuMKrmVPZY4Co7VEYCAg2SLWTTHaWwLKy','2025-10-13 05:13:56','manager');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL,
  `admin_name` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category` varchar(100) NOT NULL DEFAULT 'Général',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
REPLACE INTO `departments`(id, name, description, image) VALUES
(1,'Ressources Humaines','gérer, développer et valoriser le capital humain',NULL),
(2,'Développement Logiciel','Concevoir, développer, tester et maintenir des applications informatiques',NULL),
(3,'Marketing et Communication','développer la notoriété de l’entreprise\r\n',NULL),
(4,'Comptabilité et Finance','gérer, contrôler et optimiser les ressources financières',NULL),
(5,'Support Technique','Assister les utilisateurs, de garantir la disponibilité des outils informatiques et d’assurer la résolution rapide des incidents techniques afin de maintenir une productivité optimale.',NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `remaining_leaves` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `job_id` int(11) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `function_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `job_id` (`job_id`),
  KEY `department_id` (`department_id`),
  KEY `fk_employee_service` (`service_id`),
  KEY `fk_employee_function` (`function_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_employee_function` FOREIGN KEY (`function_id`) REFERENCES `functions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_employee_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
REPLACE INTO `employees`(id, name, email, photo_url, position, age, experience, remaining_leaves, phone, address, hire_date, job_id, salary, department_id, service_id, function_id) 
VALUES
(1,'Ali Attayallah','ali.attayallah@example.com',NULL,'Chef de projet',32,7,10,'62787307','Secteur 7','2020-05-02',NULL,NULL,NULL,5,NULL),
(2,'Asra Ngapor César','ngapor.cesar@example.com',NULL,'Développeur Senior',32,4,10,'66186116','Secteur 7',NULL,NULL,NULL,NULL,2,NULL),
(3,'Azaimé Saleh','azaime.saleh@example.com',NULL,'Comptabilité et Finance',28,3,2,'62719471','Secteur 7',NULL,NULL,NULL,NULL,4,NULL),
(4,'Amadou Ben Agadou','amadoubenagadou@gmail.com','/uploads/1759343751631.JPG','PDG',32,7,15,'66396816','Rue 6242','2025-10-01',NULL,NULL,NULL,2,NULL),
(5,'hassan Amane','hassan@teste.com','/uploads/default.png','Developpeur',30,4,5,'66397842','Secteur 9','2025-10-04',NULL,NULL,NULL,2,NULL),
(9,'Nodjimel Mbaitelem Nadège','nadege@exemple.com',NULL,'GRH',28,4,10,'60046664','Secteur 10',NULL,NULL,NULL,NULL,1,NULL),
(10,'Don De Dieu Ndjenodji','ndjenodji@exemple.com',NULL,'Developpeur',32,4,5,'94468484','Secteur 10',NULL,NULL,NULL,NULL,2,NULL),
(11,'Moussa Boukar','boukar@exemple.com',NULL,'Développeur Senior',32,5,10,'61404061','Secteur 6',NULL,NULL,NULL,NULL,2,NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`amadou`@`localhost`*/ /*!50003 TRIGGER after_employee_insert
      AFTER INSERT ON employees
      FOR EACH ROW
      BEGIN
        IF NEW.service_id IS NOT NULL THEN
          UPDATE services SET employee_count = employee_count + 1 WHERE id = NEW.service_id;
        END IF;
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`amadou`@`localhost`*/ /*!50003 TRIGGER after_employee_update
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
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`amadou`@`localhost`*/ /*!50003 TRIGGER after_employee_delete
      AFTER DELETE ON employees
      FOR EACH ROW
      BEGIN
        IF OLD.service_id IS NOT NULL THEN
          UPDATE services SET employee_count = GREATEST(0, employee_count - 1) WHERE id = OLD.service_id;
        END IF;
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `functions`
--

DROP TABLE IF EXISTS `functions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `functions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
REPLACE INTO `functions` VALUES
(1,'Développeur Full Stack','Conception et développement d\'applications web complètes.','2025-10-07 16:26:42'),
(2,'Chef de Projet','Planification, exécution et clôture des projets.','2025-10-07 16:26:42'),
(3,'Responsable RH','Gestion du personnel et des politiques RH.','2025-10-07 16:26:42'),
(4,'Administrateur Réseau','Gestion du réseau','2025-10-18 15:39:28'),
(5,'Maintenance Matériel','Réparation des Appareils Electronique et maintenance ','2025-10-19 07:32:45'),
(6,'Designer','Design UI/UX','2025-10-24 14:27:38'),
(7,'Comptabilité et Finance',',,,,','2025-11-06 13:09:08');
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaves`
--

DROP TABLE IF EXISTS `leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaves` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaves`
--

LOCK TABLES `leaves` WRITE;
/*!40000 ALTER TABLE `leaves` DISABLE KEYS */;
REPLACE INTO `leaves` VALUES
(1,1,'2025-11-01','2025-11-30','voyage',NULL,'Rejeté'),
(2,2,'2025-10-04','2025-11-03','Malade',NULL,'Approuvé'),
(3,5,'2025-10-04','2025-11-03','Voyage',NULL,'Approuvé'),
(4,3,'2025-09-30','2025-11-13','Voyage',NULL,'pending');
/*!40000 ALTER TABLE `leaves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo_url` text DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
REPLACE INTO `partners` VALUES
(32,'QuantumLeap','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDAwMEZGIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjIwIj5RdWFudHVtTGVhcDwvdGV4dD48L3N2Zz4=','https://example.com/quantumleap'),
(33,'StellarForge','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkYwMDAwIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjIwIj5TdGVsbGFyRm9yZ2U8L3RleHQ+PC9zdmc+','https://example.com/stellarforge'),
(34,'NexusWave','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDBGRjAwIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjIwIj5OZXh1c1dhdmU8L3RleHQ+PC9zdmc+','https://example.com/nexuswave'),
(35,'Zenith Systems','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGRjAwIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwMDAwIiBmb250LXNpemU9IjIwIj5aZW5pdGg8L3RleHQ+PC9zdmc+','https://example.com/zenith'),
(36,'Apex Innovations','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjODAwMDgwIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjIwIj5BcGV4PC90ZXh0Pjwvc3ZnPg==','https://example.com/apex'),
(37,'ATRD','/uploads/1758193035535.jpg','atdrguera.wordpress.com'),
(38,'Lycée Virtuel du Tchad','/uploads/1758193649166.jpg','https://lyceevirtueltchad.wordpress.com'),
(39,'Mairie De Mongo','/uploads/1758194525489.png','https://communedemongo.netlify.app'),
(40,'Generation Numerique','/uploads/1758194981530.jpg','https://generationnumerique.wordpress.com');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `besoin` text NOT NULL,
  `date_creation` timestamp NULL DEFAULT current_timestamp(),
  `status` enum('en attente','traité','rejeté') DEFAULT 'en attente',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
REPLACE INTO `requests` VALUES
(2,'Marie Martin','marie.martin@email.com','0987654321','Application mobile','2025-09-14 08:03:48','traité'),
(3,'Pierre Durand','pierre.durand@email.com','0612345678','Refonte site e-commerce','2025-09-14 08:03:48','traité'),
(4,'Sophie Lambert','sophie.lambert@email.com','0712345678','Site vitrine restaurant','2025-09-14 08:03:48','traité'),
(5,'Thomas Moreau','thomas.moreau@email.com','0623456789','Application de gestion','2025-09-14 08:03:48','traité'),
(7,'Amadou','amadoubenagadou@gmail.com','66396816','Inscription à la formation : \"Maintenance informatique\". Message : mmmmmmmm','2025-09-17 08:28:18','traité'),
(8,'saleh','brahim@gmail.com','66193619','maintenance','2025-09-17 13:11:43','en attente'),
(9,'saleh','brahim@gmail.com','66193619','maintenance','2025-09-17 13:12:12','en attente'),
(10,'saleh','brahim@gmail.com','66193619','maintenance','2025-09-17 13:12:17','traité'),
(11,'saleh','brahim@gmail.com','66271883','maintenance','2025-09-17 13:16:55','traité'),
(12,'saleh','brahim@gmail.com','66271883','maintenance','2025-09-17 13:19:06','traité'),
(13,'saleh','brahim@gmail.com','66271883','maintenance','2025-09-17 13:19:08','traité'),
(14,'saleh','brahim@gmail.com','63937676','maintenance','2025-09-17 13:21:42','traité'),
(20,'saleh','brahim@gmail.com','66201230','application','2025-09-17 13:54:58','traité'),
(21,'Zakaiy','zakaiy@gmail.com','66667906','reparation','2025-09-17 14:25:59','traité');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salaries`
--

DROP TABLE IF EXISTS `salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salaries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `last_payment_date` date DEFAULT NULL,
  `payment_status` enum('Payé','En attente','En retard') DEFAULT 'En attente',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salaries`
--

LOCK TABLES `salaries` WRITE;
/*!40000 ALTER TABLE `salaries` DISABLE KEYS */;
REPLACE INTO `salaries` VALUES
(1,1,60000.00,'2025-09-29','Payé','2025-09-29 21:36:36','2025-09-29 21:36:36'),
(2,2,10000.00,'2025-09-28','Payé','2025-09-29 21:37:20','2025-11-06 12:48:35'),
(3,3,250000.00,'2025-09-28','Payé','2025-09-29 21:37:50','2025-11-06 12:48:44'),
(4,4,1000000.00,'2025-01-02','Payé','2025-11-06 09:31:17','2025-11-06 09:31:17'),
(5,10,1500000.00,'2025-11-02','En attente','2025-11-06 12:05:31','2025-11-06 12:05:31');
/*!40000 ALTER TABLE `salaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `responsable_id` int(11) DEFAULT NULL,
  `employee_count` int(11) DEFAULT 0,
  `department_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_responsable` (`responsable_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `fk_responsable` FOREIGN KEY (`responsable_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
REPLACE INTO `services`(id, title, description, icon, created_at, responsable_id, employee_count, department_id) VALUES
(1,'Courtage en solutions numériques','Nous trouvons pour vous les meilleurs outils et logiciels (CRM, ERP, etc.) adaptés à vos besoins et à votre budget.','🔎','2025-10-01 17:34:22',2,1,5),
(2,'Intermédiation et mise en relation','Nous vous mettons en contact avec des experts et prestataires qualifiés pour réaliser vos projets techniques.','🤝','2025-10-01 17:34:22',2,5,3),
(3,'Initiation au numérique','Maîtrisez les bases de l’informatique et des outils digitaux pour gagner en autonomie.','🖥️','2025-10-01 17:34:22',9,0,1),
(4,'Maintenance informatique','Apprenez à diagnostiquer, réparer et entretenir vos équipements pour une performance optimale.','🛠️','2025-10-01 17:34:22',4,1,2),
(5,'Sécurité et bonnes pratiques','Protégez vos données personnelles et professionnelles et adoptez les bons réflexes en ligne.','🛡️','2025-10-01 17:34:22',1,1,2);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscribers`
--

DROP TABLE IF EXISTS `subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `confirmed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscribers`
--

LOCK TABLES `subscribers` WRITE;
/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
REPLACE INTO `subscribers` VALUES
(1,'amadoubenagadou@gmail.com','Amadou','66396816','8ca9eb3a74c5febe1398bb62accded6937c5a387a05f82da430591a05c9937df',0,'2025-09-18 15:09:46'),
(2,'abenagadou@gmail.com','Amadou Ben AGADOU','66201230','6f5af8973a8bec069e100b8a1f50a245192ca7cd032d244e02f4c7e4a935c573',0,'2025-09-18 15:11:40'),
(3,'benagadou1@gmail.com','saleh','66667906','1169024a1b3777a022c68c3dcf38fa31f4f6152239fafaf927303938533159a0',0,'2025-09-19 11:57:52'),
(12,'guiliatechnologie@gmail.com','Amadou','66396816','7b196e900d6ee93b12ce989158c37284a7c0b537',0,'2025-11-03 11:26:10'),
(13,'teste@gmail.com','Amadou','66396816','3a0dfe67cee2ff99b746c2b2fec2034a40b6794b',0,'2025-11-04 13:38:24'),
(14,'teste@gmail.fr','Amadou','66396816','830ba61dd7ab65c7e39ad8ef233255b235942f29',0,'2025-11-06 12:08:52'),
(15,'amadou@test.com','Amadou','66396816','8532e4210c1191089cb26034b811267c6370af5e',0,'2025-11-06 13:10:07');
/*!40000 ALTER TABLE `subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings`
--

DROP TABLE IF EXISTS `trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
/*!40000 ALTER TABLE `trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page` varchar(255) NOT NULL,
  `visit_timestamp` timestamp NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `referrer` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1064 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
REPLACE INTO `visits` VALUES
(1,'/accueil','2025-09-15 18:09:32','192.168.1.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64)','https://google.com'),
(2,'/services','2025-09-15 18:09:32','192.168.1.2','Mozilla/5.0 (Macintosh; Intel Mac OS X)','https://facebook.com'),
(3,'/demandes','2025-09-15 18:09:32','192.168.1.3','Mozilla/5.0 (Linux; Android 10)','direct'),
(4,'/','2025-09-17 12:56:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(5,'/','2025-09-17 12:56:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(6,'/','2025-09-17 12:56:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(7,'/','2025-09-17 12:56:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(8,'/legal-notice','2025-09-17 12:56:10',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(9,'/request','2025-09-17 12:56:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(10,'/legal-notice','2025-09-17 12:56:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(11,'/','2025-09-17 12:56:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(12,'/legal-notice','2025-09-17 12:56:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(13,'/','2025-09-17 13:09:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(14,'/','2025-09-17 13:09:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(15,'/services','2025-09-17 13:10:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(16,'/legal-notice','2025-09-17 13:10:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(17,'/services','2025-09-17 13:10:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(18,'/under-development','2025-09-17 13:10:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(19,'/','2025-09-17 13:10:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(20,'/request','2025-09-17 13:10:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(21,'/legal-notice','2025-09-17 13:15:00',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(22,'/training','2025-09-17 13:16:16',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(23,'/services','2025-09-17 13:16:22',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(24,'/request','2025-09-17 13:16:25',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(25,'/request','2025-09-17 13:21:19',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(26,'/request','2025-09-17 13:21:19',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(27,'/','2025-09-17 13:25:02',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(28,'/legal-notice','2025-09-17 13:25:10',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(29,'/','2025-09-17 13:30:13',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(30,'/','2025-09-17 13:30:20',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(31,'/','2025-09-17 13:30:20',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(32,'/terms-of-use','2025-09-17 13:30:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(33,'/','2025-09-17 13:31:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(34,'/legal-notice','2025-09-17 13:31:50',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(35,'/','2025-09-17 13:32:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(36,'/terms-of-use','2025-09-17 13:32:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(37,'/request','2025-09-17 13:32:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(38,'/request','2025-09-17 13:35:08',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(39,'/request','2025-09-17 13:35:08',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(40,'/login-admin','2025-09-17 13:49:09',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(41,'/','2025-09-17 13:53:45',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(42,'/','2025-09-17 13:54:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(43,'/services','2025-09-17 13:54:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(44,'/request','2025-09-17 13:54:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(45,'/','2025-09-17 14:15:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(46,'/','2025-09-17 14:15:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(47,'/request','2025-09-17 14:22:28',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(48,'/services','2025-09-17 14:22:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(49,'/request','2025-09-17 14:22:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(50,'/training','2025-09-17 14:22:45',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(51,'/','2025-09-17 14:23:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(52,'/request','2025-09-17 14:25:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(53,'/request','2025-09-17 14:26:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(54,'/request','2025-09-17 14:26:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(55,'/request','2025-09-17 14:26:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(56,'/request','2025-09-17 14:26:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(57,'/services','2025-09-17 14:26:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(58,'/','2025-09-17 14:27:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(59,'/services','2025-09-17 14:27:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(60,'/services','2025-09-17 14:27:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(61,'/services','2025-09-17 14:27:17',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(62,'/services','2025-09-17 14:27:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(63,'/services','2025-09-17 14:27:19',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(64,'/services','2025-09-17 14:27:19',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(65,'/services','2025-09-17 14:27:19',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(66,'/services','2025-09-17 14:27:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(67,'/','2025-09-17 14:27:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(68,'/services','2025-09-17 14:27:34',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(69,'/','2025-09-17 14:27:42',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(70,'/services','2025-09-17 14:28:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(71,'/','2025-09-17 14:35:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(72,'/services','2025-09-17 14:35:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(73,'/','2025-09-17 14:44:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(74,'/services','2025-09-17 14:44:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(75,'/request','2025-09-17 14:45:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(76,'/training','2025-09-17 14:45:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(77,'/','2025-09-17 14:46:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(78,'/','2025-09-17 14:46:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(79,'/','2025-09-17 14:52:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(80,'/','2025-09-17 14:52:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(81,'/services','2025-09-17 14:53:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(82,'/login-admin','2025-09-17 14:53:54',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(83,'/services','2025-09-17 14:55:12',NULL,'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1','direct'),
(84,'/training','2025-09-17 14:55:17',NULL,'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1','direct'),
(85,'/','2025-09-17 14:55:27',NULL,'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1','direct'),
(86,'/terms-of-use','2025-09-17 14:55:35',NULL,'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1','direct'),
(87,'/','2025-09-17 14:55:40',NULL,'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1','direct'),
(88,'/','2025-09-17 15:00:21',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(89,'/','2025-09-17 15:00:21',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(90,'/','2025-09-18 08:03:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(91,'/','2025-09-18 08:03:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(92,'/legal-notice','2025-09-18 08:03:28',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(93,'/','2025-09-18 08:03:47',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(94,'/terms-of-use','2025-09-18 08:03:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(95,'/training','2025-09-18 08:04:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(96,'/under-development','2025-09-18 08:04:19',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(97,'/under-development','2025-09-18 08:04:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(98,'/under-development','2025-09-18 08:04:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(99,'/request','2025-09-18 08:04:32',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(100,'/training','2025-09-18 08:04:34',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(101,'/services','2025-09-18 08:04:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(102,'/','2025-09-18 08:07:08',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(103,'/services','2025-09-18 08:07:13',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(104,'/request','2025-09-18 08:07:15',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(105,'/training','2025-09-18 08:07:17',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(106,'/login-admin','2025-09-18 08:07:41',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(107,'/login-admin','2025-09-18 08:12:09',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(108,'/login-admin','2025-09-18 08:12:37',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(109,'/','2025-09-18 08:12:56',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(110,'/request','2025-09-18 08:18:15',NULL,'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(111,'/training','2025-09-18 08:19:08',NULL,'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(112,'/services','2025-09-18 08:19:19',NULL,'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(113,'/servicestfyfuuguyfty','2025-09-18 08:20:15',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(114,'/servicestfyfuuguyfty','2025-09-18 08:20:15',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(115,'/','2025-09-18 08:21:05',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(116,'/services','2025-09-18 08:21:25',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(117,'/training','2025-09-18 08:21:47',NULL,'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(118,'/legal-notice','2025-09-18 08:21:56',NULL,'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(119,'/','2025-09-18 08:24:48',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(120,'/login-admin','2025-09-18 08:27:38',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(121,'/login-admin','2025-09-18 08:27:38',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(122,'/login-admin','2025-09-18 08:28:07',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(123,'/','2025-09-18 08:33:07',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(124,'/services','2025-09-18 08:33:30',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(125,'/','2025-09-18 08:33:32',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(126,'/terms-of-use','2025-09-18 08:34:30',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(127,'/','2025-09-18 08:34:43',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(128,'/services','2025-09-18 08:35:46',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(129,'/request','2025-09-18 08:36:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(130,'/training','2025-09-18 08:36:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(131,'/training','2025-09-18 09:06:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(132,'/training','2025-09-18 09:06:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(133,'/','2025-09-18 09:06:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(134,'/','2025-09-18 09:07:42',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(135,'/','2025-09-18 09:07:42',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(136,'/partners','2025-09-18 09:11:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(137,'/partners','2025-09-18 09:11:45',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(138,'/partners','2025-09-18 09:17:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(139,'/partners','2025-09-18 09:17:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(140,'/login-admin','2025-09-18 09:17:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(141,'/partners','2025-09-18 09:18:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(142,'/partners','2025-09-18 09:19:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(143,'/partners','2025-09-18 09:19:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(144,'/partners','2025-09-18 09:19:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(145,'/partners','2025-09-18 09:19:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(146,'/partners','2025-09-18 09:19:46',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(147,'/partners','2025-09-18 09:19:46',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(148,'/partners','2025-09-18 09:23:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(149,'/partners','2025-09-18 09:23:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(150,'/login-admin','2025-09-18 09:23:46',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(151,'/partners','2025-09-18 09:42:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(152,'/login-admin','2025-09-18 09:42:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(153,'/partners','2025-09-18 09:53:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(154,'/partners','2025-09-18 09:53:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(155,'/partners','2025-09-18 09:53:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(156,'/partners','2025-09-18 09:56:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(157,'/partners','2025-09-18 09:56:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(158,'/login-admin','2025-09-18 09:57:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(159,'/login-admin','2025-09-18 10:11:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(160,'/partners','2025-09-18 10:11:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(161,'/partners','2025-09-18 10:20:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(162,'/partners','2025-09-18 10:20:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(163,'/login-admin','2025-09-18 10:20:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(164,'/','2025-09-18 10:40:34',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(165,'/partners','2025-09-18 10:40:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(166,'/partners','2025-09-18 10:54:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(167,'/partners','2025-09-18 10:54:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(168,'/login-admin','2025-09-18 10:55:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(169,'/','2025-09-18 10:57:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(170,'/partners','2025-09-18 10:57:28',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(171,'/atdrguera.wordpress.com','2025-09-18 10:57:32',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(172,'/atdrguera.wordpress.com','2025-09-18 10:57:32',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(173,'/','2025-09-18 10:59:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(174,'/partners','2025-09-18 10:59:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(175,'/atdrguera.wordpress.com','2025-09-18 10:59:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(176,'/atdrguera.wordpress.com','2025-09-18 10:59:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(177,'/partners','2025-09-18 11:05:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(178,'/partners','2025-09-18 11:05:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(179,'/partners','2025-09-18 11:07:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(180,'/partners','2025-09-18 11:13:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(181,'/services','2025-09-18 11:14:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(182,'/request','2025-09-18 11:14:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(183,'/services','2025-09-18 11:17:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(184,'/services','2025-09-18 11:17:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(185,'/partners','2025-09-18 11:17:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(186,'/request','2025-09-18 11:17:38',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(187,'/partners','2025-09-18 11:22:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(188,'/','2025-09-18 11:44:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(189,'/partners','2025-09-18 11:45:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(190,'/','2025-09-18 11:46:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(191,'/','2025-09-18 11:52:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(192,'/','2025-09-18 11:52:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(193,'/partners','2025-09-18 11:52:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(194,'/','2025-09-18 11:56:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(195,'/partners','2025-09-18 11:57:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(196,'/training','2025-09-18 11:57:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(197,'/login-admin','2025-09-18 11:58:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(198,'/','2025-09-18 11:58:46',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(199,'/under-development','2025-09-18 11:59:54',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(200,'/under-development','2025-09-18 11:59:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(201,'/under-development','2025-09-18 11:59:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(202,'/','2025-09-18 12:00:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(203,'/request','2025-09-18 12:30:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(204,'/','2025-09-18 12:30:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(205,'/','2025-09-18 13:00:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(206,'/','2025-09-18 13:00:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(207,'/request','2025-09-18 13:00:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(208,'/request','2025-09-18 13:15:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(209,'/request','2025-09-18 13:15:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(210,'/','2025-09-18 13:15:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(211,'/','2025-09-18 13:15:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(212,'/request','2025-09-18 13:15:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(213,'/','2025-09-18 13:20:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(214,'/','2025-09-18 13:20:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(215,'/request','2025-09-18 13:20:50',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(216,'/login-admin','2025-09-18 13:20:54',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(217,'/','2025-09-18 13:30:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(218,'/request','2025-09-18 13:30:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(219,'/','2025-09-18 13:30:32',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(220,'/request','2025-09-18 13:30:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(221,'/request','2025-09-18 13:37:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(222,'/request','2025-09-18 13:37:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(223,'/request','2025-09-18 13:37:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(224,'/request','2025-09-18 13:37:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(225,'/','2025-09-18 13:37:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(226,'/request','2025-09-18 13:37:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(227,'/','2025-09-18 13:37:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(228,'/request','2025-09-18 13:37:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(229,'/','2025-09-18 13:55:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(230,'/','2025-09-18 13:55:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(231,'/request','2025-09-18 13:55:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(232,'/','2025-09-18 13:55:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(233,'/request','2025-09-18 13:55:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(234,'/request','2025-09-18 13:56:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(235,'/request','2025-09-18 14:03:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(236,'/request','2025-09-18 14:03:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(237,'/','2025-09-18 14:03:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(238,'/request','2025-09-18 14:03:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(239,'/','2025-09-18 14:04:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(240,'/request','2025-09-18 14:05:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(241,'/','2025-09-18 14:08:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(242,'/','2025-09-18 14:08:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(243,'/request','2025-09-18 14:08:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(244,'/','2025-09-18 14:09:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(245,'/','2025-09-18 14:12:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(246,'/','2025-09-18 14:12:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(247,'/request','2025-09-18 14:12:17',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(248,'/login-admin','2025-09-18 14:12:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(249,'/','2025-09-18 14:48:26',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(250,'/request','2025-09-18 14:48:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(251,'/request','2025-09-18 14:48:34',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(252,'/request','2025-09-18 14:48:34',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(253,'/request','2025-09-18 15:00:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(254,'/request','2025-09-18 15:00:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(255,'/','2025-09-18 15:00:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(256,'/request','2025-09-18 15:00:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(257,'/request','2025-09-18 15:00:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(258,'/request','2025-09-18 15:00:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(259,'/request','2025-09-18 15:01:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(260,'/request','2025-09-18 15:01:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(261,'/services','2025-09-18 15:01:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(262,'/partners','2025-09-18 15:01:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(263,'/request','2025-09-18 15:01:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(264,'/services','2025-09-18 15:01:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(265,'/','2025-09-18 15:01:17',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(266,'/request','2025-09-18 15:01:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(267,'/','2025-09-18 15:01:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(268,'/request','2025-09-18 15:01:29',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(269,'/request','2025-09-18 15:06:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(270,'/request','2025-09-18 15:06:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(271,'/','2025-09-18 15:06:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(272,'/subscribe','2025-09-18 15:06:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(273,'/subscribe','2025-09-18 15:09:42',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(274,'/subscribe','2025-09-18 15:09:42',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(275,'/','2025-09-18 15:10:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(276,'/subscribe','2025-09-18 15:11:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(277,'/','2025-09-18 20:04:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(278,'/','2025-09-18 20:04:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(279,'/subscribe','2025-09-18 20:05:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(280,'/login-admin','2025-09-18 20:05:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(281,'/','2025-09-18 20:06:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(282,'/services','2025-09-18 20:06:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(283,'/partners','2025-09-18 20:06:10',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(284,'/','2025-09-18 20:07:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(285,'/subscribe','2025-09-19 07:55:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(286,'/','2025-09-19 07:56:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(287,'/subscribe','2025-09-19 07:56:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(288,'/','2025-09-19 07:56:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(289,'/login-admin','2025-09-19 07:56:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(290,'/partners','2025-09-19 07:58:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(291,'/partners','2025-09-19 07:58:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(292,'/subscribe','2025-09-19 08:00:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(293,'/partners','2025-09-19 08:00:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(294,'/services','2025-09-19 08:00:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(295,'/','2025-09-19 08:01:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(296,'/subscribe','2025-09-19 08:01:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(297,'/','2025-09-19 08:01:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(298,'/legal-notice','2025-09-19 08:01:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(299,'/services','2025-09-19 08:02:51',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(300,'/','2025-09-19 08:02:54',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(301,'/services','2025-09-19 08:03:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(302,'/','2025-09-19 08:03:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(303,'/subscribe','2025-09-19 08:03:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(304,'/','2025-09-19 10:37:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(305,'/','2025-09-19 10:37:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(306,'/blog','2025-09-19 10:59:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(307,'/','2025-09-19 11:00:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(308,'/','2025-09-19 11:28:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(309,'/','2025-09-19 11:28:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(310,'/login-admin','2025-09-19 11:29:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(311,'/','2025-09-19 11:29:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(312,'/partners','2025-09-19 11:29:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(313,'/services','2025-09-19 11:29:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(314,'/request','2025-09-19 11:29:38',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(315,'/training','2025-09-19 11:29:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(316,'/','2025-09-19 11:30:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(317,'/subscribe','2025-09-19 11:30:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(318,'/','2025-09-19 11:30:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(319,'/','2025-09-19 11:30:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(320,'/services','2025-09-19 11:30:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(321,'/','2025-09-19 11:39:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(322,'/subscribe','2025-09-19 11:39:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(323,'/login-admin','2025-09-19 11:40:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(324,'/','2025-09-19 11:48:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(325,'/','2025-09-19 11:48:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(326,'/subscribe','2025-09-19 11:48:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(327,'/','2025-09-19 11:57:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(328,'/subscribe','2025-09-19 11:57:26',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(329,'/login-admin','2025-09-19 12:02:14',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(330,'/partners','2025-09-19 12:08:11',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(331,'/','2025-09-19 12:08:12',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(332,'/partners','2025-09-19 12:08:15',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(333,'/subscribe','2025-09-19 12:08:16',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(334,'/','2025-09-19 12:35:47',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(335,'/subscribe','2025-09-19 12:36:54',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(336,'/','2025-09-19 12:36:58',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(337,'/subscribe','2025-09-19 12:46:12',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','direct'),
(338,'/','2025-09-19 13:04:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(339,'/','2025-09-19 13:04:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(340,'/subscribe','2025-09-19 13:04:46',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(341,'/login-admin','2025-09-19 13:04:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(342,'/','2025-09-19 13:12:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(343,'/subscribe','2025-09-19 13:12:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(344,'/','2025-09-19 13:16:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(345,'/','2025-09-19 13:16:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(346,'/subscribe','2025-09-19 13:16:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(347,'/','2025-09-19 13:16:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(348,'/services','2025-09-19 13:16:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(349,'/partners','2025-09-19 13:17:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(350,'/','2025-09-19 13:17:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(351,'/partners','2025-09-19 13:17:26',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(352,'/request','2025-09-19 13:17:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(353,'/training','2025-09-19 13:17:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(354,'/training','2025-09-19 13:17:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(355,'/login-admin','2025-09-19 13:18:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(356,'/register-admin','2025-09-19 13:19:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(357,'/','2025-09-19 13:40:17',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(358,'/partners','2025-09-19 13:40:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(359,'/subscribe','2025-09-19 13:40:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(360,'/partners','2025-09-19 13:40:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(361,'/subscribe','2025-09-19 13:40:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(362,'/partners','2025-09-19 13:41:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(363,'/training','2025-09-19 13:41:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(364,'/training','2025-09-19 14:10:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(365,'/','2025-09-21 12:52:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(366,'/','2025-09-21 12:52:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(367,'/services','2025-09-21 12:53:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(368,'/partners','2025-09-21 12:53:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(369,'/login-admin','2025-09-21 12:54:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(370,'/training','2025-09-21 12:55:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(371,'/','2025-09-21 12:55:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(372,'/blog','2025-09-21 12:56:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(373,'/','2025-09-21 12:56:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(374,'/services','2025-09-22 13:45:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(375,'/partners','2025-09-22 13:45:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(376,'/login-admin','2025-09-22 13:59:20',NULL,'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36','http://localhost:3000/admin/dashboard/stats'),
(377,'/','2025-09-22 14:07:47',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(378,'/','2025-09-22 14:07:47',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(379,'/login-admin','2025-09-22 14:08:10',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(380,'/','2025-09-24 09:54:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(381,'/','2025-09-24 09:54:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(382,'/blog','2025-09-24 09:56:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(383,'/','2025-09-24 09:56:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(384,'/subscribe','2025-09-24 09:56:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(385,'/subscribe','2025-09-24 09:56:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(386,'/subscribe','2025-09-24 09:56:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(387,'/','2025-09-24 09:56:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(388,'/login-admin','2025-09-24 09:57:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(389,'/login-admin','2025-09-24 09:57:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(390,'/partners','2025-09-24 09:57:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(391,'/services','2025-09-24 09:57:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(392,'/request','2025-09-24 09:57:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(393,'/request','2025-09-24 09:58:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(394,'/request','2025-09-24 09:58:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(395,'/training','2025-09-24 09:58:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(396,'/services','2025-09-24 09:59:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(397,'/training','2025-09-24 09:59:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(398,'/services','2025-09-24 10:00:10',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(399,'/training','2025-09-24 10:00:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(400,'/services','2025-09-24 10:00:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(401,'/training','2025-09-24 10:01:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(402,'/request','2025-09-24 10:01:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(403,'/partners','2025-09-24 10:01:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(404,'/subscribe','2025-09-24 10:03:17',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(405,'/partners','2025-09-24 10:03:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(406,'/partners','2025-09-24 12:32:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(407,'/request','2025-09-24 12:32:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(408,'/','2025-09-24 12:32:38',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(409,'/services','2025-09-24 12:32:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(410,'/','2025-09-24 12:33:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(411,'/terms-of-use','2025-09-24 12:33:42',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(412,'/','2025-09-24 12:33:47',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(413,'/legal-notice','2025-09-24 12:33:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(414,'/','2025-09-24 12:33:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(415,'/','2025-09-24 12:33:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(416,'/services','2025-09-24 12:33:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(417,'/training','2025-09-24 12:33:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(418,'/request','2025-09-24 12:34:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(419,'/under-development','2025-09-24 12:34:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(420,'/','2025-09-24 12:34:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(421,'/login-admin','2025-09-24 12:34:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(422,'/login-admin','2025-09-24 12:35:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(423,'/','2025-09-24 17:26:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(424,'/','2025-09-24 17:26:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(425,'/login-admin','2025-09-24 17:27:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(426,'/login-admin','2025-09-24 17:27:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(427,'/','2025-09-24 18:35:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(428,'/','2025-09-24 18:35:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(429,'/login-admin','2025-09-24 18:35:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(430,'/','2025-09-25 07:05:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(431,'/','2025-09-25 07:05:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(432,'/','2025-09-25 07:05:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(433,'/','2025-09-25 07:05:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(434,'/login-admin','2025-09-25 07:06:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(435,'/','2025-09-25 11:51:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(436,'/','2025-09-25 11:51:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(437,'/','2025-09-25 11:51:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(438,'/','2025-09-25 11:51:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(439,'/','2025-09-25 11:55:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(440,'/','2025-09-25 11:55:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(441,'/legal-notice','2025-09-25 11:55:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(442,'/','2025-09-26 08:27:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(443,'/','2025-09-26 08:27:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(444,'/training','2025-09-26 08:27:29',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(445,'/login-admin','2025-09-26 08:27:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(446,'/partners','2025-09-26 08:28:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(447,'/','2025-09-26 09:10:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(448,'/','2025-09-26 09:10:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(449,'/','2025-09-26 09:10:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(450,'/','2025-09-26 09:10:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(451,'/login-admin','2025-09-26 09:11:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(452,'/services','2025-09-26 09:12:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(453,'/services','2025-09-26 09:14:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(454,'/','2025-09-26 09:14:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(455,'/blog','2025-09-26 09:17:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(456,'/','2025-09-26 09:17:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(457,'/services','2025-09-26 09:18:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(458,'/partners','2025-09-26 09:18:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(459,'/subscribe','2025-09-26 09:19:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(460,'/partners','2025-09-26 09:19:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(461,'/subscribe','2025-09-26 09:19:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(462,'/partners','2025-09-26 09:19:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(463,'/legal-notice','2025-09-26 09:22:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(464,'/partners','2025-09-26 09:27:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(465,'/terms-of-use','2025-09-26 09:27:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(466,'/partners','2025-09-26 09:31:29',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(467,'/under-development','2025-09-26 09:31:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(468,'/under-development','2025-09-26 09:31:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(469,'/under-development','2025-09-26 09:31:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(470,'/legal-notice','2025-09-26 09:31:45',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(471,'/under-development','2025-09-26 09:32:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(472,'/terms-of-use','2025-09-26 09:32:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(473,'/under-development','2025-09-26 09:32:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(474,'/legal-notice','2025-09-26 09:37:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(475,'/login-admin','2025-09-26 09:45:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(476,'/login-admin','2025-09-26 09:45:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(477,'/login-admin','2025-09-26 09:45:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(478,'/login-admin','2025-09-26 09:45:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(479,'/login-admin','2025-09-26 09:45:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(480,'/login-admin','2025-09-26 09:45:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(481,'/services','2025-09-26 09:47:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(482,'/','2025-09-26 13:22:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(483,'/','2025-09-26 13:22:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(484,'/login-admin','2025-09-26 13:22:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(485,'/','2025-09-26 13:41:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(486,'/','2025-09-26 13:41:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(487,'/','2025-09-26 13:41:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(488,'/','2025-09-26 13:41:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(489,'/','2025-09-26 20:20:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(490,'/','2025-09-26 20:20:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(491,'/login-admin','2025-09-26 20:20:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(492,'/','2025-09-27 06:19:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(493,'/','2025-09-27 06:19:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(494,'/','2025-09-27 12:02:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(495,'/','2025-09-27 12:02:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(496,'/login-admin','2025-09-27 12:02:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(497,'/','2025-09-28 10:44:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(498,'/','2025-09-28 10:44:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(499,'/','2025-09-29 09:27:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(500,'/','2025-09-29 09:27:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(501,'/login-admin','2025-09-29 09:27:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(502,'/','2025-09-29 10:20:45',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(503,'/','2025-09-29 10:20:45',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(504,'/login-admin','2025-09-29 10:20:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(505,'/','2025-09-29 10:55:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(506,'/','2025-09-29 10:55:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(507,'/','2025-09-29 10:58:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(508,'/','2025-09-29 10:58:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(509,'/login-admin','2025-09-29 10:58:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(510,'/services','2025-09-29 11:07:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(511,'/services','2025-09-29 11:07:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(512,'/partners','2025-09-29 11:07:50',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(513,'/request','2025-09-29 11:07:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(514,'/training','2025-09-29 11:07:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(515,'/services','2025-09-29 11:08:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(516,'/','2025-09-29 11:08:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(517,'/request','2025-09-29 11:08:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(518,'/','2025-09-29 11:08:29',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(519,'/','2025-09-29 11:23:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(520,'/','2025-09-29 11:23:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(521,'/login-admin','2025-09-29 11:23:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/'),
(522,'/','2025-09-29 11:39:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(523,'/','2025-09-29 11:39:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(524,'/login-admin','2025-09-29 11:39:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(525,'/services','2025-09-29 16:16:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(526,'/services','2025-09-29 16:17:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(527,'/services','2025-09-29 16:17:07',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(528,'/','2025-09-29 16:18:32',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(529,'/services','2025-09-29 16:18:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(530,'/request','2025-09-29 16:18:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(531,'/partners','2025-09-29 16:18:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(532,'/training','2025-09-29 16:18:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(533,'/services','2025-09-29 16:19:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(534,'/','2025-09-29 16:19:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(535,'/services','2025-09-29 16:19:34',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(536,'/services','2025-09-29 16:21:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(537,'/services','2025-09-29 16:21:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(538,'/','2025-09-29 21:32:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(539,'/','2025-09-29 21:32:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(540,'/','2025-09-29 21:33:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(541,'/','2025-09-29 21:33:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(542,'/services','2025-09-29 21:33:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(543,'/partners','2025-09-29 21:33:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(544,'/request','2025-09-29 21:33:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(545,'/training','2025-09-29 21:33:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(546,'/terms-of-use','2025-09-29 21:39:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(547,'/','2025-09-29 21:39:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(548,'/subscribe','2025-09-29 21:39:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(549,'/','2025-09-29 21:40:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(550,'/services','2025-09-29 21:40:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(551,'/training','2025-09-29 21:40:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(552,'/legal-notice','2025-09-29 21:40:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(553,'/','2025-09-30 15:47:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(554,'/','2025-09-30 15:47:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(555,'/services','2025-09-30 15:47:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(556,'/services','2025-10-01 15:03:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(557,'/services','2025-10-01 15:03:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(558,'/services','2025-10-01 15:04:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(559,'/services','2025-10-01 15:04:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(560,'/login-admin','2025-10-01 15:04:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(561,'/','2025-10-01 15:10:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(562,'/','2025-10-01 15:10:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(563,'/','2025-10-01 15:10:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(564,'/services','2025-10-01 15:10:54',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(565,'/login-admin','2025-10-01 15:11:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(566,'/services','2025-10-01 15:11:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(567,'/services','2025-10-01 15:18:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(568,'/services','2025-10-01 15:18:48',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(569,'/services','2025-10-01 15:18:51',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(570,'/services','2025-10-01 15:18:51',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(571,'/services','2025-10-01 15:28:26',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(572,'/services','2025-10-01 15:28:26',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(573,'/login-admin','2025-10-01 15:28:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(574,'/services','2025-10-01 15:28:51',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(575,'/services','2025-10-01 15:32:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(576,'/services','2025-10-01 15:32:39',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(577,'/services','2025-10-01 15:35:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(578,'/services','2025-10-01 15:35:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(579,'/services','2025-10-01 15:49:32',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(580,'/services','2025-10-01 15:49:32',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(581,'/partners','2025-10-01 16:05:19',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(582,'/services','2025-10-01 16:05:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(583,'/partners','2025-10-01 16:05:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(584,'/services','2025-10-01 16:05:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(585,'/services','2025-10-01 16:10:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(586,'/services','2025-10-01 16:10:14',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(587,'/services','2025-10-01 16:39:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(588,'/services','2025-10-01 16:39:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(589,'/services','2025-10-01 17:09:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(590,'/services','2025-10-01 17:09:04',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(591,'/services','2025-10-01 17:14:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(592,'/services','2025-10-01 17:14:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(593,'/services','2025-10-01 17:14:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(594,'/','2025-10-01 17:15:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(595,'/services','2025-10-01 17:15:17',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(596,'/services','2025-10-01 17:20:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(597,'/services','2025-10-01 17:20:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(598,'/services','2025-10-01 17:21:22',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(599,'/training','2025-10-01 17:24:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(600,'/services','2025-10-01 17:38:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(601,'/services','2025-10-01 17:38:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(602,'/services/5','2025-10-01 17:39:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(603,'/services','2025-10-01 17:39:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(604,'/training','2025-10-01 17:39:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(605,'/services','2025-10-01 17:39:29',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(606,'/services/1','2025-10-01 17:40:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(607,'/services','2025-10-01 17:40:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(608,'/services','2025-10-01 17:44:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(609,'/services','2025-10-01 17:45:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(610,'/services','2025-10-01 17:51:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(611,'/','2025-10-01 17:59:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(612,'/','2025-10-02 05:48:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(613,'/','2025-10-02 05:48:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(614,'/','2025-10-02 05:48:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(615,'/','2025-10-02 05:48:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(616,'/','2025-10-02 05:48:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(617,'/','2025-10-02 05:48:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(618,'/','2025-10-02 05:48:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(619,'/','2025-10-02 05:48:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(620,'/services','2025-10-02 05:49:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(621,'/','2025-10-02 08:49:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(622,'/','2025-10-02 08:49:20',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(623,'/services','2025-10-02 08:53:50',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(624,'/services/2','2025-10-02 08:54:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(625,'/services','2025-10-02 08:54:33',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(626,'/services/1','2025-10-02 08:54:35',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(627,'/services','2025-10-02 08:54:36',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(628,'/partners','2025-10-02 08:57:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(629,'/request','2025-10-02 08:59:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(630,'/training','2025-10-02 08:59:29',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(631,'/login-admin','2025-10-02 09:01:13',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(632,'/','2025-10-02 09:02:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(633,'/login-admin','2025-10-02 09:03:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(634,'/under-development','2025-10-02 09:23:30',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(635,'/under-development','2025-10-02 09:23:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(636,'/under-development','2025-10-02 09:23:58',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(637,'/under-development','2025-10-02 09:24:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(638,'/under-development','2025-10-02 09:24:15',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(639,'/terms-of-use','2025-10-02 09:24:27',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(640,'/under-development','2025-10-02 09:24:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(641,'/legal-notice','2025-10-02 09:24:38',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(642,'/login-admin','2025-10-02 09:26:03',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(643,'/','2025-10-02 09:26:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(644,'/login-admin','2025-10-02 09:26:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(645,'/login-admin','2025-10-02 09:26:08',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(646,'/login-admin','2025-10-02 09:26:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(647,'/login-admin','2025-10-02 09:26:11',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(648,'/','2025-10-02 09:26:31',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(649,'/blog','2025-10-02 09:26:43',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(650,'/','2025-10-02 09:26:45',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(651,'/blog','2025-10-02 09:26:51',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(652,'/','2025-10-02 09:27:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(653,'/request','2025-10-02 09:28:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(654,'/','2025-10-02 09:28:51',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(655,'/subscribe','2025-10-02 09:29:02',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(656,'/','2025-10-02 09:29:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(657,'/services','2025-10-02 09:29:41',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(658,'/partners','2025-10-02 09:29:46',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(659,'/login-admin','2025-10-02 09:30:00',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(660,'/register-admin','2025-10-02 09:30:16',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(661,'/login-admin','2025-10-02 09:31:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(662,'/login-admin','2025-10-02 09:31:01',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(663,'/','2025-10-02 09:31:05',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(664,'/request','2025-10-02 09:31:09',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(665,'/','2025-10-02 09:31:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(666,'/request','2025-10-02 09:31:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(667,'/training','2025-10-02 09:31:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(668,'/','2025-10-02 09:52:52',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(669,'/services','2025-10-02 09:52:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(670,'/login-admin','2025-10-02 09:53:49',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(671,'/','2025-10-03 07:31:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(672,'/','2025-10-03 07:31:37',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(673,'/services','2025-10-03 07:31:47',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(674,'/','2025-10-04 09:22:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(675,'/','2025-10-04 09:22:40',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(676,'/','2025-10-04 09:55:50',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(677,'/','2025-10-04 09:55:50',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(678,'/','2025-10-04 10:33:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(679,'/','2025-10-04 10:33:55',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(680,'/login-admin','2025-10-04 10:34:12',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(681,'/login-admin','2025-10-04 11:15:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(682,'/request','2025-10-04 11:15:51',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(683,'/training','2025-10-04 11:15:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(684,'/login-admin','2025-10-04 11:15:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(685,'/login-admin','2025-10-04 11:16:06',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(686,'/partners','2025-10-04 11:36:21',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(687,'/services','2025-10-04 11:36:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(688,'/','2025-10-04 11:36:25',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(689,'/request','2025-10-04 11:36:26',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(690,'/training','2025-10-04 11:36:28',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(691,'/login-admin','2025-10-04 13:06:44',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(692,'/login-admin','2025-10-04 13:06:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(693,'/login-admin','2025-10-04 13:06:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(694,'/login-admin','2025-10-04 13:06:57',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','http://localhost:3000/admin/hrm'),
(695,'/','2025-10-04 13:33:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(696,'/','2025-10-04 13:33:56',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(697,'/','2025-10-04 14:18:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(698,'/','2025-10-04 14:18:24',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(699,'/login-admin','2025-10-04 14:22:18',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(700,'/login-admin','2025-10-04 14:22:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(701,'/login-admin','2025-10-04 14:22:23',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(702,'/','2025-10-04 14:40:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(703,'/','2025-10-04 14:40:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(704,'/services','2025-10-04 15:56:42',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(705,'/login-admin','2025-10-04 17:37:53',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(706,'/login-admin','2025-10-04 17:37:59',NULL,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','direct'),
(707,'/','2025-10-28 12:28:05',NULL,NULL,NULL),
(708,'/about','2025-10-28 12:28:24',NULL,NULL,NULL),
(709,'/partners','2025-10-28 12:28:58',NULL,NULL,NULL),
(710,'/','2025-10-28 13:18:20',NULL,NULL,NULL),
(711,'/login-admin','2025-10-28 13:26:17',NULL,NULL,NULL),
(712,'/login-admin','2025-10-28 13:35:53',NULL,NULL,NULL),
(713,'/partners','2025-10-28 13:36:25',NULL,NULL,NULL),
(714,'/login-admin','2025-10-28 13:36:40',NULL,NULL,NULL),
(715,'/partners','2025-10-28 13:46:46',NULL,NULL,NULL),
(716,'/partners','2025-10-28 14:01:43',NULL,NULL,NULL),
(717,'/login-admin','2025-10-28 14:50:23',NULL,NULL,NULL),
(718,'/','2025-10-28 14:50:27',NULL,NULL,NULL),
(719,'/login-admin','2025-10-28 14:50:33',NULL,NULL,NULL),
(720,'/about','2025-10-28 15:15:22',NULL,NULL,NULL),
(721,'/','2025-10-28 15:37:13',NULL,NULL,NULL),
(722,'/login-admin','2025-10-28 15:37:31',NULL,NULL,NULL),
(723,'/','2025-10-29 10:22:18',NULL,NULL,NULL),
(724,'/','2025-10-29 10:22:18',NULL,NULL,NULL),
(725,'/login-admin','2025-10-29 10:22:23',NULL,NULL,NULL),
(726,'/login-admin','2025-10-29 10:22:28',NULL,NULL,NULL),
(727,'/','2025-10-29 14:10:51',NULL,NULL,NULL),
(728,'/','2025-10-29 14:10:51',NULL,NULL,NULL),
(729,'/login-admin','2025-10-29 14:10:57',NULL,NULL,NULL),
(730,'/login-admin','2025-10-29 14:11:00',NULL,NULL,NULL),
(731,'/','2025-10-31 05:30:26',NULL,NULL,NULL),
(732,'/','2025-10-31 05:30:27',NULL,NULL,NULL),
(733,'/login-admin','2025-10-31 05:30:39',NULL,NULL,NULL),
(734,'/login-admin','2025-10-31 06:35:13',NULL,NULL,NULL),
(735,'/','2025-10-31 11:14:11',NULL,NULL,NULL),
(736,'/','2025-10-31 11:14:11',NULL,NULL,NULL),
(737,'/login-admin','2025-10-31 11:17:12',NULL,NULL,NULL),
(738,'/login-admin','2025-11-01 07:33:22',NULL,NULL,NULL),
(739,'/login-admin','2025-11-01 09:23:01',NULL,NULL,NULL),
(740,'/','2025-11-02 06:52:37',NULL,NULL,NULL),
(741,'/','2025-11-02 06:52:37',NULL,NULL,NULL),
(742,'/login-admin','2025-11-02 06:53:00',NULL,NULL,NULL),
(743,'/partners','2025-11-02 07:30:36',NULL,NULL,NULL),
(744,'/','2025-11-02 10:22:42',NULL,NULL,NULL),
(745,'/','2025-11-02 10:22:42',NULL,NULL,NULL),
(746,'/','2025-11-02 10:22:59',NULL,NULL,NULL),
(747,'/','2025-11-02 10:23:02',NULL,NULL,NULL),
(748,'/about','2025-11-02 10:23:04',NULL,NULL,NULL),
(749,'/services','2025-11-02 10:23:14',NULL,NULL,NULL),
(750,'/training','2025-11-02 10:23:18',NULL,NULL,NULL),
(751,'/blog','2025-11-02 10:23:25',NULL,NULL,NULL),
(752,'/contact','2025-11-02 10:23:34',NULL,NULL,NULL),
(753,'/','2025-11-03 09:08:23',NULL,NULL,NULL),
(754,'/','2025-11-03 09:08:23',NULL,NULL,NULL),
(755,'/login-admin','2025-11-03 09:09:13',NULL,NULL,NULL),
(756,'/login-admin','2025-11-03 09:14:52',NULL,NULL,NULL),
(757,'/login-admin','2025-11-03 09:14:52',NULL,NULL,NULL),
(758,'/login-admin','2025-11-03 09:22:38',NULL,NULL,NULL),
(759,'/','2025-11-03 09:22:41',NULL,NULL,NULL),
(760,'/about','2025-11-03 09:22:45',NULL,NULL,NULL),
(761,'/training','2025-11-03 09:22:47',NULL,NULL,NULL),
(762,'/partners','2025-11-03 09:22:49',NULL,NULL,NULL),
(763,'/blog','2025-11-03 09:22:52',NULL,NULL,NULL),
(764,'/contact','2025-11-03 09:22:57',NULL,NULL,NULL),
(765,'/login-admin','2025-11-03 09:22:59',NULL,NULL,NULL),
(766,'/','2025-11-03 09:34:16',NULL,NULL,NULL),
(767,'/login-admin','2025-11-03 09:34:21',NULL,NULL,NULL),
(768,'/','2025-11-03 09:34:26',NULL,NULL,NULL),
(769,'/login-admin','2025-11-03 09:34:30',NULL,NULL,NULL),
(770,'/login-admin','2025-11-03 09:39:39',NULL,NULL,NULL),
(771,'/login-admin','2025-11-03 09:39:39',NULL,NULL,NULL),
(772,'/','2025-11-03 09:39:42',NULL,NULL,NULL),
(773,'/login-admin','2025-11-03 09:39:49',NULL,NULL,NULL),
(774,'/','2025-11-03 09:39:52',NULL,NULL,NULL),
(775,'/login-admin','2025-11-03 09:41:03',NULL,NULL,NULL),
(776,'/','2025-11-03 09:41:05',NULL,NULL,NULL),
(777,'/login-admin','2025-11-03 09:41:26',NULL,NULL,NULL),
(778,'/','2025-11-03 09:41:30',NULL,NULL,NULL),
(779,'/blog','2025-11-03 09:42:48',NULL,NULL,NULL),
(780,'/login-admin','2025-11-03 09:42:51',NULL,NULL,NULL),
(781,'/login-admin','2025-11-03 09:45:03',NULL,NULL,NULL),
(782,'/','2025-11-03 09:45:10',NULL,NULL,NULL),
(783,'/login-admin','2025-11-03 09:47:32',NULL,NULL,NULL),
(784,'/login-admin','2025-11-03 09:47:42',NULL,NULL,NULL),
(785,'/login-admin','2025-11-03 09:47:52',NULL,NULL,NULL),
(786,'/login-admin','2025-11-03 09:48:59',NULL,NULL,NULL),
(787,'/login-admin','2025-11-03 09:49:01',NULL,NULL,NULL),
(788,'/login-admin','2025-11-03 09:49:29',NULL,NULL,NULL),
(789,'/','2025-11-03 09:49:34',NULL,NULL,NULL),
(790,'/login-admin','2025-11-03 09:49:37',NULL,NULL,NULL),
(791,'/blog','2025-11-03 09:49:53',NULL,NULL,NULL),
(792,'/blog','2025-11-03 09:51:55',NULL,NULL,NULL),
(793,'/blog','2025-11-03 09:51:55',NULL,NULL,NULL),
(794,'/login-admin','2025-11-03 09:52:03',NULL,NULL,NULL),
(795,'/contact','2025-11-03 09:52:05',NULL,NULL,NULL),
(796,'/blog','2025-11-03 09:52:08',NULL,NULL,NULL),
(797,'/partners','2025-11-03 09:52:09',NULL,NULL,NULL),
(798,'/partners','2025-11-03 09:54:44',NULL,NULL,NULL),
(799,'/partners','2025-11-03 09:54:44',NULL,NULL,NULL),
(800,'/partners','2025-11-03 10:02:18',NULL,NULL,NULL),
(801,'/partners','2025-11-03 10:02:18',NULL,NULL,NULL),
(802,'/login-admin','2025-11-03 11:26:18',NULL,NULL,NULL),
(803,'/login-admin','2025-11-03 12:46:27',NULL,NULL,NULL),
(804,'/login-admin','2025-11-03 12:46:44',NULL,NULL,NULL),
(805,'/login-admin','2025-11-03 12:46:47',NULL,NULL,NULL),
(806,'/login-admin','2025-11-03 12:46:48',NULL,NULL,NULL),
(807,'/','2025-11-03 12:46:55',NULL,NULL,NULL),
(808,'/services','2025-11-03 12:47:04',NULL,NULL,NULL),
(809,'/services','2025-11-03 12:49:28',NULL,NULL,NULL),
(810,'/services','2025-11-03 12:49:28',NULL,NULL,NULL),
(811,'/','2025-11-03 12:49:30',NULL,NULL,NULL),
(812,'/login-admin','2025-11-03 12:49:36',NULL,NULL,NULL),
(813,'/','2025-11-03 12:51:23',NULL,NULL,NULL),
(814,'/','2025-11-03 12:51:28',NULL,NULL,NULL),
(815,'/contact','2025-11-03 12:51:30',NULL,NULL,NULL),
(816,'/login-admin','2025-11-03 12:51:31',NULL,NULL,NULL),
(817,'/contact','2025-11-03 12:51:33',NULL,NULL,NULL),
(818,'/login-admin','2025-11-03 12:51:34',NULL,NULL,NULL),
(819,'/','2025-11-04 11:01:00',NULL,NULL,NULL),
(820,'/','2025-11-04 11:04:49',NULL,NULL,NULL),
(821,'/','2025-11-04 11:04:49',NULL,NULL,NULL),
(822,'/','2025-11-04 12:08:31',NULL,NULL,NULL),
(823,'/','2025-11-04 12:08:31',NULL,NULL,NULL),
(824,'/services','2025-11-04 12:12:21',NULL,NULL,NULL),
(825,'/','2025-11-04 12:12:25',NULL,NULL,NULL),
(826,'/','2025-11-04 13:30:26',NULL,NULL,NULL),
(827,'/','2025-11-04 13:30:26',NULL,NULL,NULL),
(828,'/blog','2025-11-04 13:30:39',NULL,NULL,NULL),
(829,'/login-admin','2025-11-04 13:30:43',NULL,NULL,NULL),
(830,'/','2025-11-04 13:30:46',NULL,NULL,NULL),
(831,'/','2025-11-04 13:36:48',NULL,NULL,NULL),
(832,'/','2025-11-04 13:36:48',NULL,NULL,NULL),
(833,'/training','2025-11-04 13:36:51',NULL,NULL,NULL),
(834,'/services','2025-11-04 13:37:05',NULL,NULL,NULL),
(835,'/training','2025-11-04 13:37:08',NULL,NULL,NULL),
(836,'/services','2025-11-04 13:37:11',NULL,NULL,NULL),
(837,'/about','2025-11-04 13:37:16',NULL,NULL,NULL),
(838,'/services','2025-11-04 13:37:17',NULL,NULL,NULL),
(839,'/training','2025-11-04 13:37:19',NULL,NULL,NULL),
(840,'/services','2025-11-04 13:37:25',NULL,NULL,NULL),
(841,'/services/1','2025-11-04 13:37:26',NULL,NULL,NULL),
(842,'/services','2025-11-04 13:37:34',NULL,NULL,NULL),
(843,'/partners','2025-11-04 13:37:36',NULL,NULL,NULL),
(844,'/blog','2025-11-04 13:38:28',NULL,NULL,NULL),
(845,'/contact','2025-11-04 13:38:31',NULL,NULL,NULL),
(846,'/login-admin','2025-11-04 13:38:57',NULL,NULL,NULL),
(847,'/login-admin','2025-11-04 13:38:59',NULL,NULL,NULL),
(848,'/','2025-11-04 15:03:20',NULL,NULL,NULL),
(849,'/','2025-11-04 15:03:20',NULL,NULL,NULL),
(850,'/','2025-11-04 15:08:18',NULL,NULL,NULL),
(851,'/','2025-11-04 15:08:18',NULL,NULL,NULL),
(852,'/','2025-11-04 15:10:51',NULL,NULL,NULL),
(853,'/','2025-11-04 15:10:51',NULL,NULL,NULL),
(854,'/services','2025-11-04 15:10:54',NULL,NULL,NULL),
(855,'/services/1','2025-11-04 15:10:55',NULL,NULL,NULL),
(856,'/services','2025-11-04 15:10:58',NULL,NULL,NULL),
(857,'/contact','2025-11-04 15:11:00',NULL,NULL,NULL),
(858,'/login-admin','2025-11-04 15:19:14',NULL,NULL,NULL),
(859,'/login-admin','2025-11-05 07:19:41',NULL,NULL,NULL),
(860,'/login-admin','2025-11-05 07:19:44',NULL,NULL,NULL),
(861,'/','2025-11-05 07:28:29',NULL,NULL,NULL),
(862,'/','2025-11-05 07:28:36',NULL,NULL,NULL),
(863,'/','2025-11-05 07:28:36',NULL,NULL,NULL),
(864,'/','2025-11-05 07:29:39',NULL,NULL,NULL),
(865,'/','2025-11-05 07:29:39',NULL,NULL,NULL),
(866,'/services','2025-11-05 07:30:49',NULL,NULL,NULL),
(867,'/services','2025-11-05 07:30:49',NULL,NULL,NULL),
(868,'/','2025-11-05 07:30:52',NULL,NULL,NULL),
(869,'/','2025-11-05 07:30:56',NULL,NULL,NULL),
(870,'/','2025-11-05 07:30:56',NULL,NULL,NULL),
(871,'/','2025-11-05 07:34:14',NULL,NULL,NULL),
(872,'/','2025-11-05 07:34:14',NULL,NULL,NULL),
(873,'/','2025-11-05 07:34:25',NULL,NULL,NULL),
(874,'/','2025-11-05 07:34:25',NULL,NULL,NULL),
(875,'/services','2025-11-05 07:34:46',NULL,NULL,NULL),
(876,'/services','2025-11-05 07:34:46',NULL,NULL,NULL),
(877,'/login-admin','2025-11-05 07:34:51',NULL,NULL,NULL),
(878,'/','2025-11-05 07:35:06',NULL,NULL,NULL),
(879,'/','2025-11-05 07:41:51',NULL,NULL,NULL),
(880,'/','2025-11-05 07:41:52',NULL,NULL,NULL),
(881,'/about','2025-11-05 07:41:54',NULL,NULL,NULL),
(882,'/','2025-11-05 07:41:55',NULL,NULL,NULL),
(883,'/about','2025-11-05 07:42:10',NULL,NULL,NULL),
(884,'/about','2025-11-05 07:42:10',NULL,NULL,NULL),
(885,'/services','2025-11-05 07:42:13',NULL,NULL,NULL),
(886,'/about','2025-11-05 07:42:23',NULL,NULL,NULL),
(887,'/services','2025-11-05 07:42:25',NULL,NULL,NULL),
(888,'/login-admin','2025-11-05 07:42:27',NULL,NULL,NULL),
(889,'/','2025-11-05 09:06:46',NULL,NULL,NULL),
(890,'/','2025-11-05 09:06:46',NULL,NULL,NULL),
(891,'/services','2025-11-05 09:07:01',NULL,NULL,NULL),
(892,'/services/5','2025-11-05 09:07:04',NULL,NULL,NULL),
(893,'/services','2025-11-05 09:08:54',NULL,NULL,NULL),
(894,'/training','2025-11-05 09:08:58',NULL,NULL,NULL),
(895,'/','2025-11-05 09:09:01',NULL,NULL,NULL),
(896,'/login-admin','2025-11-05 09:09:19',NULL,NULL,NULL),
(897,'/login-admin','2025-11-05 09:09:25',NULL,NULL,NULL),
(898,'/','2025-11-05 09:10:31',NULL,NULL,NULL),
(899,'/','2025-11-05 09:11:26',NULL,NULL,NULL),
(900,'/','2025-11-05 09:11:26',NULL,NULL,NULL),
(901,'/','2025-11-05 09:11:42',NULL,NULL,NULL),
(902,'/services','2025-11-05 09:11:45',NULL,NULL,NULL),
(903,'/services/5','2025-11-05 09:11:48',NULL,NULL,NULL),
(904,'/services','2025-11-05 09:11:51',NULL,NULL,NULL),
(905,'/services/2','2025-11-05 09:11:53',NULL,NULL,NULL),
(906,'/services/2','2025-11-05 09:13:19',NULL,NULL,NULL),
(907,'/services/2','2025-11-05 09:13:19',NULL,NULL,NULL),
(908,'/services','2025-11-05 09:13:22',NULL,NULL,NULL),
(909,'/services/1','2025-11-05 09:13:24',NULL,NULL,NULL),
(910,'/services/1','2025-11-05 09:14:18',NULL,NULL,NULL),
(911,'/services/1','2025-11-05 09:14:18',NULL,NULL,NULL),
(912,'/services','2025-11-05 09:14:21',NULL,NULL,NULL),
(913,'/services/1','2025-11-05 09:14:22',NULL,NULL,NULL),
(914,'/services/1','2025-11-05 09:16:19',NULL,NULL,NULL),
(915,'/services/1','2025-11-05 09:16:19',NULL,NULL,NULL),
(916,'/services','2025-11-05 09:16:22',NULL,NULL,NULL),
(917,'/services/1','2025-11-05 09:16:24',NULL,NULL,NULL),
(918,'/services','2025-11-05 09:19:32',NULL,NULL,NULL),
(919,'/services/1','2025-11-05 09:19:34',NULL,NULL,NULL),
(920,'/','2025-11-05 09:19:41',NULL,NULL,NULL),
(921,'/blog','2025-11-05 09:19:51',NULL,NULL,NULL),
(922,'/','2025-11-05 09:19:58',NULL,NULL,NULL),
(923,'/services','2025-11-05 09:20:03',NULL,NULL,NULL),
(924,'/services/1','2025-11-05 09:20:05',NULL,NULL,NULL),
(925,'/services/1','2025-11-05 09:24:49',NULL,NULL,NULL),
(926,'/services/1','2025-11-05 09:24:49',NULL,NULL,NULL),
(927,'/','2025-11-05 09:25:15',NULL,NULL,NULL),
(928,'/services','2025-11-05 09:25:19',NULL,NULL,NULL),
(929,'/services/1','2025-11-05 09:25:21',NULL,NULL,NULL),
(930,'/login-admin','2025-11-05 10:17:15',NULL,NULL,NULL),
(931,'/','2025-11-05 10:35:34',NULL,NULL,NULL),
(932,'/','2025-11-05 10:35:34',NULL,NULL,NULL),
(933,'/services','2025-11-05 10:35:42',NULL,NULL,NULL),
(934,'/services/1','2025-11-05 10:35:44',NULL,NULL,NULL),
(935,'/','2025-11-05 10:35:47',NULL,NULL,NULL),
(936,'/login-admin','2025-11-05 10:35:50',NULL,NULL,NULL),
(937,'/login-admin','2025-11-05 10:55:21',NULL,NULL,NULL),
(938,'/login-admin','2025-11-05 11:12:16',NULL,NULL,NULL),
(939,'/login-admin','2025-11-05 11:20:51',NULL,NULL,NULL),
(940,'/login-admin','2025-11-05 13:06:09',NULL,NULL,NULL),
(941,'/login-admin','2025-11-05 13:06:25',NULL,NULL,NULL),
(942,'/login-admin','2025-11-05 13:07:12',NULL,NULL,NULL),
(943,'/contact','2025-11-05 13:07:14',NULL,NULL,NULL),
(944,'/blog','2025-11-05 13:07:16',NULL,NULL,NULL),
(945,'/blog','2025-11-05 13:07:22',NULL,NULL,NULL),
(946,'/partners','2025-11-05 13:07:24',NULL,NULL,NULL),
(947,'/partners','2025-11-05 13:07:28',NULL,NULL,NULL),
(948,'/training','2025-11-05 13:07:29',NULL,NULL,NULL),
(949,'/services','2025-11-05 13:07:33',NULL,NULL,NULL),
(950,'/about','2025-11-05 13:07:34',NULL,NULL,NULL),
(951,'/','2025-11-05 13:07:40',NULL,NULL,NULL),
(952,'/','2025-11-05 13:07:42',NULL,NULL,NULL),
(953,'/login-admin','2025-11-05 13:07:48',NULL,NULL,NULL),
(954,'/login-admin','2025-11-05 13:13:41',NULL,NULL,NULL),
(955,'/','2025-11-05 13:13:44',NULL,NULL,NULL),
(956,'/login-admin','2025-11-05 13:13:46',NULL,NULL,NULL),
(957,'/','2025-11-05 13:13:53',NULL,NULL,NULL),
(958,'/login-admin','2025-11-05 13:14:46',NULL,NULL,NULL),
(959,'/login-admin','2025-11-05 13:55:05',NULL,NULL,NULL),
(960,'/','2025-11-06 08:26:21',NULL,NULL,NULL),
(961,'/','2025-11-06 08:26:21',NULL,NULL,NULL),
(962,'/login-admin','2025-11-06 08:26:27',NULL,NULL,NULL),
(963,'/','2025-11-06 08:26:29',NULL,NULL,NULL),
(964,'/login-admin','2025-11-06 08:26:42',NULL,NULL,NULL),
(965,'/','2025-11-06 09:16:04',NULL,NULL,NULL),
(966,'/','2025-11-06 09:16:04',NULL,NULL,NULL),
(967,'/login-admin','2025-11-06 09:16:17',NULL,NULL,NULL),
(968,'/login-admin','2025-11-06 10:18:40',NULL,NULL,NULL),
(969,'/','2025-11-06 10:18:42',NULL,NULL,NULL),
(970,'/login-admin','2025-11-06 10:18:48',NULL,NULL,NULL),
(971,'/login-admin','2025-11-06 11:50:49',NULL,NULL,NULL),
(972,'/login-admin','2025-11-06 11:51:18',NULL,NULL,NULL),
(973,'/login-admin','2025-11-06 11:51:18',NULL,NULL,NULL),
(974,'/login-admin','2025-11-06 12:06:39',NULL,NULL,NULL),
(975,'/','2025-11-06 12:06:41',NULL,NULL,NULL),
(976,'/login-admin','2025-11-06 12:06:44',NULL,NULL,NULL),
(977,'/','2025-11-06 12:07:05',NULL,NULL,NULL),
(978,'/','2025-11-06 12:07:18',NULL,NULL,NULL),
(979,'/about','2025-11-06 12:07:19',NULL,NULL,NULL),
(980,'/services','2025-11-06 12:08:06',NULL,NULL,NULL),
(981,'/training','2025-11-06 12:08:10',NULL,NULL,NULL),
(982,'/partners','2025-11-06 12:08:26',NULL,NULL,NULL),
(983,'/blog','2025-11-06 12:08:57',NULL,NULL,NULL),
(984,'/contact','2025-11-06 12:09:03',NULL,NULL,NULL),
(985,'/login-admin','2025-11-06 12:09:28',NULL,NULL,NULL),
(986,'/login-admin','2025-11-06 12:09:39',NULL,NULL,NULL),
(987,'/','2025-11-06 12:40:15',NULL,NULL,NULL),
(988,'/','2025-11-06 12:40:15',NULL,NULL,NULL),
(989,'/login-admin','2025-11-06 12:40:38',NULL,NULL,NULL),
(990,'/partners','2025-11-06 13:09:47',NULL,NULL,NULL),
(991,'/contact','2025-11-06 13:10:16',NULL,NULL,NULL),
(992,'/login-admin','2025-11-06 13:10:46',NULL,NULL,NULL),
(993,'/login-admin','2025-11-06 13:11:17',NULL,NULL,NULL),
(994,'/','2025-11-06 13:11:21',NULL,NULL,NULL),
(995,'/contact','2025-11-06 13:12:36',NULL,NULL,NULL),
(996,'/contact','2025-11-06 13:15:38',NULL,NULL,NULL),
(997,'/contact','2025-11-06 13:15:38',NULL,NULL,NULL),
(998,'/contact','2025-11-06 13:16:09',NULL,NULL,NULL),
(999,'/contact','2025-11-06 13:16:09',NULL,NULL,NULL),
(1000,'/contact','2025-11-06 13:18:45',NULL,NULL,NULL),
(1001,'/contact','2025-11-06 13:18:45',NULL,NULL,NULL),
(1002,'/','2025-11-06 13:36:30',NULL,NULL,NULL),
(1003,'/','2025-11-06 13:52:28',NULL,NULL,NULL),
(1004,'/','2025-11-06 13:53:05',NULL,NULL,NULL),
(1005,'/','2025-11-06 13:53:06',NULL,NULL,NULL),
(1006,'/','2025-11-06 13:53:20',NULL,NULL,NULL),
(1007,'/','2025-11-06 13:53:20',NULL,NULL,NULL),
(1008,'/','2025-11-06 13:53:30',NULL,NULL,NULL),
(1009,'/','2025-11-06 13:53:30',NULL,NULL,NULL),
(1010,'/','2025-11-06 15:00:17',NULL,NULL,NULL),
(1011,'/','2025-11-06 15:00:17',NULL,NULL,NULL),
(1012,'/services/1','2025-11-06 15:07:10',NULL,NULL,NULL),
(1013,'/services','2025-11-06 15:07:12',NULL,NULL,NULL),
(1014,'/','2025-11-06 15:07:18',NULL,NULL,NULL),
(1015,'/services/1','2025-11-06 15:08:22',NULL,NULL,NULL),
(1016,'/services','2025-11-06 15:08:24',NULL,NULL,NULL),
(1017,'/services/1','2025-11-06 15:08:26',NULL,NULL,NULL),
(1018,'/','2025-11-06 15:08:29',NULL,NULL,NULL),
(1019,'/login-admin','2025-11-06 15:10:37',NULL,NULL,NULL),
(1020,'/','2025-11-06 15:11:53',NULL,NULL,NULL),
(1021,'/services/1','2025-11-06 15:14:50',NULL,NULL,NULL),
(1022,'/services','2025-11-06 15:14:52',NULL,NULL,NULL),
(1023,'/','2025-11-06 15:16:12',NULL,NULL,NULL),
(1024,'/login-admin','2025-11-06 15:21:50',NULL,NULL,NULL),
(1025,'/','2025-11-06 15:22:46',NULL,NULL,NULL),
(1026,'/login-admin','2025-11-06 15:23:00',NULL,NULL,NULL),
(1027,'/','2025-11-06 15:28:51',NULL,NULL,NULL),
(1028,'/','2025-11-07 05:31:50',NULL,NULL,NULL),
(1029,'/','2025-11-07 05:31:50',NULL,NULL,NULL),
(1030,'/','2025-11-07 05:44:17',NULL,NULL,NULL),
(1031,'/','2025-11-07 05:44:17',NULL,NULL,NULL),
(1032,'/login-admin','2025-11-07 05:44:38',NULL,NULL,NULL),
(1033,'/','2025-11-07 05:46:50',NULL,NULL,NULL),
(1034,'/login-admin','2025-11-07 05:53:49',NULL,NULL,NULL),
(1035,'/','2025-11-07 05:54:23',NULL,NULL,NULL),
(1036,'/login-admin','2025-11-07 06:10:47',NULL,NULL,NULL),
(1037,'/','2025-11-07 06:11:41',NULL,NULL,NULL),
(1038,'/login-admin','2025-11-07 06:15:43',NULL,NULL,NULL),
(1039,'/','2025-11-07 06:17:19',NULL,NULL,NULL),
(1040,'/login-admin','2025-11-07 06:42:10',NULL,NULL,NULL),
(1041,'/','2025-11-07 06:45:09',NULL,NULL,NULL),
(1042,'/login-admin','2025-11-07 06:45:17',NULL,NULL,NULL),
(1043,'/','2025-11-07 06:45:55',NULL,NULL,NULL),
(1044,'/login-admin','2025-11-07 06:47:23',NULL,NULL,NULL),
(1045,'/','2025-11-07 06:48:41',NULL,NULL,NULL),
(1046,'/login-admin','2025-11-07 06:48:47',NULL,NULL,NULL),
(1047,'/','2025-11-07 06:53:14',NULL,NULL,NULL),
(1048,'/','2025-11-07 08:59:52',NULL,NULL,NULL),
(1049,'/','2025-11-07 08:59:52',NULL,NULL,NULL),
(1050,'/login-admin','2025-11-07 08:59:57',NULL,NULL,NULL),
(1051,'/','2025-11-07 09:00:01',NULL,NULL,NULL),
(1052,'/','2025-11-07 09:00:54',NULL,NULL,NULL),
(1053,'/','2025-11-07 09:00:55',NULL,NULL,NULL),
(1054,'/about','2025-11-07 09:00:57',NULL,NULL,NULL),
(1055,'/services','2025-11-07 09:00:59',NULL,NULL,NULL),
(1056,'/training','2025-11-07 09:01:00',NULL,NULL,NULL),
(1057,'/partners','2025-11-07 09:01:03',NULL,NULL,NULL),
(1058,'/contact','2025-11-07 09:01:07',NULL,NULL,NULL),
(1059,'/','2025-11-07 09:01:12',NULL,NULL,NULL),
(1060,'/services','2025-11-07 09:01:23',NULL,NULL,NULL),
(1061,'/login-admin','2025-11-07 09:01:32',NULL,NULL,NULL),
(1062,'/','2025-11-07 09:01:41',NULL,NULL,NULL),
(1063,'/login-admin','2025-11-07 09:01:43',NULL,NULL,NULL);
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-07 12:56:50

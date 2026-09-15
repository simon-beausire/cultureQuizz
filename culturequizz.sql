-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: mon_projet_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `categorie` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_categorie_unique` (`categorie`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (4,'Arts et Littérature'),(2,'Géographie'),(1,'Histoire'),(3,'Sciences'),(5,'Sport');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2026_09_15_000001_create_categories_table',1),(6,'2026_09_15_000002_create_questions_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `categorie` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse2` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse3` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse4` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse5` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse6` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse7` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse8` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse9` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reponse10` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_categorie_foreign` (`categorie`),
  CONSTRAINT `questions_categorie_foreign` FOREIGN KEY (`categorie`) REFERENCES `categories` (`categorie`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'Histoire','En quelle année a eu lieu la prise de la Bastille ?','1789','1792','1776','1815','1799','1804','1830','1848','1774','1793'),(2,'Histoire','Qui a été le premier empereur des Français ?','Napoléon Ier','Louis XVI','Charlemagne','Napoléon III','Louis XIV','Charles de Gaulle','Henri IV','François Ier','Louis-Philippe','Jules César'),(3,'Histoire','En quelle année a commencé la Première Guerre mondiale ?','1914','1918','1939','1905','1912','1916','1870','1920','1911','1945'),(4,'Histoire','Quelle civilisation a construit le Machu Picchu ?','Les Incas','Les Aztèques','Les Mayas','Les Olmèques','Les Toltèques','Les Égyptiens','Les Romains','Les Khmers','Les Zapotèques','Les Mochicas'),(5,'Histoire','Qui a été la première femme à recevoir un prix Nobel ?','Marie Curie','Rosalind Franklin','Ada Lovelace','Simone Veil','Florence Nightingale','Lise Meitner','George Sand','Louise Michel','Olympe de Gouges','Hypatie'),(6,'Histoire','En quelle année l\'homme a-t-il marché sur la Lune pour la première fois ?','1969','1965','1972','1957','1961','1975','1967','1981','1959','1971'),(7,'Histoire','Quel mur est tombé en 1989 ?','Le mur de Berlin','Le mur d\'Hadrien','Le mur des Lamentations','La ligne Maginot','Le mur de Varsovie','Le mur de Belfast','Le mur de Vienne','Le mur de Prague','Le mur de Moscou','Le mur de Budapest'),(8,'Histoire','Quel pharaon est célèbre pour son tombeau découvert presque intact en 1922 ?','Toutânkhamon','Ramsès II','Khéops','Akhenaton','Séthi Ier','Khéphren','Amenhotep III','Thoutmôsis III','Mykérinos','Hatchepsout'),(9,'Histoire','Quel navigateur a atteint l\'Amérique en 1492 ?','Christophe Colomb','Vasco de Gama','Fernand de Magellan','Amerigo Vespucci','Jacques Cartier','Marco Polo','James Cook','Hernán Cortés','Francisco Pizarro','Bartolomeu Dias'),(10,'Histoire','En quelle année les Françaises ont-elles voté pour la première fois ?','1945','1936','1918','1958','1968','1901','1920','1950','1929','1848'),(11,'Histoire','Quelle ville était la capitale de l\'Empire byzantin ?','Constantinople','Rome','Athènes','Alexandrie','Antioche','Jérusalem','Venise','Carthage','Damas','Babylone'),(12,'Histoire','Quel roi de France était surnommé le Roi-Soleil ?','Louis XIV','Louis XIII','Louis XV','Louis XVI','Henri IV','François Ier','Charles VII','Philippe le Bel','Louis IX','Charles X'),(13,'Géographie','Quelle est la capitale de l\'Australie ?','Canberra','Sydney','Melbourne','Brisbane','Perth','Adélaïde','Darwin','Hobart','Auckland','Wellington'),(14,'Géographie','Quel est le plus long fleuve de France ?','La Loire','La Seine','Le Rhône','La Garonne','La Dordogne','La Somme','La Charente','L\'Adour','La Vilaine','L\'Escaut'),(15,'Géographie','Quel est le plus grand océan du monde ?','L\'océan Pacifique','L\'océan Atlantique','L\'océan Indien','L\'océan Arctique','L\'océan Austral','La mer Méditerranée','La mer des Caraïbes','La mer de Chine méridionale','La mer d\'Arabie','La mer de Béring'),(16,'Géographie','Quel est le plus haut sommet du monde ?','L\'Everest','Le K2','Le Kangchenjunga','Le mont Blanc','Le Kilimandjaro','L\'Aconcagua','Le Denali','Le mont Elbrouz','Le Lhotse','Le Makalu'),(17,'Géographie','Dans quel pays se trouve la ville de Marrakech ?','Le Maroc','L\'Algérie','La Tunisie','L\'Égypte','La Libye','La Mauritanie','Le Sénégal','Le Mali','La Jordanie','Le Liban'),(18,'Géographie','Quelle est la capitale du Canada ?','Ottawa','Toronto','Montréal','Vancouver','Québec','Calgary','Edmonton','Winnipeg','Halifax','Victoria'),(19,'Géographie','Quel est le plus grand désert chaud du monde ?','Le Sahara','Le désert de Gobi','Le Kalahari','Le désert d\'Atacama','Le Namib','Le désert de Mojave','Le désert d\'Arabie','Le désert de Sonora','Le désert du Thar','Le Grand Désert de Victoria'),(20,'Géographie','Combien d\'États membres compte l\'Union européenne depuis le Brexit ?','27','28','25','26','30','24','29','15','32','20'),(21,'Géographie','Quel est le plus grand pays du monde par sa superficie ?','La Russie','Le Canada','La Chine','Les États-Unis','Le Brésil','L\'Australie','L\'Inde','L\'Argentine','Le Kazakhstan','L\'Algérie'),(22,'Géographie','Quelle mer borde la ville de Marseille ?','La mer Méditerranée','La Manche','La mer du Nord','L\'océan Atlantique','La mer Baltique','La mer Noire','La mer Rouge','La mer Adriatique','La mer Égée','La mer Tyrrhénienne'),(23,'Géographie','Quelle est la capitale du Japon ?','Tokyo','Kyoto','Osaka','Séoul','Pékin','Hiroshima','Nagoya','Sapporo','Yokohama','Shanghai'),(24,'Géographie','Quel fleuve traverse Paris ?','La Seine','La Loire','Le Rhône','La Garonne','Le Rhin','La Somme','La Meuse','La Moselle','La Dordogne','Le Danube'),(25,'Sciences','Quel est le symbole chimique de l\'or ?','Au','Ag','Or','Fe','Pb','Cu','Go','Hg','Pt','Zn'),(26,'Sciences','Quelle planète est la plus proche du Soleil ?','Mercure','Vénus','La Terre','Mars','Jupiter','Saturne','Uranus','Neptune','Pluton','La Lune'),(27,'Sciences','Combien d\'os compte le squelette d\'un adulte humain ?','206','196','212','250','180','300','226','150','108','186'),(28,'Sciences','Quelle est la formule chimique de l\'eau ?','H2O','CO2','H2O2','O2','HO','H3O','NaCl','CH4','NH3','H2'),(29,'Sciences','Quel scientifique a formulé la théorie de la relativité générale ?','Albert Einstein','Isaac Newton','Galilée','Niels Bohr','Max Planck','Stephen Hawking','Nikola Tesla','Marie Curie','Charles Darwin','Louis Pasteur'),(30,'Sciences','Quelle est la vitesse approximative de la lumière dans le vide ?','300 000 km/s','30 000 km/s','3 000 km/s','150 000 km/s','1 000 000 km/s','340 m/s','3 000 000 km/s','30 km/s','100 000 km/s','500 000 km/s'),(31,'Sciences','Quel organe du corps humain produit l\'insuline ?','Le pancréas','Le foie','Les reins','L\'estomac','La rate','Le cœur','La thyroïde','Les poumons','La vésicule biliaire','L\'intestin grêle'),(32,'Sciences','Quel gaz les plantes absorbent-elles pour réaliser la photosynthèse ?','Le dioxyde de carbone','L\'oxygène','L\'azote','L\'hydrogène','L\'hélium','Le méthane','L\'argon','L\'ozone','Le monoxyde de carbone','Le néon'),(33,'Sciences','Qui a mis au point le premier vaccin contre la rage ?','Louis Pasteur','Edward Jenner','Robert Koch','Alexander Fleming','Marie Curie','Claude Bernard','Albert Calmette','Jonas Salk','Ignace Semmelweis','Hippocrate'),(34,'Sciences','Quelle est la plus grande planète du système solaire ?','Jupiter','Saturne','Neptune','Uranus','La Terre','Mars','Vénus','Mercure','Pluton','Le Soleil'),(35,'Sciences','À quelle température l\'eau bout-elle au niveau de la mer ?','100 °C','90 °C','80 °C','120 °C','50 °C','70 °C','0 °C','110 °C','150 °C','37 °C'),(36,'Sciences','Combien de chromosomes possède une cellule humaine normale (hors gamètes) ?','46','23','44','48','42','22','50','24','36','64'),(37,'Arts et Littérature','Qui a peint La Joconde ?','Léonard de Vinci','Michel-Ange','Raphaël','Botticelli','Titien','Rembrandt','Vermeer','Caravage','Pablo Picasso','Claude Monet'),(38,'Arts et Littérature','Qui a écrit Les Misérables ?','Victor Hugo','Émile Zola','Honoré de Balzac','Gustave Flaubert','Alexandre Dumas','Stendhal','Guy de Maupassant','Jules Verne','Charles Baudelaire','Molière'),(39,'Arts et Littérature','Quel peintre s\'est coupé une partie de l\'oreille en 1888 ?','Vincent van Gogh','Paul Gauguin','Claude Monet','Paul Cézanne','Salvador Dalí','Pablo Picasso','Auguste Renoir','Edgar Degas','Henri Matisse','Henri de Toulouse-Lautrec'),(40,'Arts et Littérature','Qui a écrit Le Petit Prince ?','Antoine de Saint-Exupéry','Jules Verne','Albert Camus','Marcel Pagnol','Jean de La Fontaine','Charles Perrault','Victor Hugo','Jacques Prévert','Alexandre Dumas','Marcel Proust'),(41,'Arts et Littérature','Quel compositeur a écrit l\'opéra La Flûte enchantée ?','Wolfgang Amadeus Mozart','Ludwig van Beethoven','Jean-Sébastien Bach','Antonio Vivaldi','Frédéric Chopin','Giuseppe Verdi','Richard Wagner','Joseph Haydn','Franz Schubert','Piotr Ilitch Tchaïkovski'),(42,'Arts et Littérature','Quel dramaturge a écrit Roméo et Juliette ?','William Shakespeare','Molière','Jean Racine','Pierre Corneille','Goethe','Oscar Wilde','Victor Hugo','Christopher Marlowe','Beaumarchais','Anton Tchekhov'),(43,'Arts et Littérature','Quel peintre a réalisé le tableau « Impression, soleil levant » ?','Claude Monet','Édouard Manet','Auguste Renoir','Edgar Degas','Paul Cézanne','Vincent van Gogh','Gustave Courbet','Eugène Delacroix','Paul Gauguin','Georges Seurat'),(44,'Arts et Littérature','Quel auteur français a écrit la fable « Le Corbeau et le Renard » ?','Jean de La Fontaine','Charles Perrault','Molière','Jean Racine','Nicolas Boileau','François Rabelais','Voltaire','Michel de Montaigne','Jean-Jacques Rousseau','Pierre Corneille'),(45,'Arts et Littérature','Quel artiste espagnol a peint Guernica ?','Pablo Picasso','Salvador Dalí','Joan Miró','Francisco de Goya','Diego Velázquez','Le Greco','Antoni Gaudí','Bartolomé Murillo','Joaquín Sorolla','Juan Gris'),(46,'Arts et Littérature','Quel compositeur a écrit la symphonie dont est tiré l\'« Hymne à la joie » ?','Ludwig van Beethoven','Wolfgang Amadeus Mozart','Jean-Sébastien Bach','Joseph Haydn','Johannes Brahms','Franz Schubert','Gustav Mahler','Antonín Dvořák','Frédéric Chopin','Franz Liszt'),(47,'Arts et Littérature','Quel écrivain a créé le personnage de Sherlock Holmes ?','Arthur Conan Doyle','Agatha Christie','Maurice Leblanc','Edgar Allan Poe','Charles Dickens','Georges Simenon','Jules Verne','H. G. Wells','Oscar Wilde','Gaston Leroux'),(48,'Arts et Littérature','Quel sculpteur a réalisé « Le Penseur » ?','Auguste Rodin','Camille Claudel','Michel-Ange','Auguste Bartholdi','Donatello','Alberto Giacometti','Le Bernin','Constantin Brancusi','Aristide Maillol','César'),(49,'Sport','Combien de joueurs composent une équipe de football sur le terrain ?','11','10','9','12','7','6','15','8','13','5'),(50,'Sport','Quelle ville a accueilli les Jeux olympiques d\'été de 2024 ?','Paris','Los Angeles','Tokyo','Londres','Rome','Madrid','Berlin','Pékin','Sydney','Rio de Janeiro'),(51,'Sport','Quel pays a remporté la Coupe du monde de football 2018 ?','La France','La Croatie','L\'Allemagne','Le Brésil','L\'Argentine','L\'Espagne','La Belgique','L\'Angleterre','L\'Italie','Le Portugal'),(52,'Sport','Combien de temps dure un match de rugby à XV, hors prolongations ?','80 minutes','90 minutes','60 minutes','70 minutes','100 minutes','40 minutes','120 minutes','85 minutes','75 minutes','50 minutes'),(53,'Sport','Quel tournoi du Grand Chelem se joue sur terre battue à Paris ?','Roland-Garros','Wimbledon','L\'US Open','L\'Open d\'Australie','Le Masters de Monte-Carlo','La Coupe Davis','Indian Wells','Le tournoi du Queen\'s','Le Masters de Miami','L\'Open de Madrid'),(54,'Sport','Combien d\'anneaux figurent sur le drapeau olympique ?','5','4','6','7','3','8','10','9','2','12'),(55,'Sport','Quel sport pratique Teddy Riner ?','Le judo','Le karaté','La lutte','La boxe','Le rugby','Le taekwondo','Le sumo','L\'escrime','L\'haltérophilie','L\'aïkido'),(56,'Sport','Dans quel sport utilise-t-on un volant ?','Le badminton','Le tennis','Le squash','Le tennis de table','Le padel','Le cricket','Le hockey','Le golf','Le baseball','Le volley-ball'),(57,'Sport','Quelle course cycliste se termine traditionnellement sur les Champs-Élysées ?','Le Tour de France','Le Tour d\'Italie','Le Tour d\'Espagne','Paris-Roubaix','Milan-San Remo','Le Tour des Flandres','Liège-Bastogne-Liège','Paris-Nice','Le Critérium du Dauphiné','Le Tour de Suisse'),(58,'Sport','Quel athlète détient le record du monde masculin du 100 mètres ?','Usain Bolt','Carl Lewis','Tyson Gay','Yohan Blake','Asafa Powell','Justin Gatlin','Maurice Greene','Christophe Lemaitre','Noah Lyles','Ben Johnson'),(59,'Sport','Combien de trous compte un parcours de golf standard ?','18','9','12','16','20','24','10','14','21','36'),(60,'Sport','Quel club de football est surnommé « les Gones » ?','L\'Olympique lyonnais','L\'Olympique de Marseille','Le Paris Saint-Germain','L\'AS Saint-Étienne','Les Girondins de Bordeaux','Le LOSC Lille','Le RC Lens','Le FC Nantes','Le Stade rennais','L\'AS Monaco');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-15 15:15:53

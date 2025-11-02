-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: online_edu
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `admin_one_adminuser`
--

DROP TABLE IF EXISTS `admin_one_adminuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_one_adminuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_one_adminuser`
--

LOCK TABLES `admin_one_adminuser` WRITE;
/*!40000 ALTER TABLE `admin_one_adminuser` DISABLE KEYS */;
INSERT INTO `admin_one_adminuser` VALUES (2,'suresh169073@gmail.com','pbkdf2_sha256$1000000$kaK71DYTCd7ZKM9CTiyj2g$35clOIkiREWFCmVqaubnsH0xRVjo7Qnm+lf+zLRpHzo=');
/*!40000 ALTER TABLE `admin_one_adminuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission_sessions`
--

DROP TABLE IF EXISTS `admission_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admission_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admission_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admission_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admission_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admission_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opening_date` date NOT NULL,
  `closing_date` date NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `max_applications` int NOT NULL,
  `current_applications` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admission_code` (`admission_code`),
  UNIQUE KEY `admission_key` (`admission_key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission_sessions`
--

LOCK TABLES `admission_sessions` WRITE;
/*!40000 ALTER TABLE `admission_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `admission_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allcourses`
--

DROP TABLE IF EXISTS `allcourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allcourses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_short_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_semesters` int NOT NULL,
  `num_years` int NOT NULL,
  `course_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `degree` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_fee` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allcourses`
--

LOCK TABLES `allcourses` WRITE;
/*!40000 ALTER TABLE `allcourses` DISABLE KEYS */;
/*!40000 ALTER TABLE `allcourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_application`
--

DROP TABLE IF EXISTS `api_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_application` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode_of_study` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `programme_applied` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medium` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deb_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abc_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_initial` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhaar_no` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_as_aadhaar` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_selected` tinyint(1) NOT NULL,
  `guardian_selected` tinyint(1) NOT NULL,
  `father_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_occupation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_occupation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_occupation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `community` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_tongue` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `differently_abled` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disability_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_group` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `access_internet` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comm_pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comm_district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comm_state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comm_country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comm_town` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comm_area` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `same_as_comm` tinyint(1) NOT NULL,
  `perm_pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perm_district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perm_state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perm_country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perm_town` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perm_area` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_application`
--

LOCK TABLES `api_application` WRITE;
/*!40000 ALTER TABLE `api_application` DISABLE KEYS */;
INSERT INTO `api_application` VALUES (1,'suresh169073@gmail.com','ODL','Postgraduate','MCA',NULL,'2025-2026','123','12345','Suresh G','2025-10-22','Male','297297521022','Suresh G',1,0,'Gopal','Farmer','Selvi','House Wife',NULL,NULL,'Indian','Hindu','BC','Tamil','Yes','Dysgraphia','B+','Yes','636111','Salem','Tamil Nadu','India','Salem, Tamil Nadu','Rural',1,'636111','Salem','Tamil Nadu','India','Salem, Tamil Nadu','Rural','P','Completed',1,1);
/*!40000 ALTER TABLE `api_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_marksheet_uploads`
--

DROP TABLE IF EXISTS `api_marksheet_uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_marksheet_uploads` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualification_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_marksheet_uploads_student_id_6c4f6541` (`student_id`)
) ENGINE=MyISAM AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_marksheet_uploads`
--

LOCK TABLES `api_marksheet_uploads` WRITE;
/*!40000 ALTER TABLE `api_marksheet_uploads` DISABLE KEYS */;
INSERT INTO `api_marksheet_uploads` VALUES (1,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.KALAI.pdf','2025-10-30 07:33:00.012153',1),(2,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.SAI.pdf','2025-10-30 07:33:23.285626',1),(3,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_fsdex7.SAI.pdf','2025-10-30 07:34:04.928673',1),(4,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.SAI.pdf','2025-10-30 07:34:25.534166',1),(5,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.KALAI.pdf','2025-10-30 07:34:40.604918',1),(6,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_fsdex7.KALAI.pdf','2025-10-30 07:43:30.987225',1),(7,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.SAI.pdf','2025-10-30 07:44:11.199352',1),(8,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.KALAI.pdf','2025-10-30 07:44:31.310471',1),(9,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_fsdex7.KALAI.pdf','2025-10-30 07:51:17.212377',1),(10,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.KALAI.pdf','2025-10-30 07:51:43.656571',1),(11,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.KALAI.pdf','2025-10-30 07:52:15.300338',1),(12,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_fsdex7.KALAI.pdf','2025-10-30 07:56:01.246983',1),(13,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.SAI.pdf','2025-10-30 07:56:47.478548',1),(14,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.KALAI.pdf','2025-10-30 07:57:25.514758',1),(15,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_fsdex7.KALAI.pdf','2025-10-30 08:05:03.706639',1),(16,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.KALAI.pdf','2025-10-30 08:05:27.116930',1),(17,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.KALAI.pdf','2025-10-30 08:05:50.776533',1),(18,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_fsdex7.KALAI.pdf','2025-10-30 08:10:38.334003',1),(19,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_fsdex7.KALAI.pdf','2025-10-30 08:10:57.129399',1),(20,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.SAI.pdf','2025-10-30 08:11:08.249454',1),(21,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','2025-10-30 08:44:58.213000',1),(22,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.KALAI.pdf','2025-10-30 08:45:03.731882',1),(23,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-30 08:45:11.406418',1),(24,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','2025-10-30 09:19:34.616887',1),(25,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_application.pdf','2025-10-30 09:20:15.665285',1),(26,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-30 09:20:23.527427',1),(27,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','2025-10-30 11:06:16.393546',1),(28,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_fsdex7.KALAI.pdf','2025-10-30 11:09:23.424354',1),(29,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-30 11:10:49.632116',1),(30,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','2025-10-30 14:48:41.937551',1),(31,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_application.pdf','2025-10-30 14:48:55.356274',1),(32,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-30 14:49:11.425298',1),(33,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-30 15:03:30.820576',1),(34,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-30 15:47:22.315596',1),(35,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-30 18:18:37.716251',1),(36,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','2025-10-30 18:19:20.028079',1),(37,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_application.pdf','2025-10-30 18:19:29.148251',1),(38,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-31 05:14:06.211098',1),(39,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_application.pdf','2025-10-31 05:15:00.357018',1),(40,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','2025-10-31 05:15:23.329267',1),(41,'suresh169073@gmail.com','S.S.L.C','/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','2025-10-31 10:55:14.654555',1),(42,'suresh169073@gmail.com','HSC','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_application.pdf','2025-10-31 10:55:19.236344',1),(43,'suresh169073@gmail.com','UG Provisional','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf','2025-10-31 10:55:22.748933',1);
/*!40000 ALTER TABLE `api_marksheet_uploads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_student`
--

DROP TABLE IF EXISTS `api_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_student` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `api_student_user_id_8e5f9cbd` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_student`
--

LOCK TABLES `api_student` WRITE;
/*!40000 ALTER TABLE `api_student` DISABLE KEYS */;
INSERT INTO `api_student` VALUES (1,'Suresh G','suresh169073@gmail.com','8248649356',1,'Suresh2004',1);
/*!40000 ALTER TABLE `api_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_studentdetails`
--

DROP TABLE IF EXISTS `api_studentdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_studentdetails` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_initial` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualifications` json NOT NULL,
  `semester_marks` json NOT NULL,
  `total_max_marks` double DEFAULT NULL,
  `total_obtained_marks` double DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `cgpa` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `overall_grade` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `class_obtained` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_designation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_institute` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years_experience` double DEFAULT NULL,
  `annual_income` double DEFAULT NULL,
  `sslc_marksheet_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hsc_marksheet_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ug_marksheet_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `semester_marksheet_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signature_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `community_certificate_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhaar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transfer_certificate_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_studentdetails_user_id_d6dbdf35` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_studentdetails`
--

LOCK TABLES `api_studentdetails` WRITE;
/*!40000 ALTER TABLE `api_studentdetails` DISABLE KEYS */;
INSERT INTO `api_studentdetails` VALUES (1,'suresh169073@gmail.com','Suresh G','[{\"board\": \"State Board\", \"course\": \"S.S.L.C\", \"reg_no\": \"6649667\", \"month_year\": \"09/2025\", \"percentage\": 98, \"mode_of_study\": \"Regular\", \"institute_name\": \"GOVT SCHOOL\", \"subject_studied\": \"TAMIL,ENG,SCIENCE\"}, {\"board\": \"CBSE\", \"course\": \"HSC\", \"reg_no\": \"6649667\", \"month_year\": \"05/2025\", \"percentage\": 88, \"mode_of_study\": \"Distance\", \"institute_name\": \"GOVT SCHOOL\", \"subject_studied\": \"TAMIL,ENG,SCIENCE\"}, {\"course\": \"UG\", \"reg_no\": \"6649667\", \"month_year\": \"02/2025\", \"percentage\": 76, \"university\": \"University of Madras\", \"mode_of_study\": \"Distance\", \"institute_name\": \"GOVT SCHOOL\", \"subject_studied\": \"TAMIL,ENG,SCIENCE\"}]','[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/media/student_documents/suresh169073_at_gmail_com/SSLC/suresh169073_at_gmail_com_S.S.L.C_application.pdf','/media/student_documents/suresh169073_at_gmail_com/HSC/suresh169073_at_gmail_com_HSC_application.pdf','/media/student_documents/suresh169073_at_gmail_com/UG/suresh169073_at_gmail_com_UG Provisional_application.pdf',NULL,'/media/student_documents/suresh169073_at_gmail_com/Photo/suresh169073_at_gmail_com_photo_G.jpg','/media/student_documents/suresh169073_at_gmail_com/Signature/suresh169073_at_gmail_com_signature_G1.jpg','/media/student_documents/suresh169073_at_gmail_com/Community_Certificate/suresh169073_at_gmail_com_community_certificate_fsdex7.KALAI.pdf','/media/student_documents/suresh169073_at_gmail_com/Aadhar_Card/suresh169073_at_gmail_com_aadhar_card_fsdex7.KALAI.pdf','/media/student_documents/suresh169073_at_gmail_com/Transfer_Certificate/suresh169073_at_gmail_com_transfer_certificate_fsdex7.KALAI.pdf',1);
/*!40000 ALTER TABLE `api_studentdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_status`
--

DROP TABLE IF EXISTS `application_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_status` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` longtext COLLATE utf8mb4_unicode_ci,
  `updated_at` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_id` (`application_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_status`
--

LOCK TABLES `application_status` WRITE;
/*!40000 ALTER TABLE `application_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `application_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `affected_model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `affected_record_id` int DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_admin_email` (`admin_email`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=302 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_063356.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:03:57','success'),(2,'suresh169073@gmail.com','CREATE_BACKUP','Backup failed: \'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:03:57','failed'),(3,'suresh169073@gmail.com','CREATE_LSC_ADMIN','Created LSC Admin: LC2101 - CDOE - Centre for Distance and Online Education','LSCAdmin',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:48:26','success'),(4,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:50:00','success'),(5,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:50:02','success'),(6,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:50:35','success'),(7,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:50:36','success'),(8,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:50:37','success'),(9,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:50:41','success'),(10,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:11','success'),(11,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:13','success'),(12,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:13','success'),(13,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:35','success'),(14,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:37','success'),(15,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:37','success'),(16,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:55','success'),(17,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:57','success'),(18,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:51:58','success'),(19,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:52:00','success'),(20,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:53:38','success'),(21,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 01:53:47','success'),(22,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:00:15','success'),(23,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:00:16','success'),(24,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:00:17','success'),(25,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:01:41','success'),(26,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:04:28','success'),(27,'suresh169073@gmail.com','database_info','Retrieved structure for table: lsc_admins',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:04:37','success'),(28,'suresh169073@gmail.com','database_info','Retrieved structure for table: feepayment',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:04:52','success'),(29,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:05:06','success'),(30,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:05:15','success'),(31,'suresh169073@gmail.com','email_config','Sent test email to suresh169073@gmail.com',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:05:36','success'),(32,'suresh169073@gmail.com','maintenance','Optimized 25 database tables',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:05:46','success'),(33,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:05:49','success'),(34,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:05:51','success'),(35,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:05:52','success'),(36,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:06:02','success'),(37,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:06:40','success'),(38,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:06:42','success'),(39,'suresh169073@gmail.com','database_query','Executed query: select * from lsc_admins',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:07:17','success'),(40,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:10:30','success'),(41,'suresh169073@gmail.com','database_info','Retrieved structure for table: application_status',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:10:37','success'),(42,'suresh169073@gmail.com','database_info','Retrieved structure for table: auth_permission',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:10:38','success'),(43,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:13:22','success'),(44,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:13:36','success'),(45,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:13:37','success'),(46,'suresh169073@gmail.com','maintenance','Cleared application cache',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:13:46','success'),(47,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:13:53','success'),(48,'suresh169073@gmail.com','guidelines','Created new guideline: New ',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:14','success'),(49,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:14','success'),(50,'suresh169073@gmail.com','guidelines','Deleted guideline: New ','SystemSettings',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:23','success'),(51,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:23','success'),(52,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:25','success'),(53,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:46','success'),(54,'suresh169073@gmail.com','database_info','Retrieved structure for table: api_student',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:49','success'),(55,'suresh169073@gmail.com','database_info','Retrieved structure for table: api_studentdetails',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:14:50','success'),(56,'suresh169073@gmail.com','database_query','Executed query: select * from lsc_admins;',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:15:13','success'),(57,'suresh169073@gmail.com','database_query','Executed query: select * from lsc_admins',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:15:25','success'),(58,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:16:24','success'),(59,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:37','success'),(60,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:45','success'),(61,'suresh169073@gmail.com','guidelines','Created new guideline: gd',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:51','success'),(62,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:51','success'),(63,'suresh169073@gmail.com','guidelines','Deleted guideline: gd','SystemSettings',2,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:54','success'),(64,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:54','success'),(65,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:56','success'),(66,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:17:57','success'),(67,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:20:17','success'),(68,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:21:33','success'),(69,'suresh169073@gmail.com','guidelines','Created new guideline: SGS',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:21:37','success'),(70,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:21:37','success'),(71,'suresh169073@gmail.com','guidelines','Deleted guideline: SGS','SystemSettings',3,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:21:44','success'),(72,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:21:44','success'),(73,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:22:05','success'),(74,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:23:31','success'),(75,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_075353.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:23:54','success'),(76,'suresh169073@gmail.com','CREATE_BACKUP','Backup failed: \'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:23:54','failed'),(77,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:24:14','success'),(78,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:24:15','success'),(79,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:24:41','success'),(80,'suresh169073@gmail.com','guidelines','Created new guideline: SS',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:24:50','success'),(81,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:24:50','success'),(82,'suresh169073@gmail.com','guidelines','Deleted guideline: SS','SystemSettings',4,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:24:59','success'),(83,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:24:59','success'),(84,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:14','success'),(85,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:15','success'),(86,'suresh169073@gmail.com','guidelines','Created new guideline: DDD',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:18','success'),(87,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:18','success'),(88,'suresh169073@gmail.com','guidelines','Deleted guideline: DDD','SystemSettings',5,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:24','success'),(89,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:24','success'),(90,'suresh169073@gmail.com','guidelines','Created new guideline: ZVZ',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:29','success'),(91,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:25:29','success'),(92,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:27:13','success'),(93,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:27:14','success'),(94,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_075716.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:27:17','success'),(95,'suresh169073@gmail.com','CREATE_BACKUP','Backup failed: \'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:27:17','failed'),(96,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:27:27','success'),(97,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:27:35','success'),(98,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:27:59','success'),(99,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:02','success'),(100,'suresh169073@gmail.com','maintenance','Optimized 25 database tables',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:10','success'),(101,'suresh169073@gmail.com','maintenance','Cleared application cache',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:10','success'),(102,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:14','success'),(103,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_075823.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:24','success'),(104,'suresh169073@gmail.com','CREATE_BACKUP','Backup failed: \'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:24','failed'),(105,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:41','success'),(106,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:41','success'),(107,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:42','success'),(108,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:28:42','success'),(109,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:29:55','success'),(110,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_075958.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:29:58','success'),(111,'suresh169073@gmail.com','CREATE_BACKUP','Backup failed: \'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:29:58','failed'),(112,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:01','success'),(113,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:02','success'),(114,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:04','success'),(115,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:15','success'),(116,'suresh169073@gmail.com','maintenance','Optimized 25 database tables',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:16','success'),(117,'suresh169073@gmail.com','maintenance','Cleared application cache',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:16','success'),(118,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:26','success'),(119,'suresh169073@gmail.com','guidelines','Created new guideline: CFSF',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:33','success'),(120,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:30:33','success'),(121,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_080244.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:32:44','success'),(122,'suresh169073@gmail.com','CREATE_BACKUP','Backup failed: mysqldump: Got error: 1045: Access denied for user \'root\'@\'localhost\' (using password: YES) when trying to connect\n',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:34:38','failed'),(123,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_080445.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:34:45','success'),(124,'suresh169073@gmail.com','CREATE_BACKUP','Backup failed: mysqldump: Got error: 1045: Access denied for user \'root\'@\'localhost\' (using password: YES) when trying to connect\n',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:34:53','failed'),(125,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_080455.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:34:55','success'),(126,'suresh169073@gmail.com','CREATE_BACKUP','Backup completed: backup_20251102_080455.sql (0.11 MB)','DatabaseBackup',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:04','success'),(127,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:36','success'),(128,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:43','success'),(129,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:48','success'),(130,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:49','success'),(131,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:49','success'),(132,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:50','success'),(133,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:56','success'),(134,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:58','success'),(135,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:35:58','success'),(136,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:36:41','success'),(137,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:36:43','success'),(138,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:36:46','success'),(139,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:36:46','success'),(140,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:36:49','success'),(141,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:38:08','success'),(142,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:39:18','success'),(143,'suresh169073@gmail.com','DELETE_BACKUP','Deleted backup: backup_20251102_080445.sql','DatabaseBackup',7,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:39:21','success'),(144,'suresh169073@gmail.com','DOWNLOAD_BACKUP','Downloaded backup: backup_20251102_080244.sql','DatabaseBackup',6,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:39:25','success'),(145,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:39:30','success'),(146,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:39:31','success'),(147,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:39:33','success'),(148,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:39:34','success'),(149,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:40:25','success'),(150,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:40:26','success'),(151,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:40:27','success'),(152,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:41:19','success'),(153,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:41:58','success'),(154,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:38','success'),(155,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:39','success'),(156,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:41','success'),(157,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:41','success'),(158,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:42','success'),(159,'suresh169073@gmail.com','maintenance','Optimized 25 database tables',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:48','success'),(160,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:51','success'),(161,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:52','success'),(162,'suresh169073@gmail.com','maintenance','Cleared application cache',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:42:54','success'),(163,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:43:47','success'),(164,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:02','success'),(165,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:04','success'),(166,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:06','success'),(167,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:07','success'),(168,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:08','success'),(169,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:10','success'),(170,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:34','success'),(171,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:35','success'),(172,'suresh169073@gmail.com','maintenance','Cleared application cache',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:44:41','success'),(173,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:45:01','success'),(174,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:45:01','success'),(175,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:45:08','success'),(176,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:45:23','success'),(177,'suresh169073@gmail.com','CREATE_SYSTEM_SETTING','Created setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:45:27','success'),(178,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:06','success'),(179,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:07','success'),(180,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:07','success'),(181,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:14','success'),(182,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:17','success'),(183,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:19','success'),(184,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:27','success'),(185,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:46:59','success'),(186,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:47:00','success'),(187,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:47:13','success'),(188,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:48:59','success'),(189,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:48:59','success'),(190,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:49:00','success'),(191,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:49:00','success'),(192,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:49:07','success'),(193,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:49:08','success'),(194,'suresh169073@gmail.com','DELETE_BACKUP','Deleted backup: backup_20251102_063356.sql','DatabaseBackup',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:50:25','success'),(195,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:50:27','success'),(196,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:51:19','success'),(197,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:51:24','success'),(198,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:51:25','success'),(199,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:51:27','success'),(200,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:53:48','success'),(201,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:53:51','success'),(202,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:55:44','success'),(203,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:55:47','success'),(204,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:55:49','success'),(205,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:55:54','success'),(206,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:55:57','success'),(207,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:55:58','success'),(208,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:55:59','success'),(209,'suresh169073@gmail.com','maintenance','Optimized 25 database tables',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:56:06','success'),(210,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:56:09','success'),(211,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:56:10','success'),(212,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:56:11','success'),(213,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:56:43','success'),(214,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:56:44','success'),(215,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:56:45','success'),(216,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:11','success'),(217,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:13','success'),(218,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:18','success'),(219,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:27','success'),(220,'suresh169073@gmail.com','DELETE_BACKUP','Deleted backup: backup_20251102_075958.sql','DatabaseBackup',5,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:30','success'),(221,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:33','success'),(222,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:33','success'),(223,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:34','success'),(224,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:35','success'),(225,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:37','success'),(226,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:37','success'),(227,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:38','success'),(228,'suresh169073@gmail.com','DOWNLOAD_BACKUP','Downloaded backup: backup_20251102_080455.sql','DatabaseBackup',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:57:51','success'),(229,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:58:10','success'),(230,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:59:03','success'),(231,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 02:59:38','success'),(232,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:03:45','success'),(233,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:03:49','success'),(234,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:03:50','success'),(235,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:03:51','success'),(236,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:04:57','success'),(237,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:04:58','success'),(238,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:03','success'),(239,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:06','success'),(240,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:10','success'),(241,'suresh169073@gmail.com','maintenance','Cleared application cache',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:12','success'),(242,'suresh169073@gmail.com','maintenance','Optimized 25 database tables',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:28','success'),(243,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:34','success'),(244,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:35','success'),(245,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:36','success'),(246,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:37','success'),(247,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:38','success'),(248,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:39','success'),(249,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:40','success'),(250,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:41','success'),(251,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:42','success'),(252,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:43','success'),(253,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:44','success'),(254,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:45','success'),(255,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:46','success'),(256,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:47','success'),(257,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:49','success'),(258,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:05:57','success'),(259,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:06:05','success'),(260,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:06:28','success'),(261,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:06:30','success'),(262,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:06:30','success'),(263,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:06:33','success'),(264,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:06:57','success'),(265,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:07:15','success'),(266,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:07:25','success'),(267,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:08:14','success'),(268,'suresh169073@gmail.com','security','Retrieved security logs',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:08:21','success'),(269,'suresh169073@gmail.com','email_config','Retrieved email settings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:08:26','success'),(270,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:08:32','success'),(271,'suresh169073@gmail.com','guidelines','Retrieved system guidelines',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:08:44','success'),(272,'suresh169073@gmail.com','maintenance','Retrieved system health metrics',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:08:46','success'),(273,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:09:04','success'),(274,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:09:33','success'),(275,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:09:34','success'),(276,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:09:36','success'),(277,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:09:43','success'),(278,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 03:09:48','success'),(279,'suresh169073@gmail.com','DELETE_LSC_ADMIN','Deleted LSC Admin: LC2101-CDOE','LSCAdmin',2,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:01:06','success'),(280,'suresh169073@gmail.com','CREATE_LSC_ADMIN','Created LSC Admin: Hari123 - HariSuresh','LSCAdmin',3,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:04:16','success'),(281,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:04:40','success'),(282,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:04:44','success'),(283,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:04:46','success'),(284,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:04:46','success'),(285,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:04:48','success'),(286,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:04:49','success'),(287,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:05:04','success'),(288,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:05:05','success'),(289,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:05:16','success'),(290,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:05:22','success'),(291,'suresh169073@gmail.com','UPDATE_SYSTEM_SETTING','Updated setting: maintenance_mode','SystemSettings',8,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:05:28','success'),(292,'suresh169073@gmail.com','database_info','Retrieved database tables list',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:05:30','success'),(293,'suresh169073@gmail.com','database_info','Retrieved structure for table: portal_student',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:05:53','success'),(294,'suresh169073@gmail.com','database_query','Executed query: select * from portal_student;',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:07:13','success'),(295,'suresh169073@gmail.com','database_info','Retrieved structure for table: portal_program',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:07:21','success'),(296,'suresh169073@gmail.com','database_info','Retrieved structure for table: portal_notificationsettings',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:07:24','success'),(297,'suresh169073@gmail.com','database_info','Retrieved structure for table: portal_counsellor',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:07:26','success'),(298,'suresh169073@gmail.com','database_info','Retrieved structure for table: portal_attendance',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:07:27','success'),(299,'suresh169073@gmail.com','database_info','Retrieved structure for table: feepayment',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:07:30','success'),(300,'suresh169073@gmail.com','database_query','Executed query: select * from feepayment;',NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:07:51','success'),(301,'suresh169073@gmail.com','CREATE_BACKUP','Initiated database backup: backup_20251102_123833.sql','DatabaseBackup',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','2025-11-02 07:08:33','success');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissions_group_id_b120cbf9` (`group_id`),
  KEY `auth_group_permissions_permission_id_84c5c92e` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  KEY `auth_permission_content_type_id_2f476e4b` (`content_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Token',7,'add_token'),(26,'Can change Token',7,'change_token'),(27,'Can delete Token',7,'delete_token'),(28,'Can view Token',7,'view_token'),(29,'Can add Token',8,'add_tokenproxy'),(30,'Can change Token',8,'change_tokenproxy'),(31,'Can delete Token',8,'delete_tokenproxy'),(32,'Can view Token',8,'view_tokenproxy'),(33,'Can add all courses',9,'add_allcourses'),(34,'Can change all courses',9,'change_allcourses'),(35,'Can delete all courses',9,'delete_allcourses'),(36,'Can view all courses',9,'view_allcourses'),(37,'Can add courses',10,'add_courses'),(38,'Can change courses',10,'change_courses'),(39,'Can delete courses',10,'delete_courses'),(40,'Can view courses',10,'view_courses'),(41,'Can add application',11,'add_application'),(42,'Can change application',11,'change_application'),(43,'Can delete application',11,'delete_application'),(44,'Can view application',11,'view_application'),(45,'Can add application payment',12,'add_applicationpayment'),(46,'Can change application payment',12,'change_applicationpayment'),(47,'Can delete application payment',12,'delete_applicationpayment'),(48,'Can view application payment',12,'view_applicationpayment'),(49,'Can add payment',13,'add_payment'),(50,'Can change payment',13,'change_payment'),(51,'Can delete payment',13,'delete_payment'),(52,'Can view payment',13,'view_payment'),(53,'Can add student',14,'add_student'),(54,'Can change student',14,'change_student'),(55,'Can delete student',14,'delete_student'),(56,'Can view student',14,'view_student'),(57,'Can add student details',15,'add_studentdetails'),(58,'Can change student details',15,'change_studentdetails'),(59,'Can delete student details',15,'delete_studentdetails'),(60,'Can view student details',15,'view_studentdetails'),(61,'Can add marksheet upload',16,'add_marksheetupload'),(62,'Can change marksheet upload',16,'change_marksheetupload'),(63,'Can delete marksheet upload',16,'delete_marksheetupload'),(64,'Can view marksheet upload',16,'view_marksheetupload'),(65,'Can add admin user',17,'add_adminuser'),(66,'Can change admin user',17,'change_adminuser'),(67,'Can delete admin user',17,'delete_adminuser'),(68,'Can view admin user',17,'view_adminuser'),(69,'Can add application',18,'add_application'),(70,'Can change application',18,'change_application'),(71,'Can delete application',18,'delete_application'),(72,'Can view application',18,'view_application'),(73,'Can add student details',19,'add_studentdetails'),(74,'Can change student details',19,'change_studentdetails'),(75,'Can delete student details',19,'delete_studentdetails'),(76,'Can view student details',19,'view_studentdetails'),(77,'Can add student info',20,'add_studentinfo'),(78,'Can change student info',20,'change_studentinfo'),(79,'Can delete student info',20,'delete_studentinfo'),(80,'Can view student info',20,'view_studentinfo'),(81,'Can add application status',21,'add_applicationstatus'),(82,'Can change application status',21,'change_applicationstatus'),(83,'Can delete application status',21,'delete_applicationstatus'),(84,'Can view application status',21,'view_applicationstatus'),(85,'Can add audit log',22,'add_auditlog'),(86,'Can change audit log',22,'change_auditlog'),(87,'Can delete audit log',22,'delete_auditlog'),(88,'Can view audit log',22,'view_auditlog'),(89,'Can add counsellor',23,'add_counsellor'),(90,'Can change counsellor',23,'change_counsellor'),(91,'Can delete counsellor',23,'delete_counsellor'),(92,'Can view counsellor',23,'view_counsellor'),(93,'Can add course',24,'add_course'),(94,'Can change course',24,'change_course'),(95,'Can delete course',24,'delete_course'),(96,'Can view course',24,'view_course'),(97,'Can add database backup',25,'add_databasebackup'),(98,'Can change database backup',25,'change_databasebackup'),(99,'Can delete database backup',25,'delete_databasebackup'),(100,'Can view database backup',25,'view_databasebackup'),(101,'Can add lsc',26,'add_lsc'),(102,'Can change lsc',26,'change_lsc'),(103,'Can delete lsc',26,'delete_lsc'),(104,'Can view lsc',26,'view_lsc'),(105,'Can add lsc admin',27,'add_lscadmin'),(106,'Can change lsc admin',27,'change_lscadmin'),(107,'Can delete lsc admin',27,'delete_lscadmin'),(108,'Can view lsc admin',27,'view_lscadmin'),(109,'Can add payment',28,'add_payment'),(110,'Can change payment',28,'change_payment'),(111,'Can delete payment',28,'delete_payment'),(112,'Can view payment',28,'view_payment'),(113,'Can add student',29,'add_student'),(114,'Can change student',29,'change_student'),(115,'Can delete student',29,'delete_student'),(116,'Can view student',29,'view_student'),(117,'Can add system settings',30,'add_systemsettings'),(118,'Can change system settings',30,'change_systemsettings'),(119,'Can delete system settings',30,'delete_systemsettings'),(120,'Can view system settings',30,'view_systemsettings'),(121,'Can add lsc user',31,'add_lscuser'),(122,'Can change lsc user',31,'change_lscuser'),(123,'Can delete lsc user',31,'delete_lscuser'),(124,'Can view lsc user',31,'view_lscuser'),(125,'Can view student data',31,'can_view_student_data'),(126,'Can edit student data',31,'can_edit_student_data'),(127,'Can add student',32,'add_student'),(128,'Can change student',32,'change_student'),(129,'Can delete student',32,'delete_student'),(130,'Can view student',32,'view_student'),(131,'Can add counsellor',33,'add_counsellor'),(132,'Can change counsellor',33,'change_counsellor'),(133,'Can delete counsellor',33,'delete_counsellor'),(134,'Can view counsellor',33,'view_counsellor'),(135,'Can add assignment mark',34,'add_assignmentmark'),(136,'Can change assignment mark',34,'change_assignmentmark'),(137,'Can delete assignment mark',34,'delete_assignmentmark'),(138,'Can view assignment mark',34,'view_assignmentmark'),(139,'Can add attendance',35,'add_attendance'),(140,'Can change attendance',35,'change_attendance'),(141,'Can delete attendance',35,'delete_attendance'),(142,'Can view attendance',35,'view_attendance'),(143,'Can add program',36,'add_program'),(144,'Can change program',36,'change_program'),(145,'Can delete program',36,'delete_program'),(146,'Can view program',36,'view_program'),(147,'Can add application settings',37,'add_applicationsettings'),(148,'Can change application settings',37,'change_applicationsettings'),(149,'Can delete application settings',37,'delete_applicationsettings'),(150,'Can view application settings',37,'view_applicationsettings'),(151,'Can add system settings',38,'add_systemsettings'),(152,'Can change system settings',38,'change_systemsettings'),(153,'Can delete system settings',38,'delete_systemsettings'),(154,'Can view system settings',38,'view_systemsettings'),(155,'Can add notification settings',39,'add_notificationsettings'),(156,'Can change notification settings',39,'change_notificationsettings'),(157,'Can delete notification settings',39,'delete_notificationsettings'),(158,'Can view notification settings',39,'view_notificationsettings'),(159,'Can add Admission Session',40,'add_admissionsession'),(160,'Can change Admission Session',40,'change_admissionsession'),(161,'Can delete Admission Session',40,'delete_admissionsession'),(162,'Can view Admission Session',40,'view_admissionsession');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1000000$1jb7AzB3hcBnQl21AePy7A$QzMuCEu+oQTN6Fu8ShlDswnpetXccQ8REt4qsigP0ek=',NULL,0,'suresh169073@gmail.com','','','suresh169073@gmail.com',0,1,'2025-10-30 06:43:58.760438');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_user_id_6a12ed8b` (`user_id`),
  KEY `auth_user_groups_group_id_97559544` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permissions_user_id_a95ead1b` (`user_id`),
  KEY `auth_user_user_permissions_permission_id_1fbb5f2c` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('51cedb3d0bfbe243e86a44a687c551343a6fe278','2025-10-30 06:43:58.772504',1);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `database_backups`
--

DROP TABLE IF EXISTS `database_backups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `database_backups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `backup_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `backup_path` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `backup_size` bigint NOT NULL,
  `backup_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `database_backups`
--

LOCK TABLES `database_backups` WRITE;
/*!40000 ALTER TABLE `database_backups` DISABLE KEYS */;
INSERT INTO `database_backups` VALUES (2,'backup_20251102_075353.sql','C:\\Users\\sowmy\\OneDrive\\Desktop\\Project\\online-edu-platform(1)\\online-edu-platform(1)\\backend\\backups\\backup_20251102_075353.sql',0,'full','failed','suresh169073@gmail.com','2025-11-02 02:23:54','\'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n'),(3,'backup_20251102_075716.sql','C:\\Users\\sowmy\\OneDrive\\Desktop\\Project\\online-edu-platform(1)\\online-edu-platform(1)\\backend\\backups\\backup_20251102_075716.sql',0,'full','failed','suresh169073@gmail.com','2025-11-02 02:27:17','\'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n'),(4,'backup_20251102_075823.sql','C:\\Users\\sowmy\\OneDrive\\Desktop\\Project\\online-edu-platform(1)\\online-edu-platform(1)\\backend\\backups\\backup_20251102_075823.sql',0,'full','failed','suresh169073@gmail.com','2025-11-02 02:28:24','\'mysqldump\' is not recognized as an internal or external command,\noperable program or batch file.\n'),(6,'backup_20251102_080244.sql','C:\\Users\\sowmy\\OneDrive\\Desktop\\Project\\online-edu-platform(1)\\online-edu-platform(1)\\backend\\backups\\backup_20251102_080244.sql',0,'full','failed','suresh169073@gmail.com','2025-11-02 02:32:44','mysqldump: Got error: 1045: Access denied for user \'root\'@\'localhost\' (using password: YES) when trying to connect\n'),(8,'backup_20251102_080455.sql','C:\\Users\\sowmy\\OneDrive\\Desktop\\Project\\online-edu-platform(1)\\online-edu-platform(1)\\backend\\backups\\backup_20251102_080455.sql',115205,'full','completed','suresh169073@gmail.com','2025-11-02 02:34:55',''),(9,'backup_20251102_123833.sql','C:\\Users\\sowmy\\OneDrive\\Desktop\\Project\\online-edu-platform(1)\\online-edu-platform(1)\\backend\\backups\\backup_20251102_123833.sql',0,'full','in_progress','suresh169073@gmail.com','2025-11-02 07:08:33','');
/*!40000 ALTER TABLE `database_backups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6` (`user_id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','permission'),(3,'auth','group'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session'),(7,'authtoken','token'),(8,'authtoken','tokenproxy'),(9,'api','allcourses'),(10,'api','courses'),(11,'api','application'),(12,'api','applicationpayment'),(13,'api','payment'),(14,'api','student'),(15,'api','studentdetails'),(16,'api','marksheetupload'),(17,'admin_one','adminuser'),(18,'admin_one','application'),(19,'admin_one','studentdetails'),(20,'admin_one','studentinfo'),(21,'admin_one','applicationstatus'),(22,'admin_one','auditlog'),(23,'admin_one','counsellor'),(24,'admin_one','course'),(25,'admin_one','databasebackup'),(26,'admin_one','lsc'),(27,'admin_one','lscadmin'),(28,'admin_one','payment'),(29,'admin_one','student'),(30,'admin_one','systemsettings'),(31,'lsc_auth','lscuser'),(32,'portal','student'),(33,'portal','counsellor'),(34,'portal','assignmentmark'),(35,'portal','attendance'),(36,'portal','program'),(37,'portal','applicationsettings'),(38,'portal','systemsettings'),(39,'portal','notificationsettings'),(40,'admissions','admissionsession');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-10-30 06:42:45.379612'),(2,'auth','0001_initial','2025-10-30 06:42:45.816622'),(3,'admin','0001_initial','2025-10-30 06:42:45.933091'),(4,'admin','0002_logentry_remove_auto_add','2025-10-30 06:42:45.939859'),(5,'admin','0003_logentry_add_action_flag_choices','2025-10-30 06:42:45.946409'),(6,'api','0001_initial','2025-10-30 06:42:46.421355'),(7,'contenttypes','0002_remove_content_type_name','2025-10-30 06:42:46.500810'),(8,'auth','0002_alter_permission_name_max_length','2025-10-30 06:42:46.533644'),(9,'auth','0003_alter_user_email_max_length','2025-10-30 06:42:46.570311'),(10,'auth','0004_alter_user_username_opts','2025-10-30 06:42:46.579598'),(11,'auth','0005_alter_user_last_login_null','2025-10-30 06:42:46.628077'),(12,'auth','0006_require_contenttypes_0002','2025-10-30 06:42:46.630714'),(13,'auth','0007_alter_validators_add_error_messages','2025-10-30 06:42:46.644421'),(14,'auth','0008_alter_user_username_max_length','2025-10-30 06:42:46.678179'),(15,'auth','0009_alter_user_last_name_max_length','2025-10-30 06:42:46.713431'),(16,'auth','0010_alter_group_name_max_length','2025-10-30 06:42:46.744958'),(17,'auth','0011_update_proxy_permissions','2025-10-30 06:42:46.764167'),(18,'auth','0012_alter_user_first_name_max_length','2025-10-30 06:42:46.792030'),(19,'authtoken','0001_initial','2025-10-30 06:42:46.825126'),(20,'authtoken','0002_auto_20160226_1747','2025-10-30 06:42:46.867709'),(21,'authtoken','0003_tokenproxy','2025-10-30 06:42:46.870996'),(22,'authtoken','0004_alter_tokenproxy_options','2025-10-30 06:42:46.874019'),(23,'sessions','0001_initial','2025-10-30 06:42:46.898148'),(24,'api','0002_alter_marksheetupload_file_url_and_more','2025-10-30 08:03:12.621120'),(25,'api','0003_courses_application_fee','2025-10-30 08:36:15.415038'),(26,'admin_one','0001_initial','2025-11-02 00:49:40.262706'),(27,'admin_one','0002_alter_adminuser_email_alter_application_email_and_more','2025-11-02 00:50:01.980003'),(28,'admin_one','0003_alter_adminuser_email_alter_application_email_and_more','2025-11-02 00:50:01.982547'),(29,'admin_one','0004_applicationstatus_auditlog_counsellor_course_and_more','2025-11-02 00:58:37.288556'),(30,'admin_one','0005_alter_systemsettings_setting_type','2025-11-02 02:46:51.632256'),(31,'lsc_auth','0001_initial','2025-11-02 03:35:44.565278'),(32,'portal','0001_initial','2025-11-02 03:36:04.762350'),(33,'portal','0002_applicationsettings_systemsettings_and_more','2025-11-02 03:36:04.890554'),(34,'admissions','0001_initial','2025-11-02 06:41:03.926811');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feepayment`
--

DROP TABLE IF EXISTS `feepayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feepayment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_transaction_id` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_id` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `course` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_type` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_name` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response_code` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response_message` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_mode` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_amount` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mid` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_date` datetime(6) DEFAULT NULL,
  `payment_type` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feepayment_user_id_8dbf8d6b` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feepayment`
--

LOCK TABLES `feepayment` WRITE;
/*!40000 ALTER TABLE `feepayment` DISABLE KEYS */;
INSERT INTO `feepayment` VALUES (1,'PU/PA/2025/BB81CE','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761813473',236.00,NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 08:37:53.288751','APPLICATION_FEE',1),(2,'PU/PA/2025/EB5155','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761813489',236.00,NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 08:38:09.026125','APPLICATION_FEE',1),(3,'PU/PA/2025/AB7A7B','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761813579',236.00,NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 08:39:39.317067','APPLICATION_FEE',1),(4,'PU/PA/2025/61409C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814120',236.00,'MCA','TXN_FAILURE',NULL,NULL,NULL,'Payment verification failed',NULL,NULL,'0',NULL,'2025-10-30 08:48:40.508537','APPLICATION_FEE',1),(5,'PU/PA/2025/5A4CA1','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814135',236.00,'MCA','TXN_FAILURE',NULL,NULL,NULL,'Payment verification failed',NULL,NULL,'0',NULL,'2025-10-30 08:48:55.964870','APPLICATION_FEE',1),(6,'PU/PA/2025/C1971F','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814196',236.00,'MCA','TXN_FAILURE',NULL,NULL,'501','System Error.',NULL,NULL,'0',NULL,'2025-10-30 08:49:56.806625','APPLICATION_FEE',1),(7,'PU/PA/2025/EF937B','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814206',236.00,'MCA','TXN_FAILURE',NULL,NULL,'501','System Error.',NULL,NULL,'0',NULL,'2025-10-30 08:50:06.653999','APPLICATION_FEE',1),(8,'PU/PA/2025/C5FB17','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814247',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0',NULL,'2025-10-30 08:50:47.987125','APPLICATION_FEE',1),(9,'PU/PA/2025/8329E4','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814267',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0',NULL,'2025-10-30 08:51:07.776339','APPLICATION_FEE',1),(10,'PU/PA/2025/8AB7DA','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814278',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0',NULL,'2025-10-30 08:51:18.604592','APPLICATION_FEE',1),(11,'PU/PA/2025/59934B','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814507',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0',NULL,'2025-10-30 08:55:07.880854','APPLICATION_FEE',1),(12,'PU/PA/2025/D9276E','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761814613',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0',NULL,'2025-10-30 08:56:53.482641','APPLICATION_FEE',1),(13,'PU/PA/2025/755C39','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761822735',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 11:12:15.142709','APPLICATION_FEE',1),(14,'PU/PA/2025/351B4F','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867583',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:39:43.616041','APPLICATION_FEE',1),(15,'PU/PA/2025/7FFFE8','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867598',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:39:58.402600','APPLICATION_FEE',1),(16,'PU/PA/2025/A1DB23','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867758',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:42:38.936073','APPLICATION_FEE',1),(17,'PU/PA/2025/FB9772','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867766',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:42:46.849924','APPLICATION_FEE',1),(18,'PU/PA/2025/E5492C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867805',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0',NULL,'2025-10-30 23:43:25.800261','APPLICATION_FEE',1),(19,'PU/PA/2025/1586DC','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867837',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:43:57.102941','APPLICATION_FEE',1),(20,'PU/PA/2025/D41C7C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867845',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:44:05.789225','APPLICATION_FEE',1),(21,'PU/PA/2025/F83805','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867907',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:45:07.030975','APPLICATION_FEE',1),(22,'PU/PA/2025/A74DA1','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867936',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:45:36.770190','APPLICATION_FEE',1),(23,'PU/PA/2025/00C815','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761867954',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:45:54.249501','APPLICATION_FEE',1),(24,'PU/PA/2025/3A5E03','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868023',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:47:03.988413','APPLICATION_FEE',1),(25,'PU/PA/2025/3CD164','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868393',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:53:13.353447','APPLICATION_FEE',1),(26,'PU/PA/2025/C93210','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868509',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:55:09.895785','APPLICATION_FEE',1),(27,'PU/PA/2025/EDC1CA','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868516',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:55:16.625881','APPLICATION_FEE',1),(28,'PU/PA/2025/10D911','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868597',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:56:37.485362','APPLICATION_FEE',1),(29,'PU/PA/2025/59E59A','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868630',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:57:10.093335','APPLICATION_FEE',1),(30,'PU/PA/2025/E63E09','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868685',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:58:05.097514','APPLICATION_FEE',1),(31,'PU/PA/2025/C047A4','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868733',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:58:53.038636','APPLICATION_FEE',1),(32,'PU/PA/2025/4FBAB1','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868747',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-30 23:59:07.666090','APPLICATION_FEE',1),(33,'PU/PA/2025/F3985D','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868833',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0',NULL,'2025-10-31 00:00:33.084627','APPLICATION_FEE',1),(34,'PU/PA/2025/13A31F','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868909',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:01:49.353873','APPLICATION_FEE',1),(35,'PU/PA/2025/E3F989','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761868970',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:02:50.206624','APPLICATION_FEE',1),(36,'PU/PA/2025/EBFDC9','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869027',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:03:47.254455','APPLICATION_FEE',1),(37,'PU/PA/2025/120D1E','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869046',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:04:06.064919','APPLICATION_FEE',1),(38,'PU/PA/2025/1F6E96','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869131',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:05:31.498840','APPLICATION_FEE',1),(39,'PU/PA/2025/3EF17C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869298',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:08:18.016978','APPLICATION_FEE',1),(40,'PU/PA/2025/BE7E18','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869389',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:09:49.725964','APPLICATION_FEE',1),(41,'PU/PA/2025/23E968','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869522',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:12:02.088254','APPLICATION_FEE',1),(42,'PU/PA/2025/4821E9','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869543',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:12:23.014372','APPLICATION_FEE',1),(43,'PU/PA/2025/BB498D','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869618',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:13:38.148803','APPLICATION_FEE',1),(44,'PU/PA/2025/3958FF','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761869691',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:14:51.480772','APPLICATION_FEE',1),(45,'PU/PA/2025/7834C8','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761870051',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:20:51.371689','APPLICATION_FEE',1),(46,'PU/PA/2025/633C83','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761870144',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:22:24.753616','APPLICATION_FEE',1),(47,'PU/PA/2025/DCC5EB','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761870443',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:27:23.515728','APPLICATION_FEE',1),(48,'PU/PA/2025/65EAB8','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761870744',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:32:24.521691','APPLICATION_FEE',1),(49,'PU/PA/2025/AE8C8D','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761870797',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:33:17.438341','APPLICATION_FEE',1),(50,'PU/PA/2025/A8DFEA','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761871037',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:37:17.849661','APPLICATION_FEE',1),(51,'PU/PA/2025/198A4C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761871415',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:43:35.989536','APPLICATION_FEE',1),(52,'PU/PA/2025/8424D9','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761871823',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:50:23.786548','APPLICATION_FEE',1),(53,'PU/PA/2025/A56235','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761872096',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:54:56.018319','APPLICATION_FEE',1),(54,'PU/PA/2025/61E6F5','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761872213',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 00:56:53.428156','APPLICATION_FEE',1),(55,'PU/PA/2025/859AFB','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761872801',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:06:41.266761','APPLICATION_FEE',1),(56,'PU/PA/2025/D66D65','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761872899',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:08:20.000601','APPLICATION_FEE',1),(57,'PU/PA/2025/3BF5AD','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873021',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:10:21.307647','APPLICATION_FEE',1),(58,'PU/PA/2025/9F2997','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873072',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:11:12.105292','APPLICATION_FEE',1),(59,'PU/PA/2025/D946F7','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873180',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:13:00.694988','APPLICATION_FEE',1),(60,'PU/PA/2025/8E688D','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873191',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:13:11.162192','APPLICATION_FEE',1),(61,'PU/PA/2025/B1A7B1','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873308',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:15:08.024840','APPLICATION_FEE',1),(62,'PU/PA/2025/C02F8A','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873326',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:15:26.894625','APPLICATION_FEE',1),(63,'PU/PA/2025/E6EA02','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873455',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:17:35.094944','APPLICATION_FEE',1),(64,'PU/PA/2025/2D9495','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761873500',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 01:18:20.067040','APPLICATION_FEE',1),(65,'PU/PA/2025/8BEA7C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761883274',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 04:01:14.144776','APPLICATION_FEE',1),(66,'PU/PA/2025/1CCCB0','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761883341',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 04:02:21.031624','APPLICATION_FEE',1),(67,'PU/PA/2025/AA5024','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761887998',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:19:58.499835','APPLICATION_FEE',1),(68,'PU/PA/2025/254838','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761888636',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:30:36.334282','APPLICATION_FEE',1),(69,'PU/PA/2025/0F28DE','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761888951',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:35:51.485008','APPLICATION_FEE',1),(70,'PU/PA/2025/BCD66E','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761889077',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:37:57.116315','APPLICATION_FEE',1),(71,'PU/PA/2025/2A560A','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761889151',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:39:11.752006','APPLICATION_FEE',1),(72,'PU/PA/2025/B38E61','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761889453',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:44:13.265336','APPLICATION_FEE',1),(73,'PU/PA/2025/79B69E','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761889472',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:44:32.707561','APPLICATION_FEE',1),(74,'PU/PA/2025/6A71E2','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761889747',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:49:07.993922','APPLICATION_FEE',1),(75,'PU/PA/2025/FC77AD','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761889847',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:50:47.458127','APPLICATION_FEE',1),(76,'PU/PA/2025/E4541B','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761889976',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 05:52:56.517017','APPLICATION_FEE',1),(77,'PU/PA/2025/230770','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761890326',236.00,'MCA','TXN_FAILURE',NULL,NULL,NULL,'Mid is invalid',NULL,NULL,'0',NULL,'2025-10-31 05:58:46.557438','APPLICATION_FEE',1),(78,'PU/PA/2025/0D7ECE','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761890638',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 06:03:58.767891','APPLICATION_FEE',1),(79,'PU/PA/2025/9A3B36','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900381',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:46:21.089913','APPLICATION_FEE',1),(80,'PU/PA/2025/87F637','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900502',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:48:22.723642','APPLICATION_FEE',1),(81,'PU/PA/2025/939589','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900580',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:49:40.967284','APPLICATION_FEE',1),(82,'PU/PA/2025/2B712F','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900617',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:50:17.244551','APPLICATION_FEE',1),(83,'PU/PA/2025/A59E14','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900692',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:51:32.377962','APPLICATION_FEE',1),(84,'PU/PA/2025/3D33B7','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900846',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:54:06.263662','APPLICATION_FEE',1),(85,'PU/PA/2025/A62103','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900855',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:54:15.789362','APPLICATION_FEE',1),(86,'PU/PA/2025/14CA8D','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900904',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:55:04.205650','APPLICATION_FEE',1),(87,'PU/PA/2025/E435C4','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761900943',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:55:43.435172','APPLICATION_FEE',1),(88,'PU/PA/2025/948042','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761901001',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 08:56:41.459432','APPLICATION_FEE',1),(89,'PU/PA/2025/33C694','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761901285',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 09:01:25.767320','APPLICATION_FEE',1),(90,'PU/PA/2025/F03BF0','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761901440',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 09:04:00.456796','APPLICATION_FEE',1),(91,'PU/PA/2025/32C0ED','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761901452',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 09:04:12.676486','APPLICATION_FEE',1),(92,'PU/PA/2025/51446B','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761906330',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 10:25:30.865394','APPLICATION_FEE',1),(93,'PU/PA/2025/078433','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761906597',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 10:29:57.090791','APPLICATION_FEE',1),(94,'PU/PA/2025/380F6B','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761906601',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 10:30:01.560465','APPLICATION_FEE',1),(95,'PU/PA/2025/45B45C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761906621',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0',NULL,'2025-10-31 10:30:21.146376','APPLICATION_FEE',1),(96,'PU/PA/2025/27C212','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761906911',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:35:11.966954','APPLICATION_FEE',1),(97,'PU/PA/2025/603DA7','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907000',236.00,'MCA','TXN_FAILURE',NULL,NULL,'501','System Error.',NULL,NULL,'0','Periya55817471605926','2025-10-31 10:36:40.153033','APPLICATION_FEE',1),(98,'PU/PA/2025/238F36','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907280',236.00,'MCA','TXN_FAILURE',NULL,NULL,'501','System Error.',NULL,NULL,'0','Periya55817471605926','2025-10-31 10:41:20.478859','APPLICATION_FEE',1),(99,'PU/PA/2025/166241','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907411',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:43:31.577275','APPLICATION_FEE',1),(100,'PU/PA/2025/4BD79D','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907429',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:43:49.441848','APPLICATION_FEE',1),(101,'PU/PA/2025/176016','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907668',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:47:48.040568','APPLICATION_FEE',1),(102,'PU/PA/2025/CA90D6','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907681',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:48:01.915546','APPLICATION_FEE',1),(103,'PU/PA/2025/AA58FC','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907688',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:48:08.109693','APPLICATION_FEE',1),(104,'PU/PA/2025/9A31DC','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907700',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:48:20.810590','APPLICATION_FEE',1),(105,'PU/PA/2025/0D0A77','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907730',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:48:50.641786','APPLICATION_FEE',1),(106,'PU/PA/2025/0693B1','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761907738',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:48:58.648407','APPLICATION_FEE',1),(107,'PU/PA/2025/6A8B7F','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908158',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:55:58.044498','APPLICATION_FEE',1),(108,'PU/PA/2025/9ED87D','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908209',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:56:49.719386','APPLICATION_FEE',1),(109,'PU/PA/2025/300B0A','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908299',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:58:19.786646','APPLICATION_FEE',1),(110,'PU/PA/2025/03155C','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908381',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 10:59:41.910919','APPLICATION_FEE',1),(111,'PU/PA/2025/9F8914','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908438',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:00:38.859767','APPLICATION_FEE',1),(112,'PU/PA/2025/E91E13','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908503',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:01:43.937678','APPLICATION_FEE',1),(113,'PU/PA/2025/35E439','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908673',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:04:33.219556','APPLICATION_FEE',1),(114,'PU/PA/2025/CBC6C4','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908703',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:05:03.123503','APPLICATION_FEE',1),(115,'PU/PA/2025/658BE0','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761908906',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:08:26.608694','APPLICATION_FEE',1),(116,'PU/PA/2025/4A8514','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761909065',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:11:05.234121','APPLICATION_FEE',1),(117,'PU/PA/2025/8DF1B9','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761909197',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:13:17.126044','APPLICATION_FEE',1),(118,'PU/PA/2025/DC40A9','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761911472',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:51:12.124349','APPLICATION_FEE',1),(119,'PU/PA/2025/2FA4C8','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761911541',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:52:21.313607','APPLICATION_FEE',1),(120,'PU/PA/2025/AFB245','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761911541',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:52:21.322196','APPLICATION_FEE',1),(121,'PU/PA/2025/28894E','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761911684',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0','Periya55817471605926','2025-10-31 11:54:44.580745','APPLICATION_FEE',1),(122,'PU/PA/2025/63775A','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761911973',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 11:59:33.897908','APPLICATION_FEE',1),(123,'PU/PA/2025/CA6ED3','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761912314',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:05:14.184806','APPLICATION_FEE',1),(124,'PU/PA/2025/A79888','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761912650',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:10:50.379559','APPLICATION_FEE',1),(125,'PU/PA/2025/FA33FF','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761912757',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:12:37.079852','APPLICATION_FEE',1),(126,'PU/PA/2025/425268','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761912873',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:14:33.832249','APPLICATION_FEE',1),(127,'PU/PA/2025/838AF4','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761912882',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:14:42.429790','APPLICATION_FEE',1),(128,'PU/PA/2025/22B42A','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761912887',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:14:47.053087','APPLICATION_FEE',1),(129,'PU/PA/2025/C843BF','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761913151',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:19:11.621752','APPLICATION_FEE',1),(130,'PU/PA/2025/A01EAF','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761913156',236.00,'MCA','CREATED',NULL,NULL,NULL,NULL,NULL,NULL,'0','Periya55817471605926','2025-10-31 12:19:16.994910','APPLICATION_FEE',1),(131,'PU/PA/2025/E43E31','Suresh G','suresh169073@gmail.com','8248649356',NULL,NULL,'PUCDOE1761913445',236.00,'MCA','TXN_FAILURE',NULL,NULL,'330','Paytm checksum mismatch.',NULL,NULL,'0','Periya55817471605926','2025-10-31 12:24:05.971084','APPLICATION_FEE',1),(132,'PU/PA/2025/881B0C','suresh169073@gmail.com','suresh169073@gmail.com','','TEST_TXN_TEST1761913626','TEST_BANK_TEST1761913626','TEST1761913626',236.00,'MCA','TXN_SUCCESS',NULL,NULL,'01','Test payment - Auto approved','TEST_BANK','TEST','0','TEST_MID','2025-10-31 12:27:06.117819','APPLICATION_FEE',1);
/*!40000 ALTER TABLE `feepayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lsc_admins`
--

DROP TABLE IF EXISTS `lsc_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lsc_admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lsc_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `center_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lsc_code` (`lsc_code`),
  UNIQUE KEY `admin_email` (`admin_email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lsc_admins`
--

LOCK TABLES `lsc_admins` WRITE;
/*!40000 ALTER TABLE `lsc_admins` DISABLE KEYS */;
INSERT INTO `lsc_admins` VALUES (1,'LC2101','CDOE - Centre for Distance and Online Education','suresh169073@gmail.com','pbkdf2_sha256$1000000$GAc2gC6S1BmCxTDSsAKCjn$LwO9qoaQtKEiszi6zOte+C9hW1Stvjr3kc42YBzRwWo=','PUADMIN','8248649356','4/280 Mettupatty pudhur kanavai adikkadu sesanchavadi po valppady tk salem dt','SALEM','Tamil Nadu','636111',1,'2025-11-02 01:48:26','2025-11-02 01:48:26','suresh169073@gmail.com'),(3,'Hari123','HariSuresh','sureshhari@gmail.com','pbkdf2_sha256$1000000$YH4lyhX04O0kb53Ns9sJV3$vFYsxqXWaEVu16germP1rDHHRe24lAQdQaPoO9Jxhts=','SureshHari','8248666762','Mettupatti, Dadagapatti, Salem','Salem','Tamil Nadu','636116',1,'2025-11-02 07:04:16','2025-11-02 07:04:16','suresh169073@gmail.com');
/*!40000 ALTER TABLE `lsc_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lsc_auth_lscuser`
--

DROP TABLE IF EXISTS `lsc_auth_lscuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lsc_auth_lscuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `lsc_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lsc_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lsc_number` (`lsc_number`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lsc_auth_lscuser`
--

LOCK TABLES `lsc_auth_lscuser` WRITE;
/*!40000 ALTER TABLE `lsc_auth_lscuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `lsc_auth_lscuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `course` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_user_id_189b9948` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_applicationsettings`
--

DROP TABLE IF EXISTS `portal_applicationsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_applicationsettings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_open` tinyint(1) NOT NULL,
  `opening_date` datetime(6) DEFAULT NULL,
  `closing_date` datetime(6) DEFAULT NULL,
  `max_applications` int unsigned NOT NULL,
  `current_applications` int unsigned NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructions` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_type` (`application_type`),
  CONSTRAINT `portal_applicationsettings_chk_1` CHECK ((`max_applications` >= 0)),
  CONSTRAINT `portal_applicationsettings_chk_2` CHECK ((`current_applications` >= 0))
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_applicationsettings`
--

LOCK TABLES `portal_applicationsettings` WRITE;
/*!40000 ALTER TABLE `portal_applicationsettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_applicationsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_assignmentmark`
--

DROP TABLE IF EXISTS `portal_assignmentmark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_assignmentmark` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `internal_marks` decimal(5,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  `program_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reg_no` (`reg_no`),
  KEY `portal_assignmentmark_program_id_3f16e327` (`program_id`),
  KEY `portal_assignmentmark_student_id_c88d8322` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_assignmentmark`
--

LOCK TABLES `portal_assignmentmark` WRITE;
/*!40000 ALTER TABLE `portal_assignmentmark` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_assignmentmark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_attendance`
--

DROP TABLE IF EXISTS `portal_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attendance_percentage` decimal(5,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recorded_at` datetime(6) NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `portal_attendance_student_id_21af515e` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_attendance`
--

LOCK TABLES `portal_attendance` WRITE;
/*!40000 ALTER TABLE `portal_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_counsellor`
--

DROP TABLE IF EXISTS `portal_counsellor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_counsellor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `counsellor_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `father_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mother_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aadhaar_card` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualification` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `highest_qualification` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternate_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_id` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_designation` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `working_experience` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line3` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `programme_assigned_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aadhaar_card` (`aadhaar_card`),
  UNIQUE KEY `email_id` (`email_id`),
  KEY `portal_counsellor_programme_assigned_id_0b2ab95f` (`programme_assigned_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_counsellor`
--

LOCK TABLES `portal_counsellor` WRITE;
/*!40000 ALTER TABLE `portal_counsellor` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_counsellor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_notificationsettings`
--

DROP TABLE IF EXISTS `portal_notificationsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_notificationsettings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notification_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_enabled` tinyint(1) NOT NULL,
  `email_notifications` tinyint(1) NOT NULL,
  `sms_notifications` tinyint(1) NOT NULL,
  `push_notifications` tinyint(1) NOT NULL,
  `system_notifications` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `portal_notificationsetti_user_id_notification_typ_dfb6f07d_uniq` (`user_id`,`notification_type`),
  KEY `portal_notificationsettings_user_id_0505a1fa` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_notificationsettings`
--

LOCK TABLES `portal_notificationsettings` WRITE;
/*!40000 ALTER TABLE `portal_notificationsettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_notificationsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_program`
--

DROP TABLE IF EXISTS `portal_program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_program` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_program`
--

LOCK TABLES `portal_program` WRITE;
/*!40000 ALTER TABLE `portal_program` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_student`
--

DROP TABLE IF EXISTS `portal_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_student` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `community` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admission_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `counsellor_id` bigint DEFAULT NULL,
  `program_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_no` (`application_no`),
  KEY `portal_student_counsellor_id_e1df4a40` (`counsellor_id`),
  KEY `portal_student_program_id_eec6a774` (`program_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_student`
--

LOCK TABLES `portal_student` WRITE;
/*!40000 ALTER TABLE `portal_student` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portal_systemsettings`
--

DROP TABLE IF EXISTS `portal_systemsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portal_systemsettings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `setting_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `portal_systemsettings_setting_type_key_b68fa12e_uniq` (`setting_type`,`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portal_systemsettings`
--

LOCK TABLES `portal_systemsettings` WRITE;
/*!40000 ALTER TABLE `portal_systemsettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `portal_systemsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `updated_by` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES (6,'ZVZ','vzz','guideline','zvz',1,'suresh169073@gmail.com','2025-11-02 02:25:29','2025-11-02 02:25:29'),(7,'CFSF','fsf','guideline','fs',1,'suresh169073@gmail.com','2025-11-02 02:30:33','2025-11-02 02:30:33'),(8,'maintenance_mode','false','system','Website maintenance mode - when enabled, shows maintenance page to all users',1,'suresh169073@gmail.com','2025-11-02 07:05:28','2025-11-02 02:45:27');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_course`
--

DROP TABLE IF EXISTS `tbl_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_short_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_semesters` int NOT NULL,
  `num_years` int NOT NULL,
  `course_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `degree` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_fee` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_course`
--

LOCK TABLES `tbl_course` WRITE;
/*!40000 ALTER TABLE `tbl_course` DISABLE KEYS */;
INSERT INTO `tbl_course` VALUES (1,'MCA','Master of Computer Applications','Computer Science',4,2,'MCA01','2025-10-30 08:38:27.196545','2025-10-30 08:38:27.196579','MCA',236.00),(2,'MBA','Master of Business Administration','Management',4,2,'MBA01','2025-10-30 08:38:27.200771','2025-10-30 08:38:27.200810','MBA',236.00),(3,'MSC-CS','Master of Science in Computer Science','Computer Science',4,2,'MSC-CS01','2025-10-30 08:38:27.204701','2025-10-30 08:38:27.204723','M.Sc (CS)',236.00),(4,'MA-ENG','Master of Arts in English','English',4,2,'MA-ENG01','2025-10-30 08:38:27.207807','2025-10-30 08:38:27.207829','M.A (English)',236.00),(5,'MSW','Master of Social Work','Social Work',4,2,'MSW01','2025-10-30 08:38:27.211985','2025-10-30 08:38:27.212018','MSW',236.00);
/*!40000 ALTER TABLE `tbl_course` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-02 12:38:46

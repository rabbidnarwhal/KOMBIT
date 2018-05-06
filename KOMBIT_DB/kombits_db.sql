/*
SQLyog Ultimate v8.32 
MySQL - 5.5.5-10.1.16-MariaDB : Database - kombits_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`kombits_db` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `kombits_db`;

/*Table structure for table `foto_upload` */

DROP TABLE IF EXISTS `foto_upload`;

CREATE TABLE `foto_upload` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL COMMENT 'foto yang diupload  per product_id',
  `foto_name` varchar(50) NOT NULL,
  `foto_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `foto_upload` */

/*Table structure for table `interaction` */

DROP TABLE IF EXISTS `interaction`;

CREATE TABLE `interaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL COMMENT 'product yang di like/comment/view refer table product',
  `is_like` tinyint(1) DEFAULT NULL,
  `liked_by` int(11) DEFAULT NULL COMMENT 'refer ke field id table m_user',
  `liked_date` datetime DEFAULT NULL,
  `is_comment` tinyint(1) DEFAULT NULL,
  `comment_by` int(11) DEFAULT NULL COMMENT 'refer ke field id table m_user',
  `comment_date` datetime DEFAULT NULL,
  `is_chat` tinyint(1) DEFAULT NULL,
  `chat_by` int(11) DEFAULT NULL COMMENT 'refer ke field id table m_user',
  `chat_date` datetime DEFAULT NULL,
  `is_viewed` tinyint(1) DEFAULT NULL,
  `viewed_by` int(11) DEFAULT NULL COMMENT 'refer ke field id table m_user',
  `viewed_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `interaction` */

/*Table structure for table `m_category` */

DROP TABLE IF EXISTS `m_category`;

CREATE TABLE `m_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Data for the table `m_category` */

insert  into `m_category`(`id`,`category`) values (1,'IT Solution'),(2,'Humman Resource'),(3,'Network'),(4,'Design'),(5,'Mobile Application'),(6,'CRM'),(7,'Healthcare'),(8,'Fintech'),(9,'Security'),(10,'Logistic');

/*Table structure for table `m_company` */

DROP TABLE IF EXISTS `m_company`;

CREATE TABLE `m_company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `holding_id` int(11) NOT NULL COMMENT 'refer m_holding',
  `company_name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `address_koordinat` varchar(255) NOT NULL COMMENT 'koordinat google map',
  `fixed_call` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `m_company` */

insert  into `m_company`(`id`,`holding_id`,`company_name`,`address`,`address_koordinat`,`fixed_call`) values (1,1,'PT.Sigma Cipta Caraka','JL.kaki untuk maju','https://goo.gl/maps/ZffhwyEpVzA2','+62 21 789987');

/*Table structure for table `m_holding` */

DROP TABLE IF EXISTS `m_holding`;

CREATE TABLE `m_holding` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `holding_name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `address_koordinat` varchar(255) NOT NULL COMMENT 'koordinat google map',
  `fixed_call` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `m_holding` */

insert  into `m_holding`(`id`,`holding_name`,`address`,`address_koordinat`,`fixed_call`) values (1,'PT. Telekomunikasi Indonesia','Telkom Landmark Tower, Lantai 39 Jl. Jendral Gatot Subroto Kav. 52 RT.6/RW.1, Kuningan Barat, Mampang Prapatan RT.6/RW.1, Kuningan Barat, Mampang Prapatan Jakarta Selatan, DKI Jakarta, 12710 Indonesia','https://goo.gl/maps/ZffhwyEpVzA2','+62 21 - 5215328');

/*Table structure for table `m_type_id` */

DROP TABLE IF EXISTS `m_type_id`;

CREATE TABLE `m_type_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desc_type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `m_type_id` */

insert  into `m_type_id`(`id`,`desc_type`) values (1,'KTP'),(2,'KITAS'),(3,'KIPEM'),(4,'Passport'),(5,'ID Company');

/*Table structure for table `m_user` */

DROP TABLE IF EXISTS `m_user`;

CREATE TABLE `m_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_number` varchar(50) NOT NULL,
  `id_type` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `occupation` varchar(100) NOT NULL,
  `handphone` varchar(15) NOT NULL,
  `job_title` varchar(100) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `m_user` */

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL COMMENT 'refer m_company',
  `holding_id` int(11) NOT NULL COMMENT 'refer m_holding',
  `product_name` varchar(200) NOT NULL,
  `description` varchar(255) NOT NULL COMMENT 'High Level dan Low level detail',
  `is_include_price` tinyint(1) NOT NULL COMMENT 'jika ya => memunculkan harga,tidak => harga hide',
  `price` double DEFAULT NULL,
  `credentials` varchar(255) DEFAULT NULL COMMENT 'success stories, client name',
  `video_path` varchar(255) DEFAULT NULL COMMENT 'video about product or testimoni',
  `user_id` int(11) NOT NULL COMMENT 'refer m_user (kebutuhan contact person)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `product` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

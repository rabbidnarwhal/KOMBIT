ALTER TABLE `product`
	ADD COLUMN `category_id` INT(11) NOT NULL COMMENT 'refer m_category' AFTER `holding_id`,
	ADD COLUMN `currency` VARCHAR(3) NOT NULL AFTER `price`;

ALTER TABLE `interaction`
	ADD COLUMN `comment` VARCHAR(255) NULL DEFAULT NULL AFTER `liked_date`;

ALTER TABLE `m_company`
	ADD COLUMN `image` VARCHAR(255) NULL DEFAULT NULL AFTER `fixed_call`;

ALTER TABLE `m_user`
	ADD COLUMN `address_koordinat` VARCHAR(255) NULL DEFAULT NULL AFTER `address`,
	ADD COLUMN `image` VARCHAR(255) NULL DEFAULT NULL AFTER `company_id`;

CREATE TABLE `sys_param` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`param_code` VARCHAR(100) NOT NULL COMMENT 'kode param',
	`param_value` VARCHAR(255) NOT NULL COMMENT 'nilai param yang akan digunakan',
	`description` VARCHAR(255) NOT NULL COMMENT 'penjelasan fungsi parameter',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `notification` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`content` VARCHAR(255) NOT NULL,
	`title` VARCHAR(100) NOT NULL,
	`topic` VARCHAR(100) NULL DEFAULT NULL COMMENT 'target topic yang akan dikirimkan notification',
	`to` INT(11) NULL DEFAULT NULL COMMENT 'target user yang akan dikirimkan notification',
	`push_date` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `m_user`
	ADD COLUMN `push_id` VARCHAR(255) NULL DEFAULT NULL AFTER `password`;
	-- ADD COLUMN `jwt_token` VARCHAR(255) NULL DEFAULT NULL AFTER `push_token`;

ALTER TABLE `m_user`
	ADD COLUMN `provinsi_id` INT(11) NULL DEFAULT NULL AFTER `address`,
	ADD COLUMN `kab_kota_id` INT(11) NULL DEFAULT NULL AFTER `address`;

CREATE TABLE `m_kab_kota` (
	`kab_kota_id` INT(11) NOT NULL AUTO_INCREMENT,
	`provinsi_id` INT(11) NOT NULL,
	`kab_kota_name` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `m_provinsi` (
	`provinsi_id` INT(11) NOT NULL AUTO_INCREMENT,
	`provinsi_name` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
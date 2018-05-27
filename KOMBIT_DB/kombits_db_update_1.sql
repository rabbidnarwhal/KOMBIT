ALTER TABLE `product`
	ADD COLUMN `category_id` INT(11) NOT NULL COMMENT 'refer m_category' AFTER `holding_id`;

ALTER TABLE `interaction`
	ADD COLUMN `comment` VARCHAR(255) NULL DEFAULT NULL AFTER `liked_date`;
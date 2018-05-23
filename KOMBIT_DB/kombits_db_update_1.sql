ALTER TABLE `product`
	ADD COLUMN `category_id` INT(11) NOT NULL COMMENT 'refer m_category' AFTER `holding_id`;
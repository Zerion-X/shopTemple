ALTER TABLE `shoptemple`.`brands` 
ADD COLUMN `pic` VARCHAR(255) NULL DEFAULT '' AFTER `name`;

-- do this for categories and products also
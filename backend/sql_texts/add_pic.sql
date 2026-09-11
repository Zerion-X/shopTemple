ALTER TABLE `shoptemple`.`brands` 
ADD COLUMN image_url VARCHAR(500) NULL,
ADD COLUMN image_public_id VARCHAR(255) NULL;

-- do this for categories and products also
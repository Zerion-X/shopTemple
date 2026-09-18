-- =========================================================
-- SHOPTEMPLE DATABASE
-- =========================================================

CREATE DATABASE IF NOT EXISTS shoptemple;
USE shoptemple;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS users;

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(45) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- =========================================================
-- BRANDS
-- =========================================================

CREATE TABLE brands (
  brand_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  image_url VARCHAR(500) NULL,
  image_public_id VARCHAR(255) NULL,
  PRIMARY KEY (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE categories (
  category_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  image_url VARCHAR(500) NULL,
  image_public_id VARCHAR(255) NULL,
  PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE products (
  product_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  brand_id INT NOT NULL,
  category_id INT NOT NULL,
  image_url VARCHAR(500) NULL,
  image_public_id VARCHAR(255) NULL,
  PRIMARY KEY (product_id),
  INDEX fk_products_brands_idx (brand_id),
  INDEX fk_products_categories_idx (category_id),
  CONSTRAINT fk_products_brands
    FOREIGN KEY (brand_id)
    REFERENCES brands (brand_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_products_categories
    FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- REVIEWS
-- =========================================================

CREATE TABLE reviews (
  review_id INT NOT NULL AUTO_INCREMENT,
  rating TINYINT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  product_id INT NOT NULL,
  user_id INT NULL,
  PRIMARY KEY (review_id),

  -- One review per user for each product
  UNIQUE KEY unique_user_product_review (user_id, product_id),

  INDEX fk_reviews_products_idx (product_id),
  INDEX fk_reviews_users_idx (user_id),

  CONSTRAINT fk_reviews_products
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- Keep review if user is deleted; simply remove user association
  CONSTRAINT fk_reviews_users
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;


-- =========================================================
-- SHOPTEMPLE_TEST DATABASE
-- =========================================================

CREATE DATABASE IF NOT EXISTS shoptemple_test;
USE shoptemple_test;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS users;

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(45) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- =========================================================
-- BRANDS
-- =========================================================

CREATE TABLE brands (
  brand_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  image_url VARCHAR(500) NULL,
  image_public_id VARCHAR(255) NULL,
  PRIMARY KEY (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE categories (
  category_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  image_url VARCHAR(500) NULL,
  image_public_id VARCHAR(255) NULL,
  PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE products (
  product_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  brand_id INT NOT NULL,
  category_id INT NOT NULL,
  image_url VARCHAR(500) NULL,
  image_public_id VARCHAR(255) NULL,
  PRIMARY KEY (product_id),
  INDEX fk_products_brands_idx (brand_id),
  INDEX fk_products_categories_idx (category_id),
  CONSTRAINT fk_products_brands
    FOREIGN KEY (brand_id)
    REFERENCES brands (brand_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_products_categories
    FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- REVIEWS
-- =========================================================

CREATE TABLE reviews (
  review_id INT NOT NULL AUTO_INCREMENT,
  rating TINYINT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  product_id INT NOT NULL,
  user_id INT NULL,
  PRIMARY KEY (review_id),

  -- One review per user for each product
  UNIQUE KEY unique_user_product_review (user_id, product_id),

  INDEX fk_reviews_products_idx (product_id),
  INDEX fk_reviews_users_idx (user_id),

  CONSTRAINT fk_reviews_products
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- Keep review if user is deleted; simply remove user association
  CONSTRAINT fk_reviews_users
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
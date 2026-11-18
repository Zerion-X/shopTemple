CREATE TABLE orders (
  order_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id),
  
  INDEX fk_orders_users_idx (user_id),
  
  CONSTRAINT fk_orders_users
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE order_items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  price_per_unit DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  
  INDEX fk_order_items_products_idx (product_id),
  
  CONSTRAINT fk_order_items_orders
    FOREIGN KEY (order_id)
    REFERENCES orders (order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    
  CONSTRAINT fk_order_items_products
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
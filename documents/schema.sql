CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    image_url TEXT,
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cart (
    cart_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT,
    product_id BIGINT,
    quantity INT NOT NULL,
    
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id)
        ON DELETE CASCADE,
        
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS addresses (
    address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    address_line VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(100),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
        
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNIQUE,
    payment_method ENUM('RAZORPAY', 'STRIPE', 'MOCK'),
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    paid_at TIMESTAMP NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE
);

-- Insert Sample Categories
INSERT IGNORE INTO categories (category_id, name) VALUES 
(3, 'Electronics'),
(4, 'Food'),
(5, 'Clothes'),
(6, 'Footwear');

-- Insert Sample User (John Doe)
INSERT IGNORE INTO users (user_id, name, email, password, role) VALUES 
(2, 'John Doe', 'john@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER');

-- Insert Sample Products for Your Categories
INSERT IGNORE INTO products (product_id, name, description, price, stock, image_url, category_id) VALUES
-- Electronics Products (Category ID: 3)
(1, 'iPhone 15 Pro', 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system', 999.99, 50, 'https://example.com/iphone15pro.jpg', 3),
(2, 'Samsung Galaxy S24', 'Flagship Samsung smartphone with Galaxy AI and premium features', 899.99, 40, 'https://example.com/galaxys24.jpg', 3),
(3, 'MacBook Pro 16"', 'Powerful laptop with M3 Pro chip, perfect for professionals', 2499.99, 20, 'https://example.com/macbookpro16.jpg', 3),
(4, 'iPad Air', 'Versatile tablet with M1 chip, perfect for work and entertainment', 599.99, 30, 'https://example.com/ipadair.jpg', 3),
(5, 'AirPods Pro', 'Premium wireless earbuds with active noise cancellation', 249.99, 100, 'https://example.com/airpodspro.jpg', 3),
(6, 'Sony WH-1000XM5', 'Industry-leading noise canceling headphones', 399.99, 35, 'https://example.com/sonyxm5.jpg', 3),
(7, 'Apple Watch Series 9', 'Advanced smartwatch with health monitoring features', 449.99, 45, 'https://example.com/applewatch9.jpg', 3),
(8, 'Dell XPS 13 Laptop', 'Ultra-portable laptop with Intel Core i7 processor', 1299.99, 25, 'https://example.com/dellxps13.jpg', 3),

-- Food Products (Category ID: 4)
(9, 'Organic Honey', 'Pure raw honey from local farms', 12.99, 80, 'https://example.com/organichoney.jpg', 4),
(10, 'Artisan Coffee Beans', 'Premium roasted coffee beans from Colombia', 24.99, 120, 'https://example.com/coffeebeans.jpg', 4),
(11, 'Dark Chocolate Collection', 'Gourmet dark chocolate assortment from Belgium', 18.99, 95, 'https://example.com/darkchocolate.jpg', 4),
(12, 'Extra Virgin Olive Oil', 'Cold-pressed olive oil from Italy', 15.99, 60, 'https://example.com/oliveoil.jpg', 4),
(13, 'Organic Green Tea', 'Premium Japanese green tea leaves', 22.99, 75, 'https://example.com/greentea.jpg', 4),
(14, 'Gourmet Pasta Set', 'Artisanal pasta variety pack from Italy', 16.99, 85, 'https://example.com/pastaset.jpg', 4),
(15, 'Himalayan Pink Salt', 'Natural pink salt with minerals', 8.99, 150, 'https://example.com/pinksalt.jpg', 4),
(16, 'Organic Nuts Mix', 'Healthy mix of almonds, walnuts, and cashews', 14.99, 100, 'https://example.com/nutsmix.jpg', 4),

-- Clothes Products (Category ID: 5)
(17, 'Men''s Leather Jacket', 'Genuine leather jacket with modern fit', 299.99, 25, 'https://example.com/leatherjacket.jpg', 5),
(18, 'Women''s Summer Dress', 'Elegant summer dress with floral pattern', 89.99, 60, 'https://example.com/summerdress.jpg', 5),
(19, 'Nike Air Max 270', 'Comfortable running shoes with air cushioning', 149.99, 80, 'https://example.com/nikeairmax.jpg', 5),
(20, 'Designer Handbag', 'Luxury leather handbag with multiple compartments', 499.99, 15, 'https://example.com/handbag.jpg', 5),
(21, 'Men''s Business Suit', 'Professional business suit with modern tailoring', 399.99, 20, 'https://example.com/menssuit.jpg', 5),
(22, 'Women''s Yoga Pants', 'Comfortable and stylish yoga pants for workout', 49.99, 90, 'https://example.com/yogapants.jpg', 5),
(23, 'Cotton T-Shirt Pack', 'Pack of 5 premium cotton t-shirts', 39.99, 120, 'https://example.com/tshirtpack.jpg', 5),
(24, 'Winter Coat', 'Warm winter coat with hood and pockets', 199.99, 30, 'https://example.com/wintercoat.jpg', 5),

-- Footwear Products (Category ID: 6)
(25, 'Nike Running Shoes', 'Professional running shoes with advanced cushioning', 129.99, 70, 'https://example.com/nikerunning.jpg', 6),
(26, 'Adidas Sneakers', 'Casual sneakers with classic design', 89.99, 85, 'https://example.com/adidassneakers.jpg', 6),
(27, 'Formal Leather Shoes', 'Men''s formal shoes for business meetings', 149.99, 40, 'https://example.com/formalshoes.jpg', 6),
(28, 'Women''s High Heels', 'Elegant high heels for special occasions', 119.99, 35, 'https://example.com/highheels.jpg', 6),
(29, 'Hiking Boots', 'Waterproof hiking boots for outdoor adventures', 179.99, 25, 'https://example.com/hikingboots.jpg', 6),
(30, 'Kids Sports Shoes', 'Comfortable sports shoes for active kids', 59.99, 95, 'https://example.com/kidssports.jpg', 6),
(31, 'Sandals Beach', 'Comfortable beach sandals for summer', 39.99, 110, 'https://example.com/beachsandals.jpg', 6),
(32, 'Safety Work Boots', 'Steel-toe boots for workplace safety', 199.99, 20, 'https://example.com/workboots.jpg', 6);

-- Create Cart for John Doe
INSERT IGNORE INTO cart (cart_id, user_id) VALUES (1, 2);

-- Add Products to John Doe's Cart
INSERT IGNORE INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 9, 2),
(1, 17, 1),
(1, 25, 1);

-- Create Sample Orders
INSERT IGNORE INTO orders (order_id, user_id, total_amount, status) VALUES
(1, 2, 1499.97, 'DELIVERED'),
(2, 2, 279.97, 'PENDING');

-- Add Order Items
INSERT IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 3, 1, 2499.99),
(2, 2, 1, 899.99),
(2, 18, 1, 39.99);

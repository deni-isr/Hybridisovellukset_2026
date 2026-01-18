-- Database schema for Your Slice pizza restaurant

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INTEGER CHECK (age >= 16 AND age <= 120),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table for menu items
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    image_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'pizza',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lunch_menus table to track which products are available on which days
CREATE TABLE IF NOT EXISTS lunch_menus (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    special_price DECIMAL(10,2), -- Optional special pricing for the day
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, date)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery TIMESTAMP
);

-- Create order_items table for order details
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);

-- Insert sample admin user (password: Admin123)
INSERT INTO users (first_name, last_name, email, password_hash, age, is_admin) 
VALUES ('Admin', 'User', 'admin@yourslice.fi', '$2b$10$rQQ7gF8J9fJ5J5J5J5J5JeJ5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 30, true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample products for today's menu
INSERT INTO products (name, description, price, is_vegan, image_url, category) VALUES 
('Margherita Classic', 'Fresh mozzarella, tomato sauce, basil, and olive oil on our signature dough', 12.50, false, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400', 'pizza'),
('Vegan Supreme', 'Plant-based cheese, bell peppers, mushrooms, onions, olives, and tomato sauce', 14.90, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'pizza'),
('Pepperoni Delight', 'Spicy pepperoni, mozzarella cheese, and our classic tomato sauce', 13.80, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 'pizza'),
('Mediterranean Veggie', 'Feta cheese, sun-dried tomatoes, olives, spinach, and herbs', 13.20, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 'pizza'),
('BBQ Chicken Special', 'Grilled chicken, BBQ sauce, red onions, cilantro, and mozzarella', 15.50, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 'pizza')
ON CONFLICT DO NOTHING;

-- Add today's menu items (using current date)
INSERT INTO lunch_menus (product_id, date, special_price, is_available) 
SELECT 
    id, 
    CURRENT_DATE, 
    CASE 
        WHEN name = 'Margherita Classic' THEN 10.90 
        WHEN name = 'Vegan Supreme' THEN 12.90 
        ELSE NULL 
    END,
    true
FROM products 
WHERE name IN ('Margherita Classic', 'Vegan Supreme', 'Pepperoni Delight', 'Mediterranean Veggie')
ON CONFLICT (product_id, date) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lunch_menus_date ON lunch_menus(date);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);


-- ============================= --
-- Week1 (02-databases.md) Task:

-- TRANSACTIONS
-- Idea: Kaikki tai ei mitään. Varmistetaan, että tilaus on ehjä.

START TRANSACTION;

-- Lisätään uusi tilaus
INSERT INTO orders (customer_id, total, status, delivery_address) 
VALUES (1, 25.00, 'pending', 'Keskuskatu 10');

-- Lisätään tilauksen tuotteet (order_items käyttää LAST_INSERT_ID)
-- Jos tämä epäonnistuu, koko tilaus perutaan automaattisesti.
INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (LAST_INSERT_ID(), 1, 2);

COMMIT; -- Nyt kaikki tallentuu kerralla.


-- CASCADE DELETE
-- Idea: Jos poistat tuotteen, sen tiedot poistuvat kaikkialta automaattisesti.

-- Esimerkki: Poistetaan Margherita-pitsa valikoimasta
DELETE FROM products WHERE id = 1;

-- Selitys suomeksi:
-- Koska käytimme "ON DELETE CASCADE", tämä tuote poistuu 
-- automaattisesti myös lunch_menus ja order_items tauluista.
-- Sinun ei tarvitse poistaa niitä käsin.


-- VIEWS
-- Idea: Tehdään valmis "ikkuna", josta on helppo katsoa tietoja.

-- Luodaan näkymä kokille: Mitä pitää valmistaa juuri nyt?
CREATE VIEW active_orders AS
SELECT o.id, p.name, oi.quantity
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status = 'pending';

-- Käyttö:
SELECT * FROM active_orders; 
-- (Ei tarvitse kirjoittaa pitkää JOIN-kyselyä joka kerta).


-- INDEXES
-- Idea: Nopeutetaan hakua. Kuin kirjan sisällysluettelo.

-- Nopeutetaan hakuja sähköpostin perusteella (esim. kirjautuminen)
CREATE INDEX idx_user_email ON users(email);

-- Nopeutetaan hakuja päivämäärän mukaan
CREATE INDEX idx_menu_date ON lunch_menus(date);

-- Miksi: Jos taulussa on 10 000 riviä, haku on heti paljon nopeampi.
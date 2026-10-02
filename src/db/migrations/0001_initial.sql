-- Migration: 0001_initial.sql
-- Project: Serena Diamond Bespoke (Supabase Project: twcprpnlqgltxgcspeip)
-- Database: PostgreSQL
-- Ready-to-wear corporate attire for executive women (Lagos, Nigeria)

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL, -- Stored in NGN
    category VARCHAR(100) NOT NULL,
    sizes TEXT[] NOT NULL DEFAULT '{"XS","S","M","L","XL"}',
    stock_quantity INTEGER NOT NULL DEFAULT 10,
    images TEXT[] NOT NULL DEFAULT '{}',
    fabric VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY, -- e.g. SDB-84920
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_address JSONB NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'paid', 'pending', 'failed'
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'tailoring', 'dispatched', 'completed'
    payment_method VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    size VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 6. Row Level Security (RLS) Policies for Public Storefront & Orders
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Products: Everyone (including anonymous shoppers) can view products
DROP POLICY IF EXISTS "Public products read access" ON products;
CREATE POLICY "Public products read access" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable product inserts for service/anon" ON products;
CREATE POLICY "Enable product inserts for service/anon" ON products FOR ALL USING (true) WITH CHECK (true);

-- Orders: Allow inserts from checkout, and allow viewing created orders
DROP POLICY IF EXISTS "Allow public order placement" ON orders;
CREATE POLICY "Allow public order placement" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow order select" ON orders;
CREATE POLICY "Allow order select" ON orders FOR SELECT USING (true);

-- Order Items: Allow public inserts during order checkout
DROP POLICY IF EXISTS "Allow public order items insert" ON order_items;
CREATE POLICY "Allow public order items insert" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow order items select" ON order_items;
CREATE POLICY "Allow order items select" ON order_items FOR SELECT USING (true);

-- Users: Allow profile access
DROP POLICY IF EXISTS "Allow user upsert and select" ON users;
CREATE POLICY "Allow user upsert and select" ON users FOR ALL USING (true) WITH CHECK (true);

-- 7. Initial Seed Data (Serena Diamond Bespoke Executive Suite)
INSERT INTO products (id, name, description, price, category, sizes, stock_quantity, images, fabric)
VALUES 
(
    'sdb-blazer-victoria',
    'The Victoria Double-Breasted Emerald Blazer',
    'Impeccably tailored from 100% fine Italian worsted wool with signature brushed champagne gold horn buttons. Structured shoulders and hourglass contouring designed for high-stakes executive boardroom presentations.',
    285000.00,
    'Tailored Blazers',
    '{"XS","S","M","L","XL"}',
    14,
    '{"/src/assets/images/product_emerald_blazer_1790771215550.jpg"}',
    '100% Super 130s Italian Worsted Wool & Pure Silk Cupro Lining'
),
(
    'sdb-dress-ikoyi',
    'The Ikoyi Crepe Sheath Dress',
    'Sculpted from heavy Japanese architectural crepe in champagne ivory. Features an asymmetrical fold neckline, contoured darting, and a removable tailored belt. The epitome of modern African corporate grace.',
    225000.00,
    'Sheath Dresses',
    '{"XS","S","M","L","XL"}',
    18,
    '{"/src/assets/images/product_sheath_dress_1790771226613.jpg"}',
    'Japanese Bonded Crepe & Micro-Stretch Elastane'
),
(
    'sdb-suit-eko',
    'The Eko Executive Three-Piece Power Suit',
    'A tour-de-force power ensemble featuring a peak-lapel jacket, tailored tailored waistcoat, and pleated high-rise trousers. Crafted for female CEOs and board directors who lead with authority.',
    420000.00,
    'Power Suits',
    '{"XS","S","M","L","XL"}',
    8,
    '{"/src/assets/images/product_power_suit_1790771238788.jpg"}',
    'Mid-weight English Wool Serge & Gold Filament Weave'
),
(
    'sdb-trousers-marina',
    'The Marina Wide-Leg Trousers & Silk Drape Set',
    'Fluid, high-waisted wide-leg trousers in emerald bottle green paired with an oyster champagne mulberry silk drape blouse. Designed for executive poise from morning board meetings to evening galas in Lagos.',
    260000.00,
    'Luxury Trousers & Silk',
    '{"XS","S","M","L","XL"}',
    12,
    '{"/src/assets/images/product_luxury_trousers_1790771249867.jpg"}',
    'Pure 22-Momme Mulberry Silk & Tropical Wool Gabardine'
),
(
    'sdb-jacket-asooke-tuxedo',
    'The Alara Hand-Woven Aso-Oke Peplum Tuxedo',
    'An exquisite synthesis of Yoruba weaving heritage and sharp executive tailoring. Crafted from midnight black worsted wool sculpted with authentic hand-loomed metallic gold and deep navy Aso-Oke weaves along the architectural peak lapel, flared peplum waist, and cuff facing.',
    345000.00,
    'African Heritage Tailoring',
    '{"XS","S","M","L","XL"}',
    9,
    '{"/src/assets/images/asooke_tuxedo_jacket_1790773988544.jpg"}',
    'Hand-Loomed Yoruba Metallic Aso-Oke & Super 140s Worsted Wool'
),
(
    'sdb-dress-adire-capelet',
    'The Ile-Ife Artisan Adire Silk Capelet Sheath',
    'Modern African corporate majesty. Pure Italian silk faille hand-dyed using ancestral Abeokuta Adire resist-dye techniques in minimalist obsidian indigo and terracotta geometric motifs. Features a floating architectural silk organza capelet.',
    295000.00,
    'African Heritage Tailoring',
    '{"XS","S","M","L","XL"}',
    11,
    '{"/src/assets/images/adire_capelet_dress_1790774002306.jpg"}',
    'Artisanal Hand-Resist Adire Pure Silk Faille with Silk Organza Capelet'
),
(
    'sdb-robe-boubou-executive',
    'The Sahel Executive Power Boubou & Leather Cinch',
    'A contemporary corporate reimagining of the iconic West African Grand Boubou. Tailored from structured obsidian black damask and lightweight linen-crepe with intricate hand-embroidered bronze threadwork.',
    380000.00,
    'African Heritage Tailoring',
    '{"XS","S","M","L","XL"}',
    7,
    '{"/src/assets/images/executive_boubou_robe_1790774015050.jpg"}',
    'Heavyweight Jacquard Damask with High-Twist Crisp Linen-Crepe'
),
(
    'sdb-trench-ankara-bisi',
    'The Victoria Island Ankara-Inlaid Executive Trench',
    'The quintessential global executive outerwear elevated with subtle African pride. Sandstone beige water-resistant Italian gabardine featuring concealed African wax geometric silk facing along the under-collar, storm flaps, and turn-back cuff tabs.',
    350000.00,
    'African Heritage Tailoring',
    '{"XS","S","M","L","XL"}',
    10,
    '{"/src/assets/images/ankara_trench_coat_1790774027334.jpg"}',
    'Weather-Resistant Italian Cotton Gabardine with Pure Silk Ankara Inlays'
),
(
    'sdb-plus-dress-omolara',
    'The Omolara Sculpted Silk-Crepe Column Gown',
    'Masterfully engineered to celebrate voluptuous corporate elegance. Cut from heavyweight matte double-silk crepe with architectural vertical princess darts that elongate the silhouette, a draped surplice crossover bust that flatters without gaping, and a signature brushed 24k gold filigree waist cincher.',
    320000.00,
    'Curated Plus & Silhouette',
    '{"L","XL","1X","2X","3X","4X"}',
    12,
    '{"/src/assets/images/plussize_column_dress_1790774277671.jpg"}',
    'Heavyweight 4-Ply Italian Silk-Crepe & Stretch Cupro Lining'
),
(
    'sdb-plus-suit-moremi',
    'The Moremi Peplum Power Tuxedo & Palazzo Set',
    'Executive grandeur tailored for curvy female directors. Midnight navy Super 130s English wool featuring a sculpted double-breasted peplum jacket that flares gracefully over the hips, paired with high-waisted pleated palazzo trousers. Accentuated with subtle hand-woven metallic gold Aso-Oke peak lapel borders.',
    440000.00,
    'Curated Plus & Silhouette',
    '{"L","XL","1X","2X","3X","4X"}',
    8,
    '{"/src/assets/images/plussize_peplum_suit_1790774290555.jpg"}',
    'Super 130s English Worsted Wool & Hand-Loomed Gold Aso-Oke Trim'
),
(
    'sdb-plus-gown-kaftan-sapphire',
    'The Cleopatra Draped Asymmetric Kaftan-Tuxedo',
    'An authoritative blend of traditional African regal drapery and sharp British bespoke tailoring. Features a sharp peak lapel tuxedo on the right side melting into a floor-sweeping accordion-pleated pure silk cape on the left, finished with delicate gold bullion embroidery along the cuff and hem.',
    395000.00,
    'Curated Plus & Silhouette',
    '{"XL","1X","2X","3X","4X"}',
    6,
    '{"/src/assets/images/plussize_kaftan_tuxedo_1790774302051.jpg"}',
    'Imperial Sapphire Double Silk Georgette & Worsted Wool Serge'
),
(
    'sdb-plus-trench-wrap-camel',
    'The Ikoyi Executive Pleated Wrap Trench & Trouser',
    'Effortless luxury designed to celebrate statuesque proportions. Tailored in camel Italian wool-twill with terracotta silk accents, featuring an elongated shawl collar, generous crossover front closure that eliminates bust strain, and a wide matching sash belt that sculpts the waist effortlessly.',
    360000.00,
    'Curated Plus & Silhouette',
    '{"L","XL","1X","2X","3X","4X"}',
    10,
    '{"/src/assets/images/plussize_wrap_trench_1790774312581.jpg"}',
    'Mid-Weight Italian Virgin Wool Twill with Pure Silk Lining'
)
ON CONFLICT (id) DO NOTHING;

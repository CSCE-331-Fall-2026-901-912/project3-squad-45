-- Sprint 2: richer menu data for the explore-first kiosk.
ALTER TABLE products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- Seed copy and flavor tags for the launch menu. Only fills blanks, so manager edits are never overwritten.
UPDATE products AS p
   SET description = v.description,
       tags = v.tags::text[]
  FROM (VALUES
    ('Classic Milk Tea', 'Smooth black tea shaken with creamy milk. The drink that started it all.', '{creamy,balanced,caffeine}'),
    ('Brown Sugar Milk Tea', 'Fresh milk tea swirled with warm, caramel-like brown sugar syrup.', '{creamy,sweet,caffeine}'),
    ('Taro Milk Tea', 'Nutty, vanilla-sweet taro blended with creamy milk. No tea, no caffeine.', '{creamy,sweet,caffeine-free}'),
    ('Matcha Milk Tea', 'Stone-ground matcha and milk for a grassy, rich, lightly bitter sip.', '{creamy,balanced,caffeine}'),
    ('Thai Milk Tea', 'Bold spiced tea with a sweet, creamy finish.', '{creamy,sweet,caffeine}'),
    ('Oolong Milk Tea', 'Roasted oolong with a toasty aroma, softened by milk.', '{creamy,light,caffeine}'),
    ('Jasmine Green Tea', 'Light, floral green tea. Clean and refreshing.', '{classic,light,caffeine}'),
    ('Honey Green Tea', 'Green tea lightly sweetened with real honey.', '{classic,balanced,caffeine}'),
    ('Mango Green Tea', 'Sweet, juicy mango over cool jasmine green tea.', '{fruity,sweet,caffeine}'),
    ('Strawberry Green Tea', 'Ripe strawberry flavor with fresh green tea.', '{fruity,balanced,caffeine}'),
    ('Passion Fruit Green Tea', 'Tangy passion fruit, bright and tropical.', '{fruity,light,caffeine}'),
    ('Lychee Oolong Tea', 'Delicate lychee over roasted oolong. Fragrant and refreshing.', '{fruity,light,caffeine}'),
    ('Pudding Milk Tea', 'Classic milk tea topped with silky egg pudding.', '{creamy,sweet,caffeine}'),
    ('Red Bean Milk Tea', 'Milk tea with sweet red bean. A cozy favorite.', '{creamy,sweet,caffeine}'),
    ('Tiger Boba Milk Tea', 'Brown sugar tiger stripes, milk tea and chewy tapioca pearls.', '{creamy,sweet,caffeine}'),
    ('Mango Slush', 'Frozen mango blended icy smooth. Made for Texas summers.', '{icy,fruity,sweet,caffeine-free}'),
    ('Strawberry Slush', 'Sweet strawberry frozen into a frosty slush.', '{icy,fruity,sweet,caffeine-free}'),
    ('Taro Slush', 'Creamy taro blended with ice into a thick, frosty treat.', '{icy,creamy,sweet,caffeine-free}'),
    ('Matcha Latte', 'Whisked matcha with steamed-style milk. Smooth and earthy.', '{creamy,balanced,caffeine}'),
    ('Fresh Milk Tea', 'Tea with fresh milk instead of creamer. Light and silky.', '{creamy,light,caffeine}'),
    ('Pumpkin Spice Delight(Seasonal)', 'Seasonal pumpkin spice with cinnamon and cream.', '{creamy,sweet,caffeine-free}')
  ) AS v(name, description, tags)
 WHERE p.name = v.name AND p.description IS NULL;

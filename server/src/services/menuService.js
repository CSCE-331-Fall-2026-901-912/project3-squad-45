import { MENU_DETAILS } from '../settings/menu.js';
import { query } from '../db/pool.js';
import { notFoundError } from '../utils/httpError.js';
import { buildDetail } from '../utils/menuDetails.js';

const MENU_COLUMNS = `product_id AS "productId", name, price, category,
                      is_available AS "isAvailable", popularity,
                      description, image_url AS "imageUrl", tags`;

export const listMenu = ({ includeUnavailable = false } = {}) =>
  query(
    `SELECT ${MENU_COLUMNS} FROM products
      WHERE $1 OR is_available
      ORDER BY category, name`,
    [includeUnavailable],
  );

// Best sellers first; used by the kiosk home page.
export const listFeatured = (limit = MENU_DETAILS.FEATURED_COUNT) =>
  query(
    `SELECT ${MENU_COLUMNS} FROM products
      WHERE is_available
      ORDER BY popularity DESC NULLS LAST, name
      LIMIT $1`,
    [limit],
  );

export async function getMenuItemDetail(productId) {
  const [product] = await query(
    `SELECT ${MENU_COLUMNS} FROM products WHERE product_id = $1 AND is_available`,
    [productId],
  );
  if (!product) throw notFoundError('Menu item not found');
  const ingredients = await query(
    `SELECT i.name FROM product_ingredients pi
       JOIN inventory i ON i.item_id = pi.item_id
      WHERE pi.product_id = $1
      ORDER BY pi.quantity_used DESC`,
    [productId],
  );
  return buildDetail(product, ingredients);
}

export async function createMenuItem({ name, price, category, isAvailable }) {
  const [item] = await query(
    `INSERT INTO products (product_id, name, price, category, is_available)
     VALUES (nextval('products_product_id_seq'), $1, $2, $3, $4)
     RETURNING ${MENU_COLUMNS}`,
    [name, price, category, isAvailable],
  );
  return item;
}

export async function updateMenuItem(productId, { name, price, category, isAvailable }) {
  const [item] = await query(
    `UPDATE products SET name = $2, price = $3, category = $4, is_available = $5
      WHERE product_id = $1
      RETURNING ${MENU_COLUMNS}`,
    [productId, name, price, category, isAvailable],
  );
  if (!item) throw notFoundError('Menu item not found');
  return item;
}

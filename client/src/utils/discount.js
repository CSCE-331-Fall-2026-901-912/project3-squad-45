const roundCents = (amount) => Math.round(amount * 100) / 100;

// Previews a percentage discount in the cart. The server recalculates it when the order is placed.
export function previewDiscount(subtotal, percent = 0) {
  const discountAmount = roundCents((subtotal * Math.min(100, Math.max(0, percent))) / 100);
  return { discountAmount, payable: roundCents(subtotal - discountAmount) };
}

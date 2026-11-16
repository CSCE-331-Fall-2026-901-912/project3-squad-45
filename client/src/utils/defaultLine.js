// A cart line for a drink with the standard options, used when a suggestion is added in one tap.
export function defaultLine(product, options) {
  return {
    productId: product.productId,
    name: product.name,
    toppings: [],
    iceLevel: options.defaultIceLevel,
    sugarLevel: options.defaultSugarLevel,
    quantity: 1,
    unitPrice: product.price,
  };
}

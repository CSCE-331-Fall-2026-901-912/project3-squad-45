import { useCallback, useMemo, useState } from 'react';
import { submitOrder } from '../api/ordersApi';
import { GAME } from '../config/game';
import { removeDiscount, resetDiscount } from '../discount/discountStore';
import { previewDiscount } from '../utils/discount';
import { useDiscount } from './useDiscount';

let nextLineId = 1;

// Shared cart for the cashier and kiosk screens. Lines come from useDrinkConfig.
// Only the kiosk can use Boba Spin discounts.
export function useOrderCart(source) {
  const [lines, setLines] = useState([]);
  const spin = useDiscount();
  const discount = source === GAME.KIOSK_SOURCE && spin.code ? spin : null;

  const addLine = useCallback(
    (line) => setLines((current) => [...current, { ...line, lineId: nextLineId++ }]),
    [],
  );
  const removeLine = useCallback(
    (lineId) => setLines((current) => current.filter((line) => line.lineId !== lineId)),
    [],
  );
  const clear = useCallback(() => {
    setLines([]);
    if (source === GAME.KIOSK_SOURCE) resetDiscount();
  }, [source]);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [lines],
  );
  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const { discountAmount, payable } = useMemo(
    () => previewDiscount(total, discount?.percent),
    [total, discount?.percent],
  );

  // Resolves with { orderId, total, discountAmount } and empties the cart on success.
  const checkout = useCallback(
    async (extra = {}) => {
      const items = lines.map(({ productId, quantity, toppings, iceLevel, sugarLevel }) => ({
        productId, quantity, toppings, iceLevel, sugarLevel,
      }));
      const result = await submitOrder({ source, items, discountCode: discount?.code, ...extra });
      setLines([]);
      if (discount) resetDiscount();
      return result;
    },
    [lines, source, discount],
  );

  return {
    lines, total, itemCount, addLine, removeLine, clear, checkout,
    discount, discountAmount, payable, removeDiscount,
  };
}

import { useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from '../discount/discountStore';

export const useDiscount = () => useSyncExternalStore(subscribe, getSnapshot);

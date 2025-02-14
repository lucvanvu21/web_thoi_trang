import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItemType } from '@/types/indexType';

type CartState = {
  cart: CartItemType[];
  totalAmount: number;
  addItemToCart: (item: CartItemType) => void;
  removeItemFromCart: (variantId: number) => void;
  increaseAmount: (variantId: number) => void;
  decreaseAmount: (variantId: number) => void;
  clearCart: () => void;
  updateCart: (ids: number[]) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      totalAmount: 0,

      addItemToCart: item =>
        set(state => {
          const existingItem = state.cart.find(i => i.variantId === item.variantId);
          console.log('existingItem', existingItem, item);
          let newCart;
          if (existingItem) {
            newCart = state.cart.map(i => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i));
          } else {
            newCart = [...state.cart, item];
          }
          return {
            cart: newCart,
            totalAmount: newCart.reduce((prev, curr) => prev + curr.quantity, 0),
          };
        }),

      removeItemFromCart: variantId =>
        set(state => {
          const newCart = state.cart.filter(i => i.variantId !== variantId);
          return {
            cart: newCart,
            totalAmount: newCart.reduce((prev, curr) => prev + curr.quantity, 0),
          };
        }),

      increaseAmount: variantId =>
        set(state => ({
          cart: state.cart.map(i => (i.variantId === variantId ? { ...i, quantity: i.quantity + 1 } : i)),
          totalAmount: state.cart.reduce((prev, curr) => prev + (curr.variantId === variantId ? 1 : 0), state.totalAmount),
        })),

      decreaseAmount: variantId =>
        set(state => ({
          cart: state.cart.map(i => (i.variantId === variantId ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i)),
          totalAmount: state.cart.reduce((prev, curr) => prev - (curr.variantId === variantId ? 1 : 0), state.totalAmount),
        })),

      clearCart: () => set({ cart: [], totalAmount: 0 }),

      updateCart: ids =>
        set(state => {
          const newCart = state.cart.filter(c => ids.includes(c.variantId));
          return {
            cart: newCart,
            totalAmount: newCart.reduce((prev, curr) => prev + curr.quantity, 0),
          };
        }),
    }),
    { name: 'cart-storage' } // Lưu giỏ hàng vào localStorage
  )
);

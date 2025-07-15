import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalQuantity: number;
  totalAmount: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // 状态
      items: [],
      isOpen: false,
      totalQuantity: 0,
      totalAmount: 0,

      // 操作
      addItem: (product: Product, quantity = 1) => {
        const state = get();
        const existingItem = state.items.find(item => item.productId === product.id);

        let newItems: CartItem[];
        
        if (existingItem) {
          // 如果商品已存在，增加数量
          newItems = state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // 如果是新商品，添加到购物车
          const newItem: CartItem = {
            id: Date.now(), // 临时ID，实际应该由后端生成
            productId: product.id,
            product,
            quantity,
          };
          newItems = [...state.items, newItem];
        }

        const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        set({
          items: newItems,
          totalQuantity,
          totalAmount,
        });
      },

      removeItem: (productId: number) => {
        const state = get();
        const newItems = state.items.filter(item => item.productId !== productId);
        const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        set({
          items: newItems,
          totalQuantity,
          totalAmount,
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const state = get();
        
        if (quantity <= 0) {
          // 如果数量为0或负数，移除商品
          get().removeItem(productId);
          return;
        }

        const newItems = state.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );

        const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        set({
          items: newItems,
          totalQuantity,
          totalAmount,
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isOpen });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalAmount: state.totalAmount,
      }),
    }
  )
); 
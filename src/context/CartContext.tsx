import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ClothingSize } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: ClothingSize, quantity?: number) => void;
  removeFromCart: (productId: string, size: ClothingSize) => void;
  updateQuantity: (productId: string, size: ClothingSize, quantity: number) => void;
  updateItemSize: (productId: string, oldSize: ClothingSize, newSize: ClothingSize) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItemsCount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingZone: 'lagos-island' | 'lagos-mainland' | 'abuja-fct' | 'other-states';
  setShippingZone: (zone: 'lagos-island' | 'lagos-mainland' | 'abuja-fct' | 'other-states') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'sdb_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    // Default starter item for instant delight: Victoria Emerald Blazer size M
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingZone, setShippingZone] = useState<'lagos-island' | 'lagos-mainland' | 'abuja-fct' | 'other-states'>('lagos-island');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  const addToCart = (product: Product, size: ClothingSize, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, size, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: ClothingSize) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: ClothingSize, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const updateItemSize = (productId: string, oldSize: ClothingSize, newSize: ClothingSize) => {
    setCart((prev) => {
      const itemToMove = prev.find((item) => item.product.id === productId && item.size === oldSize);
      if (!itemToMove) return prev;

      // Check if item with newSize already exists
      const existingNewIndex = prev.findIndex((item) => item.product.id === productId && item.size === newSize);
      if (existingNewIndex > -1) {
        return prev
          .filter((item) => !(item.product.id === productId && item.size === oldSize))
          .map((item, idx) =>
            idx === existingNewIndex ? { ...item, quantity: item.quantity + itemToMove.quantity } : item
          );
      }

      return prev.map((item) =>
        item.product.id === productId && item.size === oldSize ? { ...item, size: newSize } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Complimentary delivery across Lagos for orders >= ₦300,000
  let calculatedShipping = 15000;
  if (subtotal >= 300000) {
    calculatedShipping = 0;
  } else if (shippingZone === 'lagos-mainland') {
    calculatedShipping = 12000;
  } else if (shippingZone === 'lagos-island') {
    calculatedShipping = 10000;
  } else if (shippingZone === 'abuja-fct') {
    calculatedShipping = 25000;
  } else {
    calculatedShipping = 30000;
  }

  const shippingFee = cart.length === 0 ? 0 : calculatedShipping;
  const totalAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemSize,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        subtotal,
        shippingFee,
        totalAmount,
        shippingZone,
        setShippingZone,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

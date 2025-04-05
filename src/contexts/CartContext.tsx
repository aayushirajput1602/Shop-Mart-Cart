
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { ProductType } from '@/types';

interface CartItem extends ProductType {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductType, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } else {
      // Clear cart when logged out
      setCart([]);
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product: ProductType, quantity: number = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      toast.success("Cart cleared");
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

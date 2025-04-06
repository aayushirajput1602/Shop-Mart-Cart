
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  inventory_count: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart from Supabase when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }

      setIsLoading(true);
      try {
        // Get cart items from database
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            quantity,
            product_id,
            products!inner(
              id,
              name,
              description,
              price,
              image_url,
              category,
              inventory_count
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          // Transform the nested data structure
          const transformedCart = data.map((item: any) => ({
            ...item.products,
            quantity: item.quantity
          }));
          
          setCart(transformedCart);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load your cart');
        // Fallback to localStorage
        const savedCart = localStorage.getItem(`cart-${user.id}`);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Save cart to localStorage as backup
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product: any, quantity: number = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if product is already in cart
      const existingCartItem = cart.find(item => item.id === product.id);
      
      if (existingCartItem) {
        // Update quantity in database
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingCartItem.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;
        
        // Update local state
        setCart(prevCart => 
          prevCart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          )
        );
      } else {
        // Add new item to database
        const { error } = await supabase
          .from('cart_items')
          .insert({ 
            user_id: user.id, 
            product_id: product.id, 
            quantity: quantity 
          });

        if (error) throw error;
        
        // Add to local state
        setCart(prevCart => [
          ...prevCart, 
          { ...product, quantity }
        ]);
      }
      
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      
      // Fallback to local state only
      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += quantity;
          return updatedCart;
        } else {
          return [...prevCart, { ...product, quantity }];
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Remove from database
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      // Update local state
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
      
      // Fallback to local state only
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update quantity in database
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      // Update local state
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update quantity');
      
      // Fallback to local state only
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Delete all cart items from database
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setCart([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      
      // Fallback to local state only
      setCart([]);
    } finally {
      setIsLoading(false);
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
        totalPrice,
        isLoading
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

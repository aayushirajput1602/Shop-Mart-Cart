
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProductType } from '@/types';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: ProductType;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductType, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  calculateTotal: () => number;
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
            products:product_id(
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
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product: {
              ...item.products,
              rating: 4.5, // Add default rating
              inStock: item.products.inventory_count > 0
            }
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

    // Set up real-time subscription for product inventory and cart updates
    const channel = supabase
      .channel('cart-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        },
        (payload) => {
          // When a product is updated, refresh the cart to get latest inventory info
          if (user) {
            fetchCart();
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          // When cart items change, refresh the cart
          if (user) {
            fetchCart();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Save cart to localStorage as backup
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product: ProductType, quantity: number = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    // Get the latest inventory count from the database
    const { data: latestProduct, error: productError } = await supabase
      .from('products')
      .select('inventory_count')
      .eq('id', product.id)
      .single();

    if (productError) {
      console.error('Error checking inventory:', productError);
      toast.error('Failed to check product availability');
      return;
    }

    const currentInventory = latestProduct.inventory_count;

    // Check if product is in stock and has enough inventory
    if (currentInventory < quantity) {
      toast.error(`Sorry, there are only ${currentInventory} units available`);
      return;
    }

    if (currentInventory === 0) {
      toast.error('This product is out of stock');
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if product is already in cart
      const existingCartItem = cart.find(item => item.product_id === product.id);
      
      if (existingCartItem) {
        // Check if we have enough inventory for the combined quantity
        const newQuantity = existingCartItem.quantity + quantity;
        
        if (currentInventory < newQuantity) {
          toast.error(`Sorry, we don't have enough in stock. You can add ${currentInventory - existingCartItem.quantity} more.`);
          setIsLoading(false);
          return;
        }
        
        // Update quantity in database
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCartItem.id);

        if (error) throw error;
        
        // Update local state
        setCart(prevCart => 
          prevCart.map(item => 
            item.id === existingCartItem.id 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
      } else {
        // Add new item to database
        const { data, error } = await supabase
          .from('cart_items')
          .insert({ 
            user_id: user.id, 
            product_id: product.id, 
            quantity: quantity 
          })
          .select('id')
          .single();

        if (error) throw error;
        
        // Add to local state
        setCart(prevCart => [
          ...prevCart, 
          { 
            id: data.id,
            product_id: product.id,
            quantity,
            product: {
              ...product,
              inventory_count: currentInventory
            }
          }
        ]);
      }

      // Update the product inventory in the database
      const newInventory = currentInventory - quantity;
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          inventory_count: newInventory,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) {
        console.error('Error updating inventory:', updateError);
        toast.error('Failed to update inventory');
      }
      
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      
      // Fallback to local state only
      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.product_id === product.id);
        
        if (existingItemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += quantity;
          return updatedCart;
        } else {
          return [...prevCart, { 
            id: `local-${Date.now()}`,
            product_id: product.id,
            quantity,
            product
          }];
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Remove from database
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      // Update local state
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
      
      // Fallback to local state only
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;
    
    if (quantity <= 0) {
      removeFromCart(itemId);
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
        .eq('id', itemId);

      if (error) throw error;
      
      // Update local state
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update quantity');
      
      // Fallback to local state only
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === itemId ? { ...item, quantity } : item
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

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = calculateTotal();

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
        isLoading,
        calculateTotal
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

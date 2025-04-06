import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem } from '@/types';

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch wishlist from Supabase when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }

      setIsLoading(true);
      try {
        // Get wishlist items from database
        const { data, error } = await supabase
          .from('wishlist_items')
          .select(`
            id,
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
          const transformedWishlist = data.map((item: any) => ({
            id: item.products.id,
            name: item.products.name,
            description: item.products.description,
            price: item.products.price,
            image_url: item.products.image_url,
            category: item.products.category,
            inventory_count: item.products.inventory_count
          }));
          
          setWishlist(transformedWishlist);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        // Fallback to localStorage
        const savedWishlist = localStorage.getItem(`wishlist-${user.id}`);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Save wishlist to localStorage as backup
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist-${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = async (product: any) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    // Check if product is already in wishlist
    if (wishlist.some(item => item.id === product.id)) {
      toast.info("Item already in wishlist");
      return;
    }

    try {
      setIsLoading(true);
      
      // Add to database
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ 
          user_id: user.id, 
          product_id: product.id
        });

      if (error) throw error;
      
      // Update local state
      const wishlistItem: WishlistItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url || product.image,
        category: product.category,
        inventory_count: product.inventory_count || 0
      };
      
      setWishlist(prev => [...prev, wishlistItem]);
      toast.success(`${product.name} added to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
      
      // Fallback to local state only
      const wishlistItem: WishlistItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url || product.image,
        category: product.category,
        inventory_count: product.inventory_count || 0
      };
      
      setWishlist(prev => [...prev, wishlistItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Remove from database
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      // Update local state
      setWishlist(prev => prev.filter(item => item.id !== productId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
      
      // Fallback to local state only
      setWishlist(prev => prev.filter(item => item.id !== productId));
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Delete all wishlist items from database
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setWishlist([]);
      toast.success("Wishlist cleared");
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
      
      // Fallback to local state only
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        isLoading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

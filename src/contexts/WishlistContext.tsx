
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { ProductType } from '@/types';

interface WishlistContextType {
  wishlist: ProductType[];
  addToWishlist: (product: ProductType) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductType[]>([]);
  const { user } = useAuth();

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist-${user.id}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } else {
      // Clear wishlist when logged out
      setWishlist([]);
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist-${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = (product: ProductType) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    // Check if product is already in wishlist
    if (wishlist.some(item => item.id === product.id)) {
      toast.info("Item already in wishlist");
      return;
    }

    setWishlist(prev => [...prev, product]);
    toast.success(`${product.name} added to wishlist`);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    toast.success("Item removed from wishlist");
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (user) {
      toast.success("Wishlist cleared");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
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

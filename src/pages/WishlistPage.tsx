
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { items, removeFromWishlist } = useWishlist();

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your wishlist</h2>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">
            Items added to your wishlist will be saved here. Start browsing our products to add items to your wishlist!
          </p>
          <Button asChild size="lg">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ProductCard 
            key={item.id} 
            product={item} 
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

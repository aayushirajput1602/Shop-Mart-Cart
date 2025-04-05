
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (productId: string) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  };

  if (!user) {
    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Wishlist</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Please sign in to view your wishlist</h3>
            <p className="text-muted-foreground text-center mb-6">
              You need to be logged in to save items to your wishlist.
            </p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Wishlist</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Save items you're interested in for later by adding them to your wishlist.
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <Button variant="outline" onClick={clearWishlist}>
          Clear Wishlist
        </Button>
      </div>

      <div className="product-grid">
        {wishlist.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-slate-50 relative">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image || "https://placehold.co/600x400"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <Link to={`/product/${product.id}`} className="font-medium hover:underline">
                {product.name}
              </Link>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold">${product.price.toFixed(2)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 flex items-center gap-1"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

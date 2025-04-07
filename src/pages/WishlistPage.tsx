
import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Heart, Trash } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login page if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Convert WishlistItem to ProductType by adding required properties
  const productItems = wishlistItems.map(item => ({
    ...item,
    rating: item.rating || 4.0, // Provide a default rating if missing
    inStock: item.inventory_count > 0 // Calculate inStock based on inventory
  }));

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        {wishlistItems.length > 0 && (
          <Button variant="outline" onClick={clearWishlist}>
            <Trash className="h-4 w-4 mr-2" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
                <p className="text-muted-foreground">
                  Items added to your wishlist will appear here.
                </p>
              </div>
              <Button asChild>
                <Link to="/products">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

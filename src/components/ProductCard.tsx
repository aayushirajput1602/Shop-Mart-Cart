
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  image?: string; // For backward compatibility
  category: string;
  inventory_count: number;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  const inWishlist = isInWishlist(product.id);
  const inStock = product.inventory_count > 0;
  const lowStock = inStock && product.inventory_count <= 5;
  
  // Use image_url if available, fall back to image, then to placeholder
  const imageUrl = product.image_url || product.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
  const rating = product.rating || (Math.random() * 2 + 3).toFixed(1);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to your wishlist');
      return;
    }
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to your cart');
      return;
    }
    
    if (!inStock) {
      toast.error('This product is out of stock');
      return;
    }
    
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className={cn(
      "group overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:border-primary/30",
      featured && "md:grid md:grid-cols-2 md:items-center"
    )}>
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className={cn(
          "relative overflow-hidden aspect-square bg-gradient-to-br from-slate-50 to-slate-100",
          featured && "md:aspect-[4/3]"
        )}>
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
            onClick={toggleWishlist}
          >
            <Heart className={cn(
              "h-5 w-5",
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            )} />
          </Button>
          
          {/* Stock status badge */}
          {!inStock ? (
            <Badge variant="destructive" className="absolute top-3 left-3 shadow-sm">
              Out of stock
            </Badge>
          ) : lowStock ? (
            <Badge variant="secondary" className="absolute top-3 left-3 bg-amber-100 text-amber-700 border-amber-200 shadow-sm">
              <Clock className="h-3 w-3 mr-1" />
              Only {product.inventory_count} left
            </Badge>
          ) : null}
        </div>
      </Link>

      <div>
        <CardContent className={cn("p-5", featured && "md:p-6")}>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="rounded-md bg-slate-50">
              {product.category}
            </Badge>
            <div className="flex items-center ml-auto">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium ml-1">{rating}</span>
            </div>
          </div>
          
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-lg line-clamp-1 hover:underline transition-colors hover:text-primary">{product.name}</h3>
          </Link>
          
          {featured && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Button 
            className="w-full gap-2 rounded-lg shadow-sm" 
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;

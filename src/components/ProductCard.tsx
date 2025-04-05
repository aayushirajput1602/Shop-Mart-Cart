
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductType;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className={cn(
      "group overflow-hidden rounded-lg border transition-all hover:shadow-md",
      featured && "md:grid md:grid-cols-2 md:items-center"
    )}>
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className={cn(
          "relative overflow-hidden aspect-square",
          featured && "md:aspect-[4/3]"
        )}>
          <img
            src={product.image || "https://placehold.co/600x400"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={toggleWishlist}
          >
            <Heart className={cn(
              "h-5 w-5",
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            )} />
          </Button>
          
          {/* Out of stock badge */}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of stock
            </Badge>
          )}
        </div>
      </Link>

      <div>
        <CardContent className={cn("p-4", featured && "md:p-6")}>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="rounded-sm">
              {product.category}
            </Badge>
            <div className="flex items-center ml-auto">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium ml-1">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-base line-clamp-1 hover:underline">{product.name}</h3>
          </Link>
          
          {featured && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full gap-2" 
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;

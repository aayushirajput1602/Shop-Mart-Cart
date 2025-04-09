import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Shield, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface ProductCardProps {
  product: ProductType;
  featured?: boolean;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false, compact = false }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [currentInventory, setCurrentInventory] = useState(product.inventory_count);
  const [isInventoryLoading, setIsInventoryLoading] = useState(false);
  
  const inWishlist = isInWishlist(product.id);
  const inStock = currentInventory > 0;
  const lowStock = inStock && currentInventory <= 5;
  
  useEffect(() => {
    const channel = supabase
      .channel(`product-${product.id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'products',
          filter: `id=eq.${product.id}`
        },
        (payload: any) => {
          if (payload.new) {
            setCurrentInventory(payload.new.inventory_count);
          }
        }
      )
      .subscribe();

    const fetchLatestInventory = async () => {
      setIsInventoryLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('inventory_count')
          .eq('id', product.id)
          .single();
          
        if (error) throw error;
        if (data) {
          setCurrentInventory(data.inventory_count);
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
      } finally {
        setIsInventoryLoading(false);
      }
    };
    
    fetchLatestInventory();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);
  
  const getImageUrl = () => {
    if (product.image_url) {
      return product.image_url;
    }
    
    if (product.image) {
      return product.image;
    }
    
    const categoryImageMap: Record<string, string> = {
      'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000',
      'clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000',
      'books': 'https://images.unsplash.com/photo-1510172951991-856a62a9cde5?q=80&w=1000',
      'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000',
      'home': 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=1000',
      'sports': 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1000',
      'toys': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000',
      'gaming': 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=1000',
      'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000',
      'jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000'
    };
    
    return categoryImageMap[product.category.toLowerCase()] || 'https://images.unsplash.com/photo-1586952518485-11b180e92764?q=80&w=1000';
  };
  
  const imageUrl = getImageUrl();
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
      addToWishlist({
        ...product,
        rating: Number(rating),
        inStock: inStock
      } as ProductType);
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
    
    addToCart({
      ...product,
      inventory_count: currentInventory,
      rating: Number(rating),
      inStock: inStock
    } as ProductType, 1);
  };

  if (compact) {
    return (
      <Card className="group overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:border-primary/30 h-full flex flex-col">
        <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
          <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-slate-50 to-slate-100">
            <img
              src={imageUrl}
              alt={product.name}
              className={cn(
                "object-cover w-full h-full transition-transform duration-500 group-hover:scale-110",
                !inStock && "opacity-70"
              )}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1586952518485-11b180e92764?q=80&w=1000';
              }}
            />
            
            {!inStock ? (
              <Badge variant="destructive" className="absolute top-3 left-3 shadow-sm flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Out of stock
              </Badge>
            ) : lowStock ? (
              <Badge variant="secondary" className="absolute top-3 left-3 bg-amber-100 text-amber-700 border-amber-200 shadow-sm">
                <Clock className="h-3 w-3 mr-1" />
                Only {currentInventory} left
              </Badge>
            ) : null}
            
            {!inStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
                <span className="text-red-600 font-semibold text-xl mb-2">Out of Stock</span>
                <span className="text-muted-foreground text-sm">Check back later</span>
              </div>
            )}
          </div>
          
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs ml-1">{rating}</span>
              </div>
            </div>
          </div>
        </Link>
        
        <CardFooter className="p-3 pt-0 grid grid-cols-2 gap-2">
          <Button 
            className={cn(
              "w-full gap-1 rounded-lg text-xs py-1 px-2 h-auto",
              !inStock && "opacity-70"
            )}
            size="sm"
            disabled={!inStock || isInventoryLoading}
            onClick={handleAddToCart}
          >
            {isInventoryLoading ? (
              <span className="flex items-center">
                <Clock className="h-3 w-3 animate-spin mr-1" />
                Loading...
              </span>
            ) : inStock ? (
              <>
                <ShoppingCart className="h-3 w-3" />
                Add
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Out of Stock
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className={cn(
              "w-full gap-1 rounded-lg text-xs py-1 px-2 h-auto",
              inWishlist && "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-500 border-red-200"
            )}
            onClick={toggleWishlist}
          >
            <Heart className={cn(
              "h-3 w-3",
              inWishlist && "fill-red-500"
            )} />
            {inWishlist ? "Saved" : "Save"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

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
            className={cn(
              "object-cover w-full h-full transition-transform duration-500 group-hover:scale-110",
              !inStock && "opacity-70"
            )}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1586952518485-11b180e92764?q=80&w=1000';
            }}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm",
              inWishlist && "bg-red-50 text-red-500 hover:bg-red-100"
            )}
            onClick={toggleWishlist}
          >
            <Heart className={cn(
              "h-5 w-5",
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            )} />
          </Button>
          
          {!inStock ? (
            <Badge variant="destructive" className="absolute top-3 left-3 shadow-sm flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Out of stock
            </Badge>
          ) : lowStock ? (
            <Badge variant="secondary" className="absolute top-3 left-3 bg-amber-100 text-amber-700 border-amber-200 shadow-sm">
              <Clock className="h-3 w-3 mr-1" />
              Only {currentInventory} left
            </Badge>
          ) : null}
          
          {!inStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
              <span className="text-red-600 font-semibold text-xl mb-2">Out of Stock</span>
              <span className="text-muted-foreground text-sm">Check back later</span>
            </div>
          )}
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
          
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {product.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">
              {isInventoryLoading ? (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 animate-spin mr-1" />
                  Checking...
                </span>
              ) : inStock ? (
                `${currentInventory} in stock`
              ) : (
                'Out of stock'
              )}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          <Button 
            className={cn(
              "flex-1 gap-2 rounded-lg shadow-sm",
              !inStock && "opacity-70"
            )}
            disabled={!inStock || isInventoryLoading}
            onClick={handleAddToCart}
          >
            {isInventoryLoading ? (
              <span className="flex items-center">
                <Clock className="h-4 w-4 animate-spin mr-1" />
                Checking Stock...
              </span>
            ) : inStock ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Out of Stock
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            className={cn(
              "gap-2 rounded-lg",
              inWishlist && "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-500 border-red-200"
            )}
            onClick={toggleWishlist}
          >
            <Heart className={cn(
              "h-4 w-4",
              inWishlist && "fill-red-500"
            )} />
            {inWishlist ? "Saved" : "Save"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;

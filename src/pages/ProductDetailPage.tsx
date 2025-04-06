
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Star, Truck, RotateCcw, ShieldCheck, Minus, Plus, ChevronLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProduct(data);
        } else {
          navigate('/products');
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-4 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }
  
  const inWishlist = isInWishlist(product.id);
  const inStock = product.inventory_count > 0;
  const lowStock = inStock && product.inventory_count <= 5;
  
  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to your cart');
      return;
    }
    
    if (!inStock) {
      toast.error('This product is out of stock');
      return;
    }
    
    if (quantity > product.inventory_count) {
      toast.error(`Sorry, only ${product.inventory_count} items available`);
      setQuantity(product.inventory_count);
      return;
    }
    
    addToCart(product, quantity);
    toast.success(`${product.name} (x${quantity}) added to cart`);
  };
  
  const toggleWishlist = () => {
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
  
  const incrementQuantity = () => {
    if (quantity < product.inventory_count) {
      setQuantity(prev => prev + 1);
    } else {
      toast.info(`Sorry, only ${product.inventory_count} items available`);
    }
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex items-center justify-center h-[500px]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              No image available
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
            {!inStock && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Out of stock
              </span>
            )}
            {lowStock && (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Low stock
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating || 4) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {(product.rating || 4).toFixed(1)} rating
            </span>
          </div>
          
          <div className="text-3xl font-bold mb-4 text-primary">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Inventory Status */}
          <div className="mb-6 flex items-center">
            {inStock ? (
              <div className="flex items-center text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md">
                <CheckCircle className="h-5 w-5 mr-2 text-emerald-700" />
                <span>
                  {lowStock 
                    ? `Only ${product.inventory_count} left in stock - order soon` 
                    : 'In Stock - Ready to Ship'}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-700 bg-red-50 px-3 py-2 rounded-md">
                <AlertCircle className="h-5 w-5 mr-2 text-red-700" />
                <span>Currently out of stock</span>
              </div>
            )}
          </div>
          
          <Separator className="my-6" />
          
          {/* Quantity Selector */}
          {inStock && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-11 w-11 rounded-l-lg rounded-r-none border-r-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="h-11 px-4 flex items-center justify-center border border-input bg-background min-w-[60px]">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.inventory_count}
                  className="h-11 w-11 rounded-r-lg rounded-l-none border-l-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              className="w-full sm:w-auto flex-1 gap-2 rounded-lg text-base py-6"
              disabled={!inStock}
              onClick={handleAddToCart}
              size="lg"
            >
              <ShoppingCart className="h-5 w-5" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "w-full sm:w-auto gap-2 rounded-lg py-6",
                inWishlist && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
              )}
              onClick={toggleWishlist}
            >
              <Heart className={cn(
                "h-5 w-5",
                inWishlist && "fill-current"
              )} />
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
          
          {/* Not logged in message */}
          {!user && (
            <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-lg mb-6">
              Please <Link to="/login" className="font-medium underline">log in</Link> to add items to your cart or wishlist.
            </div>
          )}
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
              <div className="p-2 rounded-full bg-slate-100">
                <Truck className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Free Shipping</h4>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
              <div className="p-2 rounded-full bg-slate-100">
                <RotateCcw className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Easy Returns</h4>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
              <div className="p-2 rounded-full bg-slate-100">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Secure Checkout</h4>
                <p className="text-xs text-muted-foreground">Encrypted payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

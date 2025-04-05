
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Star, Truck, RotateCcw, ShieldCheck, Minus, Plus, ChevronLeft } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }
  
  const inWishlist = isInWishlist(product.id);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="bg-slate-50 rounded-lg overflow-hidden">
          <img
            src={product.image || "https://placehold.co/600x400"}
            alt={product.name}
            className="w-full h-auto object-contain aspect-square"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Out of stock
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {product.rating.toFixed(1)} rating
            </span>
          </div>
          
          <div className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <Separator className="my-6" />
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline" 
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              className="w-full sm:w-auto flex-1 gap-2"
              disabled={!product.inStock || !user}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-auto gap-2",
                inWishlist && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
              )}
              onClick={toggleWishlist}
              disabled={!user}
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
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md mb-4">
              Please <Link to="/login" className="font-medium underline">log in</Link> to add items to your cart or wishlist.
            </div>
          )}
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-full bg-blue-50">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Free Shipping</h4>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-full bg-blue-50">
                <RotateCcw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Easy Returns</h4>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-full bg-blue-50">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
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

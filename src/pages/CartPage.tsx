
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/types';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateCartQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  
  // Helper function to handle quantity updates
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > (item.product.inventory_count || 10)) return;
    updateCartQuantity(item.product.id, newQuantity);
  };

  // If not logged in
  if (!user) {
    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Shopping Cart</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your cart
          </p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
              
              <Separator className="mb-6" />
              
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-b-0">
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <Link to={`/product/${item.product.id}`}>
                      <img 
                        src={item.product.image_url || item.product.image || 'https://placehold.co/600x400'} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          <Link to={`/product/${item.product.id}`} className="hover:underline">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {item.product.description}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={item.quantity >= (item.product.inventory_count || 10)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-sm sticky top-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Estimated Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <Button asChild className="w-full mt-4">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

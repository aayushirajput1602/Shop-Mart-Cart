import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, Truck } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart, totalItems, calculateTotal } = useCart();
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: user?.email || '',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expDate: '',
    cvv: '',
  });

  const [step, setStep] = useState(1);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || 
        !shippingInfo.state || !shippingInfo.zip || !shippingInfo.email) {
      toast.error('Please fill out all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!paymentInfo.cardNumber || !paymentInfo.cardName || 
        !paymentInfo.expDate || !paymentInfo.cvv) {
      toast.error('Please fill out all payment fields');
      return;
    }
    
    // Process order
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/checkout/success');
  };

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-8">Add some products to your cart to proceed with checkout.</p>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === 1 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center">
                    1
                  </div>
                  <CardTitle>Shipping Information</CardTitle>
                </div>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitShipping}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={shippingInfo.name} 
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={shippingInfo.address} 
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={shippingInfo.city} 
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={shippingInfo.state} 
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input 
                      id="zip" 
                      name="zip" 
                      value={shippingInfo.zip} 
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={shippingInfo.email} 
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={shippingInfo.phone} 
                      onChange={handleShippingChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Continue to Payment</Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center">
                    2
                  </div>
                  <CardTitle>Payment Information</CardTitle>
                </div>
                <CardDescription>Enter your payment details</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitPayment}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input 
                        id="cardNumber" 
                        name="cardNumber" 
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber} 
                        onChange={handlePaymentChange}
                        required
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      name="cardName" 
                      value={paymentInfo.cardName} 
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expDate">Expiration Date</Label>
                      <Input 
                        id="expDate" 
                        name="expDate" 
                        placeholder="MM/YY"
                        value={paymentInfo.expDate} 
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        name="cvv" 
                        placeholder="123"
                        value={paymentInfo.cvv} 
                        onChange={handlePaymentChange}
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                  <Button type="submit" className="w-full">Place Order</Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setStep(1)}
                  >
                    Back to Shipping
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
        
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="font-medium">${calculateTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p className="font-medium">Free</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p className="font-medium">${(calculateTotal() * 0.07).toFixed(2)}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <p>Total</p>
                  <p>${(calculateTotal() * 1.07).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="h-4 w-4 mr-2" />
                Free shipping on all orders
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 mr-2" />
                Secure checkout
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

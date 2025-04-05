
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

interface ShippingFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData>({
    fullName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    // In a real app, this would communicate with a payment API
    // For this demo, we'll just simulate a successful payment after a delay
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Once payment is successful, clear the cart and redirect
      clearCart();
      
      // Save the order details to localStorage for demo purposes
      const order = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        items: cart,
        totalAmount: totalPrice,
        shippingAddress: shippingInfo,
        paymentMethod,
        status: 'processing',
        createdAt: new Date().toISOString(),
      };
      
      const orders = JSON.parse(localStorage.getItem(`orders-${user.id}`) || '[]');
      orders.push(order);
      localStorage.setItem(`orders-${user.id}`, JSON.stringify(orders));
      
      navigate('/checkout/success');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      required
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={shippingInfo.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                      Credit/Debit Card
                    </Label>
                    <div className="flex gap-2">
                      <div className="h-8 w-12 rounded bg-slate-100 p-1">
                        <div className="h-full w-full bg-slate-200 rounded" />
                      </div>
                      <div className="h-8 w-12 rounded bg-slate-100 p-1">
                        <div className="h-full w-full bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                    <div className="h-8 w-12 rounded bg-slate-100 p-1">
                      <div className="h-full w-full bg-slate-200 rounded" />
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'credit_card' && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-1">
                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

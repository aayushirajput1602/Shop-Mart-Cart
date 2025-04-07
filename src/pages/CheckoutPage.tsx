import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types';

interface Address {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutPage = () => {
  const [address, setAddress] = useState<Address>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(10);
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountedSubtotal = subtotal - discount;
    return discountedSubtotal + shippingCost;
  };

  const applyDiscount = () => {
    if (discountCode === 'SUMMER20') {
      setDiscount(calculateSubtotal() * 0.2);
      toast.success('Discount applied!');
    } else {
      toast.error('Invalid discount code');
      setDiscount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to place an order.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: calculateTotal(),
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error('Failed to create order. Please try again.');
        return;
      }

      // Create order items
      for (const item of cartItems) {
        const { error: orderItemError } = await supabase
          .from('order_items')
          .insert([
            {
              order_id: orderData.id,
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            },
          ]);

        if (orderItemError) {
          console.error('Error creating order item:', orderItemError);
          toast.error('Failed to create order item. Please try again.');
          return;
        }
      }

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAddressForm = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
          <CardDescription>Enter your shipping details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={address.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={address.address}
              onChange={handleInputChange}
              placeholder="123 Main St"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              placeholder="New York"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={address.postalCode}
                onChange={handleInputChange}
                placeholder="10001"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                type="text"
                id="country"
                name="country"
                value={address.country}
                onChange={handleInputChange}
                placeholder="USA"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPaymentSection = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose your payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="credit_card" className="space-y-2" onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" disabled />
              <Label htmlFor="paypal">PayPal (Coming Soon)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    );
  };

  const renderDiscountSection = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Discount Code</CardTitle>
          <CardDescription>Enter your discount code</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="discountCode">Code</Label>
            <div className="flex items-center">
              <Input
                type="text"
                id="discountCode"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="SUMMER20"
              />
              <Button className="ml-2" onClick={applyDiscount}>
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Order summary section
  const renderOrderSummary = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your cart is empty</p>
              <Button className="mt-4" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={item.product.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderAddressForm()}
            {renderPaymentSection()}
            {renderDiscountSection()}
          </div>
          <div>
            {renderOrderSummary()}
          </div>
        </div>
        <Card>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CheckoutPage;

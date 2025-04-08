
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
import { supabase } from '@/integrations/supabase/client';

interface FormErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  cardName?: string;
  expDate?: string;
  cvv?: string;
}

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    
    // Format expiration date
    if (name === 'expDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }
    
    setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateShippingForm = () => {
    const newErrors: FormErrors = {};
    
    if (!shippingInfo.name.trim()) newErrors.name = 'Name is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors: FormErrors = {};
    
    const cardNumberStripped = paymentInfo.cardNumber.replace(/\s/g, '');
    
    if (!cardNumberStripped) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberStripped.length < 14 || cardNumberStripped.length > 16) {
      newErrors.cardNumber = 'Card number must be between 14-16 digits';
    }
    
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Name on card is required';
    
    if (!paymentInfo.expDate) {
      newErrors.expDate = 'Expiration date is required';
    } else {
      const [month, year] = paymentInfo.expDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expDate = 'Enter date in MM/YY format';
      } else if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expDate = 'Month must be between 01-12';
      } else if (
        (parseInt(year) < currentYear) || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expDate = 'Card has expired';
      }
    }
    
    if (!paymentInfo.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentInfo.cvv.length < 3 || paymentInfo.cvv.length > 4) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateShippingForm()) {
      setStep(2);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate total with tax
      const subtotal = calculateTotal();
      const tax = subtotal * 0.07;
      const total = subtotal + tax;
      
      // Create order in database if user is logged in
      if (user) {
        // Create order in database
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            total_amount: total,
            status: 'pending',
          })
          .select('id')
          .single();
        
        if (orderError) throw orderError;
        
        if (orderData) {
          // Create order items
          const orderItems = cart.map(item => ({
            order_id: orderData.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.price
          }));
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
          
          if (itemsError) throw itemsError;
          
          // Also save to localStorage as backup
          const order = {
            id: orderData.id,
            userId: user.id,
            totalAmount: total,
            products: cart.map(item => ({
              productId: item.product_id,
              quantity: item.quantity,
              price: item.product.price
            })),
            shippingAddress: {
              fullName: shippingInfo.name,
              address: shippingInfo.address,
              city: shippingInfo.city,
              postalCode: shippingInfo.zip,
              country: shippingInfo.state
            },
            status: 'pending',
            paymentStatus: 'paid',
            createdAt: new Date().toISOString()
          };
          
          // Store in localStorage
          const existingOrders = JSON.parse(localStorage.getItem(`orders-${user.id}`) || '[]');
          localStorage.setItem(`orders-${user.id}`, JSON.stringify([order, ...existingOrders]));
        }
      } else {
        // Just for demo purposes - normally this would be handled by the backend
        const orderId = `order-${Date.now()}`;
        const order = {
          id: orderId,
          userId: 'guest',
          totalAmount: total,
          products: cart.map(item => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.product.price
          })),
          shippingAddress: {
            fullName: shippingInfo.name,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.zip,
            country: shippingInfo.state
          },
          status: 'pending',
          paymentStatus: 'paid',
          createdAt: new Date().toISOString()
        };
        
        // Store in localStorage
        const guestOrders = JSON.parse(localStorage.getItem('guest-orders') || '[]');
        localStorage.setItem('guest-orders', JSON.stringify([order, ...guestOrders]));
      }
      
      // Clear cart and redirect to success page
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/checkout/success');
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('There was a problem processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={shippingInfo.address} 
                      onChange={handleShippingChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={shippingInfo.city} 
                        onChange={handleShippingChange}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={shippingInfo.state} 
                        onChange={handleShippingChange}
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input 
                      id="zip" 
                      name="zip" 
                      value={shippingInfo.zip} 
                      onChange={handleShippingChange}
                      className={errors.zip ? "border-red-500" : ""}
                    />
                    {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={shippingInfo.email} 
                      onChange={handleShippingChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                        className={errors.cardNumber ? "border-red-500" : ""}
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      name="cardName" 
                      value={paymentInfo.cardName} 
                      onChange={handlePaymentChange}
                      className={errors.cardName ? "border-red-500" : ""}
                    />
                    {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName}</p>}
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
                        maxLength={5}
                        className={errors.expDate ? "border-red-500" : ""}
                      />
                      {errors.expDate && <p className="text-red-500 text-sm">{errors.expDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        name="cvv" 
                        placeholder="123"
                        value={paymentInfo.cvv} 
                        onChange={handlePaymentChange}
                        maxLength={4}
                        className={errors.cvv ? "border-red-500" : ""}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
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
                      {item.product.image_url && (
                        <div className="w-12 h-12 rounded overflow-hidden bg-slate-100 mr-3">
                          <img 
                            src={item.product.image_url} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
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

import React, { useState, useEffect } from 'react';
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
import { CreditCard } from 'lucide-react';

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

interface CardFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
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

  const [cardInfo, setCardInfo] = useState<CardFormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      toast.error('Please login to access checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
  }, [user, cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Only allow numbers and format with spaces
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setCardInfo(prev => ({
        ...prev,
        [name]: formattedValue.substring(0, 19) // 16 digits + 3 spaces
      }));
    } else if (name === 'expiryDate') {
      // Format as MM/YY
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
      }
      setCardInfo(prev => ({
        ...prev,
        [name]: formatted.substring(0, 5)
      }));
    } else if (name === 'cvv') {
      // Only allow 3-4 numbers for CVV
      const formattedValue = value.replace(/\D/g, '');
      setCardInfo(prev => ({
        ...prev,
        [name]: formattedValue.substring(0, 4)
      }));
    } else {
      setCardInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const validateShippingForm = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields = ['fullName', 'email', 'address', 'city', 'state', 'zipCode', 'country', 'phoneNumber'];
    
    requiredFields.forEach(field => {
      if (!shippingInfo[field as keyof ShippingFormData]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Email validation
    if (shippingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation - simple check for now
    if (shippingInfo.phoneNumber && !/^\d{10,15}$/.test(shippingInfo.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCardInfo = (): boolean => {
    if (paymentMethod !== 'credit_card') return true;
    
    const errors: Record<string, string> = {};
    
    // Card number validation (should be 16 digits, spaces allowed)
    if (!cardInfo.cardNumber || cardInfo.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Expiry date validation (should be MM/YY format)
    if (!cardInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      // Check if date is in the future
      const [month, year] = cardInfo.expiryDate.split('/');
      const expiryDate = new Date();
      expiryDate.setFullYear(2000 + parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const today = new Date();
      
      if (expiryDate < today) {
        errors.expiryDate = 'Card has expired';
      }
    }
    
    // CVV validation (should be 3-4 digits)
    if (!cardInfo.cvv || !/^\d{3,4}$/.test(cardInfo.cvv)) {
      errors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }
    
    // Cardholder name validation
    if (!cardInfo.cardName) {
      errors.cardName = 'Please enter the cardholder name';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isShippingValid = validateShippingForm();
    const isCardValid = validateCardInfo();
    
    if (!isShippingValid || !isCardValid) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
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
        paymentDetails: paymentMethod === 'credit_card' ? {
          cardNumber: `**** **** **** ${cardInfo.cardNumber.slice(-4)}`,
          cardName: cardInfo.cardName,
          expiryDate: cardInfo.expiryDate
        } : null,
        status: 'processing',
        createdAt: new Date().toISOString(),
      };
      
      const orders = JSON.parse(localStorage.getItem(`orders-${user.id}`) || '[]');
      orders.push(order);
      localStorage.setItem(`orders-${user.id}`, JSON.stringify(orders));
      
      toast.success('Payment successful! Your order has been placed.');
      navigate('/checkout/success');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return null; // Early return handled by useEffect
  }

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
                      className={formErrors.fullName ? "border-red-500" : ""}
                    />
                    {formErrors.fullName && (
                      <p className="text-sm text-red-500">{formErrors.fullName}</p>
                    )}
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
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className={formErrors.address ? "border-red-500" : ""}
                    />
                    {formErrors.address && (
                      <p className="text-sm text-red-500">{formErrors.address}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && (
                      <p className="text-sm text-red-500">{formErrors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className={formErrors.state ? "border-red-500" : ""}
                    />
                    {formErrors.state && (
                      <p className="text-sm text-red-500">{formErrors.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      required
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className={formErrors.zipCode ? "border-red-500" : ""}
                    />
                    {formErrors.zipCode && (
                      <p className="text-sm text-red-500">{formErrors.zipCode}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className={formErrors.country ? "border-red-500" : ""}
                    />
                    {formErrors.country && (
                      <p className="text-sm text-red-500">{formErrors.country}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={shippingInfo.phoneNumber}
                      onChange={handleInputChange}
                      className={formErrors.phoneNumber ? "border-red-500" : ""}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
                    )}
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
                      <div className="h-8 w-12 rounded bg-slate-100 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-slate-700" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                    <div className="h-8 w-12 rounded bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-800">
                      PayPal
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'credit_card' && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456" 
                        value={cardInfo.cardNumber}
                        onChange={handleCardInputChange}
                        className={formErrors.cardNumber ? "border-red-500" : ""}
                        maxLength={19}
                      />
                      {formErrors.cardNumber && (
                        <p className="text-sm text-red-500">{formErrors.cardNumber}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input 
                        id="expiryDate" 
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInputChange}
                        className={formErrors.expiryDate ? "border-red-500" : ""}
                        maxLength={5}
                      />
                      {formErrors.expiryDate && (
                        <p className="text-sm text-red-500">{formErrors.expiryDate}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        name="cvv"
                        placeholder="123" 
                        value={cardInfo.cvv}
                        onChange={handleCardInputChange}
                        className={formErrors.cvv ? "border-red-500" : ""}
                        maxLength={4}
                      />
                      {formErrors.cvv && (
                        <p className="text-sm text-red-500">{formErrors.cvv}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input 
                        id="cardName" 
                        name="cardName"
                        value={cardInfo.cardName}
                        onChange={handleCardInputChange}
                        className={formErrors.cardName ? "border-red-500" : ""}
                      />
                      {formErrors.cardName && (
                        <p className="text-sm text-red-500">{formErrors.cardName}</p>
                      )}
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
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.product.image_url || item.product.image || "https://placehold.co/400x300"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <span className="flex-1">
                        {item.product.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                    </div>
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

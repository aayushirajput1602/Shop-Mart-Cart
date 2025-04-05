
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const CheckoutSuccessPage = () => {
  return (
    <div className="container py-16 max-w-3xl mx-auto text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your purchase. Your order has been received and is now being processed.
      </p>
      <div className="bg-slate-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">What happens next?</h2>
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-blue-50 text-blue-600 p-1 mt-0.5">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                Your order is being prepared for shipping. You'll receive a confirmation email with tracking details.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-blue-50 text-blue-600 p-1 mt-0.5">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium">Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Your items will be shipped within 1-2 business days. You'll receive tracking information via email.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-blue-50 text-blue-600 p-1 mt-0.5">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium">Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Estimated delivery time is 3-5 business days depending on your location.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link to="/orders">View Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

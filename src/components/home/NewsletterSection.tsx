
import React from 'react';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewsletterSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-pink-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to receive updates on new arrivals, special offers and exclusive discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button size="lg" className="sm:w-auto">Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

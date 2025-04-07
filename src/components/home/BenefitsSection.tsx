
import React from 'react';
import { TrendingUp, ShoppingBag, Star } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <section className="container py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Best Quality</h3>
          <p className="text-muted-foreground">
            We source only the finest products that meet our high quality standards.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-pink-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
          <p className="text-muted-foreground">
            Enjoy free shipping on all orders over $50, delivered right to your door.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
          <p className="text-muted-foreground">
            Our customer service team is available around the clock to assist you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

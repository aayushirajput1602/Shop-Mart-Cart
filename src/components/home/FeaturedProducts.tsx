
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { ProductType } from '@/types';

interface FeaturedProductsProps {
  products: ProductType[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  // Show only top 3 featured products
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h6 className="text-sm font-semibold text-primary mb-2">FEATURED PRODUCTS</h6>
          <h2 className="text-3xl font-bold mb-4">Our Premium Selection</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked premium products, crafted with exceptional quality and attention to detail.
          </p>
        </div>
        
        <div className="space-y-10">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

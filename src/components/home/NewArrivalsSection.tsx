
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { ProductType } from '@/types';

interface NewArrivalsSectionProps {
  products: ProductType[];
}

const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  // Get random products for new arrivals
  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);

  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h6 className="text-sm font-semibold text-primary mb-2">JUST ARRIVED</h6>
        <h2 className="text-3xl font-bold mb-4">New Arrivals</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Be the first to discover our latest products, fresh from the warehouse.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="electronics">Electronics</TabsTrigger>
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="beauty">Beauty</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="electronics" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter((p) => p.category === 'electronics')
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="clothing" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter((p) => p.category === 'clothing')
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="beauty" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter((p) => p.category === 'beauty')
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default NewArrivalsSection;

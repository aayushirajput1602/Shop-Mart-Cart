
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { ProductType } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';

interface NewArrivalsSectionProps {
  products: ProductType[];
}

const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  // Get the most recent products for new arrivals (sort by id for demonstration)
  const newArrivals = [...products]
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 8);

  const getCategoryProducts = (category: string) => {
    return products
      .filter((p) => p.category.toLowerCase() === category.toLowerCase())
      .slice(0, 4);
  };

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
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/products" className="flex items-center group">
                View All Products
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="electronics" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {getCategoryProducts('electronics').map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/category/electronics" className="flex items-center group">
                View All Electronics
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="clothing" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {getCategoryProducts('clothing').map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/category/clothing" className="flex items-center group">
                View All Clothing
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="beauty" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {getCategoryProducts('beauty').map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/category/beauty" className="flex items-center group">
                View All Beauty Products
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default NewArrivalsSection;

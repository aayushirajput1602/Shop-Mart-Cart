
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { products, categories } from '@/data/products';
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
  const featuredProducts = products.slice(0, 3);
  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
  const topCategories = categories.slice(0, 4);

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="container py-16 md:py-24 relative z-10">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Shop Smart, Shop Easy</h1>
              <p className="text-lg mb-8 text-blue-100">
                Discover amazing products at unbeatable prices with our easy-to-use shopping platform.
              </p>
              <Button asChild size="lg" className="font-medium">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Button variant="link" asChild>
            <Link to="/categories" className="flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {topCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-50 py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="space-y-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals Tab Section */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex md:grid-cols-none">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="electronics">Electronics</TabsTrigger>
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="home">Home & Kitchen</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="product-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="electronics" className="mt-6">
            <div className="product-grid">
              {products
                .filter((p) => p.category === 'electronics')
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="clothing" className="mt-6">
            <div className="product-grid">
              {products
                .filter((p) => p.category === 'clothing')
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="home" className="mt-6">
            <div className="product-grid">
              {products
                .filter((p) => p.category === 'home')
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Promo Section */}
      <section className="bg-blue-50 py-12">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with the latest products, exclusive offers, and discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

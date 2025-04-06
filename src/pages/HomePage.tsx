
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { ChevronRight, TrendingUp, ShoppingBag, Star, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  inventory_count: number;
  rating?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data: productsData, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        
        if (productsData) {
          setProducts(productsData);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)))
            .map(category => ({
              id: category,
              name: category.charAt(0).toUpperCase() + category.slice(1),
              description: `Explore our ${category} collection`
            }));
          
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 3);
  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
  const topCategories = categories.slice(0, 4);

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=2940')] bg-cover bg-center opacity-20"></div>
        <div className="container py-24 md:py-32 relative z-10">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              NEW SEASON ARRIVALS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Discover Your <span className="text-pink-300">Perfect Style</span>
            </h1>
            <p className="text-lg mb-8 text-white/80">
              Explore our curated collection of premium products at unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="font-medium bg-white text-indigo-900 hover:bg-white/90">
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="font-medium border-white text-white hover:bg-white/20">
                <Link to="/categories">Explore Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h6 className="text-sm font-semibold text-primary mb-2">COLLECTIONS</h6>
            <h2 className="text-3xl font-bold">Shop by Category</h2>
          </div>
          <Button variant="link" asChild className="text-primary">
            <Link to="/categories" className="flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {topCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
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

      {/* Benefits Section */}
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

      {/* New Arrivals Tab Section */}
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

      {/* Newsletter Section */}
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
    </div>
  );
};

export default HomePage;

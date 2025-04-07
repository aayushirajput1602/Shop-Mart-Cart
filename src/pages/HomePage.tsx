
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import HeroBanner from '@/components/home/HeroBanner';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { ProductType, CategoryType } from '@/types';

const HomePage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
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
          // Add required properties to match ProductType
          const enhancedProducts = productsData.map(product => ({
            ...product,
            rating: product.rating || (Math.random() * 2 + 3),
            inStock: product.inventory_count > 0
          }));
          
          setProducts(enhancedProducts);
          
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

  if (isLoading) {
    return <div className="container py-20">Loading...</div>;
  }

  return (
    <div className="pb-12">
      <HeroBanner />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={products} />
      <BenefitsSection />
      <NewArrivalsSection products={products} />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;

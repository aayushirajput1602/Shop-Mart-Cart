
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import HeroBanner from '@/components/home/HeroBanner';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { categories } from '@/data/products';
import { ProductType } from '@/types';

const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
};

const HomePage = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Map database products to include required fields for ProductType
  const mappedProducts: ProductType[] = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image_url,
    category: product.category,
    inventory_count: product.inventory_count,
    rating: 4.5, // Default rating since it's not in the database
    inStock: product.inventory_count > 0,
  }));

  if (isLoading) {
    return <div className="container py-20 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="container py-20 text-center">Error loading products: {(error as Error).message}</div>;
  }

  return (
    <div>
      <HeroBanner />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={mappedProducts} />
      <BenefitsSection />
      <NewArrivalsSection products={mappedProducts} />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;

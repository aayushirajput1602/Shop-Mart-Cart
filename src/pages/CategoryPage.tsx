
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  inventory_count: number;
}

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch products by category
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', categoryId);
        
        if (error) throw error;
        
        if (data) {
          setProducts(data);
          
          // Set category name (capitalize first letter)
          if (categoryId) {
            setCategoryName(categoryId.charAt(0).toUpperCase() + categoryId.slice(1));
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);
  
  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-[320px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link to="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
        
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of {categoryName.toLowerCase()} products
        </p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any products in this category.
          </p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

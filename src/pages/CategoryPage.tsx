
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductType } from '@/types';
import { toast } from 'sonner';

const CategoryPage = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!categoryId) {
          throw new Error('Category ID is missing');
        }
        
        console.log('Fetching products for category:', categoryId);
        
        // Fetch products by category using the lowercase category ID
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', categoryId.toLowerCase());
        
        if (error) throw error;
        
        if (data) {
          console.log('Products found:', data.length);
          
          // Transform products to include required fields for ProductType
          const transformedProducts = data.map(product => ({
            ...product,
            rating: 4.5, // Add default rating
            inStock: product.inventory_count > 0
          })) as ProductType[];
          
          setProducts(transformedProducts);
          
          // Set category name (capitalize first letter)
          if (categoryId) {
            setCategoryName(categoryId.charAt(0).toUpperCase() + categoryId.slice(1));
          }
        } else {
          toast.error("Failed to fetch products");
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      // Set up real-time subscription for product inventory updates
      const channel = supabase
        .channel('product-updates')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'products' 
          },
          (payload) => {
            // When a product is updated, refresh the product list
            if (categoryId) {
              fetchProducts();
            }
          }
        )
        .subscribe();

      fetchProducts();
      
      return () => {
        supabase.removeChannel(channel);
      };
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
  
  if (error) {
    return (
      <div className="container py-12">
        <div className="mb-8">
          <Link to="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Categories
          </Link>
          
          <h1 className="text-3xl font-bold">{categoryName || 'Category'}</h1>
        </div>
        
        <div className="text-center py-16 bg-slate-50 rounded-xl">
          <h3 className="text-lg font-medium mb-2">Error Loading Products</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
            We couldn't find any products in this category. This might be because:
          </p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 text-muted-foreground">
            <li>Products haven't been added to this category yet</li>
            <li>The category name might be different from what's stored in the database</li>
            <li>There might be a connection issue with the database</li>
          </ul>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

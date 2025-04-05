
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(product => product.category === id);

  if (!category) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-8">The category you're looking for doesn't exist or has been removed.</p>
        <Link to="/categories" className="text-blue-600 hover:underline">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link to="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Categories
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>
      
      {categoryProducts.length > 0 ? (
        <div className="product-grid">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No products found in this category.</p>
          <Link to="/products" className="text-blue-600 hover:underline">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

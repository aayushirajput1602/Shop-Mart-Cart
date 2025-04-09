
import React from 'react';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/products';
import { Grid3X3, Tag } from 'lucide-react';

const CategoriesPage = () => {
  return (
    <div className="container py-12">
      <div className="flex items-center gap-3 mb-8">
        <Grid3X3 className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>
      <p className="text-muted-foreground max-w-3xl mb-8">
        Browse our store by category to find exactly what you're looking for. Each category 
        features a curated selection of high-quality products.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;

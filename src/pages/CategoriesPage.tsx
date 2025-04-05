
import React from 'react';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/products';

const CategoriesPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;

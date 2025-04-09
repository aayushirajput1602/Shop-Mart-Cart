
import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/products';
import { Grid3X3, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          <Link key={category.id} to={`/category/${category.id}`} className="block">
            <div className="group relative h-60 rounded-2xl overflow-hidden transition-transform hover:transform hover:scale-[1.02]">
              <img 
                src={category.image_url || `/images/${category.id}.jpg`} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white text-xl font-semibold mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm mb-4">{category.description ? `${category.description}` : `Explore our ${category.name} collection`}</p>
                <Button variant="outline" className="w-full bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:text-white">
                  Browse Category
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;

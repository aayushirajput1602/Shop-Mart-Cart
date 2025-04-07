
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import { CategoryType } from '@/types';

interface CategoriesSectionProps {
  categories: CategoryType[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  // Show only top categories
  const topCategories = categories.slice(0, 4);

  return (
    <section className="container py-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h6 className="text-sm font-semibold text-primary mb-2 tracking-wider">BROWSE COLLECTIONS</h6>
          <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
        </div>
        <Button variant="link" asChild className="text-primary mt-4 md:mt-0">
          <Link to="/categories" className="flex items-center group">
            View All Categories 
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {topCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;

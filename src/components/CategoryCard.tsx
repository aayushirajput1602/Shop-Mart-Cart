
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface CategoryType {
  id: string;
  name: string;
  description: string;
}

interface CategoryCardProps {
  category: CategoryType;
}

// Map of category icons/backgrounds
const categoryImages: Record<string, string> = {
  electronics: 'bg-gradient-to-br from-blue-500 to-cyan-400',
  clothing: 'bg-gradient-to-br from-emerald-500 to-lime-400',
  books: 'bg-gradient-to-br from-amber-500 to-yellow-400',
  beauty: 'bg-gradient-to-br from-pink-500 to-rose-400',
  home: 'bg-gradient-to-br from-indigo-500 to-purple-400',
  sports: 'bg-gradient-to-br from-red-500 to-orange-400',
};

const getCategoryBackground = (categoryId: string) => {
  return categoryImages[categoryId.toLowerCase()] || 'bg-gradient-to-br from-gray-500 to-slate-400';
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
        <div className={`h-32 ${getCategoryBackground(category.id)} flex items-center justify-center`}>
          <span className="text-white text-4xl font-bold opacity-20 uppercase">{category.name.charAt(0)}</span>
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;

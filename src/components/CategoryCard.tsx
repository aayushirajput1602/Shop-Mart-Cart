
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryType } from '@/types';

interface CategoryCardProps {
  category: CategoryType;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;

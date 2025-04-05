
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { ProductType } from '@/types';

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [sortBy, setSortBy] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    // Price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // In stock filter
    if (inStockOnly) {
      result = result.filter(product => product.inStock);
    }

    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low-high':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'name-a-z':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-z-a':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategories, priceRange, sortBy, inStockOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 1500]);
    setSortBy('');
    setInStockOnly(false);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        {initialQuery && (
          <p className="text-muted-foreground">
            Search results for: <span className="font-medium">{initialQuery}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block space-y-6">
          <div>
            <h3 className="font-medium mb-3">Search</h3>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 1500]}
                max={1500}
                step={10}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(!!checked)}
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>

          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredProducts.length}</span> of{" "}
              <span className="font-medium">{products.length}</span> products
            </p>

            <div className="flex items-center gap-4">
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down products to find exactly what you're looking for.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Search</h3>
                      <form onSubmit={handleSearch}>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryChange(category.id)}
                            />
                            <Label
                              htmlFor={`mobile-category-${category.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Price Range</h3>
                      <div className="px-2">
                        <Slider
                          defaultValue={[0, 1500]}
                          max={1500}
                          step={10}
                          value={[priceRange[0], priceRange[1]]}
                          onValueChange={handlePriceChange}
                        />
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(!!checked)}
                      />
                      <Label htmlFor="mobile-in-stock" className="text-sm font-normal cursor-pointer">
                        In Stock Only
                      </Label>
                    </div>

                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                  <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;


import { ProductType, CategoryType } from '@/types';

export const categories: CategoryType[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Fashion and apparel'
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Books, novels and literature'
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    description: 'Home essentials and kitchen tools'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Beauty and personal care products'
  }
];

export const products: ProductType[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise cancelling wireless headphones with 30 hours of battery life',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'electronics',
    rating: 4.5,
    inStock: true,
    inventory_count: 15
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Track your fitness and stay connected with this feature-packed smartwatch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'electronics',
    rating: 4.2,
    inStock: true,
    inventory_count: 10
  },
  {
    id: '3',
    name: 'Premium Laptop',
    description: 'Ultra-thin laptop with powerful performance and all-day battery life',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    category: 'electronics',
    rating: 4.8,
    inStock: true,
    inventory_count: 5
  },
  {
    id: '4',
    name: 'Wireless Earbuds',
    description: 'Truly wireless earbuds with amazing sound quality and compact charging case',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
    image_url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
    category: 'electronics',
    rating: 4.3,
    inStock: true,
    inventory_count: 20
  },
  {
    id: '5',
    name: 'Slim Fit T-Shirt',
    description: 'Comfortable cotton t-shirt with a modern slim fit design',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
    image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
    category: 'clothing',
    rating: 4.0,
    inStock: true,
    inventory_count: 50
  },
  {
    id: '6',
    name: 'Denim Jeans',
    description: 'Classic denim jeans with a timeless design and perfect fit',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    category: 'clothing',
    rating: 4.1,
    inStock: true,
    inventory_count: 30
  },
  {
    id: '7',
    name: 'Winter Jacket',
    description: 'Stay warm with this insulated winter jacket suitable for extreme cold',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543',
    image_url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543',
    category: 'clothing',
    rating: 4.6,
    inStock: true,
    inventory_count: 15
  },
  {
    id: '8',
    name: 'Running Shoes',
    description: 'Lightweight and responsive running shoes for maximum performance',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    category: 'clothing',
    rating: 4.4,
    inStock: true,
    inventory_count: 25
  },
  {
    id: '9',
    name: 'Bestselling Novel',
    description: 'The latest bestselling fiction novel everyone is talking about',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    category: 'books',
    rating: 4.7,
    inStock: true,
    inventory_count: 40
  },
  {
    id: '10',
    name: 'Cookbook',
    description: 'Master the art of cooking with this comprehensive cookbook',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646',
    image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646',
    category: 'books',
    rating: 4.2,
    inStock: true,
    inventory_count: 20
  },
  {
    id: '11',
    name: 'Coffee Maker',
    description: 'Premium coffee maker that brews the perfect cup every time',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974',
    image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974',
    category: 'home',
    rating: 4.5,
    inStock: true,
    inventory_count: 12
  },
  {
    id: '12',
    name: 'Blender',
    description: 'High-powered blender for smoothies, soups, and more',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b',
    image_url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b',
    category: 'home',
    rating: 4.3,
    inStock: true,
    inventory_count: 18
  },
  {
    id: '13',
    name: 'Skincare Set',
    description: 'Complete skincare routine with cleanser, toner, and moisturizer',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1556228578-5f25e8c9958b',
    image_url: 'https://images.unsplash.com/photo-1556228578-5f25e8c9958b',
    category: 'beauty',
    rating: 4.6,
    inStock: true,
    inventory_count: 22
  },
  {
    id: '14',
    name: 'Perfume',
    description: 'Elegant fragrance with notes of jasmine and sandalwood',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539',
    category: 'beauty',
    rating: 4.4,
    inStock: true,
    inventory_count: 15
  },
  {
    id: '15',
    name: 'Makeup Palette',
    description: 'Versatile makeup palette with everyday colors for any look',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'beauty',
    rating: 4.2,
    inStock: true,
    inventory_count: 30
  }
];

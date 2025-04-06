
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
    image: '/images/headphones.jpg',
    image_url: '/images/headphones.jpg',
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
    image: '/images/smartwatch.jpg',
    image_url: '/images/smartwatch.jpg',
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
    image: '/images/laptop.jpg',
    image_url: '/images/laptop.jpg',
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
    image: '/images/earbuds.jpg',
    image_url: '/images/earbuds.jpg',
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
    image: '/images/tshirt.jpg',
    image_url: '/images/tshirt.jpg',
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
    image: '/images/jeans.jpg',
    image_url: '/images/jeans.jpg',
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
    image: '/images/jacket.jpg',
    image_url: '/images/jacket.jpg',
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
    image: '/images/running-shoes.jpg',
    image_url: '/images/running-shoes.jpg',
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
    image: '/images/novel.jpg',
    image_url: '/images/novel.jpg',
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
    image: '/images/cookbook.jpg',
    image_url: '/images/cookbook.jpg',
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
    image: '/images/coffee-maker.jpg',
    image_url: '/images/coffee-maker.jpg',
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
    image: '/images/blender.jpg',
    image_url: '/images/blender.jpg',
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
    image: '/images/skincare.jpg',
    image_url: '/images/skincare.jpg',
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
    image: '/images/perfume.jpg',
    image_url: '/images/perfume.jpg',
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
    image: '/images/makeup.jpg',
    image_url: '/images/makeup.jpg',
    category: 'beauty',
    rating: 4.2,
    inStock: true,
    inventory_count: 30
  }
];

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
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    description: 'Equipment and gear for sports and outdoor activities'
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    description: 'Fun toys and games for all ages'
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
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
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
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
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
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
    image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
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
    image: 'https://images.unsplash.com/photo-1515098506762-79e1384e9d8e',
    image_url: 'https://images.unsplash.com/photo-1515098506762-79e1384e9d8e',
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
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
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
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30',
    image_url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30',
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
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2',
    image_url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2',
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
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230',
    image_url: 'https://images.unsplash.com/photo-1543512214-318c7553f230',
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
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
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
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
    image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
    category: 'beauty',
    rating: 4.2,
    inStock: true,
    inventory_count: 30
  },
  {
    id: '16',
    name: 'Smart Speaker',
    description: 'Voice-controlled smart speaker with premium sound quality and digital assistant',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230',
    image_url: 'https://images.unsplash.com/photo-1543512214-318c7553f230',
    category: 'electronics',
    rating: 4.3,
    inStock: true,
    inventory_count: 25
  },
  {
    id: '17',
    name: 'Digital Camera',
    description: 'High-resolution digital camera for professional photography',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    category: 'electronics',
    rating: 4.7,
    inStock: true,
    inventory_count: 8
  },
  {
    id: '18',
    name: 'Gaming Console',
    description: 'Next-generation gaming console with 4K capabilities and extensive game library',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f',
    image_url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f',
    category: 'electronics',
    rating: 4.9,
    inStock: true,
    inventory_count: 3
  },
  {
    id: '19',
    name: 'Leather Jacket',
    description: 'Classic leather jacket with timeless design and comfortable fit',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    category: 'clothing',
    rating: 4.6,
    inStock: true,
    inventory_count: 12
  },
  {
    id: '20',
    name: 'Designer Sunglasses',
    description: 'Stylish designer sunglasses with UV protection',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    category: 'clothing',
    rating: 4.4,
    inStock: true,
    inventory_count: 18
  },
  {
    id: '21',
    name: 'Yoga Mat',
    description: 'High-quality non-slip yoga mat for comfortable practice',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2',
    image_url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2',
    category: 'sports',
    rating: 4.5,
    inStock: true,
    inventory_count: 30
  },
  {
    id: '22',
    name: 'Mountain Bike',
    description: 'Durable mountain bike for off-road adventures and trail riding',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
    image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
    category: 'sports',
    rating: 4.7,
    inStock: true,
    inventory_count: 7
  },
  {
    id: '23',
    name: 'Board Game Collection',
    description: 'Set of classic board games for family fun nights',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
    image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
    category: 'toys',
    rating: 4.2,
    inStock: true,
    inventory_count: 15
  },
  {
    id: '24',
    name: 'Drone with Camera',
    description: 'Remote-controlled drone with HD camera for aerial photography',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9',
    image_url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9',
    category: 'electronics',
    rating: 4.3,
    inStock: true,
    inventory_count: 10
  },
  {
    id: '25',
    name: 'Scented Candle Set',
    description: 'Set of 3 luxury scented candles for home atmosphere',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1603006905393-eadade55324f',
    image_url: 'https://images.unsplash.com/photo-1603006905393-eadade55324f',
    category: 'home',
    rating: 4.6,
    inStock: true,
    inventory_count: 22
  },
  {
    id: '26',
    name: 'Smart Refrigerator',
    description: 'Modern refrigerator with smart features and energy efficiency',
    price: 1499.99,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30',
    image_url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30',
    category: 'home',
    rating: 4.8,
    inStock: true,
    inventory_count: 4
  },
  {
    id: '27',
    name: 'Gardening Tool Set',
    description: 'Complete set of gardening tools for home gardening',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    category: 'home',
    rating: 4.4,
    inStock: true,
    inventory_count: 17
  },
  {
    id: '28',
    name: 'Professional Hair Dryer',
    description: 'Salon-quality hair dryer with multiple heat and speed settings',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53',
    image_url: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53',
    category: 'beauty',
    rating: 4.5,
    inStock: true,
    inventory_count: 14
  },
  {
    id: '29',
    name: 'Luxury Bath Set',
    description: 'Premium bath bombs, soaps, and oils for a spa experience at home',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4de8b51',
    image_url: 'https://images.unsplash.com/photo-1570194065650-d99fb4de8b51',
    category: 'beauty',
    rating: 4.7,
    inStock: true,
    inventory_count: 20
  },
  {
    id: '30',
    name: 'Classic Novel Collection',
    description: 'Set of 5 classic novels in hardcover edition',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1515098506762-79e1384e9d8e',
    image_url: 'https://images.unsplash.com/photo-1515098506762-79e1384e9d8e',
    category: 'books',
    rating: 4.9,
    inStock: true,
    inventory_count: 25
  }
];

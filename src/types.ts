
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  image?: string; // For backward compatibility
  category: string;
  rating: number;
  inStock: boolean;
  inventory_count: number; // Added to match requirements
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    image?: string; // For backward compatibility
    category: string;
    inventory_count: number;
  };
}

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  image?: string; // For backward compatibility
  category: string;
  inventory_count: number;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string;
}

export interface OrderType {
  id: string;
  userId: string;
  products: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

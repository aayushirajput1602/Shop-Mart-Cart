
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
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

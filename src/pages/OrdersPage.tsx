import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderType {
  id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
  products: { productId: string; quantity: number; price: number }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<OrderType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          const typedOrders: OrderType[] = data.map(order => ({
            id: order.id,
            userId: order.user_id,
            totalAmount: order.total_amount,
            status: order.status as "pending" | "processing" | "shipped" | "delivered",
            paymentStatus: 'paid',
            createdAt: order.created_at,
            products: [],
            shippingAddress: {
              fullName: '',
              address: '',
              city: '',
              postalCode: '',
              country: '',
            }
          }));
          setOrders(typedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        
        const savedOrders = localStorage.getItem(`orders-${user.id}`);
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (!user) {
    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Please sign in to view your orders</h3>
            <p className="text-muted-foreground text-center mb-6">
              You need to be logged in to view your order history.
            </p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Orders</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
              <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">You haven't placed any orders yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Once you place an order, it will appear here for you to track.
            </p>
            <Button asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="link" onClick={() => handleViewDetails(order.id)}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;

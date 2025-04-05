
import React from 'react';
import { Link } from 'react-router-dom';
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
import { OrderType } from '@/types';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<OrderType[]>([]);

  React.useEffect(() => {
    if (user) {
      // In a real app, this would fetch from an API
      const savedOrders = localStorage.getItem(`orders-${user.id}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  }, [user]);

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
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="link" asChild>
                      <Link to={`/orders/${order.id}`}>Details</Link>
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

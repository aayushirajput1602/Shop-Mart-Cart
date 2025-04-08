
import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Package, ShoppingBag, X, ExternalLink, Truck, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface OrderType {
  id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
  products: OrderProduct[];
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
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        
        if (ordersData) {
          const orderPromises = ordersData.map(async (order) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select(`
                id, 
                quantity, 
                price,
                product_id,
                products:product_id (
                  id,
                  name,
                  image_url
                )
              `)
              .eq('order_id', order.id);
            
            if (itemsError) {
              console.error('Error fetching order items:', itemsError);
              return null;
            }
            
            const products = itemsData.map(item => ({
              id: item.product_id,
              name: item.products?.name || 'Unknown Product',
              price: Number(item.price),
              quantity: item.quantity,
              image_url: item.products?.image_url
            }));
            
            return {
              id: order.id,
              userId: order.user_id,
              totalAmount: Number(order.total_amount),
              status: order.status as "pending" | "processing" | "shipped" | "delivered",
              paymentStatus: 'paid',
              createdAt: order.created_at,
              products: products,
              shippingAddress: {
                fullName: '',
                address: '',
                city: '',
                postalCode: '',
                country: '',
              }
            } as OrderType;
          });
          
          const completedOrders = (await Promise.all(orderPromises)).filter(
            (order): order is OrderType => order !== null
          );
          
          setOrders(completedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load your orders');
        
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

  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order);
  };

  const getTrackingInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return { icon: <Package className="h-5 w-5 text-green-500" />, text: "Delivered", description: "Your order has been delivered successfully." };
      case 'shipped':
        return { icon: <Truck className="h-5 w-5 text-blue-500" />, text: "Shipped", description: "Your order is on the way to your address." };
      case 'processing':
        return { icon: <Clock className="h-5 w-5 text-orange-500" />, text: "Processing", description: "Your order is being prepared for shipping." };
      default:
        return { icon: <Clock className="h-5 w-5 text-slate-500" />, text: "Pending", description: "Your order is pending confirmation." };
    }
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
                <TableHead>Tracking</TableHead>
                <TableHead>Items</TableHead>
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
                    <Badge className={`
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}
                    `}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTrackingInfo(order.status).icon}
                      <span className="text-xs">{getTrackingInfo(order.status).text}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.products.length} items</TableCell>
                  <TableCell className="text-right font-medium">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" onClick={() => handleViewDetails(order)}>
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex justify-between items-center">
                            Order #{order.id.slice(0, 8)}...
                            <DialogClose className="rounded-full p-1 hover:bg-slate-100">
                              <X className="h-4 w-4" />
                            </DialogClose>
                          </DialogTitle>
                          <DialogDescription>
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 my-4">
                          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium mb-2">Order Status</h3>
                              <Badge className={`
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'}
                              `}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-sm font-medium mb-2">Payment</h3>
                              <Badge className="bg-green-100 text-green-800">
                                Paid
                              </Badge>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-sm font-medium mb-2">Total</h3>
                              <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              {getTrackingInfo(order.status).icon}
                              <div>
                                <h4 className="font-medium">{getTrackingInfo(order.status).text}</h4>
                                <p className="text-sm text-muted-foreground">{getTrackingInfo(order.status).description}</p>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="font-medium mb-4">Order Items</h3>
                            <div className="space-y-4">
                              {order.products.map((product, index) => (
                                <div key={index} className="flex items-center gap-4">
                                  <div className="h-16 w-16 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                                    {product.image_url ? (
                                      <img 
                                        src={product.image_url} 
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                                        }}
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                                        No image
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{product.name}</h4>
                                      <span className="text-sm text-muted-foreground">
                                        ${product.price.toFixed(2)} × {product.quantity}
                                      </span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <Link 
                                        to={`/product/${product.id}`}
                                        className="text-xs text-primary flex items-center hover:underline"
                                      >
                                        View product
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </Link>
                                      <span className="font-medium">
                                        ${(product.price * product.quantity).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Free</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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

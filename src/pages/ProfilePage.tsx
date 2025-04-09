import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types';
import { Link } from 'react-router-dom';
import { Clock, Package, ExternalLink, Truck, Image, ShoppingBag } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface OrderType {
  id: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  totalAmount: number;
  createdAt: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    image_url?: string;
  }[];
}

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState('');
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfileData(data);
          setUsername(data.username || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoadingOrders(true);
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
              quantity: item.quantity,
              image_url: item.products?.image_url
            }));
            
            return {
              id: order.id,
              status: order.status as "pending" | "processing" | "shipped" | "delivered",
              totalAmount: Number(order.total_amount),
              createdAt: order.created_at,
              products: products
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
      } finally {
        setIsLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800">Pending</Badge>;
    }
  };
  
  const getTrackingInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return { 
          icon: <Package className="h-5 w-5 text-green-500" />, 
          text: "Delivered", 
          description: "Your order has been delivered successfully.",
          date: "Delivered on Apr 8, 2025"
        };
      case 'shipped':
        return { 
          icon: <Truck className="h-5 w-5 text-blue-500" />, 
          text: "Shipped", 
          description: "Your order is on the way to your address.",
          date: "Shipped on Apr 6, 2025",
          tracking: "TRK12345678"
        };
      case 'processing':
        return { 
          icon: <Clock className="h-5 w-5 text-orange-500" />, 
          text: "Processing", 
          description: "Your order is being prepared for shipping.",
          date: "Processing since Apr 5, 2025"
        };
      default:
        return { 
          icon: <Clock className="h-5 w-5 text-slate-500" />, 
          text: "Pending", 
          description: "Your order is pending confirmation.",
          date: "Order placed on Apr 4, 2025"
        };
    }
  };
  
  if (!user) {
    return (
      <div className="container py-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Profile</CardTitle>
            <CardDescription>You need to be logged in to view your profile</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Your email cannot be changed
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Set your username"
                />
              </div>
              
              {profileData?.created_at && (
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(profileData.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and track your previous orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                  <Button asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">Order #{order.id.slice(0, 8)}...</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="bg-slate-50 p-4 rounded-lg mb-4">
                          <div className="flex items-center gap-3">
                            {getTrackingInfo(order.status).icon}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{getTrackingInfo(order.status).text}</h4>
                                {order.status === 'shipped' && (
                                  <Badge variant="outline" className="ml-2">
                                    Tracking: {getTrackingInfo(order.status).tracking}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{getTrackingInfo(order.status).description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{getTrackingInfo(order.status).date}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {order.products.slice(0, 2).map((product, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="h-12 w-12 bg-slate-100 rounded flex-shrink-0 overflow-hidden">
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
                                    <Package className="h-6 w-6" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{product.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                              </div>
                            </div>
                          ))}
                          
                          {order.products.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{order.products.length - 2} more items
                            </p>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-end pt-2">
                        <Button variant="link" asChild className="h-auto p-0">
                          <Link to={`/orders`} className="flex items-center text-sm">
                            View Order Details
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Image Management
              </CardTitle>
              <CardDescription>
                Manage product images for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <p className="text-muted-foreground text-center mb-6">
                Go to the image management page to upload and manage your product images.
              </p>
              <Button asChild>
                <Link to="/images">Manage Images</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;

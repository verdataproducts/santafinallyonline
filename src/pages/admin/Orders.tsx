import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package, Mail, MapPin } from 'lucide-react';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  email: string;
  full_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  paypal_order_id: string | null;
  status: string;
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as unknown as Order[]);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-display font-bold">Orders</h1>
            <p className="text-muted-foreground">View all completed orders</p>
          </div>
          {!isLoading && (
            <div className="flex gap-4">
              <Card className="px-4 py-2">
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{orders.length}</p>
              </Card>
              <Card className="px-4 py-2">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
              </Card>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm text-muted-foreground">Orders will appear here after customers complete checkout.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{order.order_number}</CardTitle>
                      <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(order.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium">{order.full_name}</p>
                        <p className="text-muted-foreground">{order.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="text-muted-foreground">
                        <p>{order.address}</p>
                        <p>{order.city}, {order.state} {order.zip}</p>
                        <p>{order.country}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.title} <span className="text-muted-foreground">× {item.quantity}</span></span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">${Number(order.total_amount).toFixed(2)}</span>
                  </div>

                  {order.paypal_order_id && (
                    <p className="text-xs text-muted-foreground">PayPal ID: {order.paypal_order_id}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

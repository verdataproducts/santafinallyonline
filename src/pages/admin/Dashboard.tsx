import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, TrendingUp } from 'lucide-react';
import { getProducts } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Get product count from Shopify
        const products = await getProducts(100);
        setProductCount(products.length);

        // Get site content count
        const { count } = await supabase
          .from('site_content')
          .select('*', { count: 'exact', head: true });
        setContentCount(count || 0);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Products',
      value: productCount,
      icon: Package,
      description: 'Products in your Shopify store',
    },
    {
      title: 'Site Content',
      value: contentCount,
      icon: FileText,
      description: 'Banners, announcements & more',
    },
    {
      title: 'Store Status',
      value: 'Active',
      icon: ShoppingCart,
      description: 'Your store is live',
    },
    {
      title: 'Performance',
      value: 'Good',
      icon: TrendingUp,
      description: 'Site running smoothly',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Santa's Admin Portal</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <a 
                href="/admin/products" 
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <Package className="h-8 w-8 mb-2 text-christmas-red" />
                <h3 className="font-semibold">Manage Products</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
              </a>
              <a 
                href="/admin/content" 
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <FileText className="h-8 w-8 mb-2 text-christmas-gold" />
                <h3 className="font-semibold">Site Content</h3>
                <p className="text-sm text-muted-foreground">Update banners and announcements</p>
              </a>
              <a 
                href="/" 
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <ShoppingCart className="h-8 w-8 mb-2 text-christmas-green" />
                <h3 className="font-semibold">View Store</h3>
                <p className="text-sm text-muted-foreground">See your live storefront</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
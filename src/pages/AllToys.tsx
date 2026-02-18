import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsByPopularity, ShopifyProduct } from "@/lib/shopify";
import { SEO } from "@/components/SEO";
import { generateBreadcrumbStructuredData } from "@/utils/structuredData";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

import { useCartStore } from "@/stores/cartStore";
import { useConfetti } from "@/hooks/useConfetti";
import { Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AllToys = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const { fireworksBurst } = useConfetti();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProductsByPopularity(50);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    const cartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    fireworksBurst();
    toast.success(`Added ${product.node.title} to cart!`, {
      position: 'top-center',
    });
  };

  const baseUrl = window.location.origin;
  const allToysUrl = `${baseUrl}/all-toys`;
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: baseUrl },
    { name: "All Toys", url: allToysUrl }
  ]);

  return (
    <>
      <SEO 
        title="All Toys - Complete Collection 2025"
        description="Browse our complete collection of trending toys sorted by popularity. LEGO sets, dolls, action figures, STEM toys, games, and creative play sets. Shop best sellers now!"
        canonical={allToysUrl}
        jsonLd={breadcrumbData}
      />
      
      <div className="min-h-screen bg-background relative">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Link to="/">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-toy flex items-center justify-center text-xl md:text-2xl font-bold text-primary-foreground cursor-pointer hover:scale-110 transition-transform">
                  TV
                </div>
              </Link>
              <div>
                <Link to="/">
                  <div className="text-lg md:text-2xl font-bold bg-gradient-toy bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
                    ToyVault
                  </div>
                </Link>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">The Hottest Toys, Delivered Fast ⚡</p>
              </div>
            </div>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-3 md:px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-4 md:mb-6 gap-2 hover:scale-105 transition-transform text-sm md:text-base h-8 md:h-10">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 md:mb-4 animate-scale-in">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              <span className="text-xs md:text-sm font-semibold">Sorted by Popularity</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 animate-fade-in">
              All Best-Selling Toys 2025
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.1s' }}>
              Browse our complete collection of {products.length} trending toys, sorted by what's flying off the shelves! 🚀
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.node.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 ToyVault. The best toys, delivered to your door. ⚡
          </p>
        </div>
      </footer>

      {/* WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
    </>
  );
};

export default AllToys;

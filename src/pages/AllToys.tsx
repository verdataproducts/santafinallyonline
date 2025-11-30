import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsByPopularity, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChristmasCountdown } from "@/components/ChristmasCountdown";
import { ChristmasLights } from "@/components/ChristmasLights";
import { SantaSleigh } from "@/components/SantaSleigh";
import { SnowEffect } from "@/components/SnowEffect";
import { useCurrency } from "@/hooks/useCurrency";
import { useCartStore } from "@/stores/cartStore";
import { useConfetti } from "@/hooks/useConfetti";
import { Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import santaLogo from "@/assets/santa-logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AllToys = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const { formatPrice, currency, loading: currencyLoading } = useCurrency();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative">
      {/* Christmas Countdown */}
      <ChristmasCountdown />
      
      {/* Christmas Lights */}
      <ChristmasLights />
      
      {/* Snow Effect */}
      <SnowEffect />
      
      {/* Santa Sleigh */}
      <SantaSleigh />
      
      {/* Floating Christmas decorations */}
      <div className="fixed top-20 left-10 text-6xl animate-float opacity-30 pointer-events-none">🎄</div>
      <div className="fixed top-40 right-20 text-5xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: '1s' }}>⛄</div>
      <div className="fixed bottom-40 left-20 text-4xl animate-bounce-fun opacity-30 pointer-events-none" style={{ animationDelay: '2s' }}>🎁</div>
      <div className="fixed bottom-20 right-10 text-5xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: '1.5s' }}>🎅</div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img src={santaLogo} alt="Santa's Finally Online Logo" className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform" />
              </Link>
              <div>
                <Link to="/">
                  <h1 className="text-2xl font-bold bg-gradient-toy bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
                    Santa's Finally Online
                  </h1>
                </Link>
                <p className="text-sm text-muted-foreground">Christmas Magic Delivered to Your Door! 🎅🎄</p>
              </div>
            </div>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-5 left-[10%] text-7xl opacity-10 animate-float pointer-events-none">🎯</div>
        <div className="absolute top-10 right-[15%] text-6xl opacity-10 animate-wiggle pointer-events-none" style={{ animationDelay: '0.5s' }}>🏆</div>
        <div className="absolute bottom-5 left-[20%] text-8xl opacity-10 animate-bounce-fun pointer-events-none" style={{ animationDelay: '1s' }}>⭐</div>
        
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2 hover:scale-105 transition-transform">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-4 animate-scale-in">
              <TrendingUp className="w-5 h-5 text-accent animate-wiggle" />
              <span className="text-sm font-semibold">Sorted by Popularity</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              All Christmas Toys
              <br />
              <span className="bg-gradient-toy bg-clip-text text-transparent">Best Sellers Collection</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Browse our complete collection of {products.length} amazing toys, sorted by what's flying off the shelves! 🎁✨
            </p>
            {!currencyLoading && currency !== 'KES' && (
              <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-sm text-muted-foreground">
                  Prices shown in {currency} (converted from KES)
                </p>
                <Badge variant="secondary" className="text-xs px-2 py-0.5 gap-1">
                  🌍 Auto-detected
                </Badge>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16">
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
              {products.map((product) => (
                <ProductCard
                  key={product.node.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Santa's Finally Online. Spreading Christmas joy, one amazing toy at a time! 🎅🎄✨
          </p>
        </div>
      </footer>

      {/* WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
  );
};

export default AllToys;

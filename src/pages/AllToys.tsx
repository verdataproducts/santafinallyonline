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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b relative overflow-hidden">
        {/* Header decorative elements */}
        <div className="hidden md:block absolute top-0 left-[5%] text-3xl opacity-20 animate-float pointer-events-none">🎪</div>
        <div className="hidden md:block absolute top-0 right-[5%] text-3xl opacity-20 animate-wiggle pointer-events-none" style={{ animationDelay: '0.5s' }}>🏆</div>
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Link to="/">
                <img src={santaLogo} alt="Santa's Finally Online Logo" className="w-10 h-10 md:w-12 md:h-12 cursor-pointer hover:scale-110 transition-transform" />
              </Link>
              <div>
                <Link to="/">
                  <h1 className="text-lg md:text-2xl font-bold bg-gradient-toy bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
                    Santa's Finally Online
                  </h1>
                </Link>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Christmas Magic Delivered to Your Door! 🎅🎄</p>
              </div>
            </div>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-8 md:py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="hidden md:block absolute top-5 left-[10%] text-7xl opacity-10 animate-float pointer-events-none">🎯</div>
        <div className="hidden md:block absolute top-10 right-[15%] text-6xl opacity-10 animate-wiggle pointer-events-none" style={{ animationDelay: '0.5s' }}>🏆</div>
        <div className="hidden md:block absolute bottom-5 left-[20%] text-8xl opacity-10 animate-bounce-fun pointer-events-none" style={{ animationDelay: '1s' }}>⭐</div>
        
        <div className="container mx-auto px-3 md:px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-4 md:mb-6 gap-2 hover:scale-105 transition-transform text-sm md:text-base h-8 md:h-10">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-accent/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 md:mb-4 animate-scale-in">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-accent animate-wiggle" />
              <span className="text-xs md:text-sm font-semibold">Sorted by Popularity</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 animate-fade-in">
              All Christmas Toys
              <br />
              <span className="bg-gradient-toy bg-clip-text text-transparent">Best Sellers Collection</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.1s' }}>
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
      <section className="pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-[5%] text-9xl opacity-5 animate-float pointer-events-none">🎁</div>
        <div className="absolute top-40 right-[5%] text-8xl opacity-5 animate-wiggle pointer-events-none" style={{ animationDelay: '0.5s' }}>🎯</div>
        <div className="absolute bottom-40 left-[10%] text-7xl opacity-5 animate-bounce-fun pointer-events-none" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-10 right-[15%] text-9xl opacity-5 animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}>🎪</div>
        <div className="absolute top-1/3 left-[50%] text-6xl opacity-5 animate-wiggle pointer-events-none" style={{ animationDelay: '0.8s' }}>🏆</div>
        <div className="absolute bottom-1/3 right-[8%] text-8xl opacity-5 animate-bounce-fun pointer-events-none" style={{ animationDelay: '1.2s' }}>🎨</div>
        
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
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 relative overflow-hidden">
        {/* Footer decorative elements */}
        <div className="absolute top-2 left-[10%] text-4xl opacity-20 animate-float pointer-events-none">🎄</div>
        <div className="absolute top-2 right-[10%] text-4xl opacity-20 animate-bounce-fun pointer-events-none" style={{ animationDelay: '0.5s' }}>⛄</div>
        <div className="absolute top-1/2 -translate-y-1/2 left-[30%] text-3xl opacity-20 animate-wiggle pointer-events-none" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-1/2 -translate-y-1/2 right-[30%] text-3xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}>🌟</div>
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

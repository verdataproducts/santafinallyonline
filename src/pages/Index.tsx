import { useEffect, useState } from "react";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import santaLogo from "@/assets/santa-logo.png";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts(20);
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
    toast.success(`Added ${product.node.title} to cart!`, {
      position: 'top-center',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={santaLogo} alt="Santa's Finally Online Logo" className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Santa's Finally Online</h1>
                <p className="text-sm text-muted-foreground">Best-Selling Toys for Christmas 2025</p>
              </div>
            </div>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-festive opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Best-Selling Toys 2025</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Top Toys for the Holidays
              <br />
              <span className="text-primary">That Kids Really Want</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Shop 2025's best-selling toys from LEGO to Nintendo Switch. Featuring action figures, STEM kits, creative play, and more. 
              Find the perfect gift that will light up their face this Christmas.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trending Toys for Christmas</h2>
            <p className="text-lg text-muted-foreground">
              The most wanted toys of 2025 - from classic favorites to latest releases
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products found</p>
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

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Free Gift Wrapping</h3>
              <p className="text-muted-foreground">Every order comes beautifully wrapped</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Guaranteed delivery before Christmas</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Carefully selected, safety-tested toys</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Santa's Finally Online. Making Christmas magical, one toy at a time. 🎄
          </p>
        </div>
      </footer>

      {/* WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
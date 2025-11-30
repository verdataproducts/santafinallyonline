import { useEffect, useState } from "react";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
              <div className="text-3xl">🎄</div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Holiday Toy Express</h1>
                <p className="text-sm text-muted-foreground">Premium Christmas Toys for Every Child</p>
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
              <span className="text-sm font-semibold">Christmas 2025 Collection</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Magical Christmas Toys
              <br />
              <span className="text-primary">That Bring Joy</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our premium selection of Christmas toys, from action figures to educational STEM kits. 
              Perfect gifts for every child on your list.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Christmas Collection</h2>
            <p className="text-lg text-muted-foreground">
              Hand-picked toys that make this Christmas unforgettable
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
            © 2025 Holiday Toy Express. Making Christmas magical, one toy at a time. 🎄
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
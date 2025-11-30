import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { useCurrency } from "@/hooks/useCurrency";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProducts(100);
        const found = data.find(p => p.node.handle === handle);
        setProduct(found || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Store</span>
            </Link>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
            {image && (
              <img
                src={image.url}
                alt={image.altText || node.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">{node.title}</h1>
            
            <div className="text-4xl font-bold text-primary mb-6">
              {formatPrice(price.amount)}
            </div>

            <div className="prose prose-sm mb-8">
              <p className="text-lg text-muted-foreground">{node.description}</p>
            </div>

            <div className="mt-auto">
              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-lg py-6"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
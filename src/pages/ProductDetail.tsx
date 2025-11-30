import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useCartStore } from "@/stores/cartStore";
import { useCurrency } from "@/hooks/useCurrency";
import { useConfetti } from "@/hooks/useConfetti";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const { formatPrice, currency, loading: currencyLoading } = useCurrency();
  const { fireworksBurst } = useConfetti();

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
    fireworksBurst();
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
  const images = node.images.edges;
  const price = node.priceRange.minVariantPrice;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b relative overflow-hidden">
        {/* Header decorative elements */}
        <div className="absolute top-0 left-[5%] text-3xl opacity-20 animate-float pointer-events-none">🎁</div>
        <div className="absolute top-0 right-[5%] text-3xl opacity-20 animate-wiggle pointer-events-none" style={{ animationDelay: '0.5s' }}>⭐</div>
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
      <div className="container mx-auto px-4 py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-[5%] text-8xl opacity-5 animate-float pointer-events-none">🎁</div>
        <div className="absolute top-40 right-[5%] text-7xl opacity-5 animate-wiggle pointer-events-none" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-20 left-[10%] text-9xl opacity-5 animate-bounce-fun pointer-events-none" style={{ animationDelay: '1s' }}>🎪</div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Product Image Carousel */}
          <div className="space-y-4 animate-fade-in">
            <Carousel className="w-full" opts={{ startIndex: selectedImageIndex }}>
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-muted hover:shadow-2xl transition-all duration-300">
                      <img
                        src={image.node.url}
                        alt={image.node.altText || `${node.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-110 animate-scale-in ${
                    selectedImageIndex === index
                      ? 'border-primary ring-2 ring-primary/20 scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img
                    src={image.node.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl font-bold mb-4 hover:scale-105 transition-transform inline-block">{node.title}</h1>
            
            <div className="mb-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-primary mb-2 hover:animate-wiggle">
                {formatPrice(price.amount)}
              </div>
              {!currencyLoading && currency !== 'KES' && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 gap-1 inline-flex animate-fade-in">
                  🌍 Auto-detected
                </Badge>
              )}
            </div>

            <div className="prose prose-sm mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-lg text-muted-foreground">{node.description}</p>
            </div>

            <div className="mt-auto animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-lg py-6 hover:scale-105 transition-transform"
              >
                <ShoppingCart className="mr-2 h-5 w-5 hover:animate-wiggle" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
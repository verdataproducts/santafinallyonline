import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByHandle, Product } from "@/lib/products";
import { SEO } from "@/components/SEO";
import { generateProductStructuredData, generateBreadcrumbStructuredData } from "@/utils/structuredData";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useCartStore } from "@/stores/cartStore";
import { useCurrency } from "@/hooks/useCurrency";
import { useConfetti } from "@/hooks/useConfetti";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const { formatPrice } = useCurrency();
  const { fireworksBurst } = useConfetti();

  useEffect(() => {
    if (handle) {
      const found = getProductByHandle(handle);
      setProduct(found || null);
    }
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ product, quantity: 1 });
    fireworksBurst();
    toast.success(`Added ${product.title} to cart!`, {
      position: 'top-center',
    });
  };

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

  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/product/${product.handle}`;
  
  const productStructuredData = generateProductStructuredData(product, baseUrl);
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: baseUrl },
    { name: product.title, url: productUrl }
  ]);

  return (
    <>
      <SEO 
        title={`${product.title} - Buy Now`}
        description={product.description.slice(0, 155)}
        canonical={productUrl}
        ogImage={product.images[0]}
        type="product"
        jsonLd={[productStructuredData, breadcrumbData]}
      />
      
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-semibold">Back to Store</span>
            </Link>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <main className="container mx-auto px-3 md:px-4 py-6 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 max-w-6xl mx-auto">
          {/* Product Image Carousel */}
          <div className="space-y-4 animate-fade-in">
            <Carousel className="w-full" opts={{ startIndex: selectedImageIndex }}>
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-muted hover:shadow-2xl transition-all duration-300">
                      <img
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
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
              {product.images.map((image, index) => (
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
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <article className="flex flex-col animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{product.title}</h1>
            
            <div className="mb-4 md:mb-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {formatPrice(product.price)}
              </div>
            </div>

            <div className="prose prose-sm mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-base md:text-lg text-muted-foreground">{product.description}</p>
            </div>

            <div className="mt-auto animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-base md:text-lg py-5 md:py-6 hover:scale-105 transition-transform"
              >
                <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Add to Cart
              </Button>
            </div>
          </article>
        </div>
      </main>

      {/* WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
    </>
  );
};

export default ProductDetail;

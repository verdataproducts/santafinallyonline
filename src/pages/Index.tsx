import { useEffect, useState } from "react";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChristmasCountdown } from "@/components/ChristmasCountdown";
import { useCurrency } from "@/hooks/useCurrency";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, Sparkles, Search, X } from "lucide-react";
import { toast } from "sonner";
import santaLogo from "@/assets/santa-logo.png";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SnowEffect } from "@/components/SnowEffect";
import { ChristmasLights } from "@/components/ChristmasLights";
import { ChristmasTree } from "@/components/ChristmasTree";
import { SantaSleigh } from "@/components/SantaSleigh";
import { SoundControl } from "@/components/SoundControl";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const addItem = useCartStore(state => state.addItem);
  const { formatPrice, currency, loading: currencyLoading } = useCurrency();

  const categories = [
    { id: "all", label: "All Toys", icon: "🎁" },
    { id: "lego", label: "LEGO & Building", icon: "🧱" },
    { id: "dolls", label: "Dolls & Plush", icon: "🧸" },
    { id: "action", label: "Action Figures", icon: "🦸" },
    { id: "games", label: "Games & Puzzles", icon: "🎮" },
    { id: "stem", label: "STEM & Learning", icon: "🔬" },
    { id: "arts", label: "Arts & Crafts", icon: "🎨" },
  ];

  const ageRanges = [
    { id: "all", label: "All Ages", icon: "👶👧🧒" },
    { id: "0-2", label: "0-2 Years", icon: "👶" },
    { id: "3-5", label: "3-5 Years", icon: "👧" },
    { id: "6-8", label: "6-8 Years", icon: "🧒" },
    { id: "9-12", label: "9-12 Years", icon: "👦" },
    { id: "teen", label: "Teens", icon: "🧑" },
  ];

  const categorizeProduct = (title: string): string[] => {
    const lowerTitle = title.toLowerCase();
    const cats: string[] = ["all"];
    
    if (lowerTitle.includes("lego") || lowerTitle.includes("building") || lowerTitle.includes("magna") || lowerTitle.includes("blocks") || lowerTitle.includes("tiles")) {
      cats.push("lego");
    }
    if (lowerTitle.includes("doll") || lowerTitle.includes("plush") || lowerTitle.includes("barbie") || lowerTitle.includes("baby alive") || lowerTitle.includes("squishmallow")) {
      cats.push("dolls");
    }
    if (lowerTitle.includes("spider") || lowerTitle.includes("venom") || lowerTitle.includes("action") || lowerTitle.includes("figure")) {
      cats.push("action");
    }
    if (lowerTitle.includes("game") || lowerTitle.includes("puzzle") || lowerTitle.includes("connect") || lowerTitle.includes("pigeon") || lowerTitle.includes("kanoodle") || lowerTitle.includes("nintendo")) {
      cats.push("games");
    }
    if (lowerTitle.includes("smart") || lowerTitle.includes("tablet") || lowerTitle.includes("learning") || lowerTitle.includes("educational") || lowerTitle.includes("stem")) {
      cats.push("stem");
    }
    if (lowerTitle.includes("play-doh") || lowerTitle.includes("slime") || lowerTitle.includes("craft") || lowerTitle.includes("fashion") || lowerTitle.includes("design") || lowerTitle.includes("art")) {
      cats.push("arts");
    }
    
    return cats;
  };

  const getProductAgeRanges = (title: string): string[] => {
    const lowerTitle = title.toLowerCase();
    const ages: string[] = ["all"];
    
    // Baby/Toddler (0-2)
    if (lowerTitle.includes("baby") || lowerTitle.includes("toddler") || lowerTitle.includes("fisher-price")) {
      ages.push("0-2");
    }
    
    // Preschool (3-5)
    if (lowerTitle.includes("play-doh") || lowerTitle.includes("melissa") || lowerTitle.includes("puzzle") || lowerTitle.includes("plush")) {
      ages.push("3-5");
    }
    
    // Elementary (6-8)
    if (lowerTitle.includes("lego") || lowerTitle.includes("barbie") || lowerTitle.includes("hot wheels") || lowerTitle.includes("connect") || lowerTitle.includes("magna")) {
      ages.push("6-8");
    }
    
    // Tweens (9-12)
    if (lowerTitle.includes("lol surprise") || lowerTitle.includes("nerf") || lowerTitle.includes("fashion") || lowerTitle.includes("squishmallow")) {
      ages.push("9-12");
    }
    
    // Teens
    if (lowerTitle.includes("nintendo") || lowerTitle.includes("exploding") || lowerTitle.includes("kanoodle")) {
      ages.push("teen");
    }
    
    return ages;
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || categorizeProduct(product.node.title).includes(selectedCategory);
    const matchesAge = selectedAge === "all" || getProductAgeRanges(product.node.title).includes(selectedAge);
    const matchesSearch = searchQuery === "" || 
      product.node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.node.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAge && matchesSearch;
  });

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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative">
      <SnowEffect />
      <ChristmasLights />
      <SantaSleigh />
      
      {/* Christmas Countdown Banner */}
      <ChristmasCountdown />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <img src={santaLogo} alt="Santa's Finally Online Logo" className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Santa's Finally Online</h1>
                <p className="text-sm text-muted-foreground">Best-Selling Toys for Christmas 2025</p>
              </div>
            </div>
            <CartDrawer />
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search for toys by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {!currencyLoading && currency !== 'KES' && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  Prices shown in {currency} (converted from KES)
                </p>
                <Badge variant="secondary" className="text-xs px-2 py-0.5 gap-1">
                  🌍 Auto-detected
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-festive opacity-10" />
        <ChristmasTree className="absolute top-8 left-8 opacity-60 animate-fade-in" />
        <ChristmasTree className="absolute top-8 right-8 opacity-60 animate-fade-in" style={{ animationDelay: '0.3s' }} />
        <ChristmasTree className="absolute bottom-8 left-1/4 opacity-40 animate-fade-in" style={{ animationDelay: '0.6s' }} />
        <ChristmasTree className="absolute bottom-8 right-1/4 opacity-40 animate-fade-in" style={{ animationDelay: '0.9s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-6 animate-scale-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Best-Selling Toys 2025</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Top Toys for the Holidays
              <br />
              <span className="text-primary">That Kids Really Want</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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

          {/* Category Filters */}
          <div className="mb-8">
            <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4">Browse by Category</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-6 py-3 rounded-full font-semibold transition-all duration-300
                    flex items-center gap-2 border-2
                    ${selectedCategory === category.id 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                      : "bg-card text-foreground border-border hover:border-primary hover:scale-105 hover:shadow-md"
                    }
                  `}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age Range Filters */}
          <div className="mb-12">
            <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4">Browse by Age</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {ageRanges.map((age) => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id)}
                  className={`
                    px-6 py-3 rounded-full font-semibold transition-all duration-300
                    flex items-center gap-2 border-2
                    ${selectedAge === age.id 
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-lg scale-105" 
                      : "bg-card text-foreground border-border hover:border-secondary hover:scale-105 hover:shadow-md"
                    }
                  `}
                >
                  <span className="text-xl">{age.icon}</span>
                  <span>{age.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">
                {products.length === 0 
                  ? "No products found" 
                  : "No toys found matching your filters"}
              </p>
              {(selectedCategory !== "all" || selectedAge !== "all" || searchQuery !== "") && (
                <div className="flex gap-3 justify-center flex-wrap">
                  {searchQuery !== "" && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Clear search
                    </button>
                  )}
                  {selectedCategory !== "all" && (
                    <button 
                      onClick={() => setSelectedCategory("all")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Clear category
                    </button>
                  )}
                  {selectedAge !== "all" && (
                    <button 
                      onClick={() => setSelectedAge("all")}
                      className="text-secondary hover:underline font-semibold"
                    >
                      Clear age filter
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
      
      {/* Sound Control Button */}
      <SoundControl />
    </div>
  );
};

export default Index;
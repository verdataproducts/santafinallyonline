import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SEO } from "@/components/SEO";
import { GoogleSearchConsole } from "@/components/GoogleSearchConsole";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { generateWebsiteStructuredData, generateOrganizationStructuredData } from "@/utils/structuredData";

import { useCartStore } from "@/stores/cartStore";
import { useConfetti } from "@/hooks/useConfetti";
import { Loader2, Sparkles, Search, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const addItem = useCartStore(state => state.addItem);
  const { fireworksBurst } = useConfetti();

  const categories = [
    { id: "all", label: "All Toys", icon: "🔥" },
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
    
    if (lowerTitle.includes("baby") || lowerTitle.includes("toddler") || lowerTitle.includes("fisher-price")) {
      ages.push("0-2");
    }
    if (lowerTitle.includes("play-doh") || lowerTitle.includes("melissa") || lowerTitle.includes("puzzle") || lowerTitle.includes("plush")) {
      ages.push("3-5");
    }
    if (lowerTitle.includes("lego") || lowerTitle.includes("barbie") || lowerTitle.includes("hot wheels") || lowerTitle.includes("connect") || lowerTitle.includes("magna")) {
      ages.push("6-8");
    }
    if (lowerTitle.includes("lol surprise") || lowerTitle.includes("nerf") || lowerTitle.includes("fashion") || lowerTitle.includes("squishmallow")) {
      ages.push("9-12");
    }
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
    fireworksBurst();
    toast.success(`Added ${product.node.title} to cart!`, {
      position: 'top-center',
    });
  };

  const baseUrl = window.location.origin;
  const websiteData = generateWebsiteStructuredData(baseUrl);
  const organizationData = generateOrganizationStructuredData();

  const gscVerification = "gaJMpcAJoGNVQ9KR5v6rY7N5IDABLN7hsDtDLX7xh64";
  const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

  return (
    <>
      <GoogleSearchConsole verificationCode={gscVerification} />
      <GoogleAnalytics measurementId={gaId} />
      <SEO 
        title="ToyVault - Trending Toys 2025 | LEGO, Nintendo, Action Figures"
        description="Shop the hottest toys of 2025! LEGO sets, Nintendo Switch, action figures, STEM kits & creative play. Top-rated, safety-tested toys delivered fast."
        canonical={baseUrl}
        jsonLd={[websiteData, organizationData]}
      />
      
      <div className="min-h-screen bg-background relative">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-toy flex items-center justify-center text-xl md:text-2xl font-bold text-primary-foreground">
                TV
              </div>
              <div>
                <div className="text-lg md:text-2xl font-bold bg-gradient-toy bg-clip-text text-transparent">ToyVault</div>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">The Hottest Toys, Delivered Fast ⚡</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 self-end sm:self-auto">
              <Link to="/all-toys">
                <Button variant="outline" className="gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
                  <span className="hidden sm:inline">View All Toys</span>
                  <span className="sm:hidden">All Toys</span>
                  <Badge variant="secondary" className="text-xs">{products.length}</Badge>
                </Button>
              </Link>
              <CartDrawer />
            </div>
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-4 md:mb-6 animate-scale-in">
              <Zap className="w-3 h-3 md:w-4 md:h-4 text-accent" />
              <span className="text-xs md:text-sm font-semibold">Trending Now 🔥</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in">
              The Best Toys of 2025 — All in One Place
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
              From LEGO to Nintendo Switch, action figures to STEM kits — discover top-rated toys 
              kids actually want. Fast shipping, unbeatable prices. 🚀
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🔥 Trending Toys Right Now</h2>
            <p className="text-lg text-muted-foreground">
              The most wanted toys of 2025 — from timeless classics to the latest must-haves
            </p>
          </div>

          {/* Category Filters */}
          <div className="mb-6 md:mb-8 animate-fade-in">
            <h3 className="text-center text-xs md:text-sm font-semibold text-muted-foreground mb-3 md:mb-4">Browse by Category</h3>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300
                    flex items-center gap-1 md:gap-2 border-2 animate-scale-in
                    ${selectedCategory === category.id 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                      : "bg-card text-foreground border-border hover:border-primary hover:scale-110 hover:shadow-md"
                    }
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="text-base md:text-xl transition-transform hover:animate-wiggle">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age Range Filters */}
          <div className="mb-8 md:mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-center text-xs md:text-sm font-semibold text-muted-foreground mb-3 md:mb-4">Browse by Age</h3>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {ageRanges.map((age, index) => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id)}
                  className={`
                    px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300
                    flex items-center gap-1 md:gap-2 border-2 animate-scale-in
                    ${selectedAge === age.id 
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-lg scale-105" 
                      : "bg-card text-foreground border-border hover:border-secondary hover:scale-110 hover:shadow-md"
                    }
                  `}
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  <span className="text-base md:text-xl transition-transform hover:animate-bounce-fun">{age.icon}</span>
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
              {filteredProducts.map((product, index) => (
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

      {/* Features Section */}
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 duration-300 animate-fade-in">
              <div className="text-5xl mb-4 inline-block">🚀</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast Delivery</h3>
              <p className="text-muted-foreground">Get your toys delivered in record time, every time</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4 inline-block">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Safety Tested</h3>
              <p className="text-muted-foreground">Every toy is vetted for safety and quality standards</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4 inline-block">💰</div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">Competitive prices on the hottest toys of the year</p>
            </div>
          </div>
        </div>
      </section>

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

export default Index;

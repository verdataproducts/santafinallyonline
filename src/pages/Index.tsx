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
import { Loader2, Search, X, Zap, Rocket, Shield, Tag } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toyvaultLogo from "@/assets/toyvault-logo.png";

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
    if (lowerTitle.includes("lego") || lowerTitle.includes("building") || lowerTitle.includes("magna") || lowerTitle.includes("blocks") || lowerTitle.includes("tiles")) cats.push("lego");
    if (lowerTitle.includes("doll") || lowerTitle.includes("plush") || lowerTitle.includes("barbie") || lowerTitle.includes("baby alive") || lowerTitle.includes("squishmallow")) cats.push("dolls");
    if (lowerTitle.includes("spider") || lowerTitle.includes("venom") || lowerTitle.includes("action") || lowerTitle.includes("figure")) cats.push("action");
    if (lowerTitle.includes("game") || lowerTitle.includes("puzzle") || lowerTitle.includes("connect") || lowerTitle.includes("pigeon") || lowerTitle.includes("kanoodle") || lowerTitle.includes("nintendo")) cats.push("games");
    if (lowerTitle.includes("smart") || lowerTitle.includes("tablet") || lowerTitle.includes("learning") || lowerTitle.includes("educational") || lowerTitle.includes("stem")) cats.push("stem");
    if (lowerTitle.includes("play-doh") || lowerTitle.includes("slime") || lowerTitle.includes("craft") || lowerTitle.includes("fashion") || lowerTitle.includes("design") || lowerTitle.includes("art")) cats.push("arts");
    return cats;
  };

  const getProductAgeRanges = (title: string): string[] => {
    const lowerTitle = title.toLowerCase();
    const ages: string[] = ["all"];
    if (lowerTitle.includes("baby") || lowerTitle.includes("toddler") || lowerTitle.includes("fisher-price")) ages.push("0-2");
    if (lowerTitle.includes("play-doh") || lowerTitle.includes("melissa") || lowerTitle.includes("puzzle") || lowerTitle.includes("plush")) ages.push("3-5");
    if (lowerTitle.includes("lego") || lowerTitle.includes("barbie") || lowerTitle.includes("hot wheels") || lowerTitle.includes("connect") || lowerTitle.includes("magna")) ages.push("6-8");
    if (lowerTitle.includes("lol surprise") || lowerTitle.includes("nerf") || lowerTitle.includes("fashion") || lowerTitle.includes("squishmallow")) ages.push("9-12");
    if (lowerTitle.includes("nintendo") || lowerTitle.includes("exploding") || lowerTitle.includes("kanoodle")) ages.push("teen");
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
    toast.success(`Added ${product.node.title} to cart!`, { position: 'top-center' });
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
        title="ToyVault - Trending Toys 2026 | LEGO, Nintendo, Action Figures"
        description="Shop the hottest toys of 2026! LEGO sets, Nintendo Switch, action figures, STEM kits & creative play. Top-rated, safety-tested toys delivered fast."
        canonical={baseUrl}
        jsonLd={[websiteData, organizationData]}
      />
      
      <div className="min-h-screen bg-background relative">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 backdrop-blur-xl">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <motion.img 
                src={toyvaultLogo} 
                alt="ToyVault Logo" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div>
                <div className="text-lg md:text-2xl font-bold bg-gradient-toy bg-clip-text text-transparent">ToyVault</div>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">The Hottest Toys, Delivered Fast ⚡</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 self-end sm:self-auto">
              <Link to="/all-toys">
                <Button variant="outline" className="gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4 hover-scale">
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
      <section className="relative py-16 md:py-28 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/8 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          
          {/* Floating brand badges */}
          <motion.div 
            className="absolute top-16 right-[15%] px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary/60 select-none"
            animate={{ y: [-10, 10, -10], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >🧱 LEGO</motion.div>
          <motion.div 
            className="absolute bottom-20 left-[10%] px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-bold text-accent/60 select-none"
            animate={{ y: [10, -10, 10], rotate: [0, -2, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >🎮 PlayStation</motion.div>
          <motion.div 
            className="absolute top-1/3 left-[8%] px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-bold text-secondary/60 select-none"
            animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >🏎️ Hot Wheels</motion.div>
          <motion.div 
            className="absolute bottom-1/3 right-[8%] px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-sm font-bold text-primary/50 select-none"
            animate={{ y: [-12, 12, -12], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >🎯 Nerf</motion.div>
          <motion.div 
            className="hidden md:block absolute top-[20%] right-[30%] px-3 py-1.5 rounded-full bg-accent/15 border border-accent/20 text-xs font-bold text-accent/50 select-none"
            animate={{ scale: [0.9, 1.1, 0.9], y: [-8, 8, -8] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >🕹️ Nintendo</motion.div>
          <motion.div 
            className="hidden md:block absolute bottom-[25%] left-[25%] px-3 py-1.5 rounded-full bg-secondary/12 border border-secondary/15 text-xs font-bold text-secondary/50 select-none"
            animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >👾 GTA VI</motion.div>
          <motion.div 
            className="hidden md:block absolute top-[60%] right-[22%] px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-xs font-bold text-primary/50 select-none"
            animate={{ y: [-10, 10, -10], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          >💗 Barbie</motion.div>
          <motion.div 
            className="hidden lg:block absolute top-[15%] left-[20%] px-3 py-1.5 rounded-full bg-accent/10 border border-accent/15 text-xs font-bold text-accent/50 select-none"
            animate={{ y: [8, -12, 8], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >🎲 Hasbro</motion.div>
          
          {/* Dotted grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Trending Now 🔥</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              The Best Toys of{" "}
              <span className="bg-gradient-toy bg-clip-text text-transparent">2026</span>
              {" "}— All in One Place
            </motion.h1>
            
            <motion.p 
              className="text-base md:text-xl text-muted-foreground mb-8 px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              From LEGO to Nintendo Switch, action figures to STEM kits — discover top-rated toys 
              kids actually want. Fast shipping, unbeatable prices. 🚀
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link to="/all-toys">
                <Button size="lg" className="text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <Rocket className="w-5 h-5 mr-2" />
                  Shop All Toys
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-6 rounded-full"
                onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See What's Trending
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main id="trending" className="py-16 relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">🔥 Trending Toys Right Now</h2>
            <p className="text-lg text-muted-foreground">
              The most wanted toys of 2026 — from timeless classics to the latest must-haves
            </p>
          </motion.div>

          {/* Category Filters */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-center text-xs md:text-sm font-semibold text-muted-foreground mb-3 md:mb-4">Browse by Category</h3>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300
                    flex items-center gap-1 md:gap-2 border-2
                    ${selectedCategory === category.id 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                      : "bg-card text-foreground border-border hover:border-primary hover:shadow-md"
                    }
                  `}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-base md:text-xl">{category.icon}</span>
                  <span>{category.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Age Range Filters */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-center text-xs md:text-sm font-semibold text-muted-foreground mb-3 md:mb-4">Browse by Age</h3>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {ageRanges.map((age, index) => (
                <motion.button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id)}
                  className={`
                    px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300
                    flex items-center gap-1 md:gap-2 border-2
                    ${selectedAge === age.id 
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-lg scale-105" 
                      : "bg-card text-foreground border-border hover:border-secondary hover:shadow-md"
                    }
                  `}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-base md:text-xl">{age.icon}</span>
                  <span>{age.label}</span>
                </motion.button>
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
                {products.length === 0 ? "No products found" : "No toys found matching your filters"}
              </p>
              {(selectedCategory !== "all" || selectedAge !== "all" || searchQuery !== "") && (
                <div className="flex gap-3 justify-center flex-wrap">
                  {searchQuery !== "" && (
                    <button onClick={() => setSearchQuery("")} className="text-primary hover:underline font-semibold">Clear search</button>
                  )}
                  {selectedCategory !== "all" && (
                    <button onClick={() => setSelectedCategory("all")} className="text-primary hover:underline font-semibold">Clear category</button>
                  )}
                  {selectedAge !== "all" && (
                    <button onClick={() => setSelectedAge("all")} className="text-secondary hover:underline font-semibold">Clear age filter</button>
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
      <section className="py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Rocket className="w-8 h-8 text-primary" />, title: "Lightning Fast Delivery", desc: "Get your toys delivered in record time, every time", delay: 0 },
              { icon: <Shield className="w-8 h-8 text-secondary" />, title: "Safety Tested", desc: "Every toy is vetted for safety and quality standards", delay: 0.1 },
              { icon: <Tag className="w-8 h-8 text-accent" />, title: "Best Prices", desc: "Competitive prices on the hottest toys of the year", delay: 0.2 },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2026 ToyVault. The best toys, delivered to your door. ⚡
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
    </>
  );
};

export default Index;

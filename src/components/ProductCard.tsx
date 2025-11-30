import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { Link } from "react-router-dom";
import { useCurrency } from "@/hooks/useCurrency";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: ShopifyProduct;
  onAddToCart: (product: ShopifyProduct) => void;
  index?: number;
}

export function ProductCard({ product, onAddToCart, index = 0 }: ProductCardProps) {
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary h-full">
      <Link to={`/product/${node.handle}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {image && (
            <img
              src={`${image.url}&width=400`}
              srcSet={`${image.url}&width=200 200w, ${image.url}&width=400 400w, ${image.url}&width=600 600w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              alt={image.altText || node.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(price.amount)}
          </span>
        </div>
        <Button 
          onClick={() => onAddToCart(product)}
          className="w-full group/btn"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:animate-bounce-fun" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
    </motion.div>
  );
}
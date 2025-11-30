import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { Link } from "react-router-dom";
import { useCurrency } from "@/hooks/useCurrency";

interface ProductCardProps {
  product: ShopifyProduct;
  onAddToCart: (product: ShopifyProduct) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const { formatPrice } = useCurrency();

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
      <Link to={`/product/${node.handle}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {image && (
            <img
              src={image.url}
              alt={image.altText || node.title}
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
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
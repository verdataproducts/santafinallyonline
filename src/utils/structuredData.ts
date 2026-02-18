import { ShopifyProduct } from "@/lib/shopify";

export const generateProductStructuredData = (product: ShopifyProduct, baseUrl: string) => {
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": node.title,
    "description": node.description,
    "image": image?.url || "",
    "sku": node.id,
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product/${node.handle}`,
      "priceCurrency": price.currencyCode,
      "price": price.amount,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "ToyVault"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "ToyVault"
    }
  };
};

export const generateWebsiteStructuredData = (baseUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ToyVault",
    "description": "The ultimate online toy store with trending toys for 2026",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ToyVault",
    "description": "Modern online toy store delivering the hottest toys fast",
    "url": "https://santasfinally.online",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-912-303-6921",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    },
    "sameAs": []
  };
};

export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

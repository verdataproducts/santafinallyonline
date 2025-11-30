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
        "name": "Santa's Finally Online"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Santa's Finally Online"
    }
  };
};

export const generateWebsiteStructuredData = (baseUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Santa's Finally Online",
    "description": "The ultimate Christmas toy store with trending toys for 2025",
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
    "name": "Santa's Finally Online",
    "description": "Premium Christmas toy store delivering joy and magic",
    "url": "https://santasfinally.online",
    "logo": "https://santasfinally.online/santa-logo.png",
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShopifyProduct {
  node: {
    handle: string;
    updatedAt: string;
  };
  cursor: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating sitemap...');

    const SHOPIFY_STORE_DOMAIN = 'tyjxy6-uq.myshopify.com';
    const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get('SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    const BASE_URL = 'https://santasfinally.online';

    if (!SHOPIFY_STOREFRONT_TOKEN) {
      throw new Error('Shopify Storefront Access Token not configured');
    }

    // Fetch all products from Shopify
    const productsQuery = `
      query GetAllProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              handle
              updatedAt
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `;

    let allProducts: ShopifyProduct[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    // Fetch all products with pagination
    while (hasNextPage) {
      const response: Response = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2025-07/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: productsQuery,
            variables: {
              first: 250,
              after: cursor,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
      }

      const data: any = await response.json();

      if (data.errors) {
        throw new Error(`Shopify GraphQL error: ${JSON.stringify(data.errors)}`);
      }

      const products: ShopifyProduct[] = data.data.products.edges;
      allProducts = [...allProducts, ...products];

      hasNextPage = data.data.products.pageInfo.hasNextPage;
      cursor = products.length > 0 ? products[products.length - 1].cursor : null;

      console.log(`Fetched ${products.length} products, total: ${allProducts.length}`);
    }

    console.log(`Total products fetched: ${allProducts.length}`);

    // Generate sitemap XML
    const today = new Date().toISOString().split('T')[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}/</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';

    // All toys page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}/all-toys</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';

    // Product pages
    for (const product of allProducts) {
      const lastmod = product.node.updatedAt.split('T')[0];
      sitemap += '  <url>\n';
      sitemap += `    <loc>${BASE_URL}/product/${product.node.handle}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    }

    sitemap += '</urlset>';

    console.log('Sitemap generated successfully');

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

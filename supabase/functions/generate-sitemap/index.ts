const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://santafinallyonline.lovable.app";

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Local product handles (mirroring src/lib/products.ts)
const productHandles = [
  "baby-alive-growing-up-happy-doll",
  "barbie-dreamhouse-2025",
  "busy-board-montessori-cube",
  "connect-4-frenzy",
  "construction-vehicle-set",
  "dinosaur-excavation-kit",
  "exploding-pigeon-game",
  "fashion-design-studio-kit",
  "fisher-price-learning-tablet",
  "gui-gui-slime-kit",
  "hot-wheels-ultimate-garage",
  "kanoodle-sudoqube",
  "lego-panda-family",
  "lol-surprise-dolls",
  "magna-tiles-deluxe-set",
  "melissa-doug-wooden-puzzle",
  "montessori-busy-book",
  "musical-learning-drum",
  "nerf-elite-2-blaster",
  "nintendo-switch-lite",
  "playdoh-barbie-fashion",
  "playdoh-variety-pack",
  "pop-tubes-fidget-set",
  "silicone-stacking-blocks",
  "spiderman-vs-venom",
  "squishmallows-building-set",
  "stacking-rings-tower",
  "toothless-night-fury-dragon",
  "water-drawing-mat",
  "wooden-pounding-bench",
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BASE_URL = 'https://santafinallyonline.lovable.app';
    const today = new Date().toISOString().split('T')[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage
    sitemap += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // All toys page
    sitemap += `  <url>\n    <loc>${BASE_URL}/all-toys</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    // Product pages
    for (const handle of productHandles) {
      sitemap += `  <url>\n    <loc>${BASE_URL}/product/${handle}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    sitemap += '</urlset>';

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

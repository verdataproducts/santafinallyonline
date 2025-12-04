import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
const SHOPIFY_STORE_DOMAIN = 'tyjxy6-uq.myshopify.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    console.log(`Shopify Admin action: ${action}`, data);

    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error('SHOPIFY_ACCESS_TOKEN not configured');
    }

    const baseUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01`;
    let response;
    let result;

    switch (action) {
      case 'create_product':
        response = await fetch(`${baseUrl}/products.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          },
          body: JSON.stringify({ product: data }),
        });
        result = await response.json();
        console.log('Create product result:', result);
        break;

      case 'update_product':
        response = await fetch(`${baseUrl}/products/${data.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          },
          body: JSON.stringify({ product: data }),
        });
        result = await response.json();
        console.log('Update product result:', result);
        break;

      case 'delete_product':
        response = await fetch(`${baseUrl}/products/${data.id}.json`, {
          method: 'DELETE',
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          },
        });
        result = response.ok ? { success: true } : { error: 'Failed to delete' };
        console.log('Delete product result:', result);
        break;

      case 'get_product':
        response = await fetch(`${baseUrl}/products/${data.id}.json`, {
          method: 'GET',
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          },
        });
        result = await response.json();
        break;

      case 'upload_image':
        // Upload image to product
        response = await fetch(`${baseUrl}/products/${data.product_id}/images.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            image: {
              src: data.image_url,
              alt: data.alt || '',
            },
          }),
        });
        result = await response.json();
        console.log('Upload image result:', result);
        break;

      case 'delete_image':
        response = await fetch(`${baseUrl}/products/${data.product_id}/images/${data.image_id}.json`, {
          method: 'DELETE',
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          },
        });
        result = response.ok ? { success: true } : { error: 'Failed to delete image' };
        console.log('Delete image result:', result);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok && action !== 'delete_product' && action !== 'delete_image') {
      console.error('Shopify API error:', result);
      throw new Error(result.errors || 'Shopify API error');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in shopify-admin function:', error);
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
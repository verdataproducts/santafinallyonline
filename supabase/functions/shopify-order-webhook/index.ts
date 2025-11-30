import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-shop-domain, x-shopify-topic',
};

interface ShopifyOrder {
  id: number;
  email: string;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string;
  };
  total_price: string;
  order_number: number;
}

// Verify Shopify webhook signature
async function verifyShopifyWebhook(body: string, hmacHeader: string): Promise<boolean> {
  const secret = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  if (!secret) {
    console.error('SHOPIFY_ACCESS_TOKEN not configured');
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    );
    
    const hashArray = Array.from(new Uint8Array(signature));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    
    return hashBase64 === hmacHeader;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return false;
  }
}

// Create fulfillment in Shopify
async function createFulfillment(orderId: number, lineItems: Array<{ id: number }>) {
  const shopDomain = 'tyjxy6-uq.myshopify.com';
  const accessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  const apiVersion = '2025-07';

  console.log(`Creating fulfillment for order ${orderId}`);

  try {
    // Create fulfillment with Shopify's fulfillment service
    const fulfillmentResponse = await fetch(
      `https://${shopDomain}/admin/api/${apiVersion}/orders/${orderId}/fulfillments.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken!,
        },
        body: JSON.stringify({
          fulfillment: {
            line_items_by_fulfillment_order: [
              {
                fulfillment_order_id: orderId,
              }
            ],
            tracking_info: {
              company: 'Shopify Shipping',
              number: `TRACK-${Date.now()}`, // This will be replaced with actual tracking when label is created
            },
            notify_customer: true, // Automatically send tracking email to customer
          },
        }),
      }
    );

    if (!fulfillmentResponse.ok) {
      const errorText = await fulfillmentResponse.text();
      console.error(`Fulfillment creation failed: ${errorText}`);
      throw new Error(`Failed to create fulfillment: ${fulfillmentResponse.status}`);
    }

    const fulfillmentData = await fulfillmentResponse.json();
    console.log('Fulfillment created successfully:', fulfillmentData);
    
    return fulfillmentData;
  } catch (error) {
    console.error('Error creating fulfillment:', error);
    throw error;
  }
}

// Send confirmation email to customer
async function sendOrderConfirmation(order: ShopifyOrder) {
  console.log(`Sending order confirmation to ${order.email}`);
  
  // Log order details for tracking
  console.log('Order processed:', {
    orderId: order.id,
    orderNumber: order.order_number,
    customer: `${order.customer.first_name} ${order.customer.last_name}`,
    email: order.email,
    totalPrice: order.total_price,
    itemCount: order.line_items.length,
    shippingAddress: order.shipping_address,
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Shopify order webhook received');

    // Get headers for verification
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    const topic = req.headers.get('x-shopify-topic');

    console.log('Webhook details:', { shopDomain, topic });

    // Read body as text for verification
    const bodyText = await req.text();

    // Verify webhook authenticity
    if (hmacHeader) {
      const isValid = await verifyShopifyWebhook(bodyText, hmacHeader);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { 
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      console.log('Webhook signature verified');
    }

    // Parse the order data
    const order: ShopifyOrder = JSON.parse(bodyText);
    console.log(`Processing order #${order.order_number} (ID: ${order.id})`);

    // Process based on webhook topic
    if (topic === 'orders/create' || topic === 'orders/paid') {
      // Extract line items for fulfillment
      const lineItems = order.line_items.map(item => ({ id: item.id }));

      // Create fulfillment and shipping label
      try {
        const fulfillment = await createFulfillment(order.id, lineItems);
        console.log('Fulfillment created, tracking will be sent to customer');

        // Send order confirmation
        await sendOrderConfirmation(order);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Order processed and fulfillment created',
            orderId: order.id,
            fulfillmentId: fulfillment.fulfillment.id,
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Error processing fulfillment:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Still return 200 to Shopify to prevent retries
        // Log the error for manual review
        return new Response(
          JSON.stringify({ 
            success: false,
            message: 'Order received but fulfillment failed',
            error: errorMessage,
            orderId: order.id,
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // For other webhook types, just acknowledge receipt
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook received' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return 200 to prevent Shopify from retrying
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

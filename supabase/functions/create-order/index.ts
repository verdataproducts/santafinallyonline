import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const {
      email,
      fullName,
      address,
      city,
      state,
      zip,
      country,
      items,
      totalAmount,
      currency,
      paypalOrderId,
      paypalPayerId,
    } = body;

    // Validate required fields
    if (!email || !fullName || !address || !city || !state || !zip || !country) {
      return new Response(
        JSON.stringify({ error: "Missing shipping information" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "No items in order" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid total amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize string inputs
    const sanitize = (s: string, max: number) => String(s).trim().substring(0, max);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.from("orders").insert({
      email: sanitize(email, 255),
      full_name: sanitize(fullName, 100),
      address: sanitize(address, 200),
      city: sanitize(city, 100),
      state: sanitize(state, 100),
      zip: sanitize(zip, 20),
      country: sanitize(country, 100),
      items: items.map((item: any) => ({
        id: String(item.id).substring(0, 100),
        title: String(item.title).substring(0, 200),
        price: Number(item.price),
        quantity: Math.max(1, Math.min(99, Number(item.quantity))),
      })),
      total_amount: Number(totalAmount).toFixed(2),
      currency: sanitize(currency || "USD", 3),
      paypal_order_id: paypalOrderId ? sanitize(paypalOrderId, 100) : null,
      paypal_payer_id: paypalPayerId ? sanitize(paypalPayerId, 100) : null,
      status: "completed",
    }).select("id, order_number").single();

    if (error) {
      console.error("Order insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, orderId: data.id, orderNumber: data.order_number }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

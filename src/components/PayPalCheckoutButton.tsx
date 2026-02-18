import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PAYPAL_CLIENT_ID = "AVjsE0o24_dJT779YiN6CsG8k-8EmVl_jw0DlwVN_zQ4MoE_KM51iXMN8LYymAK_e8F6Y8KoiABYfXrE";

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PayPalCheckoutButtonProps {
  totalPrice: number;
  shippingInfo?: ShippingInfo;
  onSuccess?: (orderNumber: string) => void;
}

export function PayPalCheckoutButton({ totalPrice, shippingInfo, onSuccess }: PayPalCheckoutButtonProps) {
  const clearCart = useCartStore(state => state.clearCart);
  const items = useCartStore(state => state.items);

  if (totalPrice <= 0) return null;

  const saveOrder = async (paypalOrderId?: string, paypalPayerId?: string) => {
    if (!shippingInfo) return null;

    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          ...shippingInfo,
          items: items.map(item => ({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
          })),
          totalAmount: totalPrice,
          currency: "USD",
          paypalOrderId,
          paypalPayerId,
        },
      });

      if (error) throw error;
      return data?.orderNumber || null;
    } catch (err) {
      if (import.meta.env.DEV) console.error("Failed to save order:", err);
      return null;
    }
  };

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", intent: "capture" }}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", label: "checkout" }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [{
              amount: {
                currency_code: "USD",
                value: totalPrice.toFixed(2),
                breakdown: {
                  item_total: { currency_code: "USD", value: totalPrice.toFixed(2) },
                },
              },
              items: items.map(item => ({
                name: item.product.title.substring(0, 127),
                unit_amount: { currency_code: "USD", value: item.product.price.toFixed(2) },
                quantity: item.quantity.toString(),
                category: "PHYSICAL_GOODS" as const,
              })),
            }],
          });
        }}
        onApprove={async (_data, actions) => {
          try {
            const details = await actions.order?.capture();
            if (details?.status === "COMPLETED") {
              const orderNumber = await saveOrder(
                details.id,
                details.payer?.payer_id
              );
              toast.success(
                orderNumber
                  ? `Order ${orderNumber} placed successfully! 🎉`
                  : "Payment successful! 🎉",
                { position: "top-center", duration: 5000 }
              );
              clearCart();
              onSuccess?.(orderNumber || "");
            }
          } catch (error) {
            if (import.meta.env.DEV) console.error("Payment capture error:", error);
            toast.error("Payment failed. Please try again.");
          }
        }}
        onError={(err) => {
          if (import.meta.env.DEV) console.error("PayPal error:", err);
          toast.error("Something went wrong with PayPal. Please try again.");
        }}
        onCancel={() => {
          toast.info("Payment cancelled.", { position: "top-center" });
        }}
      />
    </PayPalScriptProvider>
  );
}

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

// PayPal sandbox Client ID for testing
// Replace with your live PayPal Client ID when ready
const PAYPAL_CLIENT_ID = "sb"; // "sb" = PayPal sandbox mode

interface PayPalCheckoutButtonProps {
  totalPrice: number;
  onSuccess?: () => void;
}

export function PayPalCheckoutButton({ totalPrice, onSuccess }: PayPalCheckoutButtonProps) {
  const clearCart = useCartStore(state => state.clearCart);
  const items = useCartStore(state => state.items);

  if (totalPrice <= 0) return null;

  return (
    <PayPalScriptProvider options={{ 
      clientId: PAYPAL_CLIENT_ID,
      currency: "USD",
    }}>
      <PayPalButtons
        style={{ 
          layout: "vertical",
          shape: "pill",
          label: "checkout",
        }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [{
              amount: {
                currency_code: "USD",
                value: totalPrice.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: totalPrice.toFixed(2),
                  },
                },
              },
              items: items.map(item => ({
                name: item.product.title.substring(0, 127),
                unit_amount: {
                  currency_code: "USD",
                  value: item.product.price.toFixed(2),
                },
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
              toast.success("Payment successful! 🎉 Your order has been placed.", {
                position: "top-center",
                duration: 5000,
              });
              clearCart();
              onSuccess?.();
            }
          } catch (error) {
            console.error("Payment capture error:", error);
            toast.error("Payment failed. Please try again.");
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          toast.error("Something went wrong with PayPal. Please try again.");
        }}
        onCancel={() => {
          toast.info("Payment cancelled.", { position: "top-center" });
        }}
      />
    </PayPalScriptProvider>
  );
}

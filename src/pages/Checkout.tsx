import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useCurrency } from "@/hooks/useCurrency";
import { PayPalCheckoutButton, type ShippingInfo } from "@/components/PayPalCheckoutButton";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, CheckCircle2, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import toyvaultLogo from "@/assets/toyvault-logo.png";

const shippingSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(200),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100),
  state: z.string().trim().min(2, "State/Province is required").max(100),
  zip: z.string().trim().min(3, "ZIP/Postal code is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(100),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { formatPrice } = useCurrency();
  const [shippingConfirmed, setShippingConfirmed] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({});
  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some toys before checking out!</p>
          <Link to="/">
            <Button className="mt-4">Browse Toys</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConfirmShipping = () => {
    const result = shippingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ShippingForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ShippingForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setShippingConfirmed(true);
    toast.success("Shipping address confirmed!");
  };

  const fields: { key: keyof ShippingForm; label: string; placeholder: string; half?: boolean }[] = [
    { key: "fullName", label: "Full Name", placeholder: "John Doe" },
    { key: "email", label: "Email", placeholder: "john@example.com" },
    { key: "address", label: "Street Address", placeholder: "123 Main St" },
    { key: "city", label: "City", placeholder: "New York", half: true },
    { key: "state", label: "State / Province", placeholder: "NY", half: true },
    { key: "zip", label: "ZIP / Postal Code", placeholder: "10001", half: true },
    { key: "country", label: "Country", placeholder: "United States", half: true },
  ];

  return (
    <>
      <SEO title="Checkout - ToyVault" description="Complete your purchase at ToyVault." />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 backdrop-blur-xl">
          <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <motion.img
                  src={toyvaultLogo}
                  alt="ToyVault Logo"
                  className="w-10 h-10 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </Link>
              <Link to="/">
                <div className="text-lg md:text-2xl font-bold bg-gradient-toy bg-clip-text text-transparent">
                  ToyVault
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 md:px-6 py-6 md:py-10 max-w-5xl">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Step 1: Shipping */}
              <Card className={shippingConfirmed ? "border-primary/40" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {shippingConfirmed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    )}
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shippingConfirmed ? (
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{form.fullName}</p>
                      <p className="text-muted-foreground">{form.email}</p>
                      <p className="text-muted-foreground">{form.address}</p>
                      <p className="text-muted-foreground">
                        {form.city}, {form.state} {form.zip}
                      </p>
                      <p className="text-muted-foreground">{form.country}</p>
                      <Button
                        variant="link"
                        className="px-0 h-auto mt-2"
                        onClick={() => setShippingConfirmed(false)}
                      >
                        Edit address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map((f) => {
                          const input = (
                            <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
                              <Label htmlFor={f.key}>{f.label}</Label>
                              <Input
                                id={f.key}
                                placeholder={f.placeholder}
                                value={form[f.key]}
                                onChange={(e) => handleChange(f.key, e.target.value)}
                                className={errors[f.key] ? "border-destructive" : ""}
                                maxLength={f.key === "email" ? 255 : 200}
                              />
                              {errors[f.key] && (
                                <p className="text-destructive text-xs mt-1">{errors[f.key]}</p>
                              )}
                            </div>
                          );
                          return input;
                        })}
                      </div>
                      <Button onClick={handleConfirmShipping} className="w-full" size="lg">
                        Confirm Shipping Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Payment */}
              <Card className={!shippingConfirmed ? "opacity-50 pointer-events-none" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shippingConfirmed ? (
                    <PayPalCheckoutButton
                      totalPrice={totalPrice}
                      shippingInfo={form as ShippingInfo}
                      onSuccess={(orderNumber) => {
                        navigate("/", { state: { orderNumber } });
                      }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please confirm your shipping address first.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Checkout;

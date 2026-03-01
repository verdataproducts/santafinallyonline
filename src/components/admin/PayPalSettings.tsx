import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, Eye, EyeOff, Loader2 } from 'lucide-react';

const SITE_CONTENT_KEY = 'paypal_client_id';

export function PayPalSettings() {
  const [clientId, setClientId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', SITE_CONTENT_KEY)
        .maybeSingle();
      if (data?.content) setClientId(data.content);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!clientId.trim()) {
      toast.error('Please enter a PayPal Client ID');
      return;
    }
    setIsSaving(true);
    try {
      // Check if row exists
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('key', SITE_CONTENT_KEY)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_content')
          .update({ content: clientId.trim(), title: 'PayPal Client ID', is_active: true })
          .eq('key', SITE_CONTENT_KEY);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert({ key: SITE_CONTENT_KEY, content: clientId.trim(), title: 'PayPal Client ID', is_active: true });
        if (error) throw error;
      }
      toast.success('PayPal Client ID saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save PayPal Client ID');
    } finally {
      setIsSaving(false);
    }
  };

  const maskedValue = clientId ? clientId.slice(0, 8) + '•'.repeat(Math.max(0, clientId.length - 12)) + clientId.slice(-4) : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          PayPal Payment Settings
        </CardTitle>
        <CardDescription>
          Update the PayPal Client ID to change which account receives payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
              <div className="relative">
                <Input
                  id="paypal-client-id"
                  type={showKey ? 'text' : 'password'}
                  placeholder="Enter your PayPal Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Find this in your PayPal Developer Dashboard → Apps & Credentials → Live Client ID.
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : 'Save PayPal Settings'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

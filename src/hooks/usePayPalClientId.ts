import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const FALLBACK_CLIENT_ID = "AVjsE0o24_dJT779YiN6CsG8k-8EmVl_jw0DlwVN_zQ4MoE_KM51iXMN8LYymAK_e8F6Y8KoiABYfXrE";

export function usePayPalClientId() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'paypal_client_id')
        .eq('is_active', true)
        .maybeSingle();
      setClientId(data?.content || FALLBACK_CLIENT_ID);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return { clientId, isLoading };
}

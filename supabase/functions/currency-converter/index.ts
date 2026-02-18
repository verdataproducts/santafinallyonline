const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://santafinallyonline.lovable.app";

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Currency map for countries
const currencyMap: { [key: string]: string } = {
  'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'JP': 'JPY', 'CN': 'CNY',
  'AU': 'AUD', 'CA': 'CAD', 'CH': 'CHF', 'IN': 'INR', 'MX': 'MXN',
  'BR': 'BRL', 'ZA': 'ZAR', 'RU': 'RUB', 'KR': 'KRW', 'SG': 'SGD',
  'HK': 'HKD', 'NZ': 'NZD', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK',
  'PL': 'PLN', 'TR': 'TRY', 'AE': 'AED', 'SA': 'SAR', 'TH': 'THB',
  'MY': 'MYR', 'ID': 'IDR', 'PH': 'PHP', 'VN': 'VND', 'EG': 'EGP',
  'NG': 'NGN', 'KE': 'KES', 'GH': 'GHS', 'TZ': 'TZS', 'UG': 'UGX',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') ||
               'check';

    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();

    const countryCode = geoData.country_code || 'US';
    const currency = currencyMap[countryCode] || 'USD';

    const exchangeResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/KES`);
    const exchangeData = await exchangeResponse.json();

    const rate = exchangeData.rates[currency] || 1;

    return new Response(
      JSON.stringify({ currency, rate, countryCode, country: geoData.country_name || 'Unknown' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        currency: 'USD',
        rate: 0.0077,
        countryCode: 'US',
        country: 'United States',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

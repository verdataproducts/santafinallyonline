import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Currency converter function called');

    // Get IP from request - try different headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') ||
               'check'; // fallback to 'check' for IP detection

    console.log('IP address:', ip);

    // Get country from IP
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();
    
    console.log('Geo data:', geoData);

    const countryCode = geoData.country_code || 'US';
    const currency = currencyMap[countryCode] || 'USD';

    console.log(`Country: ${countryCode}, Currency: ${currency}`);

    // Get exchange rate from KES to target currency
    const exchangeResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/KES`);
    const exchangeData = await exchangeResponse.json();

    console.log('Exchange data fetched');

    const rate = exchangeData.rates[currency] || 1;

    console.log(`Exchange rate KES to ${currency}: ${rate}`);

    return new Response(
      JSON.stringify({
        currency,
        rate,
        countryCode,
        country: geoData.country_name || 'Unknown'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in currency converter:', error);
    
    // Return default currency on error
    return new Response(
      JSON.stringify({
        currency: 'USD',
        rate: 0.0077, // approximate KES to USD rate as fallback
        countryCode: 'US',
        country: 'United States',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
})

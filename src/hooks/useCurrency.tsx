import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyData {
  currency: string;
  rate: number;
  countryCode: string;
  country: string;
}

export const useCurrency = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    currency: 'KES',
    rate: 1,
    countryCode: 'KE',
    country: 'Kenya'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('currency-converter');
        
        if (error) {
          console.error('Error fetching currency:', error);
        } else if (data) {
          setCurrencyData(data);
        }
      } catch (error) {
        console.error('Failed to fetch currency data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, []);

  const convertPrice = (kesPrice: string | number): string => {
    const price = typeof kesPrice === 'string' ? parseFloat(kesPrice) : kesPrice;
    const converted = price * currencyData.rate;
    return converted.toFixed(2);
  };

  const formatPrice = (kesPrice: string | number): string => {
    const converted = convertPrice(kesPrice);
    return `${currencyData.currency} ${converted}`;
  };

  return {
    currency: currencyData.currency,
    rate: currencyData.rate,
    country: currencyData.country,
    loading,
    convertPrice,
    formatPrice
  };
};

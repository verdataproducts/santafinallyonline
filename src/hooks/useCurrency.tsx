// Simple USD currency formatting - no auto-detection
export const useCurrency = () => {
  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  const convertPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  return {
    currency: 'USD',
    rate: 1,
    country: 'United States',
    loading: false,
    convertPrice,
    formatPrice
  };
};

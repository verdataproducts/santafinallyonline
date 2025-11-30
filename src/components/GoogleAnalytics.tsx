import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics 4 component with pageview tracking
 * 
 * To set up Google Analytics:
 * 1. Go to https://analytics.google.com
 * 2. Create a GA4 property
 * 3. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 4. Set the VITE_GOOGLE_ANALYTICS_ID environment variable
 */
export const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return;

    // Track pageview on route change
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <Helmet>
      {/* Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false
          });
        `}
      </script>
    </Helmet>
  );
};

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

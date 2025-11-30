import { Helmet } from 'react-helmet-async';

interface GoogleSearchConsoleProps {
  verificationCode?: string;
}

/**
 * Google Search Console verification component
 * 
 * To set up Google Search Console:
 * 1. Go to https://search.google.com/search-console
 * 2. Add your property (domain or URL prefix)
 * 3. Choose "HTML tag" verification method
 * 4. Copy the content value from the meta tag
 * 5. Set the VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION environment variable
 * 6. Verify in Google Search Console
 * 7. Submit your sitemap URL: https://cmmilrmzcwldnwgtjyue.supabase.co/functions/v1/generate-sitemap
 */
export const GoogleSearchConsole = ({ verificationCode }: GoogleSearchConsoleProps) => {
  // Check if verification code is set
  if (!verificationCode) {
    return null;
  }

  return (
    <Helmet>
      <meta name="google-site-verification" content={verificationCode} />
    </Helmet>
  );
};

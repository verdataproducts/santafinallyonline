# Google Search Console & Analytics Setup Guide

This guide will help you set up Google Search Console and Google Analytics for your Santa's Finally Online store.

## 🔍 Google Search Console Setup

Google Search Console helps you monitor your site's presence in Google Search results and identify SEO issues.

### Step 1: Verify Your Website

1. **Go to Google Search Console**
   - Visit: https://search.google.com/search-console
   - Sign in with your Google account

2. **Add Your Property**
   - Click "Add Property"
   - Choose "URL prefix" method
   - Enter your website URL: `https://santasfinally.online`

3. **Verify Ownership**
   - Select "HTML tag" verification method
   - Copy the `content` value from the meta tag (looks like: `google-site-verification` content="**abc123xyz**")
   - You'll need to add this to your Lovable project (see below)

4. **Add Verification Code to Lovable**
   
   **Option A: Via Environment Variable (Recommended for production)**
   - Contact support to add: `VITE_GOOGLE_SEARCH_CONSOLE_VERIFICATION=your_code_here`
   
   **Option B: Directly in index.html (Quick method)**
   - Add this meta tag in the `<head>` section of `index.html`:
   ```html
   <meta name="google-site-verification" content="your_verification_code_here" />
   ```

5. **Complete Verification**
   - After adding the code, return to Google Search Console
   - Click "Verify"
   - You should see a success message!

### Step 2: Submit Your Sitemap

1. **In Google Search Console sidebar, click "Sitemaps"**

2. **Add your dynamic sitemap URL:**
   ```
   https://cmmilrmzcwldnwgtjyue.supabase.co/functions/v1/generate-sitemap
   ```

3. **Click "Submit"**
   - Google will start crawling your sitemap
   - This sitemap automatically updates with all your products!

### Step 3: Monitor Performance

After a few days, you'll start seeing data in Google Search Console:

- **Performance**: See clicks, impressions, CTR, and position
- **Coverage**: Check which pages are indexed
- **Mobile Usability**: Ensure mobile-friendliness
- **Core Web Vitals**: Monitor page experience metrics

---

## 📊 Google Analytics 4 Setup

Google Analytics tracks user behavior and provides detailed insights about your visitors.

### Step 1: Create GA4 Property

1. **Go to Google Analytics**
   - Visit: https://analytics.google.com
   - Sign in with your Google account

2. **Create a Property**
   - Click "Admin" (gear icon)
   - Click "Create Property"
   - Enter property name: "Santa's Finally Online"
   - Select timezone and currency
   - Click "Next"

3. **Set Up Data Stream**
   - Choose "Web"
   - Enter website URL: `https://santasfinally.online`
   - Enter stream name: "Main Website"
   - Click "Create Stream"

4. **Get Your Measurement ID**
   - You'll see your Measurement ID (format: `G-XXXXXXXXXX`)
   - Copy this ID

### Step 2: Add Measurement ID to Lovable

**Option A: Via Environment Variable (Recommended for production)**
- Contact support to add: `VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX`

**Option B: Directly in Code (Quick method)**
- The GoogleAnalytics component is already set up
- Just pass your measurement ID when available

### Step 3: Verify Setup

1. **Test Real-Time Tracking**
   - In Google Analytics, go to "Reports" → "Realtime"
   - Visit your website in another tab
   - You should see your visit appear in real-time!

2. **Check Events**
   - The setup automatically tracks pageviews
   - You'll see data for:
     - Page views
     - User demographics
     - Traffic sources
     - User behavior flow

---

## 🎯 Key Metrics to Monitor

### Google Search Console:
- **Total Clicks**: How many people click through to your site from search
- **Average Position**: Where your pages rank in search results (lower is better)
- **CTR (Click-Through Rate)**: Percentage of impressions that result in clicks
- **Coverage Issues**: Pages that aren't being indexed properly

### Google Analytics:
- **Users**: Total number of unique visitors
- **Sessions**: Number of visits to your site
- **Bounce Rate**: Percentage of single-page visits
- **Conversion Rate**: If you set up goals/conversions
- **Top Pages**: Which products are most popular
- **Traffic Sources**: Where your visitors come from (organic, direct, social, etc.)

---

## 🚀 Pro Tips

1. **Set Up Search Console First**: It takes a few days to gather data, so set it up ASAP

2. **Link Search Console to Analytics**: 
   - In GA4, go to Admin → Property Settings → Product Links
   - Link your Search Console property for combined insights

3. **Set Up Enhanced Ecommerce**: Track product views, add-to-carts, and purchases

4. **Create Custom Reports**: Focus on metrics that matter for your toy store

5. **Set Up Alerts**: Get notified about traffic drops or technical issues

6. **Regular Monitoring**: Check both tools weekly to catch issues early

---

## 🆘 Need Help?

- **Google Search Console Help**: https://support.google.com/webmasters
- **Google Analytics Help**: https://support.google.com/analytics
- **Lovable Support**: Contact via the help button in your project

---

## ✅ Checklist

- [ ] Google Search Console property created
- [ ] Website verified with meta tag
- [ ] Sitemap submitted
- [ ] Google Analytics 4 property created
- [ ] Measurement ID added to project
- [ ] Real-time tracking verified
- [ ] Search Console and Analytics linked
- [ ] Monitoring scheduled on calendar

Once complete, you'll have powerful SEO and analytics tracking for your toy store! 🎉

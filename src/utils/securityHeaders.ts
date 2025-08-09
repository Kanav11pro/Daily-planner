
// Security headers configuration for production
// Note: This is informational - actual implementation would be done at the server/CDN level

export const securityHeaders = {
  // Content Security Policy - prevents XSS attacks
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://hqtujstdzrnmruccaibq.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://hqtujstdzrnmruccaibq.supabase.co wss://hqtujstdzrnmruccaibq.supabase.co",
    "frame-ancestors 'self' https://lovable.dev https://*.lovable.dev", // Allow Lovable iframe
  ].join('; '),

  // Prevent clickjacking - but allow Lovable iframe
  'X-Frame-Options': 'SAMEORIGIN',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS filtering
  'X-XSS-Protection': '1; mode=block',

  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Function to log security recommendations
export const logSecurityRecommendations = () => {
  if (import.meta.env.DEV) {
    console.log('Security recommendations for production deployment:');
    console.log('1. Configure security headers at your CDN/server level');
    console.log('2. Enable Supabase Auth rate limiting');
    console.log('3. Configure proper CORS settings');
    console.log('4. Enable Supabase leaked password protection');
    console.log('5. Set up monitoring for authentication failures');
  }
};


// Secure logging utility that prevents sensitive data exposure in production
const isDevelopment = import.meta.env.DEV;

export const secureLog = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(message, data);
    }
  },
  
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // In production, log only non-sensitive error information
      console.error(message, error?.message || 'An error occurred');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(message, data);
    }
  },
  
  // For debugging user data - only logs in development
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
};

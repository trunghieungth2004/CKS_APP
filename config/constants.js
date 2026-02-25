// API Configuration
export const API_BASE_URL = 'https://app-thvt3ndwfq-uc.a.run.app';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    VERIFY: '/api/auth/verify',
    REGISTER: '/api/auth/register',
  },
  PRODUCT: {
    ALL: '/api/product/all',
  },
  ORDER: {
    CREATE: '/api/order/create',
  },
};

// App Constants
export const CUTOFF_TIME = '18:00'; // 6:00 PM
export const DISPATCH_TIME = '05:00'; // 5:00 AM
export const DISPUTE_WINDOW_HOURS = 1;

// Role IDs
export const ROLES = {
  ADMIN: 0,
  CK_STAFF: 1,
  CK_SUPPLY: 2,
  MANAGER: 3,
  STORE_STAFF: 4,
};

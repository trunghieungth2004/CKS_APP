export const API_BASE_URL = 'http://192.168.240.1:5001/swd-cks/us-central1/app';

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

export const CUTOFF_TIME = '18:00'; 
export const DISPATCH_TIME = '05:00'; 
export const DISPUTE_WINDOW_HOURS = 1;

export const DISPUTE_TYPES = {
  MISSING: 'MISSING',
  SPOILED: 'SPOILED',
  DAMAGED: 'DAMAGED',
  WRONG_ITEM: 'WRONG_ITEM',
  QUANTITY_MISMATCH: 'QUANTITY_MISMATCH',
};

export const DISPUTE_TYPE_LABELS = {
  MISSING: 'Missing Item',
  SPOILED: 'Spoiled/Contaminated',
  DAMAGED: 'Damaged',
  WRONG_ITEM: 'Wrong Item',
  QUANTITY_MISMATCH: 'Quantity Mismatch',
};

export const DISPUTE_TYPE_DESCRIPTIONS = {
  MISSING: 'Item was not included in the delivery',
  SPOILED: 'Item arrived spoiled or contaminated',
  DAMAGED: 'Item arrived damaged or in poor condition',
  WRONG_ITEM: 'Incorrect item was delivered',
  QUANTITY_MISMATCH: 'Delivered quantity does not match ordered quantity',
};

export const ROLES = {
  ADMIN: 0,
  CK_STAFF: 1,
  CK_SUPPLY: 2,
  MANAGER: 3,
  STORE_STAFF: 4,
};

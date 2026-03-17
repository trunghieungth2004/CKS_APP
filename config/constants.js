export const API_BASE_URL = 'https://app-thvt3ndwfq-uc.a.run.app';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    VERIFY: '/api/auth/verify',
    REGISTER: '/api/auth/register',
  },
  PRODUCT: {
    ALL: '/api/product/all',
    ONE: '/api/product/one',
    CREATE: '/api/product/create',
  },
  RECIPE: {
    ALL: '/api/recipe/all',
    ONE: '/api/recipe/one',
    CREATE: '/api/recipe/create',
  },
  RAW_MATERIAL: {
    ALL: '/api/raw-material/all',
  },
  ORDER: {
    CREATE: '/api/order/create',
    ALL: '/api/order/all',
    ONE: '/api/order/one',
    MY_ORDERS: '/api/order/my-orders',
    UPDATE_STATUS: '/api/order/update-status',
  },
  INVENTORY: {
    CK: '/api/inventory/ck',
    STORE: '/api/inventory/store',
    RISK_POOL: '/api/inventory/store/risk-pool',
  },
  RAW_BATCH: {
    ALL: '/api/raw-batch/all',
    ONE: '/api/raw-batch/one',
  },
  COOKED_BATCH: {
    ALL: '/api/cooked-batch/all',
    ONE: '/api/cooked-batch/one',
    BY_ORDER: '/api/cooked-batch/by-order',
  },
  RAW_QC: {
    PENDING: '/api/raw-qc/pending',
    PERFORM: '/api/raw-qc/perform',
  },
  COOKED_QC: {
    PENDING: '/api/cooked-qc/pending',
    PERFORM: '/api/cooked-qc/perform',
    RISK_POOL_SEARCH: '/api/cooked-qc/risk-pool/search',
    RISK_POOL_TRANSFER: '/api/cooked-qc/risk-pool/transfer',
  },
  DISPUTE: {
    CREATE: '/api/dispute',
    MY_DISPUTES: '/api/dispute/my-disputes',
    ALL: '/api/dispute/all',
    RESOLVE: '/api/dispute/resolve',
  },
  USER: {
    STORE_INFO: '/api/user/store-info',
    ALL: '/api/user/all',
    CREATE: '/api/auth/register',
    ONE: '/api/user/one',
    UPDATE: '/api/user',
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

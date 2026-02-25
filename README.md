# CKS Mobile App

Professional React Native mobile application for the CKS system.

## Project Structure

```
CKS_APP/
├── components/          # Reusable UI components
│   ├── Button/         # Button component with styles
│   ├── Card/           # Card component with styles
│   ├── Input/          # Input component with styles
│   ├── MenuButton/     # Menu button component with styles
│   └── index.js        # Components barrel export
│
├── screens/            # App screens
│   ├── LoginScreen/    # Login screen with styles
│   ├── DashboardScreen/ # Dashboard screen with styles
│   ├── CreateOrderScreen/ # Create order screen with styles
│   ├── MyOrdersScreen/  # My orders screen with styles
│   ├── RawMaterialQCScreen/ # Raw material QC screen with styles
│   ├── CookedBatchQCScreen/ # Cooked batch QC screen with styles
│   ├── ConfirmDeliveryScreen/ # Confirm delivery screen with styles
│   ├── FileDisputeScreen/ # File dispute screen with styles
│   └── index.js        # Screens barrel export
│
├── services/           # API services
│   ├── authService.js  # Authentication API calls
│   ├── apiService.js   # Generic API service
│   └── index.js        # Services barrel export
│
├── utils/              # Utility functions
│   ├── storage.js      # Persistent storage using AsyncStorage
│   └── validators.js   # Validation functions
│
├── styles/             # Shared styles
│   └── theme.js        # Theme configuration (colors, spacing, etc.)
│
├── config/             # App configuration
│   └── constants.js    # API URLs, endpoints, app constants
│
├── App.js              # Main app component
├── index.js            # App entry point
├── package.json        # Dependencies
└── app.json            # Expo configuration
```

## Features

- ✅ Professional folder structure
- ✅ Separation of concerns (components, screens, services, utils)
- ✅ Each component has its own style file
- ✅ Centralized theme management
- ✅ Reusable components (Button, Input, Card, MenuButton)
- ✅ API service layer with centralized configuration
- ✅ Form validation
- ✅ Authentication flow
- ✅ Persistent login using AsyncStorage
- ✅ Barrel exports for clean imports
- ✅ Role-based dashboard navigation
- ✅ Complete order management workflow

## Running the App

```bash
# Install dependencies
npm install

# Start the development server
npm start
# or
expo start
```

## API Configuration

API configuration is centralized in `config/constants.js`:
```javascript
export const API_BASE_URL = 'https://app-thvt3ndwfq-uc.a.run.app';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    VERIFY: '/api/auth/verify',
    REGISTER: '/api/auth/register',
  },
  // ... more endpoints
};
```

## Test Credentials

- admin@cks.com / password123
- ckstaff@cks.com / password123
- storestaff@store1.com / password123

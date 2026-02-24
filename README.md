# CKS Mobile App

Professional React Native mobile application for the CKS system.

## Project Structure

```
CKS_APP/
├── components/          # Reusable UI components
│   ├── Button/         # Button component with styles
│   ├── Input/          # Input component with styles
│   └── index.js        # Components barrel export
│
├── screens/            # App screens
│   ├── LoginScreen/    # Login screen with styles
│   ├── HomeScreen/     # Home screen with styles
│   └── index.js        # Screens barrel export
│
├── services/           # API services
│   ├── authService.js  # Authentication API calls
│   ├── apiService.js   # Generic API service
│   └── index.js        # Services barrel export
│
├── utils/              # Utility functions
│   ├── storage.js      # Storage helper
│   └── validators.js   # Validation functions
│
├── styles/             # Shared styles
│   └── theme.js        # Theme configuration (colors, spacing, etc.)
│
├── constants/          # App constants
│   └── config.js       # API URLs, test credentials
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
- ✅ Reusable components (Button, Input)
- ✅ API service layer
- ✅ Form validation
- ✅ Authentication flow
- ✅ Persistent login (storage)
- ✅ Barrel exports for clean imports

## Running the App

```bash
npm start
# or
expo start
```

## API Configuration

API base URL is configured in `constants/config.js`:
```javascript
export const API_BASE_URL = 'https://app-thvt3ndwfq-uc.a.run.app';
```

## Test Credentials

- admin@cks.com / password123
- ckstaff@cks.com / password123
- storestaff@store1.com / password123

// Common spacing, fontSize, borderRadius across themes
export const spacing = {
  xs: 4,
  sm: 8,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 24,
  xxl: 28,
  xxxl: 36,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

// Light Theme Colors
const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#00C7BE',
  
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceVariant: '#F9F9FB',
  card: '#FFFFFF',
  
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  
  border: {
    light: '#E5E5EA',
    medium: '#D1D1D6',
    dark: '#C7C7CC',
  },
  
  icon: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
  },
  
  statusBar: 'dark',
};

// Dark Theme Colors - Tachiyomi-inspired
const darkColors = {
  primary: '#1E88E5',
  secondary: '#7986CB',
  success: '#66BB6A',
  danger: '#EF5350',
  warning: '#FFA726',
  info: '#26C6DA',
  
  background: '#1C1C1E',
  surface: '#2C2C2E',
  surfaceVariant: '#3A3A3C',
  card: '#2C2C2E',
  
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E5EA',
    tertiary: '#8E8E93',
    disabled: '#48484A',
    inverse: '#000000',
  },
  
  border: {
    light: '#38383A',
    medium: '#48484A',
    dark: '#636366',
  },
  
  icon: {
    primary: '#FFFFFF',
    secondary: '#E5E5EA',
    tertiary: '#8E8E93',
  },
  
  statusBar: 'light',
};

// Shadow styles
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Dark theme shadows (lighter for visibility)
const darkShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Exported theme objects
export const lightTheme = {
  colors: lightColors,
  spacing,
  fontSize,
  borderRadius,
  shadows,
  dark: false,
};

export const darkTheme = {
  colors: darkColors,
  spacing,
  fontSize,
  borderRadius,
  shadows: darkShadows,
  dark: true,
};

// Legacy exports for backward compatibility with old .styles.js files
export const colors = lightColors;
export { shadows };

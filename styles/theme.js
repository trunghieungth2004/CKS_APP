// Material Design 3 Color System
// Common spacing following Material Design guidelines
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Material Design Typography Scale
export const fontSize = {
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 24,
  titleLarge: 22,
  titleMedium: 16,
  titleSmall: 14,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
};

// Material Design Shape Scale
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
};

// Material Design 3 Light Theme - Dynamic Color
const lightColors = {
  primary: '#42A5F5',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E3F2FD',
  onPrimaryContainer: '#01579B',
  
  secondary: '#29B6F6',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E1F5FE',
  onSecondaryContainer: '#01579B',
  
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  
  shadow: '#000000',
  scrim: '#000000',
  
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
  
  // Custom colors for app-specific needs
  success: '#1F8A70',
  onSuccess: '#FFFFFF',
  successContainer: '#A7F3D0',
  onSuccessContainer: '#002114',
  
  warning: '#9C6F19',
  onWarning: '#FFFFFF',
  warningContainer: '#FDE68A',
  onWarningContainer: '#311B00',
  
  info: '#006874',
  onInfo: '#FFFFFF',
  infoContainer: '#97F0FF',
  onInfoContainer: '#001F24',
  
  // Legacy support (maps to new system)
  text: {
    primary: '#1C1B1F',
    secondary: '#49454F',
    tertiary: '#79747E',
    disabled: '#C4C7C5',
    inverse: '#F4EFF4',
  },
  
  border: {
    light: '#CAC4D0',
    medium: '#79747E',
    dark: '#49454F',
  },
  
  icon: {
    primary: '#1C1B1F',
    secondary: '#49454F',
    tertiary: '#79747E',
  },
  
  elevation: {
    level0: '#FFFBFE',
    level1: '#F7F2FA',
    level2: '#F2EDF7',
    level3: '#ECE6F0',
    level4: '#EAE7F0',
    level5: '#E6E0E9',
  },
  
  statusBar: 'dark',
};

// Material Design 3 Dark Theme - Dynamic Color
const darkColors = {
  primary: '#1565C0',
  onPrimary: '#FFFFFF',
  primaryContainer: '#0D47A1',
  onPrimaryContainer: '#BBDEFB',
  
  secondary: '#0277BD',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#01579B',
  onSecondaryContainer: '#B3E5FC',
  
  tertiary: '#EFB8C8',
  onTertiary: '#492532',
  tertiaryContainer: '#633B48',
  onTertiaryContainer: '#FFD8E4',
  
  error: '#F2B8B5',
  onError: '#601410',
  errorContainer: '#8C1D18',
  onErrorContainer: '#F9DEDC',
  
  background: '#1C1B1F',
  onBackground: '#E6E1E5',
  
  surface: '#1C1B1F',
  onSurface: '#E6E1E5',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  
  outline: '#938F99',
  outlineVariant: '#49454F',
  
  shadow: '#000000',
  scrim: '#000000',
  
  inverseSurface: '#E6E1E5',
  inverseOnSurface: '#313033',
  inversePrimary: '#6750A4',
  
  // Custom colors for app-specific needs
  success: '#7DDAC2',
  onSuccess: '#00382D',
  successContainer: '#005142',
  onSuccessContainer: '#A7F3D0',
  
  warning: '#F4C542',
  onWarning: '#4D3700',
  warningContainer: '#6F5100',
  onWarningContainer: '#FDE68A',
  
  info: '#4FD8EB',
  onInfo: '#00363D',
  infoContainer: '#004F58',
  onInfoContainer: '#97F0FF',
  
  // Legacy support (maps to new system)
  text: {
    primary: '#E6E1E5',
    secondary: '#CAC4D0',
    tertiary: '#938F99',
    disabled: '#5A5A5A',
    inverse: '#313033',
  },
  
  border: {
    light: '#49454F',
    medium: '#938F99',
    dark: '#CAC4D0',
  },
  
  icon: {
    primary: '#E6E1E5',
    secondary: '#CAC4D0',
    tertiary: '#938F99',
  },
  
  elevation: {
    level0: '#1C1B1F',
    level1: '#28242B',
    level2: '#2D2930',
    level3: '#322F35',
    level4: '#343037',
    level5: '#38343B',
  },
  
  statusBar: 'light',
};

// Material Design Elevation (Shadows)
const elevation = {
  level0: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.11,
    shadowRadius: 4,
    elevation: 3,
  },
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 4,
  },
  level5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },
};

// React Native Paper theme configuration
export const materialLightTheme = {
  dark: false,
  version: 3,
  colors: {
    primary: lightColors.primary,
    onPrimary: lightColors.onPrimary,
    primaryContainer: lightColors.primaryContainer,
    onPrimaryContainer: lightColors.onPrimaryContainer,
    secondary: lightColors.secondary,
    onSecondary: lightColors.onSecondary,
    secondaryContainer: lightColors.secondaryContainer,
    onSecondaryContainer: lightColors.onSecondaryContainer,
    tertiary: lightColors.tertiary,
    onTertiary: lightColors.onTertiary,
    tertiaryContainer: lightColors.tertiaryContainer,
    onTertiaryContainer: lightColors.onTertiaryContainer,
    error: lightColors.error,
    onError: lightColors.onError,
    errorContainer: lightColors.errorContainer,
    onErrorContainer: lightColors.onErrorContainer,
    background: lightColors.background,
    onBackground: lightColors.onBackground,
    surface: lightColors.surface,
    onSurface: lightColors.onSurface,
    surfaceVariant: lightColors.surfaceVariant,
    onSurfaceVariant: lightColors.onSurfaceVariant,
    outline: lightColors.outline,
    outlineVariant: lightColors.outlineVariant,
    shadow: lightColors.shadow,
    scrim: lightColors.scrim,
    inverseSurface: lightColors.inverseSurface,
    inverseOnSurface: lightColors.inverseOnSurface,
    inversePrimary: lightColors.inversePrimary,
    elevation: lightColors.elevation,
  },
  fonts: {
    displayLarge: { fontSize: fontSize.displayLarge, fontWeight: '400', lineHeight: 64 },
    displayMedium: { fontSize: fontSize.displayMedium, fontWeight: '400', lineHeight: 52 },
    displaySmall: { fontSize: fontSize.displaySmall, fontWeight: '400', lineHeight: 44 },
    headlineLarge: { fontSize: fontSize.headlineLarge, fontWeight: '400', lineHeight: 40 },
    headlineMedium: { fontSize: fontSize.headlineMedium, fontWeight: '400', lineHeight: 36 },
    headlineSmall: { fontSize: fontSize.headlineSmall, fontWeight: '400', lineHeight: 32 },
    titleLarge: { fontSize: fontSize.titleLarge, fontWeight: '500', lineHeight: 28 },
    titleMedium: { fontSize: fontSize.titleMedium, fontWeight: '500', lineHeight: 24 },
    titleSmall: { fontSize: fontSize.titleSmall, fontWeight: '500', lineHeight: 20 },
    bodyLarge: { fontSize: fontSize.bodyLarge, fontWeight: '400', lineHeight: 24 },
    bodyMedium: { fontSize: fontSize.bodyMedium, fontWeight: '400', lineHeight: 20 },
    bodySmall: { fontSize: fontSize.bodySmall, fontWeight: '400', lineHeight: 16 },
    labelLarge: { fontSize: fontSize.labelLarge, fontWeight: '500', lineHeight: 20 },
    labelMedium: { fontSize: fontSize.labelMedium, fontWeight: '500', lineHeight: 16 },
    labelSmall: { fontSize: fontSize.labelSmall, fontWeight: '500', lineHeight: 16 },
  },
  roundness: borderRadius.md,
};

export const materialDarkTheme = {
  dark: true,
  version: 3,
  colors: {
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    primaryContainer: darkColors.primaryContainer,
    onPrimaryContainer: darkColors.onPrimaryContainer,
    secondary: darkColors.secondary,
    onSecondary: darkColors.onSecondary,
    secondaryContainer: darkColors.secondaryContainer,
    onSecondaryContainer: darkColors.onSecondaryContainer,
    tertiary: darkColors.tertiary,
    onTertiary: darkColors.onTertiary,
    tertiaryContainer: darkColors.tertiaryContainer,
    onTertiaryContainer: darkColors.onTertiaryContainer,
    error: darkColors.error,
    onError: darkColors.onError,
    errorContainer: darkColors.errorContainer,
    onErrorContainer: darkColors.onErrorContainer,
    background: darkColors.background,
    onBackground: darkColors.onBackground,
    surface: darkColors.surface,
    onSurface: darkColors.onSurface,
    surfaceVariant: darkColors.surfaceVariant,
    onSurfaceVariant: darkColors.onSurfaceVariant,
    outline: darkColors.outline,
    outlineVariant: darkColors.outlineVariant,
    shadow: darkColors.shadow,
    scrim: darkColors.scrim,
    inverseSurface: darkColors.inverseSurface,
    inverseOnSurface: darkColors.inverseOnSurface,
    inversePrimary: darkColors.inversePrimary,
    elevation: darkColors.elevation,
  },
  fonts: {
    displayLarge: { fontSize: fontSize.displayLarge, fontWeight: '400', lineHeight: 64 },
    displayMedium: { fontSize: fontSize.displayMedium, fontWeight: '400', lineHeight: 52 },
    displaySmall: { fontSize: fontSize.displaySmall, fontWeight: '400', lineHeight: 44 },
    headlineLarge: { fontSize: fontSize.headlineLarge, fontWeight: '400', lineHeight: 40 },
    headlineMedium: { fontSize: fontSize.headlineMedium, fontWeight: '400', lineHeight: 36 },
    headlineSmall: { fontSize: fontSize.headlineSmall, fontWeight: '400', lineHeight: 32 },
    titleLarge: { fontSize: fontSize.titleLarge, fontWeight: '500', lineHeight: 28 },
    titleMedium: { fontSize: fontSize.titleMedium, fontWeight: '500', lineHeight: 24 },
    titleSmall: { fontSize: fontSize.titleSmall, fontWeight: '500', lineHeight: 20 },
    bodyLarge: { fontSize: fontSize.bodyLarge, fontWeight: '400', lineHeight: 24 },
    bodyMedium: { fontSize: fontSize.bodyMedium, fontWeight: '400', lineHeight: 20 },
    bodySmall: { fontSize: fontSize.bodySmall, fontWeight: '400', lineHeight: 16 },
    labelLarge: { fontSize: fontSize.labelLarge, fontWeight: '500', lineHeight: 20 },
    labelMedium: { fontSize: fontSize.labelMedium, fontWeight: '500', lineHeight: 16 },
    labelSmall: { fontSize: fontSize.labelSmall, fontWeight: '500', lineHeight: 16 },
  },
  roundness: borderRadius.md,
};

// Exported theme objects (legacy support)
export const lightTheme = {
  colors: lightColors,
  spacing,
  fontSize,
  borderRadius,
  elevation,
  dark: false,
};

export const darkTheme = {
  colors: darkColors,
  spacing,
  fontSize,
  borderRadius,
  elevation,
  dark: true,
};

// Legacy exports
export const colors = lightColors;
export const shadows = elevation;

// Material You Dynamic Color Generator
// This creates vibrant, personalized themes based on Material Design 3
export const getMaterialYouTheme = (isDark = false) => {
  // Material You color palette - more vibrant and dynamic
  const materialYouColors = isDark ? {
    primary: '#BB86FC',
    onPrimary: '#3700B3',
    primaryContainer: '#6200EE',
    onPrimaryContainer: '#E1BEE7',
    
    secondary: '#03DAC6',
    onSecondary: '#000000',
    secondaryContainer: '#018786',
    onSecondaryContainer: '#A7FFEB',
    
    tertiary: '#FF6E40',
    onTertiary: '#000000',
    tertiaryContainer: '#FF3D00',
    onTertiaryContainer: '#FFCCBC',
    
    error: '#CF6679',
    onError: '#000000',
    errorContainer: '#B00020',
    onErrorContainer: '#F9DEDC',
    
    background: '#121212',
    onBackground: '#E1E1E1',
    
    surface: '#1E1E1E',
    onSurface: '#E1E1E1',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#CAC4D0',
    
    outline: '#938F99',
    outlineVariant: '#49454F',
    
    shadow: '#000000',
    scrim: '#000000',
    
    inverseSurface: '#E1E1E1',
    inverseOnSurface: '#1E1E1E',
    inversePrimary: '#6200EE',
    
    elevation: {
      level0: '#121212',
      level1: '#1E1E1E',
      level2: '#232323',
      level3: '#252525',
      level4: '#272727',
      level5: '#2C2C2C',
    },
  } : {
    primary: '#6200EE',
    onPrimary: '#FFFFFF',
    primaryContainer: '#BB86FC',
    onPrimaryContainer: '#3700B3',
    
    secondary: '#03DAC6',
    onSecondary: '#000000',
    secondaryContainer: '#80E8DE',
    onSecondaryContainer: '#00201C',
    
    tertiary: '#FF6E40',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFAB91',
    onTertiaryContainer: '#4A1500',
    
    error: '#B00020',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    
    background: '#FEFBFF',
    onBackground: '#1C1B1F',
    
    surface: '#FEFBFF',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    
    shadow: '#000000',
    scrim: '#000000',
    
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#BB86FC',
    
    elevation: {
      level0: '#FEFBFF',
      level1: '#F7F2FA',
      level2: '#F2EDF7',
      level3: '#ECE6F0',
      level4: '#E6E0E9',
      level5: '#E0DAE3',
    },
  };

  return {
    dark: isDark,
    version: 3,
    colors: materialYouColors,
    fonts: {
      displayLarge: { fontSize: fontSize.displayLarge, fontWeight: '400', lineHeight: 64 },
      displayMedium: { fontSize: fontSize.displayMedium, fontWeight: '400', lineHeight: 52 },
      displaySmall: { fontSize: fontSize.displaySmall, fontWeight: '400', lineHeight: 44 },
      headlineLarge: { fontSize: fontSize.headlineLarge, fontWeight: '400', lineHeight: 40 },
      headlineMedium: { fontSize: fontSize.headlineMedium, fontWeight: '400', lineHeight: 36 },
      headlineSmall: { fontSize: fontSize.headlineSmall, fontWeight: '400', lineHeight: 32 },
      titleLarge: { fontSize: fontSize.titleLarge, fontWeight: '500', lineHeight: 28 },
      titleMedium: { fontSize: fontSize.titleMedium, fontWeight: '500', lineHeight: 24 },
      titleSmall: { fontSize: fontSize.titleSmall, fontWeight: '500', lineHeight: 20 },
      bodyLarge: { fontSize: fontSize.bodyLarge, fontWeight: '400', lineHeight: 24 },
      bodyMedium: { fontSize: fontSize.bodyMedium, fontWeight: '400', lineHeight: 20 },
      bodySmall: { fontSize: fontSize.bodySmall, fontWeight: '400', lineHeight: 16 },
      labelLarge: { fontSize: fontSize.labelLarge, fontWeight: '500', lineHeight: 20 },
      labelMedium: { fontSize: fontSize.labelMedium, fontWeight: '500', lineHeight: 16 },
      labelSmall: { fontSize: fontSize.labelSmall, fontWeight: '500', lineHeight: 16 },
    },
    roundness: borderRadius.md,
  };
};

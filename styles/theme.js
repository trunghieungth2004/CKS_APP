export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

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

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
};

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

const darkColors = {
  primary: '#90CAF9',
  onPrimary: '#0D47A1',
  primaryContainer: '#1565C0',
  onPrimaryContainer: '#E3F2FD',
  
  secondary: '#80DEEA',
  onSecondary: '#006064',
  secondaryContainer: '#00838F',
  onSecondaryContainer: '#E0F7FA',
  
  tertiary: '#F48FB1',
  onTertiary: '#880E4F',
  tertiaryContainer: '#AD1457',
  onTertiaryContainer: '#FCE4EC',
  
  error: '#EF5350',
  onError: '#FFFFFF',
  errorContainer: '#C62828',
  onErrorContainer: '#FFCDD2',
  
  background: '#121212',
  onBackground: '#E0E0E0',
  
  surface: '#1E1E1E',
  onSurface: '#E0E0E0',
  surfaceVariant: '#2C2C2C',
  onSurfaceVariant: '#BDBDBD',
  
  outline: '#757575',
  outlineVariant: '#424242',
  
  shadow: '#000000',
  scrim: '#000000',
  
  inverseSurface: '#E0E0E0',
  inverseOnSurface: '#121212',
  inversePrimary: '#1976D2',
  
  success: '#81C784',
  onSuccess: '#1B5E20',
  successContainer: '#388E3C',
  onSuccessContainer: '#C8E6C9',
  
  warning: '#FFB74D',
  onWarning: '#E65100',
  warningContainer: '#F57C00',
  onWarningContainer: '#FFE0B2',
  
  info: '#4DD0E1',
  onInfo: '#006064',
  infoContainer: '#0097A7',
  onInfoContainer: '#B2EBF2',
  
  text: {
    primary: '#FFFFFF',
    secondary: '#BDBDBD',
    tertiary: '#9E9E9E',
    disabled: '#616161',
    inverse: '#121212',
  },
  
  border: {
    light: '#424242',
    medium: '#616161',
    dark: '#757575',
  },
  
  icon: {
    primary: '#FFFFFF',
    secondary: '#BDBDBD',
    tertiary: '#9E9E9E',
  },
  
  elevation: {
    level0: '#121212',
    level1: '#1E1E1E',
    level2: '#232323',
    level3: '#282828',
    level4: '#2C2C2C',
    level5: '#323232',
  },
  
  statusBar: 'light',
};

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
    success: lightColors.success,
    onSuccess: lightColors.onSuccess,
    successContainer: lightColors.successContainer,
    onSuccessContainer: lightColors.onSuccessContainer,
    warning: lightColors.warning,
    onWarning: lightColors.onWarning,
    warningContainer: lightColors.warningContainer,
    onWarningContainer: lightColors.onWarningContainer,
    info: lightColors.info,
    onInfo: lightColors.onInfo,
    infoContainer: lightColors.infoContainer,
    onInfoContainer: lightColors.onInfoContainer,
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
    success: darkColors.success,
    onSuccess: darkColors.onSuccess,
    successContainer: darkColors.successContainer,
    onSuccessContainer: darkColors.onSuccessContainer,
    warning: darkColors.warning,
    onWarning: darkColors.onWarning,
    warningContainer: darkColors.warningContainer,
    onWarningContainer: darkColors.onWarningContainer,
    info: darkColors.info,
    onInfo: darkColors.onInfo,
    infoContainer: darkColors.infoContainer,
    onInfoContainer: darkColors.onInfoContainer,
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

export const colors = lightColors;
export const shadows = elevation;

export const getMaterialYouTheme = (isDark = false) => {
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

import React, { createContext, useState, useContext, useEffect } from 'react';
import storage from '../utils/storage';
import { lightTheme, darkTheme, materialLightTheme, materialDarkTheme, getMaterialYouTheme } from '../styles/theme';

const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  loading: false,
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useMaterialYou, setUseMaterialYou] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await storage.getItem('theme');
      const savedMaterialYou = await storage.getItem('materialYou');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
      if (savedMaterialYou !== null) {
        setUseMaterialYou(savedMaterialYou === 'true');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await storage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleMaterialYou = async () => {
    const newValue = !useMaterialYou;
    setUseMaterialYou(newValue);
    await storage.setItem('materialYou', newValue.toString());
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  const paperTheme = useMaterialYou 
    ? getMaterialYouTheme(isDarkMode)
    : (isDarkMode ? materialDarkTheme : materialLightTheme);

  return (
    <ThemeContext.Provider value={{ theme, paperTheme, isDarkMode, useMaterialYou, toggleTheme, toggleMaterialYou, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: lightTheme,
      paperTheme: materialLightTheme,
      isDarkMode: false,
      toggleTheme: () => {},
      loading: false,
    };
  }
  return context;
};

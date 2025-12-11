import { createContext, useContext } from 'react';

interface ThemeContextType {
  primaryColor: string;
  textColor: string;
  setTheme: (theme: { primaryColor: string; textColor: string }) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  primaryColor: 'blue',
  textColor: 'blue',
  setTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);


import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'default' | 'ocean' | 'sunset' | 'forest' | 'purple' | 'midnight';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  default: {
    primary: 'from-indigo-600 to-purple-600',
    secondary: 'from-blue-50 via-indigo-50 to-purple-50',
    accent: 'bg-indigo-50 text-indigo-800',
    card: 'bg-white',
    border: 'border-indigo-200'
  },
  ocean: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-blue-50 via-cyan-50 to-teal-50',
    accent: 'bg-blue-50 text-blue-800',
    card: 'bg-white',
    border: 'border-blue-200'
  },
  sunset: {
    primary: 'from-orange-500 to-pink-500',
    secondary: 'from-orange-50 via-pink-50 to-red-50',
    accent: 'bg-orange-50 text-orange-800',
    card: 'bg-white',
    border: 'border-orange-200'
  },
  forest: {
    primary: 'from-green-600 to-emerald-600',
    secondary: 'from-green-50 via-emerald-50 to-teal-50',
    accent: 'bg-green-50 text-green-800',
    card: 'bg-white',
    border: 'border-green-200'
  },
  purple: {
    primary: 'from-purple-600 to-violet-600',
    secondary: 'from-purple-50 via-violet-50 to-fuchsia-50',
    accent: 'bg-purple-50 text-purple-800',
    card: 'bg-white',
    border: 'border-purple-200'
  },
  midnight: {
    primary: 'from-slate-700 to-gray-800',
    secondary: 'from-slate-100 via-gray-100 to-zinc-100',
    accent: 'bg-slate-100 text-slate-800',
    card: 'bg-white',
    border: 'border-slate-200'
  }
};

export const getThemeColors = (theme: Theme) => themes[theme];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('examPrepTheme');
    return (saved as Theme) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('examPrepTheme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

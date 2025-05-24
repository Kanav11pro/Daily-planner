
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
    background: 'from-slate-50 via-blue-50 to-indigo-100',
    accent: 'bg-indigo-50 text-indigo-800',
    card: 'bg-white/90 backdrop-blur-sm',
    border: 'border-indigo-200',
    text: 'text-indigo-900',
    glow: 'shadow-indigo-200/50'
  },
  ocean: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-blue-50 via-cyan-50 to-teal-50',
    background: 'from-cyan-50 via-blue-50 to-teal-100',
    accent: 'bg-blue-50 text-blue-800',
    card: 'bg-white/90 backdrop-blur-sm',
    border: 'border-blue-200',
    text: 'text-blue-900',
    glow: 'shadow-blue-200/50'
  },
  sunset: {
    primary: 'from-orange-500 to-pink-500',
    secondary: 'from-orange-50 via-pink-50 to-red-50',
    background: 'from-orange-50 via-pink-50 to-red-100',
    accent: 'bg-orange-50 text-orange-800',
    card: 'bg-white/90 backdrop-blur-sm',
    border: 'border-orange-200',
    text: 'text-orange-900',
    glow: 'shadow-orange-200/50'
  },
  forest: {
    primary: 'from-green-600 to-emerald-600',
    secondary: 'from-green-50 via-emerald-50 to-teal-50',
    background: 'from-green-50 via-emerald-50 to-teal-100',
    accent: 'bg-green-50 text-green-800',
    card: 'bg-white/90 backdrop-blur-sm',
    border: 'border-green-200',
    text: 'text-green-900',
    glow: 'shadow-green-200/50'
  },
  purple: {
    primary: 'from-purple-600 to-violet-600',
    secondary: 'from-purple-50 via-violet-50 to-fuchsia-50',
    background: 'from-purple-50 via-violet-50 to-fuchsia-100',
    accent: 'bg-purple-50 text-purple-800',
    card: 'bg-white/90 backdrop-blur-sm',
    border: 'border-purple-200',
    text: 'text-purple-900',
    glow: 'shadow-purple-200/50'
  },
  midnight: {
    primary: 'from-slate-700 to-gray-800',
    secondary: 'from-slate-100 via-gray-100 to-zinc-100',
    background: 'from-slate-100 via-gray-100 to-zinc-200',
    accent: 'bg-slate-100 text-slate-800',
    card: 'bg-white/90 backdrop-blur-sm',
    border: 'border-slate-200',
    text: 'text-slate-900',
    glow: 'shadow-slate-200/50'
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

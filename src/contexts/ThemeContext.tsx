
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
    card: 'bg-white/90 backdrop-blur-sm text-gray-900',
    border: 'border-indigo-200',
    text: 'text-indigo-900',
    glow: 'shadow-indigo-200/50'
  },
  ocean: {
    primary: 'from-cyan-500 to-blue-600',
    secondary: 'from-cyan-50 via-blue-50 to-teal-50',
    background: 'from-cyan-100 via-blue-200 to-teal-300',
    accent: 'bg-cyan-100 text-cyan-900',
    card: 'bg-white/95 backdrop-blur-md border border-cyan-200 text-gray-900',
    border: 'border-cyan-300',
    text: 'text-cyan-900',
    glow: 'shadow-cyan-300/60'
  },
  sunset: {
    primary: 'from-orange-500 to-red-500',
    secondary: 'from-orange-50 via-red-50 to-pink-50',
    background: 'from-orange-200 via-red-200 to-pink-300',
    accent: 'bg-orange-100 text-orange-900',
    card: 'bg-white/95 backdrop-blur-md border border-orange-200 text-gray-900',
    border: 'border-orange-300',
    text: 'text-orange-900',
    glow: 'shadow-orange-300/60'
  },
  forest: {
    primary: 'from-green-600 to-emerald-700',
    secondary: 'from-green-50 via-emerald-50 to-teal-50',
    background: 'from-green-200 via-emerald-300 to-teal-400',
    accent: 'bg-green-100 text-green-900',
    card: 'bg-white/95 backdrop-blur-md border border-green-200 text-gray-900',
    border: 'border-green-300',
    text: 'text-green-900',
    glow: 'shadow-green-300/60'
  },
  purple: {
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-purple-50 via-pink-50 to-fuchsia-50',
    background: 'from-purple-200 via-pink-300 to-fuchsia-400',
    accent: 'bg-purple-100 text-purple-900',
    card: 'bg-white/95 backdrop-blur-md border border-purple-200 text-gray-900',
    border: 'border-purple-300',
    text: 'text-purple-900',
    glow: 'shadow-purple-300/60'
  },
  midnight: {
    primary: 'from-blue-400 to-purple-400',
    secondary: 'from-gray-800 via-slate-800 to-zinc-900',
    background: 'from-gray-900 via-slate-900 to-zinc-950',
    accent: 'bg-gray-700 text-gray-100',
    card: 'bg-gray-800/95 backdrop-blur-md border border-gray-600 text-gray-100',
    border: 'border-gray-600',
    text: 'text-gray-100',
    glow: 'shadow-gray-800/60'
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


import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'ocean' | 'cosmic' | 'aurora' | 'neon' | 'sunset' | 'emerald';

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
  cosmic: {
    primary: 'from-purple-600 via-blue-600 to-indigo-700',
    secondary: 'from-purple-50 via-blue-50 to-indigo-50',
    background: 'from-slate-900 via-purple-900 to-slate-900',
    accent: 'bg-purple-100 text-purple-900',
    card: 'bg-white/95 backdrop-blur-md border border-purple-200 text-gray-900',
    border: 'border-purple-300',
    text: 'text-purple-900',
    glow: 'shadow-purple-400/60'
  },
  aurora: {
    primary: 'from-pink-500 via-purple-500 to-cyan-500',
    secondary: 'from-pink-50 via-purple-50 to-cyan-50',
    background: 'from-violet-200 via-purple-300 to-pink-400',
    accent: 'bg-pink-100 text-pink-900',
    card: 'bg-white/95 backdrop-blur-md border border-pink-200 text-gray-900',
    border: 'border-pink-300',
    text: 'text-pink-900',
    glow: 'shadow-pink-300/60'
  },
  neon: {
    primary: 'from-fuchsia-500 via-cyan-400 to-lime-400',
    secondary: 'from-fuchsia-50 via-cyan-50 to-lime-50',
    background: 'from-slate-800 via-purple-900 to-slate-900',
    accent: 'bg-fuchsia-100 text-fuchsia-900',
    card: 'bg-white/95 backdrop-blur-md border border-fuchsia-200 text-gray-900',
    border: 'border-fuchsia-300',
    text: 'text-fuchsia-900',
    glow: 'shadow-fuchsia-400/60'
  },
  sunset: {
    primary: 'from-orange-400 via-pink-500 to-purple-600',
    secondary: 'from-orange-50 via-pink-50 to-purple-50',
    background: 'from-orange-200 via-pink-300 to-purple-400',
    accent: 'bg-orange-100 text-orange-900',
    card: 'bg-white/95 backdrop-blur-md border border-orange-200 text-gray-900',
    border: 'border-orange-300',
    text: 'text-orange-900',
    glow: 'shadow-orange-300/60'
  },
  emerald: {
    primary: 'from-emerald-400 via-teal-500 to-green-600',
    secondary: 'from-emerald-50 via-teal-50 to-green-50',
    background: 'from-emerald-200 via-teal-300 to-green-400',
    accent: 'bg-emerald-100 text-emerald-900',
    card: 'bg-white/95 backdrop-blur-md border border-emerald-200 text-gray-900',
    border: 'border-emerald-300',
    text: 'text-emerald-900',
    glow: 'shadow-emerald-300/60'
  }
};

const validThemes: Theme[] = ['ocean', 'cosmic', 'aurora', 'neon', 'sunset', 'emerald'];

export const getThemeColors = (theme: Theme) => {
  const themeColors = themes[theme];
  if (!themeColors) {
    console.warn(`Theme "${theme}" not found, falling back to ocean theme`);
    return themes.ocean;
  }
  return themeColors;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('examPrepTheme') as Theme;
    if (saved && validThemes.includes(saved)) {
      return saved;
    }
    return 'ocean';
  });

  useEffect(() => {
    const saved = localStorage.getItem('examPrepTheme') as Theme;
    if (saved && !validThemes.includes(saved)) {
      localStorage.removeItem('examPrepTheme');
    }
    localStorage.setItem('examPrepTheme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

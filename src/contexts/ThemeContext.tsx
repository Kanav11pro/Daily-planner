
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'ocean' | 'forest' | 'aurora' | 'cosmic' | 'neon' | 'matrix' | 'cyberpunk';

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
  aurora: {
    primary: 'from-purple-400 via-pink-400 to-indigo-400',
    secondary: 'from-purple-950 via-indigo-950 to-pink-950',
    background: 'from-purple-950 via-indigo-950 to-pink-950',
    accent: 'bg-purple-800/50 text-purple-100 backdrop-blur-sm',
    card: 'bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-pink-900/90 backdrop-blur-xl border border-purple-400/30 text-purple-100 shadow-2xl shadow-purple-500/20',
    border: 'border-purple-400/30',
    text: 'text-purple-100',
    glow: 'shadow-purple-400/30 shadow-lg'
  },
  cosmic: {
    primary: 'from-indigo-600 to-blue-700',
    secondary: 'from-indigo-50 via-blue-50 to-sky-50',
    background: 'from-indigo-200 via-blue-300 to-sky-400',
    accent: 'bg-indigo-100 text-indigo-900',
    card: 'bg-white/95 backdrop-blur-md border border-indigo-200 text-gray-900',
    border: 'border-indigo-300',
    text: 'text-indigo-900',
    glow: 'shadow-indigo-300/60'
  },
  neon: {
    primary: 'from-cyan-400 via-blue-500 to-purple-600',
    secondary: 'from-slate-900 via-gray-900 to-black',
    background: 'from-black via-gray-950 to-slate-950',
    accent: 'bg-cyan-600/50 text-cyan-100 backdrop-blur-sm',
    card: 'bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-black/95 backdrop-blur-xl border border-cyan-400/30 text-cyan-100 shadow-2xl shadow-cyan-500/20',
    border: 'border-cyan-400/30',
    text: 'text-cyan-100',
    glow: 'shadow-cyan-400/30 shadow-lg'
  },
  matrix: {
    primary: 'from-green-400 via-lime-500 to-emerald-600',
    secondary: 'from-black via-gray-950 to-green-950',
    background: 'from-black via-gray-950 to-green-950',
    accent: 'bg-green-700/50 text-green-100 backdrop-blur-sm',
    card: 'bg-gradient-to-br from-black/95 via-gray-950/95 to-green-950/95 backdrop-blur-xl border border-green-400/30 text-green-100 shadow-2xl shadow-green-500/20',
    border: 'border-green-400/30',
    text: 'text-green-100',
    glow: 'shadow-green-400/30 shadow-lg'
  },
  cyberpunk: {
    primary: 'from-pink-400 via-purple-500 to-indigo-600',
    secondary: 'from-slate-900 via-purple-950 to-pink-950',
    background: 'from-black via-purple-950 to-pink-950',
    accent: 'bg-pink-700/50 text-pink-100 backdrop-blur-sm',
    card: 'bg-gradient-to-br from-slate-900/95 via-purple-950/95 to-pink-950/95 backdrop-blur-xl border border-pink-400/30 text-pink-100 shadow-2xl shadow-pink-500/20',
    border: 'border-pink-400/30',
    text: 'text-pink-100',
    glow: 'shadow-pink-400/30 shadow-lg'
  }
};

const validThemes: Theme[] = ['ocean', 'forest', 'aurora', 'cosmic', 'neon', 'matrix', 'cyberpunk'];

// Helper function to determine if a theme is dark
export const isDarkTheme = (theme: Theme): boolean => {
  return ['aurora', 'neon', 'matrix', 'cyberpunk'].includes(theme);
};

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
    // Check if the saved theme is valid, otherwise default to 'ocean'
    if (saved && validThemes.includes(saved)) {
      return saved;
    }
    return 'ocean';
  });

  useEffect(() => {
    // Clear invalid theme from localStorage if it exists
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

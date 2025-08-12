import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'ocean' | 'forest' | 'aurora' | 'cosmic' | 'midnight' | 'obsidian';

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
    primary: 'from-pink-500 to-violet-600',
    secondary: 'from-pink-50 via-purple-50 to-violet-50',
    background: 'from-pink-200 via-purple-300 to-violet-400',
    accent: 'bg-pink-100 text-pink-900',
    card: 'bg-white/95 backdrop-blur-md border border-pink-200 text-gray-900',
    border: 'border-pink-300',
    text: 'text-pink-900',
    glow: 'shadow-pink-300/60'
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

  // ---- Improved dark themes: Midnight & Obsidian ----
  midnight: {
    // primary gradient for buttons / highlights
    primary: 'from-slate-800 to-indigo-900',

    // subtle dark secondary gradient for backgrounds/overlays
    secondary: 'from-slate-800 via-slate-900 to-indigo-950',

    // main page background gradient (deep, even tones)
    background: 'from-slate-900 via-gray-900 to-indigo-950',

    // accent pills / badges (dark but legible)
    accent: 'bg-indigo-700 text-indigo-100',

    // card style: almost-black with high contrast text, clear border
    card: 'bg-slate-900/95 backdrop-blur-md border border-slate-700 text-slate-100 shadow',

    // border utility for components
    border: 'border-slate-700',

    // default text color for this theme
    text: 'text-slate-100',

    // glow for subtle UI emphasis (kept soft so it doesn't wash out)
    glow: 'shadow-indigo-700/40 shadow-lg'
  },

  obsidian: {
    // primary gradient (deep purples)
    primary: 'from-gray-900 to-purple-900',

    // dark secondary gradient for large surfaces
    secondary: 'from-gray-900 via-slate-800 to-zinc-900',

    // richer black-to-deep-slate background
    background: 'from-black via-gray-900 to-slate-950',

    // accent uses a darker purple with light text for readability
    accent: 'bg-purple-700 text-purple-50',

    // card is near-black with a hint of purple border and readable text
    card: 'bg-black/85 backdrop-blur-md border border-purple-700/20 text-purple-50 shadow',

    // border utility with a subtle purple tint
    border: 'border-purple-700/30',

    // default text color (soft purple-tinged white)
    text: 'text-purple-50',

    // subtle purple glow for focus / emphasis
    glow: 'shadow-purple-700/35 shadow-lg'
  }
};

const validThemes: Theme[] = ['ocean', 'forest', 'aurora', 'cosmic', 'midnight', 'obsidian'];

export const getThemeColors = (theme: Theme) => {
  const themeColors = (themes as Record<string, any>)[theme];
  if (!themeColors) {
    console.warn(`Theme "${theme}" not found, falling back to ocean theme`);
    return themes.ocean;
  }
  return themeColors;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('examPrepTheme') as Theme | null;
    // Check if the saved theme is valid, otherwise default to 'ocean'
    if (saved && validThemes.includes(saved)) {
      return saved;
    }
    return 'ocean';
  });

  useEffect(() => {
    // Clear invalid theme from localStorage if it exists
    const saved = localStorage.getItem('examPrepTheme') as Theme | null;
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

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

  // --------- Midnight (dark) - updated for contrast ----------
  midnight: {
    // Primary gradient for highlights/buttons
    primary: 'from-slate-800 to-indigo-900',

    // Subtle dark surface gradient for large areas
    secondary: 'from-slate-800 via-slate-900 to-indigo-950',

    // Page/background gradient (deep even tones)
    background: 'from-slate-900 via-gray-900 to-indigo-950',

    // Accent (badges/pills) - dark blue with white text
    accent: 'bg-indigo-600 text-white',

    // Card: dark slate surface, high contrast text, clear border
    // Use this for task cards / panels so they are noticeably dark (not white)
    card: 'bg-slate-800/95 backdrop-blur-md border border-slate-700/60 text-slate-100 shadow-lg',

    // Border utility for components
    border: 'border-slate-700/60',

    // Default text color for the theme
    text: 'text-slate-100',

    // Glow/shadow for focused elements (soft and colored)
    glow: 'shadow-indigo-700/40 shadow-lg',

    // Button tokens — use these on <button> elements to guarantee contrast
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-md px-4 py-2',
    buttonOutline: 'bg-transparent border border-indigo-600 text-indigo-100 hover:bg-indigo-700/20 rounded-md px-4 py-2'
  },

  // --------- Obsidian (deep black/purple) - updated ----------
  obsidian: {
    // Primary gradient (deep purples)
    primary: 'from-gray-900 to-purple-900',

    // Secondary surfaces (dark slate tones)
    secondary: 'from-gray-900 via-slate-800 to-zinc-900',

    // Background: true-black to deep-slate
    background: 'from-black via-gray-900 to-slate-950',

    // Accent: readable purple background with white text
    accent: 'bg-purple-700 text-white',

    // Card: near-black card with subtle purple border and high contrast text
    card: 'bg-neutral-900/95 backdrop-blur-md border border-purple-700/20 text-purple-50 shadow-lg',

    // Border utility
    border: 'border-purple-700/30',

    // Default text color
    text: 'text-purple-50',

    // Glow/shadow for emphasis
    glow: 'shadow-purple-700/35 shadow-lg',

    // Button tokens
    button: 'bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-md px-4 py-2',
    buttonOutline: 'bg-transparent border border-purple-600 text-purple-100 hover:bg-purple-700/20 rounded-md px-4 py-2'
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

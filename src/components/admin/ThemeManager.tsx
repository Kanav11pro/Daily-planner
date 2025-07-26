
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const themes = [
  { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
  { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
  { id: 'system', name: 'System', icon: Laptop, description: 'Follows system preference' },
];

const colorSchemes = [
  { id: 'blue', name: 'Blue', primary: 'bg-blue-500', secondary: 'bg-blue-100' },
  { id: 'purple', name: 'Purple', primary: 'bg-purple-500', secondary: 'bg-purple-100' },
  { id: 'green', name: 'Green', primary: 'bg-green-500', secondary: 'bg-green-100' },
  { id: 'orange', name: 'Orange', primary: 'bg-orange-500', secondary: 'bg-orange-100' },
  { id: 'pink', name: 'Pink', primary: 'bg-pink-500', secondary: 'bg-pink-100' },
];

export const ThemeManager = () => {
  const { theme, setTheme } = useTheme();
  const [selectedColorScheme, setSelectedColorScheme] = useState('blue');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Theme Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.id;
                
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id as any)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className={`font-medium ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                        {themeOption.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {themeOption.description}
                      </div>
                    </div>
                    {isActive && (
                      <Badge className="ml-auto">Active</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {colorSchemes.map((scheme) => {
                const isActive = selectedColorScheme === scheme.id;
                
                return (
                  <button
                    key={scheme.id}
                    onClick={() => setSelectedColorScheme(scheme.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-2">
                      <div className={`w-4 h-4 rounded-full ${scheme.primary}`} />
                      <div className={`w-4 h-4 rounded-full ${scheme.secondary}`} />
                    </div>
                    <span className={`font-medium ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                      {scheme.name}
                    </span>
                    {isActive && (
                      <Badge className="ml-auto">Active</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sample Interface</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Secondary Button</Button>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                <p className="text-gray-600 dark:text-gray-300">
                  This is how your interface will look with the current theme settings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

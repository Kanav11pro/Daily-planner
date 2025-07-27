
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme, getThemeColors, isDarkTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Shuffle, Palette, User, Sparkles, RefreshCw } from 'lucide-react';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeed: string;
  onSeedChange: (newSeed: string) => void;
  userName: string;
}

export const ProfilePictureModal = ({ 
  isOpen, 
  onClose, 
  currentSeed, 
  onSeedChange, 
  userName 
}: ProfilePictureModalProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [selectedSeed, setSelectedSeed] = useState(currentSeed);

  const avatarStyles = [
    'adventurer',
    'avataaars',
    'big-ears',
    'big-smile',
    'croodles',
    'fun-emoji',
    'lorelei',
    'micah',
    'miniavs',
    'open-peeps',
    'personas',
    'pixel-art'
  ];

  const generateRandomSeed = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleRandomize = () => {
    const newSeed = generateRandomSeed();
    setSelectedSeed(newSeed);
  };

  const handleSave = () => {
    onSeedChange(selectedSeed);
    onClose();
  };

  const generateAvatarUrl = (style: string, seed: string) => {
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  };

  const isThemeDark = isDarkTheme(theme);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${themeColors.card} max-w-2xl max-h-[80vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`${themeColors.text} text-2xl font-bold flex items-center`}>
            <Palette className="h-6 w-6 mr-2 text-purple-500" />
            Customize Your Avatar
          </DialogTitle>
          <DialogDescription className={`${isThemeDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose a style and customize your profile picture to make it uniquely yours!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Preview */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 border-4 border-purple-200 shadow-lg">
                <AvatarImage 
                  src={generateAvatarUrl('lorelei', selectedSeed)} 
                  alt="Preview"
                />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white rounded-full p-2">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className={`font-semibold ${themeColors.text}`}>Preview</p>
              <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This is how your avatar will look
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleRandomize}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Randomize</span>
            </Button>
          </div>

          {/* Avatar Style Grid */}
          <div>
            <h3 className={`font-semibold ${themeColors.text} mb-4 flex items-center`}>
              <Shuffle className="h-4 w-4 mr-2" />
              Choose a Style
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {avatarStyles.map((style) => (
                <div
                  key={style}
                  className={`relative cursor-pointer rounded-xl p-3 border-2 transition-all duration-200 hover:scale-105 ${
                    isThemeDark
                      ? 'bg-slate-700/30 border-gray-600 hover:border-purple-400'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-400'
                  }`}
                  onClick={() => setSelectedSeed(generateRandomSeed())}
                >
                  <Avatar className="w-full aspect-square">
                    <AvatarImage 
                      src={generateAvatarUrl(style, selectedSeed)} 
                      alt={style}
                      className="rounded-lg"
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <p className={`text-xs text-center mt-2 capitalize ${themeColors.text}`}>
                    {style.replace('-', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Seed Input */}
          <div>
            <h3 className={`font-semibold ${themeColors.text} mb-2`}>Custom Seed</h3>
            <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
              Enter any text to generate a unique avatar based on that text
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={selectedSeed}
                onChange={(e) => setSelectedSeed(e.target.value)}
                placeholder="Enter custom text..."
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isThemeDark
                    ? 'bg-slate-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
              <Button
                onClick={handleRandomize}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Save Avatar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

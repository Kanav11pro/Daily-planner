
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { ProfilePictureModal } from './ProfilePictureModal';
import { LogOut, User, Camera, Settings } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  avatar_seed?: string;
}

export const ProfileSection = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        // Use stored avatar_seed or fallback to user name/email
        const seed = data.avatar_seed || data.full_name || user.email?.split('@')[0] || 'User';
        setAvatarSeed(seed);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAvatarSeedChange = async (newSeed: string) => {
    if (!user) return;

    try {
      // Update the avatar seed in the database
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_seed: newSeed })
        .eq('id', user.id);

      if (!error) {
        setAvatarSeed(newSeed);
        // Update local profile state
        setProfile(prev => prev ? { ...prev, avatar_seed: newSeed } : null);
      }
    } catch (error) {
      console.error('Error updating avatar seed:', error);
    }
  };

  const handleProfilePictureClick = () => {
    setShowProfileModal(true);
  };

  if (!user || !profile) return null;

  // Generate profile picture URL using the stored seed or user's name/email
  const userName = profile.full_name || user.email?.split('@')[0] || 'User';
  const currentSeed = avatarSeed || userName;
  const profilePicUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(currentSeed)}`;

  return (
    <>
      <div className={`${themeColors.card} rounded-xl p-4 ${themeColors.border} border`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div 
                className={`w-12 h-12 rounded-full overflow-hidden ${themeColors.accent} flex items-center justify-center cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg group-hover:ring-2 group-hover:ring-purple-400`}
                onClick={handleProfilePictureClick}
              >
                <img 
                  src={profilePicUrl} 
                  alt={`${userName}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <User className={`h-6 w-6 ${themeColors.text} hidden`} />
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                   onClick={handleProfilePictureClick}>
                <Camera className="h-4 w-4 text-white" />
              </div>
              
              {/* Customization hint */}
              <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Settings className="h-3 w-3" />
              </div>
            </div>
            
            <div>
              <p className={`font-semibold ${themeColors.text}`}>
                {profile.full_name || 'User'}
              </p>
              <p className={`text-sm ${themeColors.text} opacity-70`}>
                {user.email}
              </p>
              <p className={`text-xs ${themeColors.text} opacity-50`}>
                Click avatar to customize
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      <ProfilePictureModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentSeed={currentSeed}
        onSeedChange={handleAvatarSeedChange}
        userName={userName}
      />
    </>
  );
};

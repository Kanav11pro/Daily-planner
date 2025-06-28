
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { LogOut, User } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export const ProfileSection = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [profile, setProfile] = useState<Profile | null>(null);

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
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user || !profile) return null;

  // Generate profile picture URL using the user's name or email
  const userName = profile.full_name || user.email?.split('@')[0] || 'User';
  const profilePicUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(userName)}`;

  return (
    <div className={`${themeColors.card} rounded-xl p-4 ${themeColors.border} border`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full overflow-hidden ${themeColors.accent} flex items-center justify-center`}>
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
            <User className={`h-5 w-5 ${themeColors.text} hidden`} />
          </div>
          <div>
            <p className={`font-semibold ${themeColors.text}`}>
              {profile.full_name || 'User'}
            </p>
            <p className={`text-sm ${themeColors.text} opacity-70`}>
              {user.email}
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
  );
};

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfilePictureModal } from './ProfilePictureModal';
import { User, LogOut, GraduationCap, BookOpen, Clock, TrendingUp, Edit3, Mail, Calendar } from 'lucide-react';
export const ProfileSection = React.memo(() => {
  const {
    user,
    signOut,
    userMetadata
  } = useAuth();
  const {
    theme
  } = useTheme();
  const themeColors = getThemeColors(theme);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(() => user?.user_metadata?.avatar_seed || user?.email || 'default');
  if (!user) return null;
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };
  const getUserName = () => {
    return user?.user_metadata?.full_name || 'Student';
  };
  const getExamInfo = () => {
    if (userMetadata?.exam === 'Other' && userMetadata?.exam_other) {
      return userMetadata.exam_other;
    }
    return userMetadata?.exam || 'Not specified';
  };
  const getInstituteInfo = () => {
    if (userMetadata?.institute === 'Others' && userMetadata?.institute_other) {
      return userMetadata.institute_other;
    }
    return userMetadata?.institute || 'Self-Study';
  };
  const generateAvatarUrl = (seed: string) => {
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;
  };
  const handleSeedChange = (newSeed: string) => {
    setAvatarSeed(newSeed);
  };
  return <>
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg py-[15px]">
        {/* Header with Profile and Sign Out */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-16 w-16 ring-2 ring-blue-200 dark:ring-gray-600 shadow-md cursor-pointer transition-all duration-200 hover:ring-blue-300 hover:shadow-lg" onClick={() => setShowProfileModal(true)}>
                <AvatarImage src={generateAvatarUrl(avatarSeed)} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  {getInitials(getUserName())}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Edit3 className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {getUserName()} : The Great
              </h2>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                <span>{user.email}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Click avatar to customize
              </p>
            </div>
          </div>

          <Button onClick={signOut} variant="outline" size="sm" className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Study Information */}
        
      </div>

      {/* Profile Picture Modal */}
      {showProfileModal && <ProfilePictureModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} currentSeed={avatarSeed} onSeedChange={handleSeedChange} userName={getUserName()} />}
    </>;
});

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfilePictureModal } from './ProfilePictureModal';
import { 
  User, 
  LogOut, 
  GraduationCap, 
  BookOpen, 
  Clock,
  TrendingUp,
  Edit3,
  Mail,
  Calendar
} from 'lucide-react';

export const ProfileSection = React.memo(() => {
  const { user, signOut, userMetadata } = useAuth();
  const { theme } = useTheme();
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
    // Optionally save to user metadata
  };

  return (
    <>
      <div className={`${themeColors.card} ${themeColors.border} border rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Profile Picture */}
          <div className="relative group cursor-pointer" onClick={() => setShowProfileModal(true)}>
            <Avatar className="h-20 w-20 ring-4 ring-white/20 shadow-lg transition-all duration-300 group-hover:ring-white/40 group-hover:scale-105">
              <AvatarImage src={generateAvatarUrl(avatarSeed)} />
              <AvatarFallback className={`bg-gradient-to-br ${themeColors.primary} text-white font-bold text-xl`}>
                {getInitials(getUserName())}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getUserName()}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
              <Mail className="h-4 w-4" />
              <p className="text-sm truncate">{user.email}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`bg-gradient-to-r ${themeColors.primary} text-white`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                Active Learner
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Study Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`${themeColors.secondary} p-3 rounded-lg`}>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Target Exam</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {getExamInfo()}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${themeColors.secondary} p-3 rounded-lg`}>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Institute</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {getInstituteInfo()}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${themeColors.secondary} p-3 rounded-lg`}>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Daily Hours</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {userMetadata?.study_hours || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Profile Picture Modal */}
      {showProfileModal && (
        <ProfilePictureModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentSeed={avatarSeed}
          onSeedChange={handleSeedChange}
          userName={getUserName()}
        />
      )}
    </>
  );
});

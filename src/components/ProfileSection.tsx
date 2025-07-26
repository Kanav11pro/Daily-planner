
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
      <div className={`${themeColors.card} backdrop-blur-sm ${themeColors.border} border rounded-3xl p-8 shadow-2xl transition-all duration-300`}>
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 mb-6">
          {/* Profile Avatar and Basic Info */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar 
                className="h-24 w-24 lg:h-28 lg:w-28 ring-4 ring-white/20 shadow-2xl cursor-pointer transition-all duration-300 group-hover:ring-white/40 group-hover:scale-105"
                onClick={() => setShowProfileModal(true)}
              >
                <AvatarImage src={generateAvatarUrl(avatarSeed)} />
                <AvatarFallback className={`bg-gradient-to-br ${themeColors.primary} text-white font-bold text-2xl`}>
                  {getInitials(getUserName())}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white truncate mb-1">
                  {getUserName()}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4" />
                  <p className="text-sm truncate">{user.email}</p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <Badge 
                  className={`bg-gradient-to-r ${themeColors.primary} text-white px-4 py-2 text-sm font-medium shadow-lg`}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Active Learner
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={signOut}
              variant="outline"
              size="lg"
              className="flex items-center gap-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 px-6 py-3"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Study Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exam Card */}
          <div className={`bg-gradient-to-br ${themeColors.primary}/10 ${themeColors.border} border rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${themeColors.primary}/20`}>
                <GraduationCap className={`h-6 w-6 text-transparent bg-gradient-to-r ${themeColors.primary} bg-clip-text`} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Exam</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {getExamInfo()}
                </p>
              </div>
            </div>
          </div>

          {/* Institute Card */}
          <div className={`bg-gradient-to-br ${themeColors.primary}/10 ${themeColors.border} border rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${themeColors.primary}/20`}>
                <BookOpen className={`h-6 w-6 text-transparent bg-gradient-to-r ${themeColors.primary} bg-clip-text`} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institute</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {getInstituteInfo()}
                </p>
              </div>
            </div>
          </div>

          {/* Study Hours Card */}
          <div className={`bg-gradient-to-br ${themeColors.primary}/10 ${themeColors.border} border rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${themeColors.primary}/20`}>
                <Clock className={`h-6 w-6 text-transparent bg-gradient-to-r ${themeColors.primary} bg-clip-text`} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Daily Hours</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {userMetadata?.study_hours || 'Not set'}
                </p>
              </div>
            </div>
          </div>
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

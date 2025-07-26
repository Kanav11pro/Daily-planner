
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfilePictureModal } from './ProfilePictureModal';
import { 
  User, 
  Settings, 
  LogOut, 
  GraduationCap, 
  BookOpen, 
  Clock,
  Target,
  Award,
  TrendingUp,
  Edit3
} from 'lucide-react';

export const ProfileSection = React.memo(() => {
  const { user, signOut, userMetadata } = useAuth();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  return (
    <div className={`${themeColors.card} backdrop-blur-sm ${themeColors.border} border rounded-2xl p-6 shadow-xl ${themeColors.glow} transition-all duration-300`}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Profile Avatar and Basic Info */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar 
              className="h-16 w-16 lg:h-20 lg:w-20 ring-4 ring-white/20 shadow-lg cursor-pointer transition-all duration-300 group-hover:ring-white/40"
              onClick={() => setShowProfileModal(true)}
            >
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className={`bg-gradient-to-r ${themeColors.primary} text-white font-bold text-xl`}>
                {getInitials(getUserName())}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
              {getUserName()}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 truncate">
              {user.email}
            </p>
            
            {/* Status Badge */}
            <div className="mt-2">
              <Badge 
                className={`bg-gradient-to-r ${themeColors.primary} text-white px-3 py-1 text-sm font-medium`}
                variant="outline"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Active Learner
              </Badge>
            </div>
          </div>
        </div>

        {/* Study Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          {/* Exam Card */}
          <div className={`bg-gradient-to-r ${themeColors.primary}/10 rounded-xl p-4 border border-white/20`}>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className={`h-5 w-5 bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">TARGET EXAM</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {getExamInfo()}
            </p>
          </div>

          {/* Institute Card */}
          <div className={`bg-gradient-to-r ${themeColors.primary}/10 rounded-xl p-4 border border-white/20`}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className={`h-5 w-5 bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">INSTITUTE</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {getInstituteInfo()}
            </p>
          </div>

          {/* Study Hours Card */}
          <div className={`bg-gradient-to-r ${themeColors.primary}/10 rounded-xl p-4 border border-white/20`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`h-5 w-5 bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">DAILY HOURS</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {userMetadata?.study_hours || 'Not set'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-300"
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
        />
      )}
    </div>
  );
});

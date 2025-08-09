
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';

export const PracticeLoadingSkeleton = () => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 md:h-10 w-80 md:w-96" />
          <Skeleton className="h-4 w-64 md:w-80" />
        </div>
        <Skeleton className="h-10 w-36 md:w-44" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className={`${themeColors.card} shadow-lg animate-pulse`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
              <Skeleton className="h-3 md:h-4 w-20 md:w-24" />
              <Skeleton className="h-3 w-3 md:h-4 md:w-4 rounded" />
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6 space-y-2">
              <Skeleton className="h-6 md:h-8 w-12 md:w-16" />
              <Skeleton className="h-3 w-16 md:w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        
        {/* Content Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className={`${themeColors.card} shadow-lg`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={`${themeColors.card} shadow-lg`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-28" />
              </div>
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading Text with Animated Dots */}
      <div className="flex items-center justify-center py-8">
        <div className={`flex items-center space-x-2 ${themeColors.text}`}>
          <div className={`animate-spin rounded-full h-6 w-6 border-2 border-transparent border-t-current`}></div>
          <span className="text-lg font-medium">Loading your practice data</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

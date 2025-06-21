
import { TrendingUp, Target, Calendar, Trophy, Clock, CheckCircle2, Circle, Flame, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  scheduled_date: string;
  created_at: string;
  duration?: number;
}

interface ProgressOverviewProps {
  tasks: Task[];
}

export const ProgressOverview = ({
  tasks
}: ProgressOverviewProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const IST_TIMEZONE = 'Asia/Kolkata';

  // Helper function to get current IST date
  const getCurrentISTDate = (): string => {
    return formatInTimeZone(new Date(), IST_TIMEZONE, 'yyyy-MM-dd');
  };

  // Helper function to format date consistently
  const formatDateForComparison = (date: Date | string): string => {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return formatInTimeZone(date, IST_TIMEZONE, 'yyyy-MM-dd');
  };

  const today = getCurrentISTDate();
  const currentTime = formatInTimeZone(new Date(), IST_TIMEZONE, 'hh:mm a');
  console.log('Today\'s IST date for progress:', today);

  const todayTasks = tasks.filter(task => {
    const taskDate = formatDateForComparison(task.scheduled_date);
    console.log('Comparing task date:', taskDate, 'with today:', today);
    return taskDate === today;
  });

  console.log('Today\'s tasks count:', todayTasks.length);
  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? completedToday / totalToday * 100 : 0;

  // Calculate total duration and completed duration
  const totalDuration = todayTasks.reduce((acc, task) => acc + (task.duration || 0), 0);
  const completedDuration = todayTasks.filter(task => task.completed).reduce((acc, task) => acc + (task.duration || 0), 0);

  // Get priority breakdown
  const priorityBreakdown = todayTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (progressPercentage === 100) return "🎉 Perfect day! You're on fire!";
    if (progressPercentage >= 75) return "🔥 Almost there! Keep pushing!";
    if (progressPercentage >= 50) return "💪 Great progress! You're doing amazing!";
    if (progressPercentage >= 25) return "🚀 Good start! Let's keep the momentum!";
    if (progressPercentage > 0) return "✨ Every step counts! You've got this!";
    return "🎯 Ready to conquer today? Let's start!";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Today's Progress Card - Mobile Optimized */}
      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg relative overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute -right-4 -top-4 sm:-right-8 sm:-top-8 w-20 h-20 sm:w-32 sm:h-32 bg-indigo-200/30 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 sm:-left-8 sm:-bottom-8 w-16 h-16 sm:w-28 sm:h-28 bg-purple-200/30 rounded-full blur-xl"></div>
          <div className="absolute right-1/3 top-1/4 w-12 h-12 sm:w-20 sm:h-20 bg-pink-200/20 rounded-full blur-lg"></div>
        </div>
        
        <CardHeader className="relative z-10 p-3 sm:p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 text-indigo-600" />
                {progressPercentage > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Flame className="h-2 w-2 sm:h-3 sm:w-3 text-orange-500 animate-pulse" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className={`${themeColors.text} text-sm sm:text-base lg:text-lg font-semibold truncate`}>
                  Today's Progress
                </CardTitle>
                <CardDescription className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-indigo-600'} font-medium text-xs sm:text-sm truncate`}>
                  <div className="hidden sm:block">
                    {format(toZonedTime(new Date(), IST_TIMEZONE), 'EEEE, MMMM do, yyyy')} • {currentTime} IST
                  </div>
                  <div className="sm:hidden">
                    {format(toZonedTime(new Date(), IST_TIMEZONE), 'EEE, MMM do')} • {currentTime} IST
                  </div>
                </CardDescription>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-lg sm:text-xl lg:text-xl font-bold ${themeColors.text}`}>
                {Math.round(progressPercentage)}%
              </div>
              <div className={`text-xs text-gray-500 ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : ''}`}>
                Complete
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 p-3 sm:p-4 lg:p-5 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {/* Main Progress Section - Mobile Optimized */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6">
                <div className="text-center min-w-0">
                  <div className={`text-lg sm:text-xl lg:text-lg font-bold ${themeColors.text} flex items-center justify-center space-x-1`}>
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4 text-green-600 flex-shrink-0" />
                    <span className="truncate">{completedToday}</span>
                  </div>
                  <p className={`text-xs font-medium ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Completed
                  </p>
                </div>
                <div className={`w-px h-6 sm:h-8 lg:h-6 ${theme === 'midnight' || theme === 'obsidian' ? 'bg-gray-600' : 'bg-indigo-200'}`}></div>
                <div className="text-center min-w-0">
                  <div className={`text-lg sm:text-xl lg:text-lg font-bold ${themeColors.text} flex items-center justify-center space-x-1`}>
                    <Circle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{totalToday - completedToday}</span>
                  </div>
                  <p className={`text-xs font-medium ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Remaining
                  </p>
                </div>
                <div className={`w-px h-6 sm:h-8 lg:h-6 ${theme === 'midnight' || theme === 'obsidian' ? 'bg-gray-600' : 'bg-indigo-200'}`}></div>
                <div className="text-center min-w-0">
                  <div className={`text-sm sm:text-lg lg:text-base font-bold ${themeColors.text} flex items-center justify-center space-x-1`}>
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4 text-blue-600 flex-shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:space-x-1 min-w-0">
                      <span className="text-xs sm:text-lg lg:text-base truncate">{Math.floor(completedDuration / 60)}h</span>
                      <span className="text-xs sm:text-lg lg:text-base truncate">{completedDuration % 60}m</span>
                    </div>
                  </div>
                  <p className={`text-xs font-medium ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Studied
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2 sm:h-3 bg-white/50" />
                <div className={`flex justify-between text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>0%</span>
                  <span className={`font-bold ${themeColors.text}`}>{completedToday}/{totalToday} tasks</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Motivational Message - Mobile Optimized */}
            <div className={`text-center p-3 rounded-xl border ${theme === 'midnight' || theme === 'obsidian' ? 'bg-slate-700/50 border-gray-600' : 'bg-gradient-to-r from-indigo-100/50 to-purple-100/50 border-indigo-200/50'}`}>
              <p className={`text-sm sm:text-base font-semibold ${themeColors.text}`}>
                {getMotivationalMessage()}
              </p>
            </div>

            {/* Today's Task Breakdown - Mobile Optimized */}
            {totalToday > 0 && (
              <div className="grid grid-cols-3 gap-2">
                <div className={`text-center p-2 rounded-lg border ${theme === 'midnight' || theme === 'obsidian' ? 'bg-slate-700/50 border-gray-600' : 'bg-white/50 border-indigo-100'}`}>
                  <div className="text-sm sm:text-base font-bold text-red-600">{priorityBreakdown.high || 0}</div>
                  <div className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>High Priority</div>
                </div>
                <div className={`text-center p-2 rounded-lg border ${theme === 'midnight' || theme === 'obsidian' ? 'bg-slate-700/50 border-gray-600' : 'bg-white/50 border-indigo-100'}`}>
                  <div className="text-sm sm:text-base font-bold text-yellow-600">{priorityBreakdown.medium || 0}</div>
                  <div className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>Medium Priority</div>
                </div>
                <div className={`text-center p-2 rounded-lg border ${theme === 'midnight' || theme === 'obsidian' ? 'bg-slate-700/50 border-gray-600' : 'bg-white/50 border-indigo-100'}`}>
                  <div className="text-sm sm:text-base font-bold text-green-600">{priorityBreakdown.low || 0}</div>
                  <div className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>Low Priority</div>
                </div>
              </div>
            )}

            {/* Quick Actions - No Tasks State */}
            {totalToday === 0 && (
              <div className={`text-center p-4 rounded-xl border ${theme === 'midnight' || theme === 'obsidian' ? 'bg-slate-700/30 border-gray-600' : 'bg-white/30 border-indigo-200/50'}`}>
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400 mx-auto mb-2" />
                <p className={`text-sm font-medium ${themeColors.text}`}>No tasks scheduled for today</p>
                <p className={`text-xs mt-1 ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-indigo-600'}`}>
                  Add some tasks to start your productive day!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

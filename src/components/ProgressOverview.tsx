
import { TrendingUp, Target, Calendar, Trophy, Clock, CheckCircle2, Circle, Flame, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

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

export const ProgressOverview = ({ tasks }: ProgressOverviewProps) => {
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
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  // Calculate total duration and completed duration
  const totalDuration = todayTasks.reduce((acc, task) => acc + (task.duration || 0), 0);
  const completedDuration = todayTasks.filter(task => task.completed).reduce((acc, task) => acc + (task.duration || 0), 0);

  // Get priority breakdown
  const priorityBreakdown = todayTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const subjectProgress = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { completed: 0, total: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

  // Calculate study streak (simplified - count days with completed tasks in last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return formatDateForComparison(date);
  });

  const daysWithCompletedTasks = last7Days.filter(date => {
    const dayTasks = tasks.filter(task => formatDateForComparison(task.scheduled_date) === date);
    return dayTasks.some(task => task.completed);
  }).length;

  const weeklyStreak = daysWithCompletedTasks;

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
      {/* Enhanced Today's Progress Card - Better Sizing for Desktop */}
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 shadow-lg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute -right-4 -top-4 sm:-right-6 sm:-top-6 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-200/30 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 sm:-left-6 sm:-bottom-6 w-12 h-12 sm:w-20 sm:h-20 bg-purple-200/30 rounded-full blur-xl"></div>
          <div className="absolute right-1/3 top-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-pink-200/20 rounded-full blur-lg"></div>
        </div>
        
        <CardHeader className="relative z-10 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                {progressPercentage > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Flame className="h-3 w-3 text-orange-500 animate-pulse" />
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-indigo-800 text-lg sm:text-xl font-bold">Today's Progress</CardTitle>
                <CardDescription className="text-indigo-600 font-medium text-xs sm:text-sm">
                  <div className="hidden sm:block">
                    {format(toZonedTime(new Date(), IST_TIMEZONE), 'EEEE, MMMM do, yyyy')} • {currentTime} IST
                  </div>
                  <div className="sm:hidden">
                    {format(toZonedTime(new Date(), IST_TIMEZONE), 'EEE, MMM do')} • {currentTime} IST
                  </div>
                </CardDescription>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-700">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-indigo-600 font-medium">Complete</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 p-4 sm:p-5 pt-0">
          <div className="space-y-4 sm:space-y-5">
            {/* Main Progress Section - Smaller Text for Desktop */}
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto">
                <div className="text-center p-3 bg-white/40 rounded-xl border border-indigo-100 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-indigo-700">{completedToday}</div>
                  <p className="text-xs text-gray-600 font-medium">Completed</p>
                </div>
                
                <div className="text-center p-3 bg-white/40 rounded-xl border border-indigo-100 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-indigo-700">{totalToday - completedToday}</div>
                  <p className="text-xs text-gray-600 font-medium">Remaining</p>
                </div>
                
                <div className="text-center p-3 bg-white/40 rounded-xl border border-indigo-100 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-indigo-700">
                    <div className="flex items-center justify-center space-x-1">
                      <span>{Math.floor(completedDuration / 60)}h</span>
                      <span>{completedDuration % 60}m</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Studied</p>
                </div>
              </div>
              
              <div className="space-y-2 max-w-lg mx-auto">
                <Progress value={progressPercentage} className="h-3 bg-white/50" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0%</span>
                  <span className="font-bold text-indigo-700">{completedToday}/{totalToday} tasks</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Motivational Message - Smaller Size */}
            <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-indigo-100/60 to-purple-100/60 rounded-xl border border-indigo-200/50 backdrop-blur-sm max-w-lg mx-auto">
              <p className="text-sm sm:text-base font-semibold text-indigo-800">{getMotivationalMessage()}</p>
            </div>

            {/* Today's Task Breakdown - Smaller Grid */}
            {totalToday > 0 && (
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                <div className="text-center p-2 sm:p-3 bg-white/50 rounded-xl border border-indigo-100 backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-bold text-red-600 mb-1">{priorityBreakdown.high || 0}</div>
                  <div className="text-xs text-gray-600 font-medium">High Priority</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/50 rounded-xl border border-indigo-100 backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-bold text-yellow-600 mb-1">{priorityBreakdown.medium || 0}</div>
                  <div className="text-xs text-gray-600 font-medium">Medium Priority</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/50 rounded-xl border border-indigo-100 backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-bold text-green-600 mb-1">{priorityBreakdown.low || 0}</div>
                  <div className="text-xs text-gray-600 font-medium">Low Priority</div>
                </div>
              </div>
            )}

            {/* No Tasks State - Smaller Size */}
            {totalToday === 0 && (
              <div className="text-center p-4 sm:p-5 bg-white/30 rounded-xl border border-indigo-200/50 backdrop-blur-sm max-w-lg mx-auto">
                <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm sm:text-base text-indigo-700 font-medium mb-1">No tasks scheduled for today</p>
                <p className="text-xs sm:text-sm text-indigo-600">Add some tasks to start your productive day!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subject Progress Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span>Subject Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3">
            {Object.entries(subjectProgress).map(([subject, progress]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{subject}</span>
                  <span className="text-gray-600">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <Progress 
                  value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Streak Card */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 text-yellow-800 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Study Streak</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-700">{weeklyStreak} days</div>
            <p className="text-sm text-gray-600">Keep it going! 🔥</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

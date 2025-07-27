
import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Zap, Sparkles, Brain, BarChart3, Star, Trophy, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTheme, getThemeColors, isDarkTheme } from "@/contexts/ThemeContext";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  created_at: string;
  scheduled_date: string;
  duration?: number;
}

interface TaskAnalyticsProps {
  tasks: Task[];
  onOpenWeeklyAnalytics: () => void;
}

export const TaskAnalytics = ({
  tasks,
  onOpenWeeklyAnalytics
}: TaskAnalyticsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  // Get today's date in YYYY-MM-DD format to match scheduled_date format
  const today = new Date().toISOString().split('T')[0];

  // Filter tasks for today using scheduled_date
  const todayTasks = tasks.filter(task => task.scheduled_date === today);
  console.log('Today:', today);
  console.log('All tasks:', tasks);
  console.log('Today tasks:', todayTasks);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const weeklyCompletion = last7Days.map(date => {
    const dayTasks = tasks.filter(task => task.scheduled_date === date);
    const completed = dayTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    return {
      date,
      completed,
      total,
      percentage: total > 0 ? completed / total * 100 : 0
    };
  }).reverse();

  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? completedToday / totalToday * 100 : 0;

  const subjectStats = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = {
        completed: 0,
        total: 0,
        timeSpent: 0
      };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
      acc[task.subject].timeSpent += task.duration || 0;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number; timeSpent: number; }>);

  const totalTimeSpent = Object.values(subjectStats).reduce((sum, stat) => sum + stat.timeSpent, 0);
  const averageCompletion = weeklyCompletion.reduce((sum, day) => sum + day.percentage, 0) / 7;
  const highPriorityCompleted = tasks.filter(task => task.priority === 'high' && task.completed).length;
  const totalHighPriority = tasks.filter(task => task.priority === 'high').length;

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'maths':
        return '📐';
      case 'physics':
        return '⚛️';
      case 'chemistry':
        return '🧪';
      case 'biology':
        return '🧬';
      case 'mock test':
        return '📝';
      default:
        return '📚';
    }
  };

  const isThemeDark = isDarkTheme(theme);

  return (
    <div className="space-y-4">
      {/* Enhanced Subject Mastery Card */}
      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span>Subject Mastery</span>
            <div className="ml-auto">
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
          </CardTitle>
          <CardDescription className={`${isThemeDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your progress across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(subjectStats).length > 0 ? (
              Object.entries(subjectStats).map(([subject, stats]) => (
                <div key={subject} className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  isThemeDark
                    ? 'bg-slate-700/30 border-gray-600 hover:bg-slate-700/50' 
                    : 'bg-gradient-to-r from-gray-50 to-white border-gray-200 hover:from-gray-100 hover:to-gray-50'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSubjectIcon(subject)}</span>
                      <span className={`font-semibold ${themeColors.text}`}>{subject}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${themeColors.text}`}>
                        {stats.completed}/{stats.total}
                      </div>
                      <div className={`text-xs ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs">
                      <span className={`${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Complete
                      </span>
                      {stats.completed === stats.total && stats.total > 0 && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center p-6 rounded-lg ${
                isThemeDark
                  ? 'bg-slate-700/30' 
                  : 'bg-gray-50'
              }`}>
                <BookOpen className={`h-8 w-8 mx-auto mb-2 ${
                  isThemeDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${themeColors.text}`}>No subjects yet</p>
                <p className={`text-xs ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add some tasks to see your progress!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Daily Consistency Card */}
      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span>Weekly Streak</span>
            <div className="ml-auto">
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
          </CardTitle>
          <CardDescription className={`${isThemeDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Your consistency over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weeklyCompletion.map((day, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className={`text-xs font-medium ${isThemeDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mx-auto transition-all duration-300 ${
                    day.percentage >= 80 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg animate-pulse' 
                      : day.percentage >= 50 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md' 
                        : day.percentage > 0 
                          ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-sm' 
                          : isThemeDark
                            ? 'bg-gray-700 text-gray-400 border border-gray-600'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}>
                    {day.total > 0 ? `${Math.round(day.percentage)}%` : '-'}
                  </div>
                  <div className={`text-xs mt-1 ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {day.total > 0 && (
                      <span>{day.completed}/{day.total}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`mt-6 p-4 rounded-lg ${
              isThemeDark
                ? 'bg-slate-700/30 border border-gray-600' 
                : 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeColors.text}`}>Weekly Average</p>
                  <p className={`text-xs ${isThemeDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your consistency score
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${themeColors.text}`}>
                    {Math.round(averageCompletion)}%
                  </div>
                  <div className="flex items-center space-x-1">
                    {averageCompletion >= 80 && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    <span className={`text-xs ${
                      averageCompletion >= 80 ? 'text-green-600' : 
                      averageCompletion >= 60 ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {averageCompletion >= 80 ? 'Excellent!' : averageCompletion >= 60 ? 'Good!' : 'Keep going!'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Weekly Analytics Button */}
      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300 group`}>
        <CardContent className="p-0">
          <Button 
            onClick={onOpenWeeklyAnalytics} 
            className={`w-full h-auto p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 group-hover:scale-105 border-0`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Weekly Analytics</div>
                  <div className="text-sm opacity-90">Detailed insights & performance charts</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Zap, Sparkles, Brain, BarChart3, Star, Trophy, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { JEEPerformanceInsights } from "./JEEPerformanceInsights";

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

  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;

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

  const isDarkTheme = theme === 'midnight' || theme === 'obsidian';

  return (
    <div className="space-y-4">
      {/* JEE Performance Insights - replaces weekly streak */}
      <JEEPerformanceInsights tasks={tasks} />

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
          <CardDescription className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your progress across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(subjectStats).length > 0 ? (
              Object.entries(subjectStats).map(([subject, stats]) => (
                <div key={subject} className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  isDarkTheme 
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
                      <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
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
                      <span className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
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
                isDarkTheme 
                  ? 'bg-slate-700/30' 
                  : 'bg-gray-50'
              }`}>
                <BookOpen className={`h-8 w-8 mx-auto mb-2 ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${themeColors.text}`}>No subjects yet</p>
                <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add some tasks to see your progress!
                </p>
              </div>
            )}
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
                  <div className="font-bold text-lg">AI Coach Analytics</div>
                  <div className="text-sm opacity-90">Comprehensive JEE preparation insights</div>
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

import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Zap, Sparkles, Brain, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
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
  const {
    theme
  } = useTheme();
  const themeColors = getThemeColors(theme);

  // Get today's date in YYYY-MM-DD format to match scheduled_date format
  const today = new Date().toISOString().split('T')[0];

  // Filter tasks for today using scheduled_date
  const todayTasks = tasks.filter(task => task.scheduled_date === today);
  console.log('Today:', today);
  console.log('All tasks:', tasks);
  console.log('Today tasks:', todayTasks);
  const last7Days = Array.from({
    length: 7
  }, (_, i) => {
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
  }, {} as Record<string, {
    completed: number;
    total: number;
    timeSpent: number;
  }>);
  const totalTimeSpent = Object.values(subjectStats).reduce((sum, stat) => sum + stat.timeSpent, 0);
  const averageCompletion = weeklyCompletion.reduce((sum, day) => sum + day.percentage, 0) / 7;
  const highPriorityCompleted = tasks.filter(task => task.priority === 'high' && task.completed).length;
  const totalHighPriority = tasks.filter(task => task.priority === 'high').length;
  const getMotivationalContent = () => {
    const motivationalQuotes = [{
      emoji: '💪',
      title: 'BEAST MODE ON!',
      message: 'Champions train when nobody is watching. Your dedication today builds tomorrow\'s success!',
      gradient: 'from-red-600 via-orange-500 to-yellow-500',
      animation: 'animate-pulse',
      intensity: 'high'
    }, {
      emoji: '🔥',
      title: 'GRIND NEVER STOPS!',
      message: 'Every page you study, every problem you solve - you\'re building an unstoppable mind!',
      gradient: 'from-purple-600 via-red-500 to-orange-500',
      animation: 'animate-bounce',
      intensity: 'high'
    }, {
      emoji: '⚡',
      title: 'POWER THROUGH!',
      message: 'The difference between ordinary and extraordinary is that little "EXTRA" - keep pushing!',
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
      animation: 'animate-pulse',
      intensity: 'high'
    }, {
      emoji: '🎯',
      title: 'LOCKED AND LOADED!',
      message: 'Focus like a laser, work like a warrior. Your goals are waiting for your action!',
      gradient: 'from-green-600 via-blue-600 to-purple-600',
      animation: 'animate-bounce',
      intensity: 'high'
    }, {
      emoji: '🚀',
      title: 'BLAST OFF TIME!',
      message: 'Today\'s study session is your launchpad. Prepare for intellectual takeoff!',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      animation: 'animate-pulse',
      intensity: 'high'
    }];
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };
  const motivationalContent = getMotivationalContent();
  return <div className="space-y-4">
      

      

      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Subject Mastery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(subjectStats).map(([subject, stats]) => <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{subject}</span>
                  </div>
                  <span className="text-gray-600">
                    {stats.completed}/{stats.total} ({stats.timeSpent}min)
                  </span>
                </div>
                <Progress value={stats.total > 0 ? stats.completed / stats.total * 100 : 0} className="h-2" />
              </div>)}
          </div>
        </CardContent>
      </Card>

      

      

      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Daily Consistency</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {weeklyCompletion.map((day, index) => <div key={index} className="space-y-1">
                <div className="text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'narrow'
              })}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto transition-all duration-300 ${day.percentage >= 80 ? 'bg-green-100 text-green-800 animate-pulse' : day.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : day.percentage > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-400'}`}>
                  {day.total > 0 ? `${Math.round(day.percentage)}%` : '-'}
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardContent className="p-6">
          <Button onClick={onOpenWeeklyAnalytics} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-normal px-0 py-[22px]">
            <div className="flex items-center justify-center space-x-3">
              <BarChart3 className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Weekly Analytics</div>
                <div className="text-sm opacity-90">View detailed insights & charts</div>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>;
};
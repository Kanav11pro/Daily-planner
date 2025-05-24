import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Zap, Sparkles, Brain, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface Task {
  id: number;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  createdAt: string;
  duration?: string;
}

interface TaskAnalyticsProps {
  tasks: Task[];
  onOpenWeeklyAnalytics: () => void;
}

export const TaskAnalytics = ({ tasks, onOpenWeeklyAnalytics }: TaskAnalyticsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const today = new Date().toDateString();
  const todayTasks = tasks.filter(task => 
    new Date(task.createdAt).toDateString() === today
  );

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const weeklyCompletion = last7Days.map(date => {
    const dayTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === date
    );
    const completed = dayTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    return { date, completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }).reverse();

  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const subjectStats = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { completed: 0, total: 0, timeSpent: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
      acc[task.subject].timeSpent += parseInt(task.duration || '0');
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number; timeSpent: number }>);

  const totalTimeSpent = Object.values(subjectStats).reduce((sum, stat) => sum + stat.timeSpent, 0);
  const averageCompletion = weeklyCompletion.reduce((sum, day) => sum + day.percentage, 0) / 7;

  const highPriorityCompleted = tasks.filter(task => task.priority === 'high' && task.completed).length;
  const totalHighPriority = tasks.filter(task => task.priority === 'high').length;

  const getMotivationalContent = () => {
    const motivationalQuotes = [
      {
        emoji: '💪',
        title: 'BEAST MODE ON!',
        message: 'Champions train when nobody is watching. Your dedication today builds tomorrow\'s success!',
        gradient: 'from-red-600 via-orange-500 to-yellow-500',
        animation: 'animate-pulse',
        intensity: 'high'
      },
      {
        emoji: '🔥',
        title: 'GRIND NEVER STOPS!',
        message: 'Every page you study, every problem you solve - you\'re building an unstoppable mind!',
        gradient: 'from-purple-600 via-red-500 to-orange-500',
        animation: 'animate-bounce',
        intensity: 'high'
      },
      {
        emoji: '⚡',
        title: 'POWER THROUGH!',
        message: 'The difference between ordinary and extraordinary is that little "EXTRA" - keep pushing!',
        gradient: 'from-blue-600 via-purple-600 to-pink-600',
        animation: 'animate-pulse',
        intensity: 'high'
      },
      {
        emoji: '🎯',
        title: 'LOCKED AND LOADED!',
        message: 'Focus like a laser, work like a warrior. Your goals are waiting for your action!',
        gradient: 'from-green-600 via-blue-600 to-purple-600',
        animation: 'animate-bounce',
        intensity: 'high'
      },
      {
        emoji: '🚀',
        title: 'BLAST OFF TIME!',
        message: 'Today\'s study session is your launchpad. Prepare for intellectual takeoff!',
        gradient: 'from-indigo-600 via-purple-600 to-pink-600',
        animation: 'animate-pulse',
        intensity: 'high'
      }
    ];

    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const motivationalContent = getMotivationalContent();

  return (
    <div className="space-y-4">
      <Card className={`bg-gradient-to-br from-indigo-50 to-purple-50 ${themeColors.border} ${themeColors.glow} shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
            <Target className="h-5 w-5" />
            <span>Today's Progress</span>
          </CardTitle>
          <CardDescription>Keep building momentum!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${themeColors.text}`}>
                {completedToday}/{totalToday}
              </div>
              <p className="text-sm text-gray-600">Tasks Completed</p>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-center text-sm text-gray-600">
              {Math.round(progressPercentage)}% of today's goals achieved
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Focus Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{totalTimeSpent} min</div>
            <p className="text-sm text-gray-600">Deep study sessions completed</p>
          </div>
        </CardContent>
      </Card>

      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Subject Mastery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(subjectStats).map(([subject, stats]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{subject}</span>
                  </div>
                  <span className="text-gray-600">
                    {stats.completed}/{stats.total} ({stats.timeSpent}min)
                  </span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 ${themeColors.glow} shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Award className="h-5 w-5" />
            <span>Achievement Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-700">
                {Math.round(averageCompletion)}%
              </div>
              <p className="text-xs text-gray-600">Weekly consistency</p>
            </div>
            <div>
              <div className="text-xl font-bold text-green-700">
                {totalHighPriority > 0 ? Math.round((highPriorityCompleted / totalHighPriority) * 100) : 0}%
              </div>
              <p className="text-xs text-gray-600">Priority focus</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${motivationalContent.gradient} text-white ${themeColors.glow} shadow-xl overflow-hidden relative`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute top-2 right-2 opacity-30">
          <Brain className="h-12 w-12 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-2 left-2 opacity-30">
          <Zap className="h-8 w-8 animate-bounce" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
          <Sparkles className="h-32 w-32 animate-pulse" />
        </div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Zap className="h-5 w-5" />
            <span>MOTIVATION ENGINE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center space-y-4">
            <div className={`text-5xl ${motivationalContent.animation}`}>
              {motivationalContent.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 tracking-wide uppercase">{motivationalContent.title}</h3>
              <p className="text-sm opacity-90 leading-relaxed font-medium">
                {motivationalContent.message}
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
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
            {weeklyCompletion.map((day, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto transition-all duration-300 ${
                  day.percentage >= 80 ? 'bg-green-100 text-green-800 animate-pulse' :
                  day.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  day.percentage > 0 ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {day.total > 0 ? `${Math.round(day.percentage)}%` : '-'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardContent className="p-6">
          <Button 
            onClick={onOpenWeeklyAnalytics}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl transition-all duration-300 hover:scale-105"
          >
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
    </div>
  );
};

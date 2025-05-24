
import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
}

export const TaskAnalytics = ({ tasks }: TaskAnalyticsProps) => {
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
    if (averageCompletion >= 80) {
      return {
        emoji: '🔥',
        title: 'On Fire!',
        message: 'You\'re crushing your goals! Keep this amazing streak going!',
        gradient: 'from-red-500 to-orange-500',
        animation: 'animate-bounce'
      };
    } else if (averageCompletion >= 60) {
      return {
        emoji: '💪',
        title: 'Strong Progress!',
        message: 'Excellent work! You\'re building great study habits!',
        gradient: 'from-blue-500 to-purple-500',
        animation: 'animate-pulse'
      };
    } else if (averageCompletion >= 40) {
      return {
        emoji: '📈',
        title: 'Building Momentum!',
        message: 'You\'re on the right track! Every step counts!',
        gradient: 'from-green-500 to-teal-500',
        animation: 'animate-pulse'
      };
    } else {
      return {
        emoji: '🌱',
        title: 'Getting Started!',
        message: 'Great things start small! You\'ve got this!',
        gradient: 'from-emerald-500 to-green-500',
        animation: 'animate-bounce'
      };
    }
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
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-2 right-2 opacity-20">
          <Zap className="h-12 w-12 animate-pulse" />
        </div>
        <div className="absolute bottom-2 left-2 opacity-20">
          <Sparkles className="h-8 w-8 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Zap className="h-5 w-5" />
            <span>Motivation Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center space-y-4">
            <div className={`text-4xl ${motivationalContent.animation}`}>
              {motivationalContent.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{motivationalContent.title}</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                {motivationalContent.message}
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
    </div>
  );
};

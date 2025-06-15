import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Calendar, TrendingUp, Clock, Target, Award, Book, Brain, Flame, X, ChevronLeft, ChevronRight, BarChart3, Activity, Zap, Sparkles 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface WeeklyAnalyticsProps {
  tasks: Task[];
  onClose: () => void;
}

export const WeeklyAnalytics = ({ tasks, onClose }: WeeklyAnalyticsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [selectedWeek, setSelectedWeek] = useState(0);

  const getWeekData = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (weekOffset * 7) - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startDateString = startOfWeek.toISOString().split('T')[0];
    const endDateString = endOfWeek.toISOString().split('T')[0];

    return {
      start: startOfWeek,
      end: endOfWeek,
      tasks: tasks.filter(task => {
        return task.scheduled_date >= startDateString && task.scheduled_date <= endDateString;
      })
    };
  };

  const currentWeekData = getWeekData(selectedWeek);
  const weeklyTasks = currentWeekData.tasks;

  const dailyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekData.start);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayTasks = weeklyTasks.filter(task => 
      task.scheduled_date === dateString
    );
    const completed = dayTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      studyTime: dayTasks.reduce((sum, task) => sum + (task.duration || 0), 0)
    };
  });

  const subjectDistribution = weeklyTasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { completed: 0, total: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) acc[task.subject].completed++;
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

  const pieData = Object.entries(subjectDistribution).map(([subject, data], index) => ({
    name: subject,
    value: data.completed,
    total: data.total,
    color: ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'][index % 5]
  }));

  const totalCompleted = weeklyTasks.filter(task => task.completed).length;
  const totalTasks = weeklyTasks.length;
  const weeklyCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const totalStudyTime = weeklyTasks.reduce((sum, task) => sum + (task.duration || 0), 0);

  const formatWeekRange = () => {
    const start = currentWeekData.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = currentWeekData.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto border border-slate-200 dark:border-slate-700 animate-fade-in">
        
        {/* Enhanced Modal Header Card */}
        <div className="relative p-8 border-b border-slate-200/50 dark:border-slate-700/50">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-t-3xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="m36 34v-4h-2v4h2zm0-8v-2h-2v2h2zm-12 0v-2h-2v2h2zm0 8v-4h-2v4h2z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 p-3 rounded-2xl backdrop-blur-sm border border-white/20 hover:scale-110 hover:rotate-90 group"
            >
              <X className="h-6 w-6 transition-transform duration-300" />
            </button>
            
            {/* Main Header Content */}
            <div className="flex items-start space-x-6 mb-8">
              {/* Icon Container */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/15 backdrop-blur-md p-6 rounded-3xl border border-white/20 group-hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <BarChart3 className="h-12 w-12 text-white drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Title and Description */}
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-sm">
                    Weekly Analytics
                  </h1>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
                
                <p className="text-xl text-blue-100/90 font-medium mb-4 leading-relaxed">
                  View detailed insights & charts
                </p>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20">
                    <TrendingUp className="h-3 w-3 mr-1.5" />
                    Progress Tracking
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20">
                    <Activity className="h-3 w-3 mr-1.5" />
                    Performance Analytics
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20">
                    <Target className="h-3 w-3 mr-1.5" />
                    Goal Insights
                  </span>
                </div>
              </div>
            </div>
            
            {/* Stats Preview Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-400/20 rounded-lg">
                    <Target className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">Completion</p>
                    <p className="text-2xl font-bold text-white">{weeklyCompletionRate}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-400/20 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">Study Time</p>
                    <p className="text-2xl font-bold text-white">{totalStudyTime}m</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-400/20 rounded-lg">
                    <Book className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">Subjects</p>
                    <p className="text-2xl font-bold text-white">{Object.keys(subjectDistribution).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-400/20 rounded-lg">
                    <Flame className="h-5 w-5 text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">Peak Day</p>
                    <p className="text-2xl font-bold text-white">
                      {dailyProgress.reduce((max, day) => day.percentage > max.percentage ? day : max, dailyProgress[0])?.day || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Enhanced Week Picker */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek + 1)}
                className="flex items-center space-x-2 hover:bg-violet-50 dark:hover:bg-violet-950 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl px-4 py-2 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="font-semibold">Previous</span>
              </Button>
              
              <div className="text-center px-6">
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">{formatWeekRange()}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {selectedWeek === 0 ? 'Current Week' : `${selectedWeek} week${selectedWeek > 1 ? 's' : ''} ago`}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
                className="flex items-center space-x-2 hover:bg-violet-50 dark:hover:bg-violet-950 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl px-4 py-2 transition-all duration-200 disabled:opacity-50"
              >
                <span className="font-semibold">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-blue-700 dark:text-blue-300">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span className="font-bold">Completion</span>
                  </div>
                  <Activity className="h-4 w-4 opacity-60" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-blue-800 dark:text-blue-200 mb-1">{weeklyCompletionRate}%</div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{totalCompleted}/{totalTasks} tasks completed</p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-bold">Study Time</span>
                  </div>
                  <Zap className="h-4 w-4 opacity-60" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-200 mb-1">{totalStudyTime}m</div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">focused learning</p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-purple-700 dark:text-purple-300">
                  <div className="flex items-center space-x-2">
                    <Book className="h-5 w-5" />
                    <span className="font-bold">Subjects</span>
                  </div>
                  <Brain className="h-4 w-4 opacity-60" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-purple-800 dark:text-purple-200 mb-1">{Object.keys(subjectDistribution).length}</div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">areas covered</p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/50 dark:to-red-950/50 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-orange-700 dark:text-orange-300">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5" />
                    <span className="font-bold">Peak Day</span>
                  </div>
                  <Award className="h-4 w-4 opacity-60" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-orange-800 dark:text-orange-200 mb-1">
                  {dailyProgress.reduce((max, day) => day.percentage > max.percentage ? day : max, dailyProgress[0])?.day || 'N/A'}
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">best performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Progress Chart */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
                <CardTitle className="flex items-center space-x-3 text-indigo-700 dark:text-indigo-300">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold">Daily Progress</span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 ml-11">
                  Track your daily task completion and study consistency
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyProgress} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="completed" fill="#8b5cf6" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" fill="#e2e8f0" name="Total" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject Distribution Chart */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                <CardTitle className="flex items-center space-x-3 text-purple-700 dark:text-purple-300">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold">Subject Distribution</span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 ml-11">
                  See your focus distribution across different subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={85}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Study Time Trend */}
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20">
              <CardTitle className="flex items-center space-x-3 text-green-700 dark:text-green-300">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">Study Time Trend</span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 ml-11">
                Monitor your daily study time patterns and consistency
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyProgress}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="studyTime" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#10b981' }}
                    activeDot={{ r: 7, fill: '#059669' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

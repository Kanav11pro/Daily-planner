
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, TrendingUp, Clock, Target, Award, Book, Brain, Flame, X, ChevronLeft, ChevronRight, Star, AlertTriangle, CheckCircle, Trophy, Zap, BookOpen, Timer, TrendingDown, Users, Lightbulb, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  const [activeTab, setActiveTab] = useState('overview');

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
  const previousWeekData = getWeekData(selectedWeek + 1);
  const weeklyTasks = currentWeekData.tasks;
  const previousWeekTasks = previousWeekData.tasks;

  // Calculate comprehensive analytics
  const totalCompleted = weeklyTasks.filter(task => task.completed).length;
  const totalTasks = weeklyTasks.length;
  const weeklyCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const totalStudyTime = weeklyTasks.reduce((sum, task) => sum + (task.duration || 0), 0);
  
  const previousCompleted = previousWeekTasks.filter(task => task.completed).length;
  const previousTotal = previousWeekTasks.length;
  const previousCompletionRate = previousTotal > 0 ? Math.round((previousCompleted / previousTotal) * 100) : 0;
  const improvementRate = weeklyCompletionRate - previousCompletionRate;

  // Daily progress with more details
  const dailyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekData.start);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayTasks = weeklyTasks.filter(task => task.scheduled_date === dateString);
    const highPriorityTasks = dayTasks.filter(task => task.priority === 'high');
    const completed = dayTasks.filter(task => task.completed).length;
    const highPriorityCompleted = highPriorityTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed,
      total,
      highPriority: highPriorityTasks.length,
      highPriorityCompleted,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      studyTime: dayTasks.reduce((sum, task) => sum + (task.duration || 0), 0),
      efficiency: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  // Subject performance analysis
  const subjectAnalysis = weeklyTasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { 
        completed: 0, 
        total: 0, 
        studyTime: 0,
        highPriority: 0,
        highPriorityCompleted: 0
      };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
      acc[task.subject].studyTime += task.duration || 0;
    }
    if (task.priority === 'high') {
      acc[task.subject].highPriority++;
      if (task.completed) acc[task.subject].highPriorityCompleted++;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number; studyTime: number; highPriority: number; highPriorityCompleted: number }>);

  const subjectPerformance = Object.entries(subjectAnalysis).map(([subject, data]) => ({
    subject,
    completion: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    studyTime: data.studyTime,
    efficiency: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    focus: data.highPriority > 0 ? Math.round((data.highPriorityCompleted / data.highPriority) * 100) : 100
  }));

  // Performance insights and recommendations
  const getPerformanceInsights = () => {
    const insights = [];
    
    if (weeklyCompletionRate >= 80) {
      insights.push({
        type: 'success',
        icon: Trophy,
        title: 'Excellent Performance!',
        message: 'You\'re crushing your goals! Keep this momentum going.',
        color: 'text-green-600'
      });
    } else if (weeklyCompletionRate >= 60) {
      insights.push({
        type: 'warning',
        icon: Target,
        title: 'Good Progress',
        message: 'You\'re doing well, but there\'s room for improvement.',
        color: 'text-yellow-600'
      });
    } else {
      insights.push({
        type: 'danger',
        icon: AlertTriangle,
        title: 'Needs Attention',
        message: 'Consider adjusting your study schedule for better results.',
        color: 'text-red-600'
      });
    }

    if (improvementRate > 10) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Great Improvement!',
        message: `You've improved by ${improvementRate}% from last week!`,
        color: 'text-green-600'
      });
    } else if (improvementRate < -10) {
      insights.push({
        type: 'warning',
        icon: TrendingDown,
        title: 'Declining Performance',
        message: `Performance dropped by ${Math.abs(improvementRate)}%. Let's get back on track!`,
        color: 'text-red-600'
      });
    }

    const weakestSubject = subjectPerformance.reduce((min, subject) => 
      subject.completion < min.completion ? subject : min, subjectPerformance[0]);
    
    if (weakestSubject && weakestSubject.completion < 60) {
      insights.push({
        type: 'info',
        icon: BookOpen,
        title: 'Focus Area Identified',
        message: `${weakestSubject.subject} needs more attention (${weakestSubject.completion}% completion).`,
        color: 'text-blue-600'
      });
    }

    return insights;
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    const bestDay = dailyProgress.reduce((max, day) => day.percentage > max.percentage ? day : max, dailyProgress[0]);
    const worstDay = dailyProgress.reduce((min, day) => day.percentage < min.percentage && day.total > 0 ? day : min, dailyProgress[0]);
    
    if (bestDay.percentage > 80) {
      recommendations.push(`Your ${bestDay.day} routine is working great! Try to replicate this pattern.`);
    }
    
    if (worstDay.percentage < 50 && worstDay.total > 0) {
      recommendations.push(`Consider reducing tasks on ${worstDay.day} or spreading them across other days.`);
    }

    if (totalStudyTime < 300) { // Less than 5 hours per week
      recommendations.push('Increase your weekly study time for better academic performance.');
    }

    const highPriorityPending = weeklyTasks.filter(task => task.priority === 'high' && !task.completed);
    if (highPriorityPending.length > 0) {
      recommendations.push(`You have ${highPriorityPending.length} high-priority tasks pending. Focus on these first.`);
    }

    return recommendations;
  };

  const pieData = subjectPerformance.map((subject, index) => ({
    name: subject.subject,
    value: subject.completion,
    studyTime: subject.studyTime,
    color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][index % 5]
  }));

  const radarData = subjectPerformance.map(subject => ({
    subject: subject.subject.substring(0, 8),
    completion: subject.completion,
    efficiency: subject.efficiency,
    focus: subject.focus
  }));

  const formatWeekRange = () => {
    const start = currentWeekData.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = currentWeekData.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  const insights = getPerformanceInsights();
  const recommendations = getRecommendations();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`${themeColors.card} rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden animate-scale-in`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'midnight' || theme === 'obsidian' ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600`}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Study Analytics Dashboard
              </h2>
              <p className="text-white/80">Advanced insights for academic success</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:scale-110 rounded-full hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Week Navigation */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(selectedWeek + 1)}
                  className="flex items-center space-x-2 hover:scale-105 transition-transform"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <div className="text-center">
                  <h3 className={`font-bold text-xl ${themeColors.text}`}>Week of {formatWeekRange()}</h3>
                  <p className={`text-sm ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedWeek === 0 ? 'Current Week' : `${selectedWeek} week${selectedWeek > 1 ? 's' : ''} ago`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                  disabled={selectedWeek === 0}
                  className="flex items-center space-x-2 hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Completion Rate</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-900">{weeklyCompletionRate}%</span>
                        {improvementRate !== 0 && (
                          <Badge variant={improvementRate > 0 ? "default" : "destructive"} className="text-xs">
                            {improvementRate > 0 ? '+' : ''}{improvementRate}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <Progress value={weeklyCompletionRate} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Study Time</p>
                      <span className="text-2xl font-bold text-green-900">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</span>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    Avg: {Math.round(totalStudyTime / 7)} min/day
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Active Subjects</p>
                      <span className="text-2xl font-bold text-purple-900">{Object.keys(subjectAnalysis).length}</span>
                    </div>
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-purple-700 mt-2">
                    Balanced learning approach
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200 transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Weekly Streak</p>
                      <span className="text-2xl font-bold text-orange-900">{dailyProgress.filter(day => day.percentage > 0).length}</span>
                    </div>
                    <Flame className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-orange-700 mt-2">
                    Days with activity
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Insights and Recommendations */}
          {insights.length > 0 && (
            <div className="px-6 pb-6">
              <h3 className={`text-xl font-bold mb-4 ${themeColors.text}`}>📊 Performance Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {insights.map((insight, index) => (
                  <Card key={index} className="transform hover:scale-105 transition-all duration-300 animate-bounce-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <insight.icon className={`h-6 w-6 ${insight.color} mt-1`} />
                        <div>
                          <h4 className={`font-semibold ${themeColors.text}`}>{insight.title}</h4>
                          <p className={`text-sm ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {insight.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {recommendations.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <span>💡 Smart Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                          theme === 'midnight' || theme === 'obsidian' ? 'bg-gray-800/50' : 'bg-blue-50'
                        } animate-fade-in`} style={{ animationDelay: `${index * 200}ms` }}>
                          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                          <p className={`text-sm ${themeColors.text}`}>{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Charts Section */}
          <div className="px-6 pb-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Daily Performance Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`${value}${name === 'studyTime' ? ' min' : '%'}`, name]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Line type="monotone" dataKey="percentage" stroke="#8B5CF6" strokeWidth={3} name="Completion %" />
                      <Line type="monotone" dataKey="studyTime" stroke="#06B6D4" strokeWidth={2} name="Study Time" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Performance Radar */}
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Subject Performance Matrix</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Completion" dataKey="completion" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Radar name="Focus" dataKey="focus" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Subject-wise Study Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    {subjectPerformance.map((subject, index) => (
                      <div key={subject.subject} className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                        theme === 'midnight' || theme === 'obsidian' 
                          ? 'bg-gray-800/50 border-gray-700' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-semibold ${themeColors.text}`}>{subject.subject}</h4>
                          <Badge variant={subject.completion >= 80 ? "default" : subject.completion >= 60 ? "secondary" : "destructive"}>
                            {subject.completion}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className={theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}>
                              Study Time: {Math.floor(subject.studyTime / 60)}h {subject.studyTime % 60}m
                            </span>
                            {subject.completion >= 80 && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <Progress value={subject.completion} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

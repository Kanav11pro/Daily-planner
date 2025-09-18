import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Clock, Target, Award, Book, Brain, Flame, ChevronDown, ChevronUp, Trophy, AlertTriangle, CheckCircle, Zap, Lightbulb, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { usePractice } from "@/hooks/usePractice";

interface FlipAnalyticsProps {
  tasks: any[];
  isFlipped: boolean;
  onToggleFlip: () => void;
}

export const FlipAnalytics = ({ tasks, isFlipped, onToggleFlip }: FlipAnalyticsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const { sessions, analytics } = usePractice();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate comprehensive weekly analytics
  const weeklyAnalytics = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    
    const weeklyTasks = tasks.filter(task => {
      const taskDate = new Date(task.scheduled_date);
      return taskDate >= weekStart && taskDate <= now;
    });

    const weeklySessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= now;
    });

    const totalTasks = weeklyTasks.length;
    const completedTasks = weeklyTasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const totalQuestions = weeklySessions.reduce((sum, session) => sum + session.questions_solved, 0);
    const totalTime = weeklySessions.reduce((sum, session) => sum + session.time_spent, 0);
    const totalHours = Math.floor(totalTime / 60);
    const totalMinutes = totalTime % 60;

    // Subject analysis
    const subjectAnalysis = weeklyTasks.reduce((acc, task) => {
      if (!acc[task.subject]) {
        acc[task.subject] = { completed: 0, total: 0, time: 0 };
      }
      acc[task.subject].total++;
      if (task.completed) {
        acc[task.subject].completed++;
        acc[task.subject].time += task.duration || 0;
      }
      return acc;
    }, {} as Record<string, { completed: number; total: number; time: number }>);

    const subjectPerformance = Object.entries(subjectAnalysis).map(([subject, data]: [string, any]) => ({
      subject,
      completion: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      time: data.time,
      tasks: data.total
    }));

    // Practice vs Theory analysis
    const practiceTime = weeklySessions.reduce((sum, session) => sum + session.time_spent, 0);
    const theoryTime = weeklyTasks
      .filter(task => task.completed && task.study_nature === 'theory')
      .reduce((sum, task) => sum + (task.duration || 0), 0);
    const revisionTime = weeklyTasks
      .filter(task => task.completed && task.study_nature === 'revision')
      .reduce((sum, task) => sum + (task.duration || 0), 0);

    const totalStudyTime = practiceTime + theoryTime + revisionTime;
    const studyDistribution = {
      practice: totalStudyTime > 0 ? Math.round((practiceTime / totalStudyTime) * 100) : 0,
      theory: totalStudyTime > 0 ? Math.round((theoryTime / totalStudyTime) * 100) : 0,
      revision: totalStudyTime > 0 ? Math.round((revisionTime / totalStudyTime) * 100) : 0
    };

    // Daily progress
    const dailyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayTasks = weeklyTasks.filter(task => task.scheduled_date === dateString);
      const daySessions = weeklySessions.filter(session => session.date === dateString);
      
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: dayTasks.filter(task => task.completed).length,
        questions: daySessions.reduce((sum, session) => sum + session.questions_solved, 0),
        time: daySessions.reduce((sum, session) => sum + session.time_spent, 0),
        efficiency: dayTasks.length > 0 ? Math.round((dayTasks.filter(task => task.completed).length / dayTasks.length) * 100) : 0
      };
    });

    // Generate insights
    const insights = [];
    
    if (completionRate >= 80) {
      insights.push({
        type: 'success',
        icon: Trophy,
        title: 'Excellent Week!',
        message: `${completionRate}% completion rate shows outstanding consistency.`,
        color: 'text-green-600'
      });
    } else if (completionRate >= 60) {
      insights.push({
        type: 'warning',
        icon: Target,
        title: 'Good Progress',
        message: `${completionRate}% completion - aim for 80%+ next week.`,
        color: 'text-yellow-600'
      });
    } else {
      insights.push({
        type: 'danger',
        icon: AlertTriangle,
        title: 'Needs Focus',
        message: `${completionRate}% completion needs improvement.`,
        color: 'text-red-600'
      });
    }

    if (studyDistribution.practice < 30) {
      insights.push({
        type: 'info',
        icon: BookOpen,
        title: 'More Practice Needed',
        message: 'Increase problem-solving practice for better exam prep.',
        color: 'text-blue-600'
      });
    }

    // Generate recommendations
    const recommendations = [];
    
    const bestPerformingSubject = subjectPerformance.reduce((max, subject) => 
      subject.completion > max.completion ? subject : max, subjectPerformance[0]);
    
    const weakestSubject = subjectPerformance.reduce((min, subject) => 
      subject.completion < min.completion ? subject : min, subjectPerformance[0]);

    if (bestPerformingSubject && bestPerformingSubject.completion > 80) {
      recommendations.push(`Maintain excellent ${bestPerformingSubject.subject} momentum (${bestPerformingSubject.completion}% completion).`);
    }

    if (weakestSubject && weakestSubject.completion < 60) {
      recommendations.push(`Focus more on ${weakestSubject.subject} - currently at ${weakestSubject.completion}% completion.`);
    }

    if (totalHours < 5) {
      recommendations.push('Aim for at least 5-7 hours of focused study per week.');
    }

    if (studyDistribution.practice > 70) {
      recommendations.push('Balance your practice with more theory and revision time.');
    } else if (studyDistribution.theory > 60) {
      recommendations.push('Add more problem-solving practice to your routine.');
    }

    return {
      completionRate,
      totalTasks,
      completedTasks,
      totalQuestions,
      totalHours,
      totalMinutes,
      subjectPerformance,
      studyDistribution,
      dailyProgress,
      insights,
      recommendations
    };
  }, [tasks, sessions]);

  const pieData = weeklyAnalytics.subjectPerformance.map((subject, index) => ({
    name: subject.subject,
    value: subject.time,
    completion: subject.completion,
    color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][index % 5]
  }));

  const studyDistributionData = [
    { name: 'Practice', value: weeklyAnalytics.studyDistribution.practice, color: '#8B5CF6' },
    { name: 'Theory', value: weeklyAnalytics.studyDistribution.theory, color: '#06B6D4' },
    { name: 'Revision', value: weeklyAnalytics.studyDistribution.revision, color: '#10B981' }
  ];

  const radarData = weeklyAnalytics.subjectPerformance.map(subject => ({
    subject: subject.subject.substring(0, 8),
    completion: subject.completion,
    time: Math.min(subject.time / 10, 100), // Normalize time data
    tasks: Math.min(subject.tasks * 10, 100) // Normalize task data
  }));

  if (!isFlipped) {
    return (
      <div className="flex justify-center mt-6">
        <Button
          onClick={onToggleFlip}
          variant="outline"
          className={`px-8 py-3 rounded-xl border-2 ${themeColors.border} hover:bg-primary/10 transition-all duration-300 hover:scale-105`}
        >
          <ChevronDown className="h-5 w-5 mr-2" />
          View Analytics Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={`${themeColors.card} rounded-2xl shadow-xl ${themeColors.border} border p-6 mt-6 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${themeColors.text} flex items-center`}>
            📊 Weekly Intelligence Dashboard
          </h2>
          <p className={`text-sm ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive insights for academic excellence
          </p>
        </div>
        <Button
          onClick={onToggleFlip}
          variant="ghost"
          size="sm"
          className="hover:scale-110 transition-all duration-200"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Weekly Progress</p>
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {weeklyAnalytics.completionRate}%
                </span>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={weeklyAnalytics.completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">Study Time</p>
                <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {weeklyAnalytics.totalHours}h {weeklyAnalytics.totalMinutes}m
                </span>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
              Avg: {Math.round((weeklyAnalytics.totalHours * 60 + weeklyAnalytics.totalMinutes) / 7)} min/day
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Questions Solved</p>
                <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {weeklyAnalytics.totalQuestions}
                </span>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-400 mt-2">
              Avg: {Math.round(weeklyAnalytics.totalQuestions / 7)} per day
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Tasks Completed</p>
                <span className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {weeklyAnalytics.completedTasks}/{weeklyAnalytics.totalTasks}
                </span>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-400 mt-2">
              Consistency matters
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      {weeklyAnalytics.insights.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-xl font-bold mb-4 ${themeColors.text}`}>🎯 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyAnalytics.insights.map((insight, index) => (
              <Card key={index} className="transform hover:scale-105 transition-all duration-300">
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
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Progress */}
        <Card className={themeColors.card}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Daily Progress Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyAnalytics.dailyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'midnight' || theme === 'obsidian' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="day" 
                  stroke={theme === 'midnight' || theme === 'obsidian' ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis stroke={theme === 'midnight' || theme === 'obsidian' ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'midnight' || theme === 'obsidian' ? '#1F2937' : 'white',
                    border: `1px solid ${theme === 'midnight' || theme === 'obsidian' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  name="Efficiency %"
                />
                <Line 
                  type="monotone" 
                  dataKey="questions" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 3 }}
                  name="Questions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Study Distribution */}
        <Card className={themeColors.card}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
              <Book className="h-5 w-5 text-green-500" />
              <span>Study Type Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={studyDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studyDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'midnight' || theme === 'obsidian' ? '#1F2937' : 'white',
                    border: `1px solid ${theme === 'midnight' || theme === 'obsidian' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 space-x-6">
              {studyDistributionData.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className={`text-sm ${themeColors.text}`}>
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {weeklyAnalytics.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>💡 Smart Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyAnalytics.recommendations.map((rec, index) => (
                <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg ${
                  theme === 'midnight' || theme === 'obsidian' ? 'bg-gray-800/50' : 'bg-blue-50'
                } animate-fade-in`} style={{ animationDelay: `${index * 200}ms` }}>
                  <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className={`text-sm ${themeColors.text}`}>{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
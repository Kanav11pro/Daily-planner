
import { useState, useMemo } from "react";
import { TrendingUp, Brain, Target, Clock, Zap, Award, BookOpen, Calendar, ChevronRight, Star, Trophy, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

interface PerformanceInsightsProps {
  tasks: Task[];
  onOpenWeeklyAnalytics: () => void;
}

export const PerformanceInsights = ({ tasks, onOpenWeeklyAnalytics }: PerformanceInsightsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const isDark = isDarkTheme(theme);

  // Calculate performance metrics
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const weeklyTasks = tasks.filter(task => last7Days.includes(task.scheduled_date));
    const todayTasks = tasks.filter(task => task.scheduled_date === today);
    const completedWeekly = weeklyTasks.filter(task => task.completed);
    const completedToday = todayTasks.filter(task => task.completed);
    
    const weeklyCompletion = weeklyTasks.length > 0 ? (completedWeekly.length / weeklyTasks.length) * 100 : 0;
    const todayCompletion = todayTasks.length > 0 ? (completedToday.length / todayTasks.length) * 100 : 0;
    
    const studyStreak = last7Days.reduce((streak, date) => {
      const dayTasks = tasks.filter(task => task.scheduled_date === date);
      const dayCompleted = dayTasks.filter(task => task.completed);
      return dayCompleted.length > 0 ? streak + 1 : 0;
    }, 0);

    const highPriorityTasks = weeklyTasks.filter(task => task.priority === 'high');
    const highPriorityCompleted = highPriorityTasks.filter(task => task.completed);
    const focusScore = highPriorityTasks.length > 0 ? (highPriorityCompleted.length / highPriorityTasks.length) * 100 : 100;

    const totalStudyTime = completedWeekly.reduce((sum, task) => sum + (task.duration || 0), 0);
    
    return {
      weeklyCompletion: Math.round(weeklyCompletion),
      todayCompletion: Math.round(todayCompletion),
      studyStreak,
      focusScore: Math.round(focusScore),
      totalStudyTime,
      tasksCompleted: completedWeekly.length,
      totalTasks: weeklyTasks.length
    };
  }, [tasks]);

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { level: 'Excellent', color: 'text-green-600', icon: Trophy };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', icon: Star };
    if (score >= 50) return { level: 'Average', color: 'text-yellow-600', icon: Target };
    return { level: 'Needs Focus', color: 'text-red-600', icon: AlertTriangle };
  };

  const performance = getPerformanceLevel(metrics.weeklyCompletion);

  return (
    <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span>JEE Performance Insights</span>
        </CardTitle>
        <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          AI-powered analysis of your study patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Overview */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/30' : 'bg-gradient-to-r from-indigo-50 to-purple-50'} border ${isDark ? 'border-gray-600' : 'border-indigo-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <performance.icon className={`h-5 w-5 ${performance.color}`} />
              <span className={`font-semibold ${themeColors.text}`}>Overall Performance</span>
            </div>
            <Badge variant={metrics.weeklyCompletion >= 70 ? "default" : "secondary"}>
              {performance.level}
            </Badge>
          </div>
          <Progress value={metrics.weeklyCompletion} className="h-2 mb-2" />
          <div className="flex justify-between text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {metrics.tasksCompleted}/{metrics.totalTasks} tasks completed this week
            </span>
            <span className={`font-bold ${themeColors.text}`}>
              {metrics.weeklyCompletion}%
            </span>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/30' : 'bg-gray-50'} text-center`}>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Study Streak</span>
            </div>
            <div className={`text-xl font-bold ${themeColors.text}`}>{metrics.studyStreak}</div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>days</div>
          </div>

          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/30' : 'bg-gray-50'} text-center`}>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Focus Score</span>
            </div>
            <div className={`text-xl font-bold ${themeColors.text}`}>{metrics.focusScore}</div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>%</div>
          </div>

          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/30' : 'bg-gray-50'} text-center`}>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-4 w-4 text-green-500" />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Study Time</span>
            </div>
            <div className={`text-lg font-bold ${themeColors.text}`}>
              {Math.floor(metrics.totalStudyTime / 60)}h {metrics.totalStudyTime % 60}m
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>this week</div>
          </div>

          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/30' : 'bg-gray-50'} text-center`}>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Today</span>
            </div>
            <div className={`text-xl font-bold ${themeColors.text}`}>{metrics.todayCompletion}</div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>% complete</div>
          </div>
        </div>

        {/* AI Insights */}
        <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDark ? 'border-blue-400/30' : 'border-blue-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-4 w-4 text-blue-500" />
            <span className={`text-sm font-medium ${themeColors.text}`}>AI Coach Insight</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            {metrics.weeklyCompletion >= 80 
              ? "Excellent consistency! Your JEE preparation is on track. Consider increasing difficulty level."
              : metrics.studyStreak >= 3
              ? "Good momentum! Focus on completing high-priority topics to maximize your JEE score potential."
              : "Your study pattern shows potential. Try setting smaller, achievable daily goals to build consistency."
            }
          </p>
        </div>

        {/* View Detailed Analytics Button */}
        <button
          onClick={onOpenWeeklyAnalytics}
          className={`w-full p-3 rounded-lg bg-gradient-to-r ${themeColors.primary} text-white hover:opacity-90 transition-all duration-300 hover:scale-105 flex items-center justify-between group`}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">View Detailed Analytics</span>
          </div>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </CardContent>
    </Card>
  );
};

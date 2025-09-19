import React from 'react';
import { TrendingUp, Target, Calendar, Trophy, Clock, BookOpen, Brain, Zap, Activity, BarChart3, PieChart, TrendingDown, AlertCircle, CheckCircle, Flame, Award, Users, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { usePractice } from "@/hooks/usePractice";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  scheduled_date: string;
  created_at: string;
  duration?: number;
  study_nature?: string;
}

interface ComprehensiveAnalyticsProps {
  tasks: Task[];
  selectedDate?: Date;
}

export const ComprehensiveAnalytics = ({ tasks, selectedDate = new Date() }: ComprehensiveAnalyticsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const { sessions } = usePractice();

  // Get current week data
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter data for current week
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.scheduled_date || task.created_at);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });

  const weekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });

  // Calculate comprehensive metrics
  const totalStudyHours = weekTasks.reduce((acc, task) => acc + (task.duration || 0), 0) / 60;
  const completedHours = weekTasks.filter(task => task.completed).reduce((acc, task) => acc + (task.duration || 0), 0) / 60;
  const totalQuestions = weekSessions.reduce((acc, session) => acc + (session.questions_solved || 0), 0);
  const avgAccuracy = weekSessions.length > 0 
    ? weekSessions.reduce((acc, session) => acc + (session.accuracy_percentage || 0), 0) / weekSessions.length 
    : 0;

  // Subject-wise analysis
  const subjectData = weekSessions.reduce((acc, session) => {
    if (!acc[session.subject]) {
      acc[session.subject] = { questions: 0, accuracy: 0, sessions: 0, time: 0 };
    }
    acc[session.subject].questions += session.questions_solved || 0;
    acc[session.subject].accuracy += session.accuracy_percentage || 0;
    acc[session.subject].sessions += 1;
    acc[session.subject].time += session.time_spent || 0;
    return acc;
  }, {} as Record<string, { questions: number; accuracy: number; sessions: number; time: number }>);

  // Calculate averages
  Object.keys(subjectData).forEach(subject => {
    subjectData[subject].accuracy = subjectData[subject].accuracy / subjectData[subject].sessions;
  });

  // Study pattern analysis
  const studyDistribution = weekTasks.reduce((acc, task) => {
    const nature = task.study_nature || 'Theory';
    acc[nature] = (acc[nature] || 0) + (task.duration || 0);
    return acc;
  }, {} as Record<string, number>);

  // Performance trends
  const dailyProgress = weekDays.map(day => {
    const dayTasks = weekTasks.filter(task => {
      const taskDate = new Date(task.scheduled_date || task.created_at);
      return taskDate.toDateString() === day.toDateString();
    });
    const daySessions = weekSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === day.toDateString();
    });
    
    return {
      date: day,
      tasksCompleted: dayTasks.filter(task => task.completed).length,
      totalTasks: dayTasks.length,
      questions: daySessions.reduce((acc, s) => acc + (s.questions_solved || 0), 0),
      studyTime: dayTasks.reduce((acc, task) => acc + (task.duration || 0), 0) / 60
    };
  });

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    for (let i = dailyProgress.length - 1; i >= 0; i--) {
      const day = dailyProgress[i];
      if (day.tasksCompleted > 0 || day.questions > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const bestSubject = Object.entries(subjectData).sort((a, b) => b[1].questions - a[1].questions)[0];
  const challengingSubject = Object.entries(subjectData).sort((a, b) => a[1].accuracy - b[1].accuracy)[0];

  // Get performance insights
  const getPerformanceInsight = () => {
    const totalCompletionRate = weekTasks.length > 0 ? (weekTasks.filter(task => task.completed).length / weekTasks.length) * 100 : 0;
    
    if (totalCompletionRate >= 90) return { message: "Outstanding performance! 🌟", color: "text-green-600", icon: Star };
    if (totalCompletionRate >= 75) return { message: "Great consistency! 💪", color: "text-blue-600", icon: Trophy };
    if (totalCompletionRate >= 60) return { message: "Good progress, keep it up! 👍", color: "text-yellow-600", icon: TrendingUp };
    if (totalCompletionRate >= 40) return { message: "Room for improvement 📈", color: "text-orange-600", icon: Activity };
    return { message: "Let's boost your study game! 🚀", color: "text-red-600", icon: AlertCircle };
  };

  const performanceInsight = getPerformanceInsight();
  const PerformanceIcon = performanceInsight.icon;

  return (
    <div className="space-y-6 p-6">
      {/* Weekly Overview Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold ${themeColors.text} mb-2`}>
          Weekly Intelligence Dashboard
        </h2>
        <p className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className={`${themeColors.card} border-l-4 border-l-blue-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Total Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedHours.toFixed(1)}h</div>
            <p className="text-xs text-gray-600 mt-1">
              of {totalStudyHours.toFixed(1)}h planned
            </p>
            <Progress 
              value={totalStudyHours > 0 ? (completedHours / totalStudyHours) * 100 : 0} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>

        <Card className={`${themeColors.card} border-l-4 border-l-green-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Questions Practiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
            <p className="text-xs text-gray-600 mt-1">
              {weekSessions.length} practice sessions
            </p>
          </CardContent>
        </Card>

        <Card className={`${themeColors.card} border-l-4 border-l-purple-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Average Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              avgAccuracy >= 80 ? 'text-green-600' : 
              avgAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {avgAccuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              across all subjects
            </p>
          </CardContent>
        </Card>

        <Card className={`${themeColors.card} border-l-4 border-l-orange-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
            <p className="text-xs text-gray-600 mt-1">
              {currentStreak === 1 ? 'day' : 'days'} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insight Banner */}
      <Card className={`${themeColors.card} bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-white/50 backdrop-blur-sm`}>
              <PerformanceIcon className={`h-5 w-5 ${performanceInsight.color}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${performanceInsight.color}`}>
                {performanceInsight.message}
              </h3>
              <p className={`text-sm ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your weekly performance analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={themeColors.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(subjectData).map(([subject, data]) => (
              <div key={subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject}</span>
                  <Badge variant="outline" className="text-xs">
                    {data.questions} questions
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Accuracy: {data.accuracy.toFixed(1)}%</span>
                  <span>{data.sessions} sessions</span>
                </div>
                <Progress value={data.accuracy} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={themeColors.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Study Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(studyDistribution).map(([type, minutes]) => {
              const hours = minutes / 60;
              const percentage = totalStudyHours > 0 ? (hours / totalStudyHours) * 100 : 0;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{type}</span>
                    <span className="text-sm text-gray-600">{hours.toFixed(1)}h</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <span className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress Visualization */}
      <Card className={themeColors.card}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Daily Progress Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dailyProgress.map((day, index) => {
              const completionRate = day.totalTasks > 0 ? (day.tasksCompleted / day.totalTasks) * 100 : 0;
              const isActive = day.tasksCompleted > 0 || day.questions > 0;
              
              return (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium mb-2">
                    {format(day.date, 'EEE')}
                  </div>
                  <div 
                    className={`h-20 rounded-lg flex flex-col items-center justify-center ${
                      isActive 
                        ? completionRate >= 80 
                          ? 'bg-green-200 text-green-800' 
                          : completionRate >= 50 
                            ? 'bg-yellow-200 text-yellow-800' 
                            : 'bg-orange-200 text-orange-800'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{day.questions}</div>
                    <div className="text-xs">Q</div>
                    <div className="text-xs">{day.studyTime.toFixed(1)}h</div>
                  </div>
                  <div className="text-xs mt-1">
                    {format(day.date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`${themeColors.card} border-l-4 border-l-green-500`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bestSubject && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <strong>{bestSubject[0]}</strong> is your strongest subject with {bestSubject[1].questions} questions practiced
                </span>
              </div>
            )}
            {currentStreak > 0 && (
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-600" />
                <span className="text-sm">
                  Great consistency with {currentStreak} day{currentStreak !== 1 ? 's' : ''} streak!
                </span>
              </div>
            )}
            {avgAccuracy >= 70 && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  Excellent accuracy rate of {avgAccuracy.toFixed(1)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`${themeColors.card} border-l-4 border-l-blue-500`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
              Growth Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {challengingSubject && challengingSubject[1].accuracy < 70 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">
                  Focus more on <strong>{challengingSubject[0]}</strong> - accuracy at {challengingSubject[1].accuracy.toFixed(1)}%
                </span>
              </div>
            )}
            {totalStudyHours > 0 && (completedHours / totalStudyHours) < 0.8 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  Try to complete more of your planned study time ({((completedHours / totalStudyHours) * 100).toFixed(1)}% completed)
                </span>
              </div>
            )}
            {Object.keys(studyDistribution).length < 3 && (
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm">
                  Balance your study with more variety in Theory/Practice/Revision
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Week Recommendations */}
      <Card className={`${themeColors.card} bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Next Week Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-indigo-600">Priority Goals</h4>
              <ul className="space-y-1 text-sm">
                <li>• Target {Math.ceil(totalQuestions * 1.1)} questions next week</li>
                <li>• Maintain accuracy above {Math.max(avgAccuracy, 75).toFixed(0)}%</li>
                <li>• Focus on {challengingSubject ? challengingSubject[0] : 'weaker areas'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">Study Strategy</h4>
              <ul className="space-y-1 text-sm">
                <li>• Allocate {Math.ceil(totalStudyHours * 1.05)}h study time</li>
                <li>• Balance Theory, Practice, and Revision</li>
                <li>• Maintain your {currentStreak}-day streak</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
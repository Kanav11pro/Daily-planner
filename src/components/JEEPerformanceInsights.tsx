
import { TrendingUp, Target, Brain, BookOpen, Clock, Award, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

interface JEEPerformanceInsightsProps {
  tasks: Task[];
}

export const JEEPerformanceInsights = ({ tasks }: JEEPerformanceInsightsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  // JEE-specific subjects mapping
  const jeeSubjects = {
    'Physics': { icon: '⚛️', color: 'from-blue-500 to-blue-600', weight: 0.33 },
    'Chemistry': { icon: '🧪', color: 'from-green-500 to-green-600', weight: 0.33 },
    'Mathematics': { icon: '📐', color: 'from-purple-500 to-purple-600', weight: 0.34 },
    'Maths': { icon: '📐', color: 'from-purple-500 to-purple-600', weight: 0.34 }
  };

  // Calculate JEE-specific metrics
  const today = new Date().toISOString().split('T')[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const weeklyTasks = tasks.filter(task => last7Days.includes(task.scheduled_date));
  const completedWeekly = weeklyTasks.filter(task => task.completed);
  const weeklyCompletionRate = weeklyTasks.length > 0 ? (completedWeekly.length / weeklyTasks.length) * 100 : 0;

  // Subject-wise analysis for JEE
  const subjectAnalysis = Object.keys(jeeSubjects).reduce((acc, subject) => {
    const subjectTasks = weeklyTasks.filter(task => 
      task.subject.toLowerCase().includes(subject.toLowerCase())
    );
    const completed = subjectTasks.filter(task => task.completed).length;
    const total = subjectTasks.length;
    
    acc[subject] = {
      total,
      completed,
      completion: total > 0 ? Math.round((completed / total) * 100) : 0,
      studyTime: subjectTasks.reduce((sum, task) => sum + (task.duration || 0), 0)
    };
    return acc;
  }, {} as Record<string, { total: number; completed: number; completion: number; studyTime: number }>);

  // JEE readiness score calculation
  const calculateJEEReadiness = () => {
    const subjectScores = Object.entries(subjectAnalysis).map(([subject, data]) => {
      const weight = jeeSubjects[subject as keyof typeof jeeSubjects]?.weight || 0.33;
      return data.completion * weight;
    });
    return Math.round(subjectScores.reduce((sum, score) => sum + score, 0));
  };

  const jeeReadinessScore = calculateJEEReadiness();

  // Performance insights based on JEE pattern
  const getPerformanceLevel = () => {
    if (jeeReadinessScore >= 85) return { level: 'Excellent', color: 'text-green-600', icon: Award };
    if (jeeReadinessScore >= 70) return { level: 'Good', color: 'text-blue-600', icon: Target };
    if (jeeReadinessScore >= 50) return { level: 'Average', color: 'text-yellow-600', icon: Clock };
    return { level: 'Needs Focus', color: 'text-red-600', icon: AlertTriangle };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  // Study consistency metric
  const studyStreak = last7Days.filter(date => {
    return tasks.some(task => task.scheduled_date === date && task.completed);
  }).length;

  return (
    <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span>JEE Performance Insights</span>
          <Badge variant={jeeReadinessScore >= 70 ? "default" : "secondary"} className="ml-auto">
            {jeeReadinessScore}% Ready
          </Badge>
        </CardTitle>
        <CardDescription className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
          Your preparation status for JEE 2027
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall JEE Readiness */}
        <div className={`p-4 rounded-lg border transition-all duration-200 ${
          theme === 'midnight' || theme === 'obsidian' 
            ? 'bg-slate-700/30 border-gray-600' 
            : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <PerformanceIcon className={`h-5 w-5 ${performance.color}`} />
              <span className={`font-semibold ${themeColors.text}`}>JEE Readiness</span>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${performance.color}`}>{performance.level}</div>
              <div className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
                {studyStreak}/7 days active
              </div>
            </div>
          </div>
          <Progress value={jeeReadinessScore} className="h-2 mb-2" />
          <div className="flex justify-between text-xs">
            <span className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
              Weekly Progress: {Math.round(weeklyCompletionRate)}%
            </span>
            <span className={`${performance.color}`}>{jeeReadinessScore}/100</span>
          </div>
        </div>

        {/* Subject-wise JEE Performance */}
        <div className="space-y-3">
          <h4 className={`text-sm font-medium ${themeColors.text} flex items-center space-x-1`}>
            <BookOpen className="h-4 w-4" />
            <span>Subject Mastery (JEE Pattern)</span>
          </h4>
          {Object.entries(subjectAnalysis).map(([subject, data]) => {
            const subjectInfo = jeeSubjects[subject as keyof typeof jeeSubjects];
            if (!subjectInfo || data.total === 0) return null;

            return (
              <div key={subject} className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                theme === 'midnight' || theme === 'obsidian' 
                  ? 'bg-slate-700/30 border-gray-600 hover:bg-slate-700/50' 
                  : 'bg-gradient-to-r from-gray-50 to-white border-gray-200 hover:from-gray-100 hover:to-gray-50'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{subjectInfo.icon}</span>
                    <span className={`font-medium text-sm ${themeColors.text}`}>{subject}</span>
                    <Badge 
                      variant={data.completion >= 70 ? "default" : data.completion >= 50 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {data.completion >= 70 ? 'Strong' : data.completion >= 50 ? 'Good' : 'Weak'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${themeColors.text}`}>
                      {data.completed}/{data.total}
                    </div>
                    <div className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {Math.floor(data.studyTime / 60)}h {data.studyTime % 60}m
                    </div>
                  </div>
                </div>
                <Progress value={data.completion} className="h-1.5" />
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {data.completion}% Complete
                  </span>
                  {data.completion >= 80 && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Tips */}
        <div className={`p-3 rounded-lg ${
          theme === 'midnight' || theme === 'obsidian' 
            ? 'bg-blue-900/20 border border-blue-700/50' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start space-x-2">
            <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${themeColors.text}`}>📚 JEE Focus Tip</p>
              <p className={`text-xs mt-1 ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
                {jeeReadinessScore < 50 
                  ? "Focus on weak subjects first. Balance practice across Physics, Chemistry, and Mathematics."
                  : jeeReadinessScore < 80 
                  ? "Great progress! Focus on time management and solving previous years' papers."
                  : "Excellent! Maintain consistency and focus on advanced problem-solving techniques."
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

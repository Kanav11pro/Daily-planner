
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { usePractice } from '@/hooks/usePractice';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  BookOpen, 
  Calendar,
  Brain,
  Zap,
  Star,
  Activity,
  Trophy,
  Flame
} from 'lucide-react';

export const PracticeAnalyticsDashboard = () => {
  const { sessions, analytics, targets } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const insightData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyData = last30Days.map(date => {
      const daySessions = sessions.filter(s => s.date === date);
      const questions = daySessions.reduce((sum, s) => sum + s.questions_solved, 0);
      const time = daySessions.reduce((sum, s) => sum + s.time_spent, 0);
      
      return {
        date,
        day: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
        questions,
        time,
        sessions: daySessions.length,
      };
    });

    const subjectPerformance = ['Physics', 'Chemistry', 'Mathematics'].map(subject => {
      const subjectSessions = sessions.filter(s => s.subject === subject);
      const avgAccuracy = subjectSessions
        .filter(s => s.accuracy_percentage != null)
        .reduce((sum, s, _, arr) => sum + (s.accuracy_percentage! / arr.length), 0);
      
      return {
        subject,
        avgAccuracy: Math.round(avgAccuracy) || 0,
        totalQuestions: subjectSessions.reduce((sum, s) => sum + s.questions_solved, 0),
        totalTime: subjectSessions.reduce((sum, s) => sum + s.time_spent, 0),
        sessions: subjectSessions.length,
      };
    });

    const streakData = calculateStreak(sessions);
    const timeDistribution = calculateTimeDistribution(sessions);

    return {
      dailyData: dailyData.slice(-14), // Last 14 days
      subjectPerformance,
      streakData,
      timeDistribution,
    };
  }, [sessions]);

  const calculateStreak = (sessions: any[]) => {
    const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Calculate current streak
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      if (i === 0 && (date === today || date === yesterdayStr)) {
        currentStreak = 1;
        tempStreak = 1;
      } else if (i > 0) {
        const prevDate = new Date(dates[i-1]);
        const currentDate = new Date(date);
        const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          if (i === 1) currentStreak++;
          tempStreak++;
        } else {
          if (tempStreak > maxStreak) maxStreak = tempStreak;
          tempStreak = 1;
        }
      }
    }

    return { currentStreak, maxStreak: Math.max(maxStreak, tempStreak) };
  };

  const calculateTimeDistribution = (sessions: any[]) => {
    const timeSlots = {
      'Morning (6-12)': 0,
      'Afternoon (12-18)': 0,
      'Evening (18-24)': 0,
      'Night (0-6)': 0,
    };

    sessions.forEach(session => {
      const hour = new Date(session.created_at).getHours();
      if (hour >= 6 && hour < 12) timeSlots['Morning (6-12)']++;
      else if (hour >= 12 && hour < 18) timeSlots['Afternoon (12-18)']++;
      else if (hour >= 18 && hour < 24) timeSlots['Evening (18-24)']++;
      else timeSlots['Night (0-6)']++;
    });

    return Object.entries(timeSlots).map(([slot, count]) => ({ slot, count }));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`${themeColors.card} ${themeColors.glow} border-l-4 border-l-blue-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{analytics.today.questionsTotal}</p>
                <p className="text-sm text-muted-foreground">Today's Questions</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${themeColors.card} ${themeColors.glow} border-l-4 border-l-green-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{analytics.today.timeTotal}m</p>
                <p className="text-sm text-muted-foreground">Today's Time</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${themeColors.card} ${themeColors.glow} border-l-4 border-l-purple-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{insightData.streakData.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
              <Flame className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${themeColors.card} ${themeColors.glow} border-l-4 border-l-orange-500`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{analytics.today.sessionsCount}</p>
                <p className="text-sm text-muted-foreground">Today's Sessions</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Progress Chart */}
        <Card className={`${themeColors.card} ${themeColors.glow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Progress (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={insightData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="questions" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="time" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className={`${themeColors.card} ${themeColors.glow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightData.subjectPerformance.map((subject, index) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.subject}</span>
                    <Badge variant="secondary">{subject.avgAccuracy}% avg accuracy</Badge>
                  </div>
                  <Progress value={subject.avgAccuracy} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{subject.totalQuestions} questions</span>
                    <span>{Math.round(subject.totalTime / 60)}h {subject.totalTime % 60}m</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Time Distribution */}
        <Card className={`${themeColors.card} ${themeColors.glow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Time Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insightData.timeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({slot, percent}) => `${slot} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {insightData.timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card className={`${themeColors.card} ${themeColors.glow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.week.questionsTotal}</div>
                  <div className="text-sm text-muted-foreground">Questions This Week</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Math.round(analytics.week.timeTotal / 60)}h {analytics.week.timeTotal % 60}m</div>
                  <div className="text-sm text-muted-foreground">Time This Week</div>
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{insightData.streakData.maxStreak}</div>
                <div className="text-sm text-muted-foreground">Longest Streak (Days)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Tips */}
      <Card className={`${themeColors.card} ${themeColors.glow} border-l-4 border-l-indigo-500`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Smart Insights & Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generateInsights(analytics, insightData).map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg ${insight.type === 'positive' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${insight.type === 'positive' ? 'bg-green-100 dark:bg-green-800' : insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-800' : 'bg-blue-100 dark:bg-blue-800'}`}>
                    {insight.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const generateInsights = (analytics: any, insightData: any) => {
  const insights = [];

  // Streak insights
  if (insightData.streakData.currentStreak >= 7) {
    insights.push({
      type: 'positive',
      icon: <Trophy className="h-4 w-4 text-green-600" />,
      title: 'Amazing Consistency!',
      description: `You're on a ${insightData.streakData.currentStreak}-day streak. Keep it up!`
    });
  } else if (insightData.streakData.currentStreak === 0) {
    insights.push({
      type: 'warning',
      icon: <Flame className="h-4 w-4 text-yellow-600" />,
      title: 'Time to Get Back',
      description: 'Start a new practice session today to begin your streak!'
    });
  }

  // Daily performance
  if (analytics.today.questionsTotal > 20) {
    insights.push({
      type: 'positive',
      icon: <Star className="h-4 w-4 text-green-600" />,
      title: 'Productive Day!',
      description: `You've solved ${analytics.today.questionsTotal} questions today. Excellent work!`
    });
  }

  // Subject balance
  const subjectQuestions = analytics.subjects.map(s => s.questions);
  const maxQuestions = Math.max(...subjectQuestions);
  const minQuestions = Math.min(...subjectQuestions);
  
  if (maxQuestions - minQuestions > 50) {
    const weakSubject = analytics.subjects.find(s => s.questions === minQuestions);
    insights.push({
      type: 'tip',
      icon: <BookOpen className="h-4 w-4 text-blue-600" />,
      title: 'Balance Your Studies',
      description: `Consider focusing more on ${weakSubject?.name} to maintain balance.`
    });
  }

  // Time insights
  if (analytics.today.timeTotal > 120) {
    insights.push({
      type: 'positive',
      icon: <Clock className="h-4 w-4 text-green-600" />,
      title: 'Great Focus Time!',
      description: `You've studied for ${Math.round(analytics.today.timeTotal / 60)} hours today.`
    });
  }

  // Weekly progress
  if (analytics.week.questionsTotal > 100) {
    insights.push({
      type: 'positive',
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      title: 'Weekly Champion!',
      description: `${analytics.week.questionsTotal} questions this week. You're crushing it!`
    });
  }

  return insights.slice(0, 6); // Limit to 6 insights
};

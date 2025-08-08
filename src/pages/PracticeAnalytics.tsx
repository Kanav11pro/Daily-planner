import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CalendarDays, Clock, Target, TrendingUp, BookOpen, Award, Zap, Brain } from 'lucide-react';
import { usePractice } from '@/hooks/usePractice';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSkeleton } from '@/components/practice/LoadingSkeleton';
import { EnhancedTargetTracker } from '@/components/practice/EnhancedTargetTracker';
import { AddPracticeSessionModal } from '@/components/practice/AddPracticeSessionModal';
import { PracticeCelebration } from '@/components/practice/PracticeCelebration';
import { useTheme } from '@/contexts/ThemeContext';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const PracticeAnalytics = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const {
    sessions,
    chapters,
    targets,
    loading,
    analytics,
    addSession,
    addTarget,
  } = usePractice();

  const [celebrationTrigger, setCelebrationTrigger] = useState<any>(null);

  const handleAddSession = useCallback(async (sessionData: any) => {
    try {
      await addSession(sessionData);
      // Trigger celebration
      setCelebrationTrigger({
        type: 'session_added',
        value: 1,
        context: sessionData
      });
    } catch (error) {
      console.error('Error adding session:', error);
    }
  }, [addSession]);

  const handleAddTarget = useCallback(async (targetData: any) => {
    try {
      await addTarget(targetData);
    } catch (error) {
      console.error('Error adding target:', error);
    }
  }, [addTarget]);

  const recentSessions = useMemo(() => {
    return sessions
      .slice(0, 10)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions]);

  const weeklyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const daySessions = sessions.filter(s => s.date === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        questions: daySessions.reduce((sum, s) => sum + s.questions_solved, 0),
        time: daySessions.reduce((sum, s) => sum + s.time_spent, 0),
      };
    });
  }, [sessions]);

  const subjectData = useMemo(() => {
    return analytics.subjects.map((subject, index) => ({
      ...subject,
      color: COLORS[index % COLORS.length]
    }));
  }, [analytics.subjects]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Please log in to view your practice analytics.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Practice Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and stay motivated
            </p>
          </div>
          <AddPracticeSessionModal 
            onAddSession={handleAddSession} 
            chapters={chapters}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Questions</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analytics.today.questionsTotal}
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.today.sessionsCount} sessions today
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Time</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(analytics.today.timeTotal / 60 * 10) / 10}h
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.today.timeTotal} minutes total
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Questions</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analytics.week.questionsTotal}
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.week.sessionsCount} sessions this week
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {chapters.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Chapters practiced
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="questions" fill="hsl(var(--chart-1))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Subject Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="questions"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Target Tracker */}
        <EnhancedTargetTracker 
          targets={targets} 
          onAddTarget={handleAddTarget}
          sessions={sessions}
        />

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No practice sessions yet</p>
                <p className="text-sm text-muted-foreground">Start adding sessions to see your progress!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{session.subject}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{session.chapter}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()} • {session.source}
                        {session.source_details && ` - ${session.source_details}`}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">
                        {session.questions_solved} questions
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.time_spent} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Celebration */}
        {celebrationTrigger && (
          <PracticeCelebration
            trigger={celebrationTrigger}
            onComplete={() => setCelebrationTrigger(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PracticeAnalytics;

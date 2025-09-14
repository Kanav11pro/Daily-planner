import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  BarChart3,
  Calendar,
  Award
} from 'lucide-react';
import { usePractice } from '@/hooks/usePractice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const IntegratedPracticeAnalytics: React.FC = () => {
  const { sessions, analytics } = usePractice();

  // Get recent sessions for quick overview
  const recentSessions = sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Prepare chart data for last 7 days - simplified version
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      questions: Math.floor(analytics.week.questionsTotal / 7), // Simplified distribution
      time: Math.floor(analytics.week.timeTotal / 7 / 60), // Convert to hours
    };
  }).reverse();

  // Calculate weekly stats
  const weeklyStats = {
    totalQuestions: analytics.week.questionsTotal,
    totalTime: Math.round(analytics.week.timeTotal / 60),
    totalSessions: analytics.week.sessionsCount,
    subjectsCount: analytics.subjects.length
  };

  if (sessions.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Tracking Your Practice</h3>
            <p className="text-sm text-muted-foreground">
              Complete practice tasks to see your analytics and progress insights here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Questions</span>
            </div>
            <div className="text-2xl font-bold">{weeklyStats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Hours</span>
            </div>
            <div className="text-2xl font-bold">{weeklyStats.totalTime}h</div>
            <p className="text-xs text-muted-foreground">Practice time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Sessions</span>
            </div>
            <div className="text-2xl font-bold">{weeklyStats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Subjects</span>
            </div>
            <div className="text-2xl font-bold">{weeklyStats.subjectsCount}</div>
            <p className="text-xs text-muted-foreground">Practiced</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="questions" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Questions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Sessions & Subject Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{session.subject}</div>
                  <div className="text-xs text-muted-foreground">{session.chapter}</div>
                  <div className="text-xs text-muted-foreground">{session.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{session.questions_solved} Qs</div>
                  <div className="text-xs text-muted-foreground">{Math.round(session.time_spent / 60)}h</div>
                </div>
              </div>
            ))}
            {recentSessions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent sessions found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Subject Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.subjects
              .sort((a, b) => b.questions - a.questions)
              .slice(0, 5)
              .map((subject) => (
                <div key={subject.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {subject.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {subject.questions} questions
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(subject.time / 60)}h
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {weeklyStats.totalQuestions > 50 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">🎯 Great Progress!</h4>
                <p className="text-sm text-green-700">
                  You've solved {weeklyStats.totalQuestions} questions this week. Keep up the momentum!
                </p>
              </div>
              
              {weeklyStats.subjectsCount >= 2 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">📚 Balanced Study</h4>
                  <p className="text-sm text-blue-700">
                    You're practicing {weeklyStats.subjectsCount} subjects. Great balance!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
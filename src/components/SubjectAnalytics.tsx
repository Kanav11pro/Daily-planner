import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { usePractice } from '@/hooks/usePractice';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';

interface SubjectAnalyticsProps {
  detailed?: boolean;
}

export const SubjectAnalytics = ({ detailed = false }: SubjectAnalyticsProps) => {
  const { sessions, analytics } = usePractice();

  const subjectData = useMemo(() => {
    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    
    return subjects.map(subject => {
      const subjectSessions = sessions.filter(s => s.subject === subject);
      const totalQuestions = subjectSessions.reduce((sum, s) => sum + s.questions_solved, 0);
      const totalTime = subjectSessions.reduce((sum, s) => sum + s.time_spent, 0);
      const avgAccuracy = subjectSessions
        .filter(s => s.accuracy_percentage != null)
        .reduce((sum, s, _, arr) => sum + (s.accuracy_percentage! / arr.length), 0);

      // Last 7 days data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayQuestions = subjectSessions
          .filter(s => s.date === dateStr)
          .reduce((sum, s) => sum + s.questions_solved, 0);
        
        return {
          date: dateStr,
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          questions: dayQuestions,
        };
      }).reverse();

      return {
        subject,
        totalQuestions,
        totalTime,
        avgAccuracy: Math.round(avgAccuracy) || 0,
        sessionsCount: subjectSessions.length,
        last7Days,
        avgQuestionsPerSession: subjectSessions.length > 0 ? Math.round(totalQuestions / subjectSessions.length) : 0,
        avgTimePerQuestion: totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0,
      };
    });
  }, [sessions]);

  const chartData = subjectData.map(data => ({
    subject: data.subject,
    questions: data.totalQuestions,
    time: Math.round(data.totalTime / 60), // Convert to hours
    accuracy: data.avgAccuracy,
    sessions: data.sessionsCount,
  }));

  const pieData = subjectData.map(data => ({
    name: data.subject,
    value: data.totalQuestions,
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  if (!detailed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Subject Overview
          </CardTitle>
          <CardDescription>Your practice distribution across subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectData.map((data, index) => (
              <div key={data.subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{data.subject}</span>
                  <Badge variant="secondary">{data.totalQuestions} questions</Badge>
                </div>
                <Progress 
                  value={(data.totalQuestions / Math.max(...subjectData.map(s => s.totalQuestions))) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(data.totalTime / 60)}h {data.totalTime % 60}m</span>
                  <span>{data.avgAccuracy}% accuracy</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjectData.map((data, index) => (
          <Card key={data.subject}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{data.subject}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{data.totalQuestions}</span>
                <span className="text-sm text-muted-foreground">questions</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{Math.round(data.totalTime / 60)}h {data.totalTime % 60}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  <span>{data.avgAccuracy}% avg</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Avg: {data.avgQuestionsPerSession} Q/session</div>
                <div>Time/Q: {data.avgTimePerQuestion} min</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Questions vs Time by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis yAxisId="questions" orientation="left" />
                <YAxis yAxisId="time" orientation="right" />
                <Tooltip />
                <Bar yAxisId="questions" dataKey="questions" fill="#8884d8" name="Questions" />
                <Bar yAxisId="time" dataKey="time" fill="#82ca9d" name="Time (hours)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Question Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subjectData.map((data, index) => (
          <Card key={data.subject}>
            <CardHeader>
              <CardTitle className="text-base">{data.subject} - Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.last7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="questions" 
                    stroke={COLORS[index]} 
                    strokeWidth={2}
                    dot={{ fill: COLORS[index] }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock, Target, Award, Book, Brain, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { usePractice } from "@/hooks/usePractice";
interface IntegratedAnalyticsProps {
  tasks: any[];
  selectedDate: Date;
}
export const IntegratedAnalytics = ({
  tasks,
  selectedDate
}: IntegratedAnalyticsProps) => {
  const {
    theme
  } = useTheme();
  const themeColors = getThemeColors(theme);
  const {
    sessions,
    analytics
  } = usePractice();

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const today = new Date().toDateString();
    const selectedDateString = selectedDate.toDateString();
    const todayTasks = tasks.filter(task => new Date(task.scheduled_date).toDateString() === today);
    const selectedDateTasks = tasks.filter(task => new Date(task.scheduled_date).toDateString() === selectedDateString);
    const completedToday = todayTasks.filter(task => task.completed).length;
    const totalToday = todayTasks.length;
    const completionRate = totalToday > 0 ? Math.round(completedToday / totalToday * 100) : 0;

    // Weekly practice data
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => task.scheduled_date === dateString);
      const daySessions = sessions.filter(session => session.date === dateString);
      weeklyData.push({
        day: date.toLocaleDateString('en-US', {
          weekday: 'short'
        }),
        tasks: dayTasks.filter(task => task.completed).length,
        questions: daySessions.reduce((sum, session) => sum + session.questions_solved, 0),
        time: daySessions.reduce((sum, session) => sum + session.time_spent, 0)
      });
    }
    return {
      completionRate,
      totalToday,
      completedToday,
      weeklyData,
      totalQuestions: analytics?.today?.questionsTotal || 0,
      totalTime: analytics?.today?.timeTotal || 0,
      streak: 0
    };
  }, [tasks, selectedDate, sessions, analytics]);
  const pieData = useMemo(() => {
    const subjectCounts = tasks.reduce((acc, task) => {
      acc[task.subject] = (acc[task.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
    return Object.entries(subjectCounts).map(([subject, count], index) => ({
      name: subject,
      value: count,
      color: colors[index % colors.length]
    }));
  }, [tasks]);
  return <div className="space-y-6">
      {/* Quick Stats */}
      

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card className={themeColors.card}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analyticsData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'midnight' || theme === 'obsidian' ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="day" stroke={theme === 'midnight' || theme === 'obsidian' ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                <YAxis stroke={theme === 'midnight' || theme === 'obsidian' ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                <Tooltip contentStyle={{
                backgroundColor: theme === 'midnight' || theme === 'obsidian' ? '#1F2937' : 'white',
                border: `1px solid ${theme === 'midnight' || theme === 'obsidian' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }} />
                <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Tasks Completed" />
                <Area type="monotone" dataKey="questions" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} name="Questions Solved" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card className={themeColors.card}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
              <Book className="h-5 w-5 text-green-500" />
              <span>Subject Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{
                backgroundColor: theme === 'midnight' || theme === 'obsidian' ? '#1F2937' : 'white',
                border: `1px solid ${theme === 'midnight' || theme === 'obsidian' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 space-x-4">
              {pieData.map((entry, index) => <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: entry.color
              }} />
                  <span className={`text-sm ${themeColors.text}`}>{entry.name}</span>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
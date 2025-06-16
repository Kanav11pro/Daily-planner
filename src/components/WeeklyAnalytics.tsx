
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Clock, Target, Award, Book, Brain, Flame, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const weeklyTasks = currentWeekData.tasks;

  const dailyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekData.start);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayTasks = weeklyTasks.filter(task => 
      task.scheduled_date === dateString
    );
    const completed = dayTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      studyTime: dayTasks.reduce((sum, task) => sum + (task.duration || 0), 0)
    };
  });

  const subjectDistribution = weeklyTasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { completed: 0, total: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) acc[task.subject].completed++;
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

  const pieData = Object.entries(subjectDistribution).map(([subject, data], index) => ({
    name: subject,
    value: data.completed,
    total: data.total,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'][index % 5]
  }));

  const totalCompleted = weeklyTasks.filter(task => task.completed).length;
  const totalTasks = weeklyTasks.length;
  const weeklyCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const totalStudyTime = weeklyTasks.reduce((sum, task) => sum + (task.duration || 0), 0);

  const formatWeekRange = () => {
    const start = currentWeekData.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = currentWeekData.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${themeColors.card} rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Study Analytics
              </h2>
              <p className="text-gray-600">Deep insights into your learning journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek + 1)}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Week of {formatWeekRange()}</h3>
                <p className="text-sm text-gray-600">
                  {selectedWeek === 0 ? 'Current Week' : `${selectedWeek} week${selectedWeek > 1 ? 's' : ''} ago`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Target className="h-5 w-5" />
                  <span>Completion Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{weeklyCompletionRate}%</div>
                <p className="text-sm text-gray-600">{totalCompleted}/{totalTasks} tasks</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Clock className="h-5 w-5" />
                  <span>Study Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{totalStudyTime}</div>
                <p className="text-sm text-gray-600">minutes focused</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Book className="h-5 w-5" />
                  <span>Subjects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">{Object.keys(subjectDistribution).length}</div>
                <p className="text-sm text-gray-600">subjects studied</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <Flame className="h-5 w-5" />
                  <span>Peak Day</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-700">
                  {dailyProgress.reduce((max, day) => day.percentage > max.percentage ? day : max, dailyProgress[0])?.day || 'N/A'}
                </div>
                <p className="text-sm text-gray-600">best performance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Daily Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#8884d8" name="Completed" />
                    <Bar dataKey="total" fill="#82ca9d" name="Total Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span>Subject Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Study Time Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dailyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="studyTime" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

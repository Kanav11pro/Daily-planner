import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Calendar, TrendingUp, Clock, Target, Award, Book, Brain, Flame, X, ChevronLeft, ChevronRight 
} from "lucide-react";
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-neutral-900 dark:via-indigo-950 dark:to-neutral-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto border-2 border-indigo-100 dark:border-neutral-800 animate-fade-in">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-100 dark:border-neutral-800 bg-white/70 dark:bg-indigo-950/70 rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <Brain className="h-9 w-9 text-purple-600 dark:text-purple-300" />
            <div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
                Study Analytics
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Insights into your learning journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple-500 transition-colors p-2 hover:scale-110 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Week Picker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek + 1)}
                className="flex items-center space-x-2 bg-white dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-800 shadow hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="font-semibold">Previous</span>
              </Button>
              <div className="text-center">
                <h3 className="font-bold text-lg tracking-tight">{formatWeekRange()}</h3>
                <p className="text-xs text-gray-500">
                  {selectedWeek === 0 ? 'Current Week' : `${selectedWeek} week${selectedWeek > 1 ? 's' : ''} ago`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
                className="flex items-center space-x-2 bg-white dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-800 shadow hover:scale-105"
              >
                <span className="font-semibold">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="bg-gradient-to-br from-blue-100/80 via-indigo-100/90 to-white border-blue-200 dark:from-indigo-900/70 dark:to-neutral-950 dark:border-neutral-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 text-base font-bold">
                  <Target className="h-5 w-5" />
                  <span>Completion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bolder text-blue-700 dark:text-blue-300">{weeklyCompletionRate}%</div>
                <p className="text-xs text-gray-500 font-medium">{totalCompleted}/{totalTasks} tasks done</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100/80 via-emerald-50/80 to-white border-green-200 dark:from-emerald-900/60 dark:to-neutral-950 dark:border-neutral-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-300 text-base font-bold">
                  <Clock className="h-5 w-5" />
                  <span>Study Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bolder text-green-700 dark:text-green-300">{totalStudyTime}m</div>
                <p className="text-xs text-gray-500 font-medium">minutes focused</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100/80 via-violet-50/80 to-white border-purple-200 dark:from-violet-900/60 dark:to-neutral-950 dark:border-neutral-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300 text-base font-bold">
                  <Book className="h-5 w-5" />
                  <span>Subjects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bolder text-purple-700 dark:text-purple-300">{Object.keys(subjectDistribution).length}</div>
                <p className="text-xs text-gray-500 font-medium">subjects studied</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-100/80 via-red-50/90 to-white border-orange-200 dark:from-orange-900/60 dark:to-neutral-950 dark:border-neutral-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-300 text-base font-bold">
                  <Flame className="h-5 w-5" />
                  <span>Peak Day</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bolder text-orange-700 dark:text-orange-300">
                  {dailyProgress.reduce((max, day) => day.percentage > max.percentage ? day : max, dailyProgress[0])?.day || 'N/A'}
                </div>
                <p className="text-xs text-gray-500 font-medium">best performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Progress Chart */}
            <Card className="bg-white/70 dark:bg-indigo-950/40 shadow rounded-2xl border border-indigo-100 dark:border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg text-indigo-700 dark:text-indigo-200 font-bold">
                  <TrendingUp className="h-5 w-5" />
                  <span>Daily Progress</span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Track the number of tasks completed and total assigned per day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dailyProgress} barGap={3}>
                    <CartesianGrid strokeDasharray="3 5" vertical={false} className="opacity-30"/>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#6366f1" name="Completed" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="total" fill="#d1fae5" name="Total" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject Distribution Chart */}
            <Card className="bg-white/70 dark:bg-indigo-950/40 shadow rounded-2xl border border-indigo-100 dark:border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg text-purple-700 dark:text-purple-200 font-bold">
                  <Award className="h-5 w-5" />
                  <span>Subject Distribution</span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  See which subjects you completed most in the week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={75}
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

          {/* Study Time Trend Chart */}
          <div>
            <Card className="bg-white/70 dark:bg-indigo-950/40 shadow rounded-2xl border border-indigo-100 dark:border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg text-green-700 dark:text-green-200 font-bold">
                  <Calendar className="h-5 w-5" />
                  <span>Study Time Trend</span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Your study time (minutes) for each day this week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={dailyProgress}>
                    <CartesianGrid strokeDasharray="3 5" vertical={false} className="opacity-25"/>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="studyTime" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

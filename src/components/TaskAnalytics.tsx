
import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: number;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  createdAt: string;
  duration?: string;
}

interface TaskAnalyticsProps {
  tasks: Task[];
}

export const TaskAnalytics = ({ tasks }: TaskAnalyticsProps) => {
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(task => 
    new Date(task.createdAt).toDateString() === today
  );

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const weeklyCompletion = last7Days.map(date => {
    const dayTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === date
    );
    const completed = dayTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    return { date, completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }).reverse();

  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const subjectStats = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { completed: 0, total: 0, timeSpent: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
      acc[task.subject].timeSpent += parseInt(task.duration || '0');
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number; timeSpent: number }>);

  const totalTimeSpent = Object.values(subjectStats).reduce((sum, stat) => sum + stat.timeSpent, 0);
  const averageCompletion = weeklyCompletion.reduce((sum, day) => sum + day.percentage, 0) / 7;

  const highPriorityCompleted = tasks.filter(task => task.priority === 'high' && task.completed).length;
  const totalHighPriority = tasks.filter(task => task.priority === 'high').length;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Target className="h-5 w-5" />
            <span>Today's Progress</span>
          </CardTitle>
          <CardDescription>Keep building momentum!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-700">
                {completedToday}/{totalToday}
              </div>
              <p className="text-sm text-gray-600">Tasks Completed</p>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-center text-sm text-gray-600">
              {Math.round(progressPercentage)}% of today's goals achieved
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Study Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{totalTimeSpent} min</div>
            <p className="text-sm text-gray-600">Total study time completed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Subject Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(subjectStats).map(([subject, stats]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{subject}</span>
                  </div>
                  <span className="text-gray-600">
                    {stats.completed}/{stats.total} ({stats.timeSpent}min)
                  </span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Award className="h-5 w-5" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-700">
                {Math.round(averageCompletion)}%
              </div>
              <p className="text-xs text-gray-600">7-day avg completion</p>
            </div>
            <div>
              <div className="text-xl font-bold text-green-700">
                {totalHighPriority > 0 ? Math.round((highPriorityCompleted / totalHighPriority) * 100) : 0}%
              </div>
              <p className="text-xs text-gray-600">High priority tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Weekly Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {weeklyCompletion.map((day, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto ${
                  day.percentage >= 80 ? 'bg-green-100 text-green-800' :
                  day.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  day.percentage > 0 ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {day.total > 0 ? `${Math.round(day.percentage)}%` : '-'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <Zap className="h-5 w-5" />
            <span>Motivation Boost</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {averageCompletion >= 80 ? '🔥' : 
               averageCompletion >= 60 ? '💪' : 
               averageCompletion >= 40 ? '📈' : '🌱'}
            </div>
            <p className="text-sm text-gray-700 font-medium">
              {averageCompletion >= 80 ? 'You\'re on fire! Keep it up!' : 
               averageCompletion >= 60 ? 'Great progress! Stay strong!' : 
               averageCompletion >= 40 ? 'Building momentum!' : 'Every step counts!'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

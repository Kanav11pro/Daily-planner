
import { TrendingUp, Target, Calendar, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  scheduled_date: string;
  created_at: string;
  duration?: number;
}

interface ProgressOverviewProps {
  tasks: Task[];
}

export const ProgressOverview = ({ tasks }: ProgressOverviewProps) => {
  // Helper function to format date consistently
  const formatDateForComparison = (date: Date | string): string => {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = formatDateForComparison(new Date());
  console.log('Today\'s date for progress:', today);
  
  const todayTasks = tasks.filter(task => {
    const taskDate = formatDateForComparison(task.scheduled_date);
    console.log('Comparing task date:', taskDate, 'with today:', today);
    return taskDate === today;
  });

  console.log('Today\'s tasks count:', todayTasks.length);

  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const subjectProgress = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { completed: 0, total: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

  // Calculate study streak (simplified - count days with completed tasks in last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return formatDateForComparison(date);
  });

  const daysWithCompletedTasks = last7Days.filter(date => {
    const dayTasks = tasks.filter(task => formatDateForComparison(task.scheduled_date) === date);
    return dayTasks.some(task => task.completed);
  }).length;

  const weeklyStreak = daysWithCompletedTasks;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Target className="h-5 w-5" />
            <span>Today's Progress</span>
          </CardTitle>
          <CardDescription>Keep up the momentum!</CardDescription>
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
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Subject Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(subjectProgress).map(([subject, progress]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{subject}</span>
                  <span className="text-gray-600">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <Progress 
                  value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <Trophy className="h-5 w-5" />
            <span>Study Streak</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">{weeklyStreak} days</div>
            <p className="text-sm text-gray-600">Keep it going! 🔥</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Weekly Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              const dateString = date.toISOString().split('T')[0];
              const dayTasks = tasks.filter(task => task.scheduled_date === dateString);
              const hasCompletedTasks = dayTasks.some(task => task.completed);
              
              return (
                <div key={index} className="space-y-1">
                  <div className="text-xs text-gray-500">{day}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    hasCompletedTasks ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {hasCompletedTasks ? '✓' : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

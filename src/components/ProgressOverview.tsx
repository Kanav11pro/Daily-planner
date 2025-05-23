
import { TrendingUp, Target, Calendar, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: number;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  createdAt: string;
}

interface ProgressOverviewProps {
  tasks: Task[];
}

export const ProgressOverview = ({ tasks }: ProgressOverviewProps) => {
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(task => 
    new Date(task.createdAt).toDateString() === today
  );

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

  const weeklyStreak = 7; // This would be calculated based on daily completions

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
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs text-gray-500">{day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  index < 5 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < 5 ? '✓' : '-'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

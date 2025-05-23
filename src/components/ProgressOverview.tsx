
import { Trophy, Target, TrendingUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressOverviewProps {
  tasks: any[];
}

export const ProgressOverview = ({ tasks }: ProgressOverviewProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const todayTasks = tasks.filter(task => 
    new Date(task.createdAt).toDateString() === new Date().toDateString()
  );
  const todayCompleted = todayTasks.filter(task => task.completed).length;
  const todayRate = todayTasks.length > 0 ? (todayCompleted / todayTasks.length) * 100 : 0;

  const subjectProgress = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { total: 0, completed: 0 };
    }
    acc[task.subject].total++;
    if (task.completed) acc[task.subject].completed++;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{Math.round(completionRate)}%</div>
          <Progress value={completionRate} className="bg-white/20" />
          <p className="text-sm text-indigo-100 mt-2">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-gray-700">
            <Target className="h-5 w-5" />
            <span>Today's Focus</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 mb-2">{Math.round(todayRate)}%</div>
          <Progress value={todayRate} className="mb-2" />
          <p className="text-sm text-gray-600">
            {todayCompleted} of {todayTasks.length} tasks done today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-gray-700">
            <BookOpen className="h-5 w-5" />
            <span>Subject Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(subjectProgress).map(([subject, progress]) => {
            const rate = (progress.completed / progress.total) * 100;
            return (
              <div key={subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{subject}</span>
                  <span className="text-gray-500">{progress.completed}/{progress.total}</span>
                </div>
                <Progress value={rate} className="h-2" />
              </div>
            );
          })}
          
          {Object.keys(subjectProgress).length === 0 && (
            <div className="text-center text-gray-400 py-4">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Add tasks to see subject progress</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Keep Going!</p>
              <p className="text-sm text-green-600">You're making great progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React from 'react';
import { Brain, Edit3, RotateCcw, Clock, Target, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePractice } from '@/hooks/usePractice';

interface Task {
  id: string;
  title: string;
  duration?: number;
  study_nature?: string;
  completed: boolean;
  scheduled_date: string;
  created_at: string;
}

interface StudyDistributionProps {
  tasks: Task[];
  selectedDate: Date;
}

export const StudyDistribution: React.FC<StudyDistributionProps> = ({ tasks, selectedDate }) => {
  const { sessions } = usePractice();
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.scheduled_date || task.created_at);
    const today = new Date(selectedDate);
    return taskDate.toDateString() === today.toDateString();
  });

  // Get today's practice sessions
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date(selectedDate);
    return sessionDate.toDateString() === today.toDateString();
  });

  // Calculate total questions practiced today
  const totalQuestions = todaySessions.reduce((acc, session) => acc + (session.questions_solved || 0), 0);
  const avgAccuracy = todaySessions.length > 0 
    ? todaySessions.reduce((acc, session) => acc + (session.accuracy_percentage || 0), 0) / todaySessions.length 
    : 0;

  const distribution = todayTasks.reduce(
    (acc, task) => {
      const duration = task.duration || 60; // Default 1 hour if no duration
      const nature = task.study_nature || 'Theory'; // Default to Theory if not set
      
      acc[nature] = (acc[nature] || 0) + duration;
      acc.total += duration;
      
      return acc;
    },
    { Theory: 0, Practice: 0, Revision: 0, total: 0 }
  );

  const completedTasks = todayTasks.filter(task => task.completed);
  const completedTime = completedTasks.reduce((acc, task) => acc + (task.duration || 60), 0);
  
  const plannedHours = Math.round((distribution.total / 60) * 10) / 10;
  const completedHours = Math.round((completedTime / 60) * 10) / 10;
  const progressPercentage = distribution.total > 0 ? (completedTime / distribution.total) * 100 : 0;

  const studyTypes = [
    { 
      name: 'Theory', 
      value: distribution.Theory, 
      icon: Brain, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      description: 'Lectures & Concepts'
    },
    { 
      name: 'Practice', 
      value: distribution.Practice, 
      icon: Edit3, 
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      description: 'Problems & Exercises'
    },
    { 
      name: 'Revision', 
      value: distribution.Revision, 
      icon: RotateCcw, 
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      description: 'Review & Recall'
    },
  ];

  // Calculate balance score (closer to equal distribution is better)
  const balanceScore = distribution.total > 0 ? 
    100 - Math.max(
      Math.abs((distribution.Theory / distribution.total) * 100 - 33.33),
      Math.abs((distribution.Practice / distribution.total) * 100 - 33.33),
      Math.abs((distribution.Revision / distribution.total) * 100 - 33.33)
    ) * 3 : 0;

  const getBalanceMessage = () => {
    if (balanceScore >= 80) return { text: "Excellent balance! 🎯", color: "text-green-600" };
    if (balanceScore >= 60) return { text: "Good balance 👍", color: "text-blue-600" };
    if (balanceScore >= 40) return { text: "Consider more balance", color: "text-yellow-600" };
    return { text: "Needs better balance", color: "text-red-600" };
  };

  const balanceMessage = getBalanceMessage();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Today's Study Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Study Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Planned Study Hours */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-gray-700 text-sm">Study Time</span>
            </div>
            <div className="text-xl font-bold text-indigo-600">{plannedHours}h</div>
            <div className="text-xs text-gray-500">{todayTasks.length} tasks</div>
          </div>

          {/* Questions Practiced */}
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700 text-sm">Questions</span>
            </div>
            <div className="text-xl font-bold text-green-600">{totalQuestions}</div>
            <div className="text-xs text-gray-500">
              {avgAccuracy > 0 ? `${Math.round(avgAccuracy)}% avg accuracy` : 'No practice yet'}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress Today</span>
            <span className="text-sm text-gray-500">{completedHours}h / {plannedHours}h</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            {Math.round(progressPercentage)}% completed
          </div>
        </div>

        {/* Study Distribution */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Study Distribution</h4>
            <span className={`text-sm font-medium ${balanceMessage.color}`}>
              {balanceMessage.text}
            </span>
          </div>
          
          {studyTypes.map(type => {
            const IconComponent = type.icon;
            const percentage = distribution.total > 0 ? (type.value / distribution.total) * 100 : 0;
            const hours = Math.round((type.value / 60) * 10) / 10;
            
            return (
              <div key={type.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${type.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${type.textColor}`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{hours}h</div>
                    <div className="text-xs text-gray-500">{Math.round(percentage)}%</div>
                  </div>
                </div>
                <Progress value={percentage} className="h-1" />
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {distribution.total > 0 && balanceScore < 60 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-1">💡 Study Tips</div>
            <div className="text-xs text-yellow-700">
              {distribution.Theory > distribution.Practice + distribution.Revision && 
                "Try adding more practice and revision tasks for better retention."
              }
              {distribution.Practice > distribution.Theory + distribution.Revision && 
                "Balance with more theory review to strengthen concepts."
              }
              {distribution.Revision === 0 && distribution.total > 0 &&
                "Don't forget to add revision time for better retention!"
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
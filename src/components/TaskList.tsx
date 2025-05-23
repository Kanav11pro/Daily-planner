
import { Check, Clock, X, Plus, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TaskListProps {
  tasks: any[];
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: () => void;
  title: string;
}

const subjectColors = {
  Mathematics: "bg-blue-100 text-blue-800 border-blue-300",
  Physics: "bg-green-100 text-green-800 border-green-300",
  Chemistry: "bg-red-100 text-red-800 border-red-300",
  English: "bg-purple-100 text-purple-800 border-purple-300",
  Biology: "bg-yellow-100 text-yellow-800 border-yellow-300"
};

const priorityColors = {
  high: "border-l-red-500 bg-gradient-to-r from-red-50 to-pink-50",
  medium: "border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50",
  low: "border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
};

const priorityIcons = {
  high: "🔴",
  medium: "🟡", 
  low: "🟢"
};

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onAddTask, title }: TaskListProps) => {
  const [completingTasks, setCompletingTasks] = useState<Set<number>>(new Set());

  const handleToggleTask = (taskId: number, isCompleted: boolean) => {
    if (!isCompleted) {
      setCompletingTasks(prev => new Set(prev).add(taskId));
      setTimeout(() => {
        setCompletingTasks(prev => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }, 1000);
    }
    onToggleTask(taskId);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8 max-w-md mx-auto animate-fade-in">
          <div className="text-4xl sm:text-6xl mb-4 animate-bounce">📚</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No tasks planned yet!</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6">Start planning your study session by adding your first task.</p>
          <Button
            onClick={onAddTask}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Plan Your First Task
          </Button>
        </div>
      </div>
    );
  }

  // Group tasks by subject
  const tasksBySubject = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = [];
    }
    acc[task.subject].push(task);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h3>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {tasks.filter(t => t.completed).length} of {tasks.length} completed
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(tasksBySubject).map(([subject, subjectTasks]: [string, any[]]) => (
          <div key={subject} className="space-y-3 animate-fade-in">
            <div className="flex items-center space-x-2 flex-wrap">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">{subject}</h4>
              <Badge className={`${subjectColors[subject] || "bg-gray-100 text-gray-800"} text-xs`}>
                {subjectTasks.length} task{subjectTasks.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="space-y-3 ml-0 sm:ml-7">
              {subjectTasks.map((task) => {
                const isCompleting = completingTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className={`group border-l-4 ${priorityColors[task.priority]} rounded-r-lg shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-4 bg-white transform hover:scale-[1.01] ${
                      task.completed ? 'opacity-75' : ''
                    } ${isCompleting ? 'animate-pulse bg-gradient-to-r from-green-100 to-emerald-100' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={() => handleToggleTask(task.id, task.completed)}
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white animate-bounce'
                              : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                          }`}
                        >
                          {task.completed && <Check className="h-4 w-4" />}
                          {isCompleting && !task.completed && <Sparkles className="h-4 w-4 text-indigo-500" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h5 className={`font-semibold text-gray-800 break-words ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </h5>
                              {task.chapter && (
                                <p className={`text-sm text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                                  Chapter: {task.chapter}
                                </p>
                              )}
                              {task.description && (
                                <p className={`text-gray-600 mt-1 text-sm break-words ${task.completed ? 'line-through' : ''}`}>
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 sm:space-x-3 mt-3 flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {priorityIcons[task.priority]} {task.priority} priority
                            </Badge>
                            
                            {task.duration && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {task.duration} min
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-red-500 hover:text-red-700 p-1 hover:scale-110 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={onAddTask}
          variant="outline"
          className="border-dashed border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Task
        </Button>
      </div>
    </div>
  );
};

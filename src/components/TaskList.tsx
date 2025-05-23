
import { Check, Clock, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TaskListProps {
  tasks: any[];
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: () => void;
  title: string;
}

const subjectColors = {
  Mathematics: "bg-blue-100 text-blue-800",
  Physics: "bg-green-100 text-green-800",
  Chemistry: "bg-red-100 text-red-800",
  English: "bg-purple-100 text-purple-800",
  Biology: "bg-yellow-100 text-yellow-800",
  General: "bg-gray-100 text-gray-800"
};

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500"
};

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onAddTask, title }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet!</h3>
          <p className="text-gray-500 mb-6">Start your study journey by adding your first task.</p>
          <Button
            onClick={onAddTask}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Task
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`group bg-white border-l-4 ${priorityColors[task.priority]} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 ${
              task.completed ? 'opacity-75 bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {task.completed && <Check className="h-4 w-4" />}
                </button>
                
                <div className="flex-1">
                  <h4 className={`font-semibold text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge className={subjectColors[task.subject] || subjectColors.General}>
                      {task.subject}
                    </Badge>
                    
                    {task.duration && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {task.duration} min
                      </div>
                    )}
                    
                    <Badge variant="outline" className="text-xs">
                      {task.priority} priority
                    </Badge>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

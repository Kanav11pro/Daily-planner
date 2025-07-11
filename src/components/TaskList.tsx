
import { Check, Clock, X, Plus, BookOpen, Sparkles, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { EditTaskModal } from "./EditTaskModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { MoveTaskModal } from "./MoveTaskModal";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface TaskListProps {
  tasks: any[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: any) => void;
  onAddTask: () => void;
  title: string;
}

const subjectColors = {
  Maths: "bg-blue-50 text-blue-700 border-blue-200",
  Physics: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Chemistry: "bg-rose-50 text-rose-700 border-rose-200",
  "Mock Test": "bg-purple-50 text-purple-700 border-purple-200"
};

const priorityColors = {
  high: "border-l-4 border-l-red-400",
  medium: "border-l-4 border-l-amber-400",
  low: "border-l-4 border-l-emerald-400"
};

const priorityDots = {
  high: "bg-red-400",
  medium: "bg-amber-400", 
  low: "bg-emerald-400"
};

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onEditTask, onAddTask, title }: TaskListProps) => {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<any>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [movingTask, setMovingTask] = useState<any>(null);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const handleToggleTask = (taskId: string, isCompleted: boolean) => {
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

  const handleEditTask = (updatedTask: any) => {
    // Remove any fields that don't exist in the database
    const { createdAt, ...taskWithoutCreatedAt } = updatedTask;
    onEditTask(editingTask.id, taskWithoutCreatedAt);
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (deletingTaskId) {
      onDeleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  const handleMoveTask = (taskId: string, newDate: string) => {
    // Use onEditTask to update the scheduled_date
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onEditTask(taskId, { ...task, scheduled_date: newDate });
      setMovingTask(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className={`${themeColors.accent} rounded-xl p-6 sm:p-8 max-w-md mx-auto animate-fade-in`}>
          <div className="text-4xl sm:text-6xl mb-4 animate-bounce">📚</div>
          <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${themeColors.text}`}>No tasks planned yet!</h3>
          <p className={`text-sm sm:text-base mb-6 ${themeColors.text} opacity-70`}>Start planning your study session by adding your first task.</p>
          <Button
            onClick={onAddTask}
            className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 transition-all duration-300 hover:scale-105`}
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
        <h3 className={`text-xl sm:text-2xl font-bold ${themeColors.text}`}>{title}</h3>
        <div className={`text-sm px-3 py-1 rounded-full ${themeColors.accent}`}>
          {tasks.filter(t => t.completed).length} of {tasks.length} completed
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(tasksBySubject).map(([subject, subjectTasks]: [string, any[]]) => (
          <div key={subject} className="space-y-1">
            {/* Subject Header */}
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className={`h-5 w-5 ${themeColors.text}`} />
              <h4 className={`text-lg font-semibold ${themeColors.text}`}>{subject}</h4>
              <Badge className={`${subjectColors[subject] || "bg-gray-50 text-gray-700"} text-xs px-2 py-1 rounded-full font-medium`}>
                {subjectTasks.length} task{subjectTasks.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {/* Tasks */}
            <div className="space-y-2">
              {subjectTasks.map((task) => {
                const isCompleting = completingTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className={`group ${priorityColors[task.priority]} bg-white rounded-lg hover:shadow-md transition-all duration-200 ${
                      task.completed ? 'opacity-60' : ''
                    } ${isCompleting ? 'animate-pulse' : ''} border border-gray-100`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleTask(task.id, task.completed)}
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 shrink-0 ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {task.completed && <Check className="h-3 w-3" />}
                          {isCompleting && !task.completed && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                        </button>
                        
                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h5 className={`text-base font-medium leading-6 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {task.title}
                              </h5>
                              {task.chapter && (
                                <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                  Chapter: {task.chapter}
                                </p>
                              )}
                              {task.description && (
                                <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                  {task.description}
                                </p>
                              )}
                            </div>
                            
                            {/* Action Buttons - Always visible on mobile, hover on desktop */}
                            <div className="flex items-center gap-1 ml-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => setMovingTask(task)}
                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Move to different date"
                              >
                                <Calendar className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingTask(task)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit task"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeletingTaskId(task.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Priority and Duration */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`}></div>
                              <span className="text-sm text-gray-600 capitalize">{task.priority} priority</span>
                            </div>
                            
                            {task.duration && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{task.duration} min</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
          className={`border-dashed border-2 transition-all duration-300 hover:scale-105 ${themeColors.border} ${themeColors.text} hover:${themeColors.accent.replace('bg-', 'bg-').replace('text-', 'hover:text-')}`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Task
        </Button>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditTask}
        />
      )}

      {deletingTaskId && (
        <DeleteConfirmDialog
          onConfirm={handleDeleteTask}
          onCancel={() => setDeletingTaskId(null)}
        />
      )}

      {movingTask && (
        <MoveTaskModal
          task={movingTask}
          onClose={() => setMovingTask(null)}
          onMove={handleMoveTask}
        />
      )}
    </div>
  );
};

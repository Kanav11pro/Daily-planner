
import { useState } from "react";
import { Check, Plus, Edit2, Trash2, Clock, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditTaskModal } from "./EditTaskModal";
import { MoveTaskModal } from "./MoveTaskModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Task } from "@/hooks/useTasks";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: any) => void;
  onMoveTask?: (taskId: string, newDate: string) => void;
  onAddTask: () => void;
  title: string;
}

export const TaskList = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onEditTask, 
  onMoveTask,
  onAddTask, 
  title 
}: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [movingTask, setMovingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const handleEditSave = (updatedTask: any) => {
    onEditTask(updatedTask.id, updatedTask);
    setEditingTask(null);
  };

  const handleMove = (taskId: string, newDate: string) => {
    if (onMoveTask) {
      onMoveTask(taskId, newDate);
    }
    setMovingTask(null);
  };

  const handleDelete = () => {
    if (deletingTaskId) {
      onDeleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <Button
            onClick={onAddTask}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 hover:scale-105 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks scheduled</h3>
            <p className="text-gray-500 mb-6">Start by adding your first study task!</p>
            <Button
              onClick={onAddTask}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`group p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${
                  task.completed 
                    ? 'bg-green-50 border-green-200 opacity-75' 
                    : 'bg-white border-gray-200 hover:border-indigo-300'
                } animate-fade-in`}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <Check className="h-4 w-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className={`text-lg font-semibold ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {getPriorityEmoji(task.priority)} {task.priority}
                        </Badge>
                        {task.duration && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.duration}min
                          </Badge>
                        )}
                      </div>
                    </div>

                    {task.description && (
                      <p className={`mt-2 text-sm ${
                        task.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        📚 {task.subject}
                      </Badge>
                      {task.chapter && (
                        <Badge variant="outline" className="text-xs">
                          📖 {task.chapter}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {onMoveTask && (
                      <button
                        onClick={() => setMovingTask(task)}
                        className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                        title="Move to different date"
                      >
                        <MoveHorizontal className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-indigo-500 hover:text-indigo-700 hover:scale-110 transition-all duration-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingTaskId(task.id)}
                      className="text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
        />
      )}

      {movingTask && (
        <MoveTaskModal
          task={movingTask}
          onClose={() => setMovingTask(null)}
          onMove={handleMove}
        />
      )}

      {deletingTaskId && (
        <DeleteConfirmDialog
          isOpen={true}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleDelete}
          taskTitle={tasks.find(t => t.id === deletingTaskId)?.title || ""}
        />
      )}
    </>
  );
};

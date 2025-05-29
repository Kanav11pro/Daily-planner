
import React, { useState } from 'react';
import { Check, Clock, MoreVertical, Calendar, Tag, Trash2, Edit3, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { Task } from '@/hooks/useTasks';
import { EditTaskModal } from './EditTaskModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { MoveTaskModal } from './MoveTaskModal';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onMoveTask: (id: string, newDate: string) => void;
  selectedDate: Date;
}

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

const priorityEmojis = {
  high: '🔴',
  medium: '🟡',
  low: '🟢'
};

export const TaskList = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onUpdateTask, 
  onMoveTask,
  selectedDate 
}: TaskListProps) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [movingTask, setMovingTask] = useState<Task | null>(null);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks.filter(task => task.scheduled_date === selectedDateStr);

  const completedTasks = dayTasks.filter(task => task.completed);
  const pendingTasks = dayTasks.filter(task => !task.completed);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className={`p-4 transition-all duration-200 hover:shadow-lg ${colors.card} ${colors.border}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleTask(task.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              task.completed
                ? `bg-gradient-to-r ${colors.primary} border-transparent`
                : `border-gray-300 hover:${colors.border}`
            }`}
          >
            {task.completed && <Check className="h-3 w-3 text-white" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`px-2 py-1 text-xs font-medium border ${colors.accent}`}>
                {task.subject}
              </Badge>
              <Badge variant="outline" className={`px-2 py-1 text-xs ${
                task.completed ? 'line-through opacity-60' : ''
              }`}>
                {priorityEmojis[task.priority]} {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              {task.duration && (
                <Badge variant="outline" className="px-2 py-1 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(task.duration)}
                </Badge>
              )}
            </div>
            
            <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h3>
            
            {task.chapter && (
              <p className={`text-sm text-gray-600 mt-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                📖 {task.chapter}
              </p>
            )}
            
            {task.description && (
              <p className={`text-sm text-gray-500 mt-2 ${task.completed ? 'line-through opacity-60' : ''}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setEditingTask(task)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMovingTask(task)}>
              <Move className="h-4 w-4 mr-2" />
              Move
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeletingTaskId(task.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );

  if (dayTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks for this day</h3>
        <p className="text-gray-500">Add a new task to get started with your study plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
            📋 Pending Tasks ({pendingTasks.length})
          </h3>
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
            ✅ Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdateTask={onUpdateTask}
        />
      )}

      {deletingTaskId && (
        <DeleteConfirmDialog
          onConfirm={() => {
            onDeleteTask(deletingTaskId);
            setDeletingTaskId(null);
          }}
          onCancel={() => setDeletingTaskId(null)}
        />
      )}

      {movingTask && (
        <MoveTaskModal
          task={movingTask}
          onClose={() => setMovingTask(null)}
          onMoveTask={onMoveTask}
        />
      )}
    </div>
  );
};

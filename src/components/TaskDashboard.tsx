
import { TaskList } from "./TaskList";

interface TaskDashboardProps {
  tasks: any[];
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: () => void;
  selectedDate: Date;
}

export const TaskDashboard = ({ tasks, onToggleTask, onDeleteTask, onAddTask, selectedDate }: TaskDashboardProps) => {
  const formatDateTitle = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today's Study Plan";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow's Study Plan";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday's Study Plan";
    } else {
      return `Study Plan for ${date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        <TaskList
          tasks={tasks}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onAddTask={onAddTask}
          title={formatDateTitle(selectedDate)}
        />
      </div>
    </div>
  );
};


import { TaskList } from "./TaskList";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface TaskDashboardProps {
  tasks: any[];
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: any) => void;
  onAddTask: () => void;
  selectedDate: Date;
}

export const TaskDashboard = ({ tasks, onToggleTask, onDeleteTask, onEditTask, onAddTask, selectedDate }: TaskDashboardProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

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
    <div className={`${themeColors.card} rounded-2xl shadow-xl ${themeColors.border} border overflow-hidden ${themeColors.glow} shadow-2xl`}>
      <div className="p-4 sm:p-6">
        <TaskList
          tasks={tasks}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onAddTask={onAddTask}
          title={formatDateTitle(selectedDate)}
        />
      </div>
    </div>
  );
};

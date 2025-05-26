
import { useState } from "react";
import { Header } from "@/components/Header";
import { QuoteSection } from "@/components/QuoteSection";
import { TaskDashboard } from "@/components/TaskDashboard";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { WeeklyAnalytics } from "@/components/WeeklyAnalytics";
import { TaskModal } from "@/components/TaskModal";
import { Celebration } from "@/components/Celebration";
import { DateSelector } from "@/components/DateSelector";
import { ProfileSection } from "@/components/ProfileSection";
import { AuthForm } from "@/components/AuthForm";
import { ThemeProvider, useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";

const IndexContent = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWeeklyAnalytics, setShowWeeklyAnalytics] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeColors.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <AuthForm />;
  }

  const handleAddTask = async (taskData: any) => {
    const newTask = {
      ...taskData,
      scheduled_date: taskData.scheduledDate || selectedDate.toISOString().split('T')[0],
      completed: false
    };
    await addTask(newTask);
    setShowTaskModal(false);
  };

  const handleEditTask = async (taskId: string, updatedTask: any) => {
    await updateTask(taskId, updatedTask);
  };

  const handleMoveTask = async (taskId: string, newDate: string) => {
    await updateTask(taskId, { scheduled_date: newDate });
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
    await toggleTask(taskId);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => 
      task.scheduled_date === dateString
    );
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <Header onAddTask={() => setShowTaskModal(true)} />
        
        <main className="container mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
          <ProfileSection />
          <QuoteSection />
          
          <DateSelector 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddTask={() => setShowTaskModal(true)}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <TaskDashboard 
                tasks={selectedDateTasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                onMoveTask={handleMoveTask}
                onAddTask={() => setShowTaskModal(true)}
                selectedDate={selectedDate}
              />
            </div>
            <div>
              <TaskAnalytics 
                tasks={tasks} 
                onOpenWeeklyAnalytics={() => setShowWeeklyAnalytics(true)}
              />
            </div>
          </div>
        </main>

        {showTaskModal && (
          <TaskModal
            onClose={() => setShowTaskModal(false)}
            onAddTask={handleAddTask}
            selectedDate={selectedDate}
          />
        )}

        {showWeeklyAnalytics && (
          <WeeklyAnalytics
            tasks={tasks}
            onClose={() => setShowWeeklyAnalytics(false)}
          />
        )}

        {showCelebration && <Celebration />}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;

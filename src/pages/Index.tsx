
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuoteSection } from "@/components/QuoteSection";
import { TaskDashboard } from "@/components/TaskDashboard";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { WeeklyAnalytics } from "@/components/WeeklyAnalytics";
import { TaskModal } from "@/components/TaskModal";
import { Celebration } from "@/components/Celebration";
import { DateSelector } from "@/components/DateSelector";
import { ThemeProvider, useTheme, getThemeColors } from "@/contexts/ThemeContext";

const IndexContent = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWeeklyAnalytics, setShowWeeklyAnalytics] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('examPrepTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  useEffect(() => {
    localStorage.setItem('examPrepTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: task.scheduledDate || new Date().toISOString(),
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 4000);
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTasksForDate = (date) => {
    const dateString = date.toDateString();
    return tasks.filter(task => 
      new Date(task.createdAt).toDateString() === dateString
    );
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <Header onAddTask={() => setShowTaskModal(true)} />
        
        <main className="container mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
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
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
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
            onAddTask={addTask}
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


import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuoteSection } from "@/components/QuoteSection";
import { TaskDashboard } from "@/components/TaskDashboard";
import { ProgressOverview } from "@/components/ProgressOverview";
import { TaskModal } from "@/components/TaskModal";
import { Celebration } from "@/components/Celebration";
import { DateSelector } from "@/components/DateSelector";

const Index = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('examPrepTasks');
    return saved ? JSON.parse(saved) : [];
  });

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
          setTimeout(() => setShowCelebration(false), 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header onAddTask={() => setShowTaskModal(true)} />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        <QuoteSection />
        
        <DateSelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onAddTask={() => setShowTaskModal(true)}
        />
        
        <div className="grid lg:grid-cols-3 gap-8">
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
            <ProgressOverview tasks={tasks} />
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

      {showCelebration && <Celebration />}
    </div>
  );
};

export default Index;

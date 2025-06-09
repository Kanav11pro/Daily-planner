
import React, { useState } from "react";
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
import { OnboardingQuiz, OnboardingAnswers } from "@/components/OnboardingQuiz";
import { GuidedTour } from "@/components/GuidedTour";
import { ThemeProvider, useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";

const IndexContent = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWeeklyAnalytics, setShowWeeklyAnalytics] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { user, loading: authLoading, updateUserMetadata, isOnboardingCompleted } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  // Helper function to format date consistently for comparison
  const formatDateForComparison = (date: Date | string): string => {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddTask = async (taskData: any) => {
    const newTask = {
      ...taskData,
      scheduled_date: taskData.scheduledDate || formatDateForComparison(selectedDate),
      completed: false
    };
    await addTask(newTask);
    setShowTaskModal(false);
  };

  const handleEditTask = async (taskId: string, updatedTask: any) => {
    // Ensure the scheduled_date is properly formatted if it's being updated
    if (updatedTask.scheduled_date) {
      updatedTask.scheduled_date = formatDateForComparison(updatedTask.scheduled_date);
    }
    await updateTask(taskId, updatedTask);
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
    const dateString = formatDateForComparison(date);
    console.log('Filtering tasks for date:', dateString);
    console.log('Available tasks:', tasks.map(t => ({ id: t.id, title: t.title, scheduled_date: t.scheduled_date })));
    
    const filteredTasks = tasks.filter(task => {
      const taskDate = formatDateForComparison(task.scheduled_date);
      return taskDate === dateString;
    });
    
    console.log('Filtered tasks:', filteredTasks.length);
    return filteredTasks;
  };

  // Check if user needs onboarding
  React.useEffect(() => {
    if (user && !authLoading) {
      if (!isOnboardingCompleted()) {
        setShowOnboarding(true);
      }
    }
  }, [user, authLoading, isOnboardingCompleted]);

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

  // Show onboarding quiz if user hasn't completed it
  if (showOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={async (answers: OnboardingAnswers) => {
          // Save onboarding answers to user metadata
          await updateUserMetadata({
            onboarding_completed: true,
            exam: answers.exam,
            exam_other: answers.examOther,
            institute: answers.institute,
            institute_other: answers.instituteOther,
            study_hours: answers.studyHours,
            challenge: answers.challenge
          });
          
          setShowOnboarding(false);
          setShowGuidedTour(true);
          toast.success("Welcome to Exam Ace! Let's take a quick tour 🚀");
        }}
      />
    );
  }

  // Show guided tour if user just completed onboarding
  if (showGuidedTour) {
    return (
      <>
        {/* Render the main app behind the tour */}
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
                    tasks={getTasksForDate(selectedDate)}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
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
          </div>
        </div>
        
        <GuidedTour
          onComplete={() => {
            setShowGuidedTour(false);
            toast.success("You're all set! Start planning your study sessions 📚");
          }}
        />
      </>
    );
  }

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

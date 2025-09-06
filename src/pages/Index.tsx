
import React, { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { TaskDashboard } from "@/components/TaskDashboard";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { WeeklyAnalytics } from "@/components/WeeklyAnalytics";
import { TaskModal } from "@/components/TaskModal";
import { Celebration } from "@/components/Celebration";
import { DateSelector } from "@/components/DateSelector";
import { ProfileSection } from "@/components/ProfileSection";
import { ProgressOverview } from "@/components/ProgressOverview";
import { AuthForm } from "@/components/AuthForm";
import { OnboardingQuiz, OnboardingAnswers } from "@/components/OnboardingQuiz";
import { GuidedTour } from "@/components/GuidedTour";
import { ThemeProvider, useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";
import { formatInTimeZone } from "date-fns-tz";

// Memoized components for better performance
const MemoizedHeader = React.memo(Header);
const MemoizedProfileSection = React.memo(ProfileSection);
const MemoizedDateSelector = React.memo(DateSelector);
const MemoizedTaskDashboard = React.memo(TaskDashboard);
const MemoizedProgressOverview = React.memo(ProgressOverview);
const MemoizedTaskAnalytics = React.memo(TaskAnalytics);

const IndexContent = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showWeeklyAnalytics, setShowWeeklyAnalytics] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { user, loading: authLoading, updateUserMetadata, isOnboardingCompleted } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const IST_TIMEZONE = 'Asia/Kolkata';

  // Memoized helper function
  const formatDateForComparison = useCallback((date: Date | string): string => {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return formatInTimeZone(date, IST_TIMEZONE, 'yyyy-MM-dd');
  }, [IST_TIMEZONE]);

  // Memoized handlers
  const handleAddTask = useCallback(async (taskData: any) => {
    const newTask = {
      ...taskData,
      scheduled_date: taskData.scheduledDate || formatDateForComparison(selectedDate),
      completed: false
    };
    await addTask(newTask);
    setShowTaskModal(false);
  }, [addTask, formatDateForComparison, selectedDate]);

  const handleEditTask = useCallback(async (taskId: string, updatedTask: any) => {
    if (updatedTask.scheduled_date) {
      updatedTask.scheduled_date = formatDateForComparison(updatedTask.scheduled_date);
    }
    await updateTask(taskId, updatedTask);
  }, [updateTask, formatDateForComparison]);

  const handleToggleTask = useCallback(async (taskId: string) => {
    await toggleTask(taskId);
  }, [toggleTask]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    await deleteTask(taskId);
  }, [deleteTask]);

  const handleOpenTaskModal = useCallback(() => setShowTaskModal(true), []);
  const handleCloseTaskModal = useCallback(() => setShowTaskModal(false), []);
  const handleOpenWeeklyAnalytics = useCallback(() => setShowWeeklyAnalytics(true), []);
  const handleCloseWeeklyAnalytics = useCallback(() => setShowWeeklyAnalytics(false), []);
  

  // Memoized tasks for selected date
  const selectedDateTasks = useMemo(() => {
    const dateString = formatDateForComparison(selectedDate);
    return tasks.filter(task => {
      const taskDate = formatDateForComparison(task.scheduled_date);
      return taskDate === dateString;
    });
  }, [tasks, selectedDate, formatDateForComparison]);

  // Memoized onboarding completion handler
  const handleOnboardingComplete = useCallback(async (answers: OnboardingAnswers) => {
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
  }, [updateUserMetadata]);

  const handleGuidedTourComplete = useCallback(() => {
    setShowGuidedTour(false);
    toast.success("You're all set! Start planning your study sessions 📚");
  }, []);

  // Check if user needs onboarding
  React.useEffect(() => {
    if (user && !authLoading) {
      if (!isOnboardingCompleted()) {
        setShowOnboarding(true);
      }
    }
  }, [user, authLoading, isOnboardingCompleted]);

  // Memoized background style
  const backgroundStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${themeColors.background.replace('from-', '').replace('to-', ', ')})`,
  }), [themeColors.background]);

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
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  // Show guided tour if user just completed onboarding
  if (showGuidedTour) {
    return (
      <>
        <div className={`min-h-screen bg-gradient-to-br ${themeColors.background} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <MemoizedHeader onAddTask={handleOpenTaskModal} />
            
            <main className="container mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
              <MemoizedProfileSection />
              
              <MemoizedDateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onAddTask={handleOpenTaskModal}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2">
                  <MemoizedTaskDashboard 
                    tasks={selectedDateTasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                    onAddTask={handleOpenTaskModal}
                    selectedDate={selectedDate}
                  />
                </div>
                <div className="space-y-6">
                  <MemoizedProgressOverview tasks={tasks} selectedDate={selectedDate} />
                  <MemoizedTaskAnalytics 
                    tasks={tasks} 
                    onOpenWeeklyAnalytics={handleOpenWeeklyAnalytics}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
        
        <GuidedTour onComplete={handleGuidedTourComplete} />
      </>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <MemoizedHeader onAddTask={handleOpenTaskModal} />
        
        <main className="container mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
          <MemoizedProfileSection />
          
          <MemoizedDateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddTask={handleOpenTaskModal}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <MemoizedTaskDashboard 
                tasks={selectedDateTasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                onAddTask={handleOpenTaskModal}
                selectedDate={selectedDate}
              />
            </div>
            <div className="space-y-6">
              <MemoizedProgressOverview tasks={tasks} selectedDate={selectedDate} />
              <MemoizedTaskAnalytics 
                tasks={tasks} 
                onOpenWeeklyAnalytics={handleOpenWeeklyAnalytics}
              />
            </div>
          </div>
        </main>

        {showTaskModal && (
          <TaskModal
            onClose={handleCloseTaskModal}
            onAddTask={handleAddTask}
            selectedDate={selectedDate}
          />
        )}

        {showWeeklyAnalytics && (
          <WeeklyAnalytics
            tasks={tasks}
            onClose={handleCloseWeeklyAnalytics}
          />
        )}

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

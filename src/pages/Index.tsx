import React, { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { TaskDashboard } from "@/components/TaskDashboard";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskModal } from "@/components/TaskModal";
import { QuickPracticeModal } from "@/components/QuickPracticeModal";
import { Celebration } from "@/components/Celebration";
import { DateSelector } from "@/components/DateSelector";
import { ProfileSection } from "@/components/ProfileSection";
import { ProgressOverview } from "@/components/ProgressOverview";
import { IntegratedAnalytics } from "@/components/IntegratedAnalytics";
import { FlipAnalytics } from "@/components/FlipAnalytics";
import { AuthForm } from "@/components/AuthForm";
import { OnboardingQuiz, OnboardingAnswers } from "@/components/OnboardingQuiz";
import { GuidedTour } from "@/components/GuidedTour";
import { ThemeProvider, useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";
import { formatInTimeZone } from "date-fns-tz";
import { BookOpen, Target, Zap, Brain, Trophy, Clock } from "lucide-react";

// Memoized components for better performance
const MemoizedHeader = React.memo(Header);
const MemoizedProfileSection = React.memo(ProfileSection);
const MemoizedDateSelector = React.memo(DateSelector);
const MemoizedTaskDashboard = React.memo(TaskDashboard);
const MemoizedProgressOverview = React.memo(ProgressOverview);
const MemoizedTaskAnalytics = React.memo(TaskAnalytics);

// JEE Motivational Banner Component
const JEEMotivationBanner = () => {
  const quotes = [
    { text: "Success is the sum of small efforts, repeated day in and day out", emoji: "💪" },
    { text: "If you want to shine like the sun, first burn like a sun", emoji: "🔥" },
    { text: "It always seems impossible until it's done", emoji: "🎯" },
    { text: "Don't watch the clock; do what it does — keep going", emoji: "⏰" },
    { text: "Your limitation—it's only your imagination", emoji: "🚀" }
  ];
  
  const [currentQuote, setCurrentQuote] = useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative mb-8">
      <div 
        className="bg-yellow-300 border-4 border-black p-6 transform rotate-[-0.5deg] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        style={{ transition: 'all 0.3s ease' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{quotes[currentQuote].emoji}</span>
          <div className="flex-1">
            <p className="text-black font-bold text-lg md:text-xl leading-tight">
              {quotes[currentQuote].text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Tips Component
const QuickJEETips = () => {
  const tips = [
    { icon: <Brain className="w-6 h-6" />, title: "Peak Hours Matter", desc: "Study complex topics in the morning when your mind is fresh", color: "bg-pink-400" },
    { icon: <Clock className="w-6 h-6" />, title: "2-Hour Rule", desc: "Take a 15-min break after every 2 hours of intense study", color: "bg-cyan-400" },
    { icon: <Target className="w-6 h-6" />, title: "Daily Targets", desc: "Small daily wins > Last-minute cramming. Consistency is key!", color: "bg-lime-400" },
    { icon: <BookOpen className="w-6 h-6" />, title: "Balance PCM", desc: "Rotate subjects daily to keep your mind engaged and fresh", color: "bg-purple-400" },
  ];
  
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-black mb-6 text-black transform -rotate-1">
        QUICK TIPS FOR YOU 📚
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className={`${tip.color} border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200`}
            style={{ transform: `rotate(${idx % 2 === 0 ? '-0.5deg' : '0.5deg'})` }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-white border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {tip.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-lg mb-1">{tip.title}</h3>
                <p className="text-sm font-semibold text-black/80">{tip.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Relatable Stats Component
const RelatableStats = ({ tasks }: { tasks: any[] }) => {
  const completedToday = tasks.filter(t => t.completed && 
    new Date(t.scheduled_date).toDateString() === new Date().toDateString()
  ).length;
  
  const stats = [
    { label: "Tasks Done Today", value: completedToday, suffix: "", color: "bg-green-400" },
    { label: "You're Ahead of", value: "65", suffix: "%", color: "bg-orange-400" },
    { label: "Study Streak", value: "12", suffix: " days", color: "bg-blue-400" },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`${stat.color} border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
          style={{ transform: `rotate(${idx === 1 ? '0deg' : idx === 0 ? '-1deg' : '1deg'})` }}
        >
          <div className="text-4xl font-black mb-2">{stat.value}{stat.suffix}</div>
          <div className="text-sm font-bold uppercase tracking-wide">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const IndexContent = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [isAnalyticsFlipped, setIsAnalyticsFlipped] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { user, loading: authLoading, updateUserMetadata, isOnboardingCompleted } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { theme } = useTheme();

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
  const handleOpenPracticeModal = useCallback(() => setShowPracticeModal(true), []);
  const handleClosePracticeModal = useCallback(() => setShowPracticeModal(false), []);
  const handleToggleAnalyticsFlip = useCallback(() => setIsAnalyticsFlipped(!isAnalyticsFlipped), [isAnalyticsFlipped]);
  

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

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-black"></div>
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
        <div className="min-h-screen bg-white">
          <div className="relative z-10">
            <MemoizedHeader onAddTask={handleOpenTaskModal} />
            
            <main className="container mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
              <MemoizedProfileSection />
              
              <MemoizedDateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onAddTask={handleOpenTaskModal}
                onLogPractice={handleOpenPracticeModal}
              />
              
              {!isAnalyticsFlipped ? (
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
                    <IntegratedAnalytics tasks={tasks} selectedDate={selectedDate} />
                  </div>
                </div>
              ) : null}
              
              <FlipAnalytics 
                tasks={tasks}
                isFlipped={isAnalyticsFlipped}
                onToggleFlip={handleToggleAnalyticsFlip}
              />
            </main>
          </div>
        </div>
        
        <GuidedTour onComplete={handleGuidedTourComplete} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Neo-Brutalism Pattern Background */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, black 10px, black 11px)`
        }}></div>
      </div>
      
      <div className="relative z-10">
        <MemoizedHeader onAddTask={handleOpenTaskModal} />
        
        <main className="container mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
          <MemoizedProfileSection />
          
          {/* JEE Motivation Banner */}
          <JEEMotivationBanner />
          
          {/* Relatable Stats */}
          <RelatableStats tasks={tasks} />
          
          <MemoizedDateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddTask={handleOpenTaskModal}
            onLogPractice={handleOpenPracticeModal}
          />
          
          {/* Quick Tips Section */}
          <QuickJEETips />
          
          {!isAnalyticsFlipped ? (
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
                <IntegratedAnalytics tasks={tasks} selectedDate={selectedDate} />
              </div>
            </div>
          ) : null}
          
          <FlipAnalytics 
            tasks={tasks}
            isFlipped={isAnalyticsFlipped}
            onToggleFlip={handleToggleAnalyticsFlip}
          />
        </main>

        {showTaskModal && (
          <TaskModal
            onClose={handleCloseTaskModal}
            onAddTask={handleAddTask}
            selectedDate={selectedDate}
          />
        )}

        {showPracticeModal && (
          <QuickPracticeModal
            open={showPracticeModal}
            onClose={handleClosePracticeModal}
            selectedDate={selectedDate}
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

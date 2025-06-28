
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { useTasks } from '@/hooks/useTasks';
import { 
  X, 
  ArrowRight, 
  Calendar, 
  Plus, 
  BarChart3, 
  Target, 
  Clock,
  CheckCircle,
  Lightbulb,
  Trophy,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MousePointer,
  Eye,
  TrendingUp,
  User,
  Settings,
  PlayCircle,
  BookOpen,
  Zap,
  Star,
  Heart
} from 'lucide-react';

interface GuidedTourProps {
  onComplete: () => void;
}

export const GuidedTour = ({ onComplete }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [demoTaskCreated, setDemoTaskCreated] = useState(false);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const { addTask } = useTasks();

  // Create demo task for walkthrough
  const createDemoTask = async () => {
    if (!demoTaskCreated) {
      try {
        await addTask({
          title: "Demo Task: Learn React Basics",
          description: "This is a demo task to show you how tasks work!",
          subject: "Computer Science",
          chapter: "React Fundamentals",
          priority: 'high' as const,
          duration: 30,
          completed: false,
          scheduled_date: new Date().toISOString().split('T')[0]
        });
        setDemoTaskCreated(true);
      } catch (error) {
        console.log('Demo task creation skipped');
      }
    }
  };

  const tourSteps = [
    {
      title: "🎉 Welcome to Exam Ace!",
      subtitle: "Your Ultimate Study Companion",
      description: "Transform your exam preparation with smart features designed for academic success. Let's explore everything step by step!",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      highlight: "",
      features: [
        "📅 Smart calendar-based study scheduling",
        "📊 Real-time progress tracking & analytics", 
        "🎯 Intelligent goal management system",
        "💪 Daily motivation & quote inspiration",
        "🔍 Deep insights with weekly performance reports",
        "🏆 Achievement tracking with study streaks"
      ],
      action: "Ready to become an exam ace?",
      mobile: "Swipe up to continue on mobile!"
    },
    {
      title: "📅 Master Your Schedule",
      subtitle: "Plan Like a Pro",
      description: "Your calendar is the heart of exam preparation. Click dates to schedule study sessions and stay organized!",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      highlight: "calendar-section",
      tip: "💡 Pro Strategy: Plan your entire week every Sunday morning for maximum productivity!",
      walkthrough: [
        "📍 Click on any date in the calendar view",
        "👀 See all your scheduled tasks for that day",
        "⬅️➡️ Use navigation arrows to browse months",
        "✨ Today's date is always highlighted in blue",
        "📱 Swipe left/right on mobile to navigate"
      ],
      mobileNotes: "On mobile: Tap dates and swipe to navigate months easily!"
    },
    {
      title: "➕ Create Powerful Tasks",
      subtitle: "Build Your Study Plan",
      description: "Let's create your first task! Click 'Add Task' to build detailed study sessions with subjects, priorities, and time estimates.",
      icon: Plus,
      color: "from-green-500 to-emerald-500",
      highlight: "add-task-button",
      tip: "🧠 Study Science: Break large topics into 25-45 minute focused sessions for better retention!",
      walkthrough: [
        "🎯 Click the 'Add Task' button (we'll try this now!)",
        "✍️ Fill in task title and select subject",
        "🔥 Set priority: High (urgent), Medium, or Low",
        "⏱️ Add estimated duration for time tracking",
        "📅 Choose the perfect date for your study session"
      ],
      interactive: true,
      action: "Try it now!",
      mobileNotes: "Task creation form is fully optimized for mobile input!"
    },
    {
      title: "📋 Smart Task Management", 
      subtitle: "Stay Organized Effortlessly",
      description: "Your tasks are beautifully organized by subject with visual priority indicators. Complete, edit, move, or delete tasks with simple actions.",
      icon: CheckCircle,
      color: "from-indigo-500 to-purple-500",
      highlight: "task-list",
      tip: "🎯 Focus Formula: Red borders = High priority. Always tackle these first for maximum impact!",
      walkthrough: [
        "✅ Click the circle icon to mark tasks complete",
        "✏️ Use the edit button to modify any task details",
        "📅 Move tasks to different dates with one click",
        "🗑️ Delete completed or unnecessary tasks",
        "🌈 Notice the priority color coding system"
      ],
      mobileNotes: "All task actions are touch-optimized with clear, large buttons!"
    },
    {
      title: "📊 Track Your Progress",
      subtitle: "See Your Success",
      description: "Monitor your daily completion rates, subject performance, and study consistency. Visual progress tracking keeps you motivated!",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      highlight: "progress-overview",
      tip: "📈 Success Benchmark: Aim for 80%+ daily completion rate to ace your exams!",
      walkthrough: [
        "📊 View your daily progress percentage",
        "📚 Check subject-wise completion statistics",
        "🔥 Monitor your current study streak",
        "📅 Track weekly consistency patterns",
        "💪 Identify your strongest performing subjects"
      ],
      mobileNotes: "Progress cards stack vertically on mobile for easy viewing!"
    },
    {
      title: "🔍 Deep Analytics & Insights",
      subtitle: "Optimize Your Strategy", 
      description: "Unlock powerful insights about your study patterns. Track subject mastery, weekly trends, and get personalized recommendations!",
      icon: TrendingUp,
      color: "from-violet-500 to-purple-500",
      highlight: "analytics-section",
      tip: "🎯 Smart Strategy: Use analytics to identify weak subjects and adjust your study plan accordingly!",
      walkthrough: [
        "📈 Review detailed subject mastery percentages",
        "📊 Analyze weekly completion trend graphs",
        "🔍 Click 'Weekly Analytics' for deep insights",
        "💡 Get AI-powered study recommendations",
        "📚 Track total time spent per subject"
      ],
      mobileNotes: "Analytics charts are responsive and touch-friendly on mobile!"
    },
    {
      title: "💪 Daily Motivation Hub",
      subtitle: "Stay Inspired & Focused",
      description: "Fuel your motivation with daily inspirational quotes, achievement tracking, and progress celebrations. Keep your energy high!",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      highlight: "motivation-section", 
      tip: "🌟 Mindset Magic: Read your daily quote each morning to set a positive tone for studying!",
      walkthrough: [
        "📖 Read fresh daily motivational quotes",
        "🔥 Check your current study streak count",
        "🏆 View total completed tasks achievement",
        "🎉 Celebrate milestones with fun animations",
        "💪 Stay mentally strong and focused"
      ],
      mobileNotes: "Motivation section is perfectly sized for mobile inspiration!"
    },
    {
      title: "👤 Personalize Your Profile",
      subtitle: "Make It Yours",
      description: "Customize your profile picture to match your personality! Click your avatar to change or refresh it anytime.",
      icon: User,
      color: "from-blue-500 to-purple-500",
      highlight: "profile-section",
      tip: "🎨 Personal Touch: A custom avatar makes your study space feel more engaging and personal!",
      walkthrough: [
        "👆 Click on your profile picture",
        "🎨 Choose 'Change Avatar' for style options",
        "🔄 Click 'Refresh' for a random new avatar",
        "✨ See your new avatar across the entire app",
        "🌟 Express your unique study personality"
      ],
      mobileNotes: "Avatar selection is touch-optimized with large, clear options!"
    },
    {
      title: "🚀 You're Ready to Excel!",
      subtitle: "Begin Your Success Journey",
      description: "Congratulations! You now have all the tools and knowledge to transform your exam preparation. Time to put it all into action!",
      icon: Sparkles,
      color: "from-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
      highlight: "",
      cta: "Start Your Academic Success Journey! 🎓",
      finalTips: [
        "🎯 Set 3-5 realistic daily study goals",
        "📅 Dedicate Sundays to weekly planning",
        "🍅 Use 25-minute focused study blocks (Pomodoro)",
        "📊 Review your analytics every Friday",
        "🏆 Celebrate every achievement, big or small",
        "💪 Consistency beats perfection - keep going!"
      ],
      mobileNotes: "All features work seamlessly across desktop, tablet, and mobile!"
    }
  ];

  const currentStepData = tourSteps[currentStep];

  const handleNext = async () => {
    // Create demo task at the appropriate step
    if (currentStep === 2 && currentStepData.interactive) {
      await createDemoTask();
    }
    
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-hidden">
      {/* Mobile-optimized overlay */}
      <div className="h-full overflow-y-auto flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-4 relative border border-gray-200 my-4 sm:my-8 animate-scale-in max-h-[95vh] flex flex-col">
          
          {/* Skip button - Mobile optimized */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Fixed Header - Mobile optimized */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200 flex-shrink-0">
            <div className="text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${currentStepData.color} rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl animate-bounce-in`}>
                  <currentStepData.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                {currentStepData.title}
              </h3>
              
              {currentStepData.subtitle && (
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-2 sm:mb-3">
                  {currentStepData.subtitle}
                </p>
              )}

              {currentStepData.highlight && (
                <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                  <MousePointer className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium text-blue-600 animate-pulse">
                    Look for the highlighted area
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Progress - Mobile optimized */}
            <div className="mt-4 sm:mt-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
                <span className="text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 rounded-full">
                  {Math.round(((currentStep + 1) / tourSteps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div 
                  className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-700 ease-out rounded-full relative overflow-hidden`}
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content - Mobile optimized */}
          <ScrollArea className="flex-1 max-h-[50vh] sm:max-h-[55vh]">
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {currentStepData.description}
              </p>

              {/* Features List - Mobile optimized */}
              {currentStepData.features && (
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {currentStepData.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-2 sm:p-3 animate-fade-in"
                         style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Demo Section */}
              {currentStepData.interactive && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-green-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Interactive Demo:
                  </h4>
                  <p className="text-xs sm:text-sm text-green-700 mb-3">
                    {demoTaskCreated ? 
                      "✅ Demo task created! Check your task list to see how it works." :
                      "We'll create a demo task to show you the process!"
                    }
                  </p>
                  {currentStepData.action && !demoTaskCreated && (
                    <Button 
                      onClick={createDemoTask}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {currentStepData.action}
                    </Button>
                  )}
                </div>
              )}

              {/* Walkthrough Steps - Mobile optimized */}
              {currentStepData.walkthrough && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Try This:
                  </h4>
                  <ol className="space-y-1 sm:space-y-2">
                    {currentStepData.walkthrough.map((step, index) => (
                      <li key={index} className="flex items-start text-xs sm:text-sm text-blue-700">
                        <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-semibold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Mobile Notes */}
              {currentStepData.mobileNotes && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 sm:p-4 sm:hidden">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center text-sm">
                    📱 Mobile Tips:
                  </h4>
                  <p className="text-xs text-purple-700">{currentStepData.mobileNotes}</p>
                </div>
              )}

              {/* Tip - Mobile optimized */}
              {currentStepData.tip && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 sm:p-4 animate-wiggle">
                  <div className="flex items-start">
                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-700 font-medium">{currentStepData.tip}</p>
                  </div>
                </div>
              )}

              {/* Final Tips - Mobile optimized */}
              {currentStepData.finalTips && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-green-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Success Tips:
                  </h4>
                  <div className="grid grid-cols-1 gap-1 sm:gap-2">
                    {currentStepData.finalTips.map((tip, index) => (
                      <div key={index} className="text-xs sm:text-sm text-green-700 animate-fade-in"
                           style={{ animationDelay: `${index * 150}ms` }}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action - Mobile optimized */}
              {currentStepData.cta && (
                <div className="text-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-xl p-4 sm:p-6">
                  <div className="animate-bounce-in">
                    <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-2 sm:mb-3" />
                    <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-1 sm:mb-2">
                      {currentStepData.cta}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Ready to start your exam preparation journey?</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Fixed Footer - Mobile optimized */}
          <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-200 bg-gray-50/50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 disabled:opacity-50 hover:bg-gray-100 text-xs sm:text-sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-2 sm:space-x-3">
                {currentStep < tourSteps.length - 1 && (
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm"
                  >
                    Skip Tour
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  size="sm"
                  className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 text-white font-semibold px-3 sm:px-6 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm`}
                >
                  <span>{currentStep === tourSteps.length - 1 ? "Start Studying!" : "Next"}</span>
                  {currentStep === tourSteps.length - 1 ? 
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" /> : 
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

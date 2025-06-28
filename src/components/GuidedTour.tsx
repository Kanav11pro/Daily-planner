
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
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
  Settings
} from 'lucide-react';

interface GuidedTourProps {
  onComplete: () => void;
}

export const GuidedTour = ({ onComplete }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const tourSteps = [
    {
      title: "Welcome to Your Study Command Center! 🎯",
      description: "Let's take a comprehensive tour of Exam Ace - your ultimate study companion designed to boost your exam preparation with smart features and insights!",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      highlight: "",
      features: [
        "📅 Smart study scheduling with calendar integration",
        "📊 Advanced progress tracking with insights",
        "🎯 Goal management with priority levels",
        "💪 Motivation system with daily quotes",
        "🔍 Weekly analytics with performance insights",
        "🏆 Achievement tracking and streaks"
      ],
      action: "Ready to explore? Let's dive in!"
    },
    {
      title: "📅 Master Your Study Schedule",
      description: "The calendar is your command center. Click on any date to plan your study sessions. You can schedule tasks for today, tomorrow, or any future date to stay organized!",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      highlight: "date-selector",
      tip: "💡 Pro Tip: Plan your week ahead every Sunday for maximum productivity!",
      walkthrough: [
        "Click on any date in the calendar",
        "See your scheduled tasks for that day",
        "Use the navigation arrows to browse months",
        "Notice today's date is highlighted"
      ]
    },
    {
      title: "➕ Create Powerful Study Tasks",
      description: "Click the 'Add Task' button to create detailed study tasks. Set subjects, chapters, priority levels, estimated duration, and specific dates!",
      icon: Plus,
      color: "from-green-500 to-emerald-500",
      highlight: "add-task-button",
      tip: "🚀 Study Hack: Break large topics into 25-30 minute focused sessions!",
      walkthrough: [
        "Click the 'Add Task' button anywhere",
        "Fill in the task title and subject",
        "Set priority: High, Medium, or Low",
        "Add estimated duration for time tracking",
        "Choose the date for your study session"
      ]
    },
    {
      title: "📋 Smart Task Management",
      description: "Your tasks are intelligently organized by subject with visual priority indicators. Complete tasks by clicking the circle, and use action buttons to edit, move, or delete tasks easily.",
      icon: CheckCircle,
      color: "from-indigo-500 to-purple-500",
      highlight: "task-list",
      tip: "⭐ Focus Tip: High priority tasks have red borders - tackle these first!",
      walkthrough: [
        "Click the circle to mark tasks complete",
        "Use the edit button to modify task details",
        "Move tasks to different dates easily",
        "Delete completed or unnecessary tasks",
        "Notice priority color coding"
      ]
    },
    {
      title: "📊 Track Your Progress",
      description: "The progress overview shows your daily completion rates, subject-wise statistics, and study streaks. Monitor your consistency and identify areas for improvement!",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      highlight: "progress-overview",
      tip: "📈 Success Metric: Aim for 80%+ daily completion rate!",
      walkthrough: [
        "View your daily progress percentage",
        "See subject-wise completion rates",
        "Track your study streak",
        "Monitor weekly consistency",
        "Identify your strongest subjects"
      ]
    },
    {
      title: "🔍 Advanced Analytics & Insights",
      description: "Dive deep into your study patterns with subject mastery tracking, weekly performance trends, and personalized recommendations to optimize your preparation!",
      icon: TrendingUp,
      color: "from-violet-500 to-purple-500",
      highlight: "analytics-section",
      tip: "🎯 Insight: Use analytics to identify weak subjects and adjust your study plan!",
      walkthrough: [
        "Check subject mastery percentages",
        "View weekly completion trends",
        "Click 'Weekly Analytics' for detailed insights",
        "Get personalized study recommendations",
        "Track time spent per subject"
      ]
    },
    {
      title: "💪 Stay Motivated Daily",
      description: "Get inspired with daily motivational quotes, track your achievements, and celebrate your progress. The motivation section keeps you energized throughout your journey!",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500",
      highlight: "motivation-section",
      tip: "🌟 Mindset: Celebrate small wins - they lead to big victories!",
      walkthrough: [
        "Read daily motivational quotes",
        "See your current study streak",
        "Track completed tasks count",
        "Celebrate achievements with animations",
        "Stay positive and focused"
      ]
    },
    {
      title: "👤 Personalize Your Profile",
      description: "Click on your profile picture to customize it! You can refresh it to get a new avatar that matches your personality. Make your study space truly yours!",
      icon: User,
      color: "from-pink-500 to-rose-500",
      highlight: "profile-section",
      tip: "🎨 Tip: A personalized profile makes your study app feel more engaging!",
      walkthrough: [
        "Click on your profile picture",
        "Choose 'Change Avatar' for a new look",
        "Or click 'Refresh' for a random avatar",
        "Your profile reflects across the app",
        "Express your unique study style"
      ]
    },
    {
      title: "🚀 You're Ready to Excel!",
      description: "Congratulations! You now have all the tools and knowledge to ace your exams. Start by adding your first study task and begin your journey to academic success!",
      icon: Sparkles,
      color: "from-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
      highlight: "",
      cta: "Start Your Success Journey! 🎓",
      finalTips: [
        "🎯 Set realistic daily goals",
        "📅 Plan your week every Sunday",
        "⏰ Use 25-minute focused study sessions",
        "📊 Review your analytics weekly",
        "🏆 Celebrate your achievements"
      ]
    }
  ];

  const currentStepData = tourSteps[currentStep];

  const handleNext = () => {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden">
      {/* Highlight overlay for specific elements */}
      {currentStepData.highlight && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            <div className={`absolute animate-pulse bg-blue-400/20 rounded-lg border-2 border-blue-400 shadow-lg shadow-blue-400/50`} 
                 style={{
                   // This would need to be dynamically positioned based on the highlighted element
                   // For now, we'll use a general highlighting approach
                 }}>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen overflow-y-auto flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 relative border border-gray-200 my-8 animate-scale-in">
          
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Fixed Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center shadow-xl animate-bounce-in`}>
                  <currentStepData.icon className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                {currentStepData.title}
              </h3>
              {currentStepData.highlight && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <MousePointer className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 animate-pulse">
                    Look for the highlighted area
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {Math.round(((currentStep + 1) / tourSteps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-700 ease-out rounded-full relative overflow-hidden`}
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="max-h-[55vh] p-6 sm:p-8">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentStepData.description}
              </p>

              {/* Features List */}
              {currentStepData.features && (
                <div className="grid grid-cols-1 gap-3">
                  {currentStepData.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-3 animate-fade-in"
                         style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Walkthrough Steps */}
              {currentStepData.walkthrough && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Try This:
                  </h4>
                  <ol className="space-y-2">
                    {currentStepData.walkthrough.map((step, index) => (
                      <li key={index} className="flex items-start text-sm text-blue-700">
                        <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tip */}
              {currentStepData.tip && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 animate-wiggle">
                  <div className="flex items-start">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 font-medium">{currentStepData.tip}</p>
                  </div>
                </div>
              )}

              {/* Final Tips */}
              {currentStepData.finalTips && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Success Tips:
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {currentStepData.finalTips.map((tip, index) => (
                      <div key={index} className="text-sm text-green-700 animate-fade-in"
                           style={{ animationDelay: `${index * 150}ms` }}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              {currentStepData.cta && (
                <div className="text-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-xl p-6">
                  <div className="animate-bounce-in">
                    <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                      {currentStepData.cta}
                    </p>
                    <p className="text-sm text-gray-600">Ready to start your exam preparation journey?</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Fixed Footer */}
          <div className="p-6 sm:p-8 border-t border-gray-200 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center space-x-2 disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-3">
                {currentStep < tourSteps.length - 1 && (
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Skip Tour
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 text-white font-semibold px-6 shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  <span>{currentStep === tourSteps.length - 1 ? "Start Studying!" : "Next"}</span>
                  {currentStep === tourSteps.length - 1 ? 
                    <Sparkles className="h-4 w-4 ml-2" /> : 
                    <ChevronRight className="h-4 w-4 ml-2" />
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


import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  ChevronLeft
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
      description: "Let's take a quick tour of Exam Ace - your ultimate study companion designed to boost your exam preparation!",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      highlight: "",
      features: [
        "📅 Smart study scheduling",
        "📊 Progress tracking",
        "🎯 Goal management",
        "💪 Motivation system"
      ]
    },
    {
      title: "📅 Date Selection & Planning",
      description: "Use the calendar to select any date and plan your study sessions. You can schedule tasks for today, tomorrow, or any future date!",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      highlight: "date-selector",
      tip: "💡 Tip: Plan your week ahead for better preparation!"
    },
    {
      title: "➕ Adding Study Tasks",
      description: "Click the 'Add Task' button to create new study tasks. You can set subjects, chapters, priority levels, and estimated time!",
      icon: Plus,
      color: "from-green-500 to-emerald-500",
      highlight: "add-task-button",
      tip: "🚀 Pro Tip: Break large topics into smaller, manageable tasks!"
    },
    {
      title: "📋 Task Management",
      description: "Your tasks are organized by subject with priority indicators. Complete tasks by clicking the circle, and use action buttons to edit, move, or delete tasks.",
      icon: CheckCircle,
      color: "from-indigo-500 to-purple-500",
      highlight: "task-list",
      tip: "⭐ Tip: High priority tasks are highlighted with red borders!"
    },
    {
      title: "📊 Analytics & Progress",
      description: "Track your study progress with detailed analytics. See completion rates, subject-wise distribution, and weekly performance trends!",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      highlight: "analytics-section",
      tip: "📈 Monitor your consistency for better results!"
    },
    {
      title: "🎯 Daily Motivation",
      description: "Get inspired with daily motivational quotes and track your achievements. Stay motivated throughout your exam preparation journey!",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500",
      highlight: "motivation-section",
      tip: "💪 Remember: Consistency beats intensity!"
    },
    {
      title: "You're All Set! 🚀",
      description: "You're now ready to ace your exams! Start by adding your first study task and begin your journey to success.",
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
      highlight: "",
      cta: "Start Planning Your Success! 🎓"
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Highlight overlay */}
      {currentStepData.highlight && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute bg-white/20 border-4 border-yellow-400 rounded-lg animate-pulse"
            style={{
              // This would need to be dynamically positioned based on the highlighted element
              // For now, we'll just show the modal without specific highlighting
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-4 relative animate-scale-in border border-gray-200">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center animate-wiggle shadow-lg`}>
              <currentStepData.icon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {currentStepData.title}
          </h3>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(((currentStep + 1) / tourSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-500 ease-out rounded-full`}
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 leading-relaxed mb-4">
            {currentStepData.description}
          </p>

          {currentStepData.features && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          {currentStepData.tip && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-700">
              {currentStepData.tip}
            </div>
          )}

          {currentStepData.cta && (
            <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mt-4">
              <p className="text-lg font-semibold text-indigo-700 mb-2">{currentStepData.cta}</p>
              <p className="text-sm text-gray-600">Ready to start your exam preparation journey?</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center space-x-2 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            {currentStep < tourSteps.length - 1 && (
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                Skip Tour
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 hover:scale-105 text-white font-semibold px-6`}
            >
              <span>{currentStep === tourSteps.length - 1 ? "Get Started!" : "Next"}</span>
              {currentStep === tourSteps.length - 1 ? 
                <Trophy className="h-4 w-4 ml-2" /> : 
                <ChevronRight className="h-4 w-4 ml-2" />
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

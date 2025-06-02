
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Brain,
  Timer,
  Heart,
  Calculator,
  Microscope,
  Users,
  Trophy
} from 'lucide-react';

interface OnboardingQuizProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

export interface OnboardingAnswers {
  exam: string;
  examOther?: string;
  institute: string;
  instituteOther?: string;
  studyHours: string;
  challenge: string;
}

export const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const steps = [
    {
      id: 1,
      title: "🎯 Which exam are you preparing for?",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "🏫 From which institute are you preparing?",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "⏰ How many hours can you study per day?",
      icon: Clock,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "💪 What's your biggest current challenge?",
      icon: Brain,
      color: "from-orange-500 to-red-500"
    }
  ];

  const examOptions = [
    { value: "IIT-JEE", label: "IIT-JEE", icon: Calculator, emoji: "🧮" },
    { value: "NEET", label: "NEET", icon: Microscope, emoji: "🔬" },
    { value: "Class-10 Board", label: "Class-10 Board", icon: BookOpen, emoji: "📚" },
    { value: "Class 9", label: "Class 9", icon: GraduationCap, emoji: "🎓" },
    { value: "Other", label: "Other (Specify)", icon: Sparkles, emoji: "✨" }
  ];

  const instituteOptions = [
    { value: "Allen", label: "Allen", emoji: "🏆" },
    { value: "Aakash", label: "Aakash", emoji: "⭐" },
    { value: "Physics Wallah", label: "Physics Wallah", emoji: "🚀" },
    { value: "eSaral", label: "eSaral", emoji: "💡" },
    { value: "Next Toppers", label: "Next Toppers", emoji: "🎯" },
    { value: "Self-Study", label: "Self-Study", emoji: "📖" },
    { value: "Others", label: "Others (Specify)", emoji: "🌟" }
  ];

  const studyHoursOptions = [
    { value: "Less than 2 hours", label: "Less than 2 hours", emoji: "⏰" },
    { value: "2–4 hours", label: "2–4 hours", emoji: "📅" },
    { value: "4–6 hours", label: "4–6 hours", emoji: "💪" },
    { value: "More than 6 hours", label: "More than 6 hours", emoji: "🔥" }
  ];

  const challengeOptions = [
    { value: "Time management", label: "Time management", emoji: "⏰", icon: Timer },
    { value: "Memorizing formulas", label: "Memorizing formulas", emoji: "🧠", icon: Brain },
    { value: "Problem-solving speed", label: "Problem-solving speed", emoji: "⚡", icon: Timer },
    { value: "Staying motivated", label: "Staying motivated", emoji: "❤️", icon: Heart }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers as OnboardingAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return answers.exam && (answers.exam !== "Other" || answers.examOther);
      case 2:
        return answers.institute && (answers.institute !== "Others" || answers.instituteOther);
      case 3:
        return answers.studyHours;
      case 4:
        return answers.challenge;
      default:
        return false;
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 z-50">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/15 to-violet-500/15 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Container - Full height with proper scrolling */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 sm:p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                  <currentStepData.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to Exam Ace! 🚀
            </h2>
            <p className="text-sm sm:text-base text-gray-600">Let's personalize your study experience</p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
              <span className="text-xs sm:text-sm font-medium text-indigo-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-500 ease-out rounded-full`}
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white text-center mb-6 sm:mb-8">
              {currentStepData.title}
            </h3>

            <div className="space-y-4">
              {/* Step 1: Exam Selection */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <RadioGroup 
                    value={answers.exam} 
                    onValueChange={(value) => setAnswers({...answers, exam: value})}
                    className="space-y-3"
                  >
                    {examOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl border-2 border-white/20 hover:border-indigo-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <RadioGroupItem value={option.value} id={option.value} className="border-white/50 text-white" />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-xl sm:text-2xl">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-indigo-200 transition-colors text-sm sm:text-base">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {answers.exam === "Other" && (
                    <div className="mt-4">
                      <Input
                        placeholder="Please specify your exam"
                        value={answers.examOther || ""}
                        onChange={(e) => setAnswers({...answers, examOther: e.target.value})}
                        className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:border-indigo-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Institute Selection */}
              {currentStep === 2 && (
                <div className="space-y-3">
                  <RadioGroup 
                    value={answers.institute} 
                    onValueChange={(value) => setAnswers({...answers, institute: value})}
                    className="space-y-3"
                  >
                    {instituteOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl border-2 border-white/20 hover:border-purple-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <RadioGroupItem value={option.value} id={option.value} className="border-white/50 text-white" />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-xl sm:text-2xl">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-purple-200 transition-colors text-sm sm:text-base">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {answers.institute === "Others" && (
                    <div className="mt-4">
                      <Input
                        placeholder="Please specify your institute"
                        value={answers.instituteOther || ""}
                        onChange={(e) => setAnswers({...answers, instituteOther: e.target.value})}
                        className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:border-purple-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Study Hours */}
              {currentStep === 3 && (
                <div className="space-y-3">
                  <RadioGroup 
                    value={answers.studyHours} 
                    onValueChange={(value) => setAnswers({...answers, studyHours: value})}
                    className="space-y-3"
                  >
                    {studyHoursOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl border-2 border-white/20 hover:border-green-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <RadioGroupItem value={option.value} id={option.value} className="border-white/50 text-white" />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-xl sm:text-2xl">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-green-200 transition-colors text-sm sm:text-base">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: Challenge Selection */}
              {currentStep === 4 && (
                <div className="space-y-3">
                  <RadioGroup 
                    value={answers.challenge} 
                    onValueChange={(value) => setAnswers({...answers, challenge: value})}
                    className="space-y-3"
                  >
                    {challengeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl border-2 border-white/20 hover:border-orange-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <RadioGroupItem value={option.value} id={option.value} className="border-white/50 text-white" />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-xl sm:text-2xl">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-orange-200 transition-colors text-sm sm:text-base">{option.label}</span>
                          <option.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/40 group-hover:text-orange-200 transition-colors" />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between max-w-2xl mx-auto">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center space-x-2 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 text-white font-semibold px-4 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{currentStep === 4 ? "Complete Setup" : "Next"}</span>
              {currentStep === 4 ? <Trophy className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

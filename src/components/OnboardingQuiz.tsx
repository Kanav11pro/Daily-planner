
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
  Zap,
  Trophy,
  Timer,
  Heart,
  Calculator,
  Microscope,
  Users,
  User,
  ArrowRight
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
    { value: "Problem-solving speed", label: "Problem-solving speed", emoji: "⚡", icon: Zap },
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
    <div className="fixed inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 z-50 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Icons */}
        {[BookOpen, Brain, GraduationCap, Target, Zap, Trophy, Sparkles].map((Icon, index) => (
          <div
            key={index}
            className="absolute text-white/10 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Icon size={20 + Math.random() * 30} />
          </div>
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-3xl animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl border border-white/20 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center animate-wiggle shadow-2xl`}>
                  <currentStepData.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to Exam Ace! 🚀
            </h2>
            <p className="text-gray-600">Let's personalize your study experience</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
              <span className="text-sm font-medium text-indigo-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-500 ease-out rounded-full`}
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8 animate-fade-in">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
              {currentStepData.title}
            </h3>

            {/* Step 1: Exam Selection */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <RadioGroup 
                  value={answers.exam} 
                  onValueChange={(value) => setAnswers({...answers, exam: value})}
                  className="space-y-3"
                >
                  {examOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 hover:scale-[1.02] group">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-medium group-hover:text-indigo-600 transition-colors">{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {answers.exam === "Other" && (
                  <div className="mt-4 animate-fade-in">
                    <Input
                      placeholder="Please specify your exam"
                      value={answers.examOther || ""}
                      onChange={(e) => setAnswers({...answers, examOther: e.target.value})}
                      className="border-2 focus:border-indigo-500"
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
                    <div key={option.value} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:scale-[1.02] group">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-medium group-hover:text-purple-600 transition-colors">{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {answers.institute === "Others" && (
                  <div className="mt-4 animate-fade-in">
                    <Input
                      placeholder="Please specify your institute"
                      value={answers.instituteOther || ""}
                      onChange={(e) => setAnswers({...answers, instituteOther: e.target.value})}
                      className="border-2 focus:border-purple-500"
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
                    <div key={option.value} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 hover:scale-[1.02] group">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-medium group-hover:text-green-600 transition-colors">{option.label}</span>
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
                    <div key={option.value} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 hover:scale-[1.02] group">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-medium group-hover:text-orange-600 transition-colors">{option.label}</span>
                        <option.icon className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center space-x-2 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 hover:scale-105 text-white font-semibold px-6 disabled:opacity-50 disabled:cursor-not-allowed`}
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

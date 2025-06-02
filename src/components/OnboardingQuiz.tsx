
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
  challenge: string[];
}

export const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({
    challenge: []
  });
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
      title: "💪 What are your biggest current challenges? (Select all that apply)",
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
    { value: "Time management", label: "Time management", emoji: "⏰" },
    { value: "Memorizing formulas", label: "Memorizing formulas", emoji: "🧠" },
    { value: "Problem-solving speed", label: "Problem-solving speed", emoji: "⚡" },
    { value: "Staying motivated", label: "Staying motivated", emoji: "❤️" },
    { value: "Too much syllabus to cover", label: "Too much syllabus to cover, don't know where to start", emoji: "📚" },
    { value: "Time management - school +- coaching + self-study", label: "Time management – can't balance school + coaching + self-study", emoji: "🕒" },
    { value: "Procrastination", label: "Procrastination / Lack of motivation", emoji: "❌" },
    { value: "Revision and retention", label: "Not able to revise or retain what I study", emoji: "📝" },
    { value: "Low mock test scores", label: "Low mock test scores / poor accuracy", emoji: "📉" },
    { value: "Understanding tough concepts", label: "Can't understand tough concepts / weak in some topics", emoji: "🧠" },
    { value: "Backlogs", label: "Backlogs – couldn't complete previous chapters", emoji: "🔁" },
    { value: "Stress and burnout", label: "Stress, burnout or pressure to perform", emoji: "🤯" },
    { value: "Distractions", label: "Distractions – phone, social media, etc.", emoji: "🛑" },
    { value: "No proper routine", label: "Not able to follow a proper routine / daily plan", emoji: "📆" }
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

  const handleChallengeChange = (challengeValue: string, checked: boolean) => {
    const currentChallenges = answers.challenge || [];
    if (checked) {
      setAnswers({
        ...answers,
        challenge: [...currentChallenges, challengeValue]
      });
    } else {
      setAnswers({
        ...answers,
        challenge: currentChallenges.filter(c => c !== challengeValue)
      });
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
        return answers.challenge && answers.challenge.length > 0;
      default:
        return false;
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 z-50 flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/15 to-violet-500/15 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Container - Using flex to optimize space */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header - Compact on larger screens */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 md:py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center md:justify-between">
              {/* Logo and title */}
              <div className="flex items-center space-x-3">
                <div className="relative hidden md:block">
                  <div className={`w-12 h-12 bg-gradient-to-r ${currentStepData.color} rounded-xl flex items-center justify-center shadow-xl`}>
                    <currentStepData.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to Exam Ace! 🚀
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 hidden md:block">Let's personalize your study experience</p>
                </div>
              </div>
              
              {/* Progress tracker */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-500 ease-out rounded-full`}
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">{Math.round((currentStep / 4) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Mobile Progress Bar - Only show on small screens */}
            <div className="mt-2 md:hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">Step {currentStep} of 4</span>
                <span className="text-xs font-medium text-indigo-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-500 ease-out rounded-full`}
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Expanded flex area */}
        <div className="flex-1 overflow-y-auto py-4 md:py-6">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-xl md:text-2xl font-semibold text-white text-center mb-4 md:mb-6">
              {currentStepData.title}
            </h3>

            <div className="space-y-3">
              {/* Step 1: Exam Selection */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <RadioGroup 
                    value={answers.exam} 
                    onValueChange={(value) => setAnswers({...answers, exam: value})}
                    className="space-y-3"
                  >
                    {examOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-xl border-2 border-white/20 hover:border-indigo-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <RadioGroupItem value={option.value} id={option.value} className="border-white/50 text-white" />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-xl sm:text-2xl">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-indigo-200 transition-colors">{option.label}</span>
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
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-xl border-2 border-white/20 hover:border-purple-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <RadioGroupItem value={option.value} id={option.value} className="border-white/50 text-white" />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-xl sm:text-2xl">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-purple-200 transition-colors">{option.label}</span>
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
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-xl border-2 border-white/20 hover:border-green-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <RadioGroupItem value={option.value} id={option.value} className="border-white/50 text-white" />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-xl sm:text-2xl">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-green-200 transition-colors">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: Challenge Selection */}
              {currentStep === 4 && (
                <div className="space-y-3">
                  <div className="text-center mb-3">
                    <p className="text-sm text-white/80">You can select multiple challenges</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {challengeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-xl border-2 border-white/20 hover:border-orange-300 hover:bg-white/10 transition-all duration-300 group bg-white/5 backdrop-blur-sm">
                        <Checkbox
                          id={option.value}
                          checked={answers.challenge?.includes(option.value) || false}
                          onCheckedChange={(checked) => handleChallengeChange(option.value, checked as boolean)}
                          className="border-white/50 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label htmlFor={option.value} className="flex-1 flex items-center space-x-3 cursor-pointer">
                          <span className="text-lg">{option.emoji}</span>
                          <span className="font-medium text-white group-hover:text-orange-200 transition-colors text-sm">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Compact with fixed height */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4">
          <div className="flex justify-between max-w-4xl mx-auto">
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
              className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 text-white font-semibold px-6 disabled:opacity-50 disabled:cursor-not-allowed`}
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

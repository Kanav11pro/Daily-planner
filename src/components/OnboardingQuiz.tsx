
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OnboardingStep } from './onboarding/OnboardingStep';
import { OnboardingOption } from './onboarding/OnboardingOption';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  Trophy,
  Users,
  Brain
} from 'lucide-react';

export interface OnboardingAnswers {
  exam: string;
  examOther?: string;
  institute: string;
  instituteOther?: string;
  studyHours: string;
  challenge: string[];
}

interface OnboardingQuizProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

const examOptions = [
  { value: "IIT-JEE", label: "IIT-JEE", emoji: "🧮" },
  { value: "NEET", label: "NEET", emoji: "🔬" },
  { value: "Class-10 Board", label: "Class-10 Board", emoji: "📚" },
  { value: "Class 9", label: "Class 9", emoji: "🎓" },
  { value: "Other", label: "Other (Specify)", emoji: "✨" }
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
  { value: "Too much syllabus to cover", label: "Too much syllabus to cover", emoji: "📚" },
  { value: "Time management - school + coaching", label: "Balancing school + coaching", emoji: "🕒" },
  { value: "Procrastination", label: "Procrastination", emoji: "❌" },
  { value: "Revision and retention", label: "Revision and retention", emoji: "📝" },
  { value: "Low mock test scores", label: "Low mock test scores", emoji: "📉" },
  { value: "Understanding tough concepts", label: "Understanding tough concepts", emoji: "🧠" },
  { value: "Backlogs", label: "Backlogs", emoji: "🔁" },
  { value: "Stress and burnout", label: "Stress and burnout", emoji: "🤯" },
  { value: "Distractions", label: "Distractions", emoji: "🛑" },
  { value: "No proper routine", label: "No proper routine", emoji: "📆" }
];

export const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({
    exam: '',
    examOther: '',
    institute: '',
    instituteOther: '',
    studyHours: '',
    challenge: []
  });

  const steps = [
    { icon: Target, title: "🎯 Which exam are you preparing for?", color: "from-blue-500 to-cyan-500" },
    { icon: Users, title: "🏫 Which institute are you studying from?", color: "from-purple-500 to-pink-500" },
    { icon: Clock, title: "⏰ How many hours can you study daily?", color: "from-green-500 to-emerald-500" },
    { icon: Brain, title: "💪 What are your biggest challenges?", color: "from-orange-500 to-red-500" }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Ensure all required fields are filled
      const finalAnswers: OnboardingAnswers = {
        exam: answers.exam || '',
        examOther: answers.examOther || '',
        institute: answers.institute || '',
        instituteOther: answers.instituteOther || '',
        studyHours: answers.studyHours || '',
        challenge: answers.challenge || []
      };
      onComplete(finalAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExamSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, exam: value, examOther: '' }));
  };

  const handleInstituteSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, institute: value, instituteOther: '' }));
  };

  const handleStudyHoursSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, studyHours: value }));
  };

  const handleChallengeChange = (challengeValue: string) => {
    const currentChallenges = answers.challenge || [];
    const isSelected = currentChallenges.includes(challengeValue);
    
    if (isSelected) {
      setAnswers(prev => ({
        ...prev,
        challenge: currentChallenges.filter(c => c !== challengeValue)
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        challenge: [...currentChallenges, challengeValue]
      }));
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return answers.exam && (answers.exam !== "Other" || (answers.examOther && answers.examOther.trim()));
      case 2:
        return answers.institute && (answers.institute !== "Others" || (answers.instituteOther && answers.instituteOther.trim()));
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
    <OnboardingStep
      icon={currentStepData.icon}
      title={currentStepData.title}
      color={currentStepData.color}
      currentStep={currentStep}
      totalSteps={4}
    >
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Step 1: Exam Selection */}
        {currentStep === 1 && (
          <div className="space-y-3">
            {examOptions.map((option) => (
              <OnboardingOption
                key={option.value}
                selected={answers.exam === option.value}
                onClick={() => handleExamSelect(option.value)}
                emoji={option.emoji}
              >
                {option.label}
              </OnboardingOption>
            ))}
            {answers.exam === "Other" && (
              <div className="mt-6">
                <Input
                  placeholder="Please specify your exam"
                  value={answers.examOther || ""}
                  onChange={(e) => setAnswers(prev => ({...prev, examOther: e.target.value}))}
                  className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:border-blue-400 text-lg p-4"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Institute Selection */}
        {currentStep === 2 && (
          <div className="space-y-3">
            {instituteOptions.map((option) => (
              <OnboardingOption
                key={option.value}
                selected={answers.institute === option.value}
                onClick={() => handleInstituteSelect(option.value)}
                emoji={option.emoji}
              >
                {option.label}
              </OnboardingOption>
            ))}
            {answers.institute === "Others" && (
              <div className="mt-6">
                <Input
                  placeholder="Please specify your institute"
                  value={answers.instituteOther || ""}
                  onChange={(e) => setAnswers(prev => ({...prev, instituteOther: e.target.value}))}
                  className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:border-purple-400 text-lg p-4"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Study Hours */}
        {currentStep === 3 && (
          <div className="space-y-3">
            {studyHoursOptions.map((option) => (
              <OnboardingOption
                key={option.value}
                selected={answers.studyHours === option.value}
                onClick={() => handleStudyHoursSelect(option.value)}
                emoji={option.emoji}
              >
                {option.label}
              </OnboardingOption>
            ))}
          </div>
        )}

        {/* Step 4: Challenge Selection */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-white/80 text-lg">Select all that apply to you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challengeOptions.map((option) => (
                <OnboardingOption
                  key={option.value}
                  selected={answers.challenge?.includes(option.value) || false}
                  onClick={() => handleChallengeChange(option.value)}
                  emoji={option.emoji}
                  className="text-sm"
                >
                  {option.label}
                </OnboardingOption>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center space-x-2 disabled:opacity-50 bg-white/10 border-white/30 text-white hover:bg-white/20 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 text-white font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>{currentStep === 4 ? "Complete Setup" : "Next"}</span>
            {currentStep === 4 ? <Trophy className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </OnboardingStep>
  );
};

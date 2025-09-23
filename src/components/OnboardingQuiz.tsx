'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { OnboardingOption } from './onboarding/OnboardingOption'; // not needed anymore
import { OnboardingStep } from './onboarding/OnboardingStep';
import { 
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
  { value: 'IIT-JEE', label: 'IIT-JEE', emoji: '🧮' },
  { value: 'NEET', label: 'NEET', emoji: '🔬' },
  { value: 'Class-10 Board', label: 'Class-10 Board', emoji: '📚' },
  { value: 'Class 9', label: 'Class 9', emoji: '🎓' },
  { value: 'Other', label: 'Other (Specify)', emoji: '✨' }
];

const instituteOptions = [
  { value: 'Allen', label: 'Allen', emoji: '🏆' },
  { value: 'Aakash', label: 'Aakash', emoji: '⭐' },
  { value: 'Physics Wallah', label: 'Physics Wallah', emoji: '🚀' },
  { value: 'eSaral', label: 'eSaral', emoji: '💡' },
  { value: 'Next Toppers', label: 'Next Toppers', emoji: '🎯' },
  { value: 'Self-Study', label: 'Self-Study', emoji: '📖' },
  { value: 'Others', label: 'Others (Specify)', emoji: '🌟' }
];

const studyHoursOptions = [
  { value: 'Less than 2 hours', label: 'Less than 2 hours', emoji: '⏰' },
  { value: '2–4 hours', label: '2–4 hours', emoji: '📅' },
  { value: '4–6 hours', label: '4–6 hours', emoji: '💪' },
  { value: 'More than 6 hours', label: 'More than 6 hours', emoji: '🔥' }
];

const challengeOptions = [
  { value: 'Time management', label: 'Time management', emoji: '⏰' },
  { value: 'Memorizing formulas', label: 'Memorizing formulas', emoji: '🧠' },
  { value: 'Problem-solving speed', label: 'Problem-solving speed', emoji: '⚡' },
  { value: 'Staying motivated', label: 'Staying motivated', emoji: '💪' },
  { value: 'Too much syllabus to cover', label: 'Too much syllabus to cover', emoji: '📚' },
  { value: 'Time management - school + coaching', label: 'Balancing school + coaching', emoji: '🕒' },
  { value: 'Procrastination', label: 'Procrastination', emoji: '🚫' },
  { value: 'Revision and retention', label: 'Revision and retention', emoji: '📝' },
  { value: 'Low mock test scores', label: 'Low mock test scores', emoji: '📉' },
  { value: 'Understanding tough concepts', label: 'Understanding tough concepts', emoji: '🔬' },
  { value: 'Backlogs', label: 'Backlogs', emoji: '🔁' },
  { value: 'Stress and burnout', label: 'Stress and burnout', emoji: '😰' },
  { value: 'Distractions', label: 'Distractions', emoji: '🛑' },
  { value: 'No proper routine', label: 'No proper routine', emoji: '📆' }
];

/**
 * Local, fully interactive option tile
 * Avoids any outside component/overlay issues.
 */
function OptionTile({
  selected,
  onClick,
  emoji,
  children,
  className = ''
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'w-full rounded-xl border-2 px-4 py-4 text-left transition outline-none',
        'bg-white/10 text-white hover:bg-white/15',
        selected ? 'border-white' : 'border-white/30',
        'flex items-center justify-between',
        className
      ].join(' ')}
    >
      <span className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <span className="text-base md:text-lg">{children}</span>
      </span>
      <span
        className={[
          'h-5 w-5 rounded-full border-2',
          selected ? 'bg-white border-white' : 'border-white/50'
        ].join(' ')}
      />
    </button>
  );
}

export const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    exam: '',
    examOther: '',
    institute: '',
    instituteOther: '',
    studyHours: '',
    challenge: []
  });

  const steps = [
    { icon: Target, title: '🎯 Which exam are you preparing for?', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, title: '🏫 Which institute are you studying from?', color: 'from-purple-500 to-pink-500' },
    { icon: Clock, title: '⏰ How many hours can you study daily?', color: 'from-green-500 to-emerald-500' },
    { icon: Brain, title: '💪 What are your biggest challenges?', color: 'from-orange-500 to-red-500' }
  ];

  const isNonEmpty = (s?: string) => !!s && s.trim().length > 0;

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return answers.exam === 'Other'
          ? isNonEmpty(answers.examOther)
          : isNonEmpty(answers.exam);
      case 2:
        return answers.institute === 'Others'
          ? isNonEmpty(answers.instituteOther)
          : isNonEmpty(answers.institute);
      case 3:
        return isNonEmpty(answers.studyHours);
      case 4:
        return Array.isArray(answers.challenge) && answers.challenge.length > 0;
      default:
        return false;
    }
  }, [currentStep, answers]);

  const handleNext = () => {
    if (!canProceed) return;
    if (currentStep < 4) setCurrentStep((s) => s + 1);
    else onComplete(answers);
  };

  const handlePrevious = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleExamSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      exam: value,
      examOther: value === 'Other' ? prev.examOther ?? '' : ''
    }));
  };

  const handleInstituteSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      institute: value,
      instituteOther: value === 'Others' ? prev.instituteOther ?? '' : ''
    }));
  };

  const handleStudyHoursSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, studyHours: value }));
  };

  const handleChallengeChange = (value: string) => {
    setAnswers((prev) => {
      const list = prev.challenge ?? [];
      return list.includes(value)
        ? { ...prev, challenge: list.filter((v) => v !== value) }
        : { ...prev, challenge: [...list, value] };
    });
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
      <div
        className="space-y-4 max-w-2xl mx-auto relative"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && canProceed) handleNext();
        }}
      >
        {/* Step 1: Exam */}
        {currentStep === 1 && (
          <div className="space-y-3">
            {examOptions.map((o) => (
              <OptionTile
                key={o.value}
                selected={answers.exam === o.value}
                onClick={() => handleExamSelect(o.value)}
                emoji={o.emoji}
              >
                {o.label}
              </OptionTile>
            ))}
            {answers.exam === 'Other' && (
              <div className="mt-6">
                <Input
                  placeholder="Please specify your exam"
                  value={answers.examOther ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, examOther: e.target.value }))
                  }
                  className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:border-blue-400 text-lg p-4"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Institute */}
        {currentStep === 2 && (
          <div className="space-y-3">
            {instituteOptions.map((o) => (
              <OptionTile
                key={o.value}
                selected={answers.institute === o.value}
                onClick={() => handleInstituteSelect(o.value)}
                emoji={o.emoji}
              >
                {o.label}
              </OptionTile>
            ))}
            {answers.institute === 'Others' && (
              <div className="mt-6">
                <Input
                  placeholder="Please specify your institute"
                  value={answers.instituteOther ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, instituteOther: e.target.value }))
                  }
                  className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:border-purple-400 text-lg p-4"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Study Hours */}
        {currentStep === 3 && (
          <div className="space-y-3">
            {studyHoursOptions.map((o) => (
              <OptionTile
                key={o.value}
                selected={answers.studyHours === o.value}
                onClick={() => handleStudyHoursSelect(o.value)}
                emoji={o.emoji}
              >
                {o.label}
              </OptionTile>
            ))}
          </div>
        )}

        {/* Step 4: Challenges */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-white/80 text-lg">Select all that apply to you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challengeOptions.map((o) => (
                <OptionTile
                  key={o.value}
                  selected={answers.challenge?.includes(o.value) || false}
                  onClick={() => handleChallengeChange(o.value)}
                  emoji={o.emoji}
                  className="text-sm"
                >
                  {o.label}
                </OptionTile>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8 relative z-10">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center space-x-2 disabled:opacity-50 bg-white/10 border-white/30 text-white hover:bg-white/20 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            aria-disabled={!canProceed}
            className={`bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-all duration-300 text-white font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>{currentStep === 4 ? 'Complete Setup' : 'Next'}</span>
            {currentStep === 4 ? <Trophy className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </OnboardingStep>
  );
};

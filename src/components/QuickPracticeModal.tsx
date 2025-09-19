import { useState } from "react";
import { X, ChevronRight, ChevronLeft, BookOpen, Target, Gauge, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { usePractice } from "@/hooks/usePractice";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { toast } from "sonner";

interface QuickPracticeModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSessionComplete?: () => void;
}

const subjects = [
  { name: 'Physics', icon: '⚡' },
  { name: 'Chemistry', icon: '🧪' },
  { name: 'Mathematics', icon: '📐' }
];

const subjectsWithChapters = {
  Physics: [
    'Mathematics in Physics', 'Units and Dimensions', 'Motion In One Dimension', 'Motion In Two Dimensions',
    'Laws of Motion', 'Work Power Energy', 'Center of Mass Momentum and Collision', 'Rotational Motion',
    'Gravitation', 'Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter',
    'Thermodynamics', 'Kinetic Theory of Gases', 'Oscillations', 'Waves and Sound', 'Electrostatics',
    'Capacitance', 'Current Electricity', 'Magnetic Properties of Matter', 'Magnetic Effects of Current',
    'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves', 'Ray Optics', 'Wave Optics',
    'Dual Nature of Matter', 'Atomic Physics', 'Nuclear Physics', 'Semiconductors', 'Experimental Physics'
  ],
  Chemistry: [
    'Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity in Properties',
    'Chemical Bonding and Molecular Structure', 'Thermodynamics (C)', 'Chemical Equilibrium', 'Ionic Equilibrium',
    'Redox Reactions', 'p Block Elements (Group 13 & 14)', 'General Organic Chemistry', 'Hydrocarbons',
    'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'p Block Elements (Group 15, 16, 17 & 18)',
    'd and f Block Elements', 'Coordination Compounds', 'Haloalkanes and Haloarenes', 'Alcohols Phenols and Ethers',
    'Aldehydes and Ketones', 'Carboxylic Acid Derivatives', 'Amines', 'Biomolecules', 'Practical Chemistry'
  ],
  Mathematics: [
    'Basic of Mathematics', 'Quadratic Equation', 'Complex Number', 'Permutation Combination',
    'Sequences and Series', 'Binomial Theorem', 'Trigonometric Ratios & Identities', 'Straight Lines',
    'Circle', 'Parabola', 'Ellipse', 'Hyperbola', 'Limits', 'Statistics', 'Sets and Relations',
    'Matrices', 'Determinants', 'Inverse Trigonometric Functions', 'Functions', 'Continuity and Differentiability',
    'Differentiation', 'Application of Derivatives', 'Indefinite Integration', 'Definite Integration',
    'Area Under Curves', 'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry', 'Probability'
  ]
};

const sources = [
  { name: 'CPPs', fullName: 'Core Practice Problems', icon: '🎯' },
  { name: 'Modules', fullName: 'Study Modules', icon: '📚' },
  { name: 'PYQs Mains', fullName: 'Previous Year Questions - Mains', icon: '📋' },
  { name: 'PYQs Advance', fullName: 'Previous Year Questions - Advanced', icon: '🔬' }
];

const quickSelectNumbers = [10, 15, 20, 25, 30];

export const QuickPracticeModal = ({ open, onClose, selectedDate, onSessionComplete }: QuickPracticeModalProps) => {
  const { user } = useAuth();
  const { addSession } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const [step, setStep] = useState(1);
  const [chapterSearch, setChapterSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '' as 'Physics' | 'Chemistry' | 'Mathematics',
    chapter: '',
    sources: [] as string[],
    questionsPracticed: 0,
    accuracy: 0
  });

  const resetForm = () => {
    setFormData({
      subject: '' as 'Physics' | 'Chemistry' | 'Mathematics',
      chapter: '',
      sources: [],
      questionsPracticed: 0,
      accuracy: 0
    });
    setStep(1);
    setChapterSearch('');
  };

  const handleNext = () => {
    if (step === 1 && formData.subject) setStep(2);
    else if (step === 2 && formData.chapter) setStep(3);
    else if (step === 3 && formData.sources.length > 0) setStep(4);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      await addSession({
        date: selectedDate.toISOString().split('T')[0],
        subject: formData.subject,
        chapter: formData.chapter,
        source: 'Custom',
        source_details: formData.sources.join(', '),
        questions_target: formData.questionsPracticed,
        questions_solved: formData.questionsPracticed,
        time_spent: 0, // Not tracking time in this modal
        accuracy_percentage: formData.accuracy,
        notes: `Quick practice log - Sources: ${formData.sources.join(', ')}`
      });

      if (onSessionComplete) {
        onSessionComplete();
      }

      toast.success("Practice session logged successfully! 🎉");
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding practice session:', error);
      toast.error("Failed to log practice session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSource = (source: string) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  const filteredChapters = subjectsWithChapters[formData.subject]?.filter(chapter =>
    chapter.toLowerCase().includes(chapterSearch.toLowerCase())
  ) || [];

  if (!open) return null;

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Select Subject";
      case 2: return "Choose Chapter";  
      case 3: return "Select Sources";
      case 4: return "Practice Details";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return "Which subject did you practice?";
      case 2: return `Choose the chapter for ${formData.subject}`;
      case 3: return "What did you practice from? (Select multiple)";
      case 4: return "Enter practice details";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-4">
            {subjects.map(subject => (
              <button
                key={subject.name}
                onClick={() => {
                  setFormData(prev => ({ ...prev, subject: subject.name as any, chapter: '' }));
                  setStep(2);
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] transform ${
                  theme === 'midnight' || theme === 'obsidian' 
                    ? 'border-gray-700 hover:border-primary/50 bg-gray-800/50 hover:bg-gray-700/50' 
                    : 'border-gray-200 hover:border-primary/50 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{subject.icon}</span>
                  <div className="text-left">
                    <div className={`font-semibold text-lg ${themeColors.text}`}>{subject.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search chapters..."
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                className="pl-10"
              />
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
              {filteredChapters.map(chapter => (
                <button
                  key={chapter}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, chapter }));
                    setStep(3);
                  }}
                  className={`p-4 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] transform ${
                    theme === 'midnight' || theme === 'obsidian'
                      ? 'border-gray-700 hover:border-primary/50 bg-gray-800/30 hover:bg-gray-700/50'
                      : 'border-gray-200 hover:border-primary/50 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className={themeColors.text}>{chapter}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {sources.map(source => (
                <button
                  key={source.name}
                  onClick={() => toggleSource(source.name)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] transform ${
                    formData.sources.includes(source.name)
                      ? `border-primary bg-primary/10 text-primary`
                      : theme === 'midnight' || theme === 'obsidian'
                        ? 'border-gray-700 hover:border-primary/50 bg-gray-800/50 hover:bg-gray-700/50'
                        : 'border-gray-200 hover:border-primary/50 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{source.icon}</span>
                      <div className="text-left">
                        <div className={`font-semibold ${themeColors.text}`}>{source.name}</div>
                        <div className={`text-sm ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {source.fullName}
                        </div>
                      </div>
                    </div>
                    {formData.sources.includes(source.name) && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {formData.sources.length > 0 && (
              <div className="mt-6">
                <Button 
                  onClick={handleNext} 
                  className={`w-full bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white`}
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Questions Practiced */}
            <div>
              <Label className="text-base font-medium mb-3 block flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Questions Practiced
              </Label>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quickSelectNumbers.map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, questionsPracticed: num }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      formData.questionsPracticed === num
                        ? `border-primary bg-primary/10 text-primary`
                        : theme === 'midnight' || theme === 'obsidian'
                          ? 'border-gray-700 hover:border-primary/50 bg-gray-800/30'
                          : 'border-gray-200 hover:border-primary/50 bg-white'
                    }`}
                  >
                    <div className={`text-lg font-semibold ${themeColors.text}`}>{num}</div>
                  </button>
                ))}
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.questionsPracticed || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, questionsPracticed: Number(e.target.value) }))}
                  placeholder="Custom number"
                  className="text-center font-semibold text-lg"
                />
              </div>
            </div>

            {/* Accuracy */}
            <div>
              <Label className="text-base font-medium mb-3 block flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                Accuracy (%)
              </Label>
              <div className="relative">
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.accuracy}
                  onChange={(e) => setFormData(prev => ({ ...prev, accuracy: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className={`text-center mt-2 text-2xl font-bold text-primary`}>
                  {formData.accuracy}%
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`${themeColors.card} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'midnight' || theme === 'obsidian' ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r ${themeColors.primary}`}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Log Practice Session</h2>
              <p className="text-white/80 text-sm">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:scale-110 rounded-full hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className={`px-6 py-4 border-b ${theme === 'midnight' || theme === 'obsidian' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > i + 1 ? 'bg-green-500 text-white' 
                  : step === i + 1 ? 'bg-primary text-white' 
                  : theme === 'midnight' || theme === 'obsidian' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                {i < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > i + 1 ? 'bg-green-500' 
                    : theme === 'midnight' || theme === 'obsidian' ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className={`text-lg font-semibold ${themeColors.text}`}>{getStepTitle()}</h3>
            <p className={`text-sm ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
              {getStepSubtitle()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t ${theme === 'midnight' || theme === 'obsidian' ? 'border-gray-700' : 'border-gray-200'}`}>
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handlePrevious}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{step === 1 ? 'Cancel' : 'Previous'}</span>
          </Button>

          {step === 4 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.questionsPracticed}
              className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white flex items-center space-x-2`}
            >
              <Eye className="h-4 w-4" />
              <span>{isSubmitting ? 'Logging...' : 'Log Practice'}</span>
            </Button>
          ) : step === 3 ? null : (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.subject) ||
                (step === 2 && !formData.chapter)
              }
              className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white flex items-center space-x-2`}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
import { useState } from "react";
import { X, Calendar, BookOpen, FileText, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { usePractice } from "@/hooks/usePractice";

interface AddPracticeSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSessionComplete?: () => void;
}

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

const sourceOptions = {
  Module: ['Ex 1', 'Ex 1A', 'Ex 2', 'Ex 2A', 'Ex 3', 'Ex 3A', 'Misc'],
  PYQs: ['Mains', 'Advanced'],
  CPPs: ['Core Practice Problems'],
  NCERT: ['NCERT Questions'],
  Other: []
};

export const AddPracticeSessionModal = ({ open, onClose, onSessionComplete }: AddPracticeSessionModalProps) => {
  const { user } = useAuth();
  const { addSession } = usePractice();

  const [step, setStep] = useState(1);
  const [chapterSearch, setChapterSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    subject: '' as 'Physics' | 'Chemistry' | 'Mathematics',
    chapter: '',
    source: '' as 'Module' | 'PYQs' | 'CPPs' | 'NCERT' | 'Other',
    sourceDetails: '',
    questionsTarget: 0,
    questionsSolved: 0,
    timeSpent: 0,
    difficultyLevel: '' as 'Easy' | 'Medium' | 'Hard' | 'Mixed',
    accuracyPercentage: 0,
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      date: new Date(),
      subject: '' as 'Physics' | 'Chemistry' | 'Mathematics',
      chapter: '',
      source: '' as 'Module' | 'PYQs' | 'CPPs' | 'NCERT' | 'Other',
      sourceDetails: '',
      questionsTarget: 0,
      questionsSolved: 0,
      timeSpent: 0,
      difficultyLevel: '' as 'Easy' | 'Medium' | 'Hard' | 'Mixed',
      accuracyPercentage: 0,
      notes: ''
    });
    setStep(1);
    setChapterSearch('');
  };

  const handleNext = () => {
    if (step === 1 && formData.date) setStep(2);
    else if (step === 2 && formData.subject) setStep(3);
    else if (step === 3 && formData.chapter) setStep(4);
    else if (step === 4 && formData.source) setStep(5);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      await addSession({
        date: formData.date.toISOString().split('T')[0],
        subject: formData.subject,
        chapter: formData.chapter,
        source: formData.source,
        source_details: formData.sourceDetails || undefined,
        questions_target: formData.questionsTarget,
        questions_solved: formData.questionsSolved,
        time_spent: formData.timeSpent,
        difficulty_level: formData.difficultyLevel || undefined,
        accuracy_percentage: formData.accuracyPercentage || undefined,
        notes: formData.notes || undefined,
      });

      if (onSessionComplete) {
        onSessionComplete();
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding practice session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredChapters = subjectsWithChapters[formData.subject]?.filter(chapter =>
    chapter.toLowerCase().includes(chapterSearch.toLowerCase())
  ) || [];

  const getDateButtonText = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return format(date, "MMM dd, yyyy");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Date</h3>
              <p className="text-sm text-gray-600">When did you practice?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Quick Date Options */}
              {[
                { label: 'Today', date: new Date() },
                { label: 'Yesterday', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                { label: 'Tomorrow', date: new Date(Date.now() + 24 * 60 * 60 * 1000) }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    setFormData({ ...formData, date: option.date });
                    setStep(2);
                  }}
                  className="p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] hover:border-indigo-300 hover:bg-gray-50 border-gray-200"
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{format(option.date, "MMM dd, yyyy")}</div>
                </button>
              ))}

              {/* Custom Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] hover:border-indigo-300 hover:bg-gray-50 border-gray-200">
                    <div className="flex items-center justify-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-medium">Custom Date</span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData({ ...formData, date });
                        setStep(2);
                      }
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Subject</h3>
              <p className="text-sm text-gray-600">Choose the subject you practiced</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(subjectsWithChapters).map(subject => (
                <button
                  key={subject}
                  onClick={() => {
                    setFormData({ ...formData, subject: subject as 'Physics' | 'Chemistry' | 'Mathematics', chapter: '' });
                    setStep(3);
                  }}
                  className="p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] hover:border-indigo-300 hover:bg-gray-50 border-gray-200"
                >
                  <div className="font-medium">{subject}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Chapter</h3>
              <p className="text-sm text-gray-600">Choose the chapter for {formData.subject}</p>
            </div>
            
            <div className="relative">
              <Input
                placeholder="Search chapters..."
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                className="pl-10"
              />
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {filteredChapters.map(chapter => (
                <button
                  key={chapter}
                  onClick={() => {
                    setFormData({ ...formData, chapter });
                    setStep(4);
                  }}
                  className="p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] hover:border-indigo-300 hover:bg-gray-50 border-gray-200"
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Source</h3>
              <p className="text-sm text-gray-600">What did you practice from?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Object.keys(sourceOptions).map((source) => (
                <button
                  key={source}
                  onClick={() => {
                    setFormData({ ...formData, source: source as any, sourceDetails: '' });
                    setStep(5);
                  }}
                  className="p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] hover:border-indigo-300 hover:bg-gray-50 border-gray-200"
                >
                  <div className="font-medium">{source}</div>
                  {source === 'CPPs' && <div className="text-sm text-gray-500">Core Practice Problems</div>}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Practice Details</h3>
              <p className="text-sm text-gray-600">{formData.subject} - {formData.chapter}</p>
            </div>

            {/* Source Details */}
            {formData.source !== 'Other' ? (
              <div>
                <Label className="text-base font-medium mb-3 block">Source Details</Label>
                <div className="grid grid-cols-2 gap-2">
                  {sourceOptions[formData.source].map((detail) => (
                    <button
                      key={detail}
                      type="button"
                      onClick={() => setFormData({ ...formData, sourceDetails: detail })}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] ${
                        formData.sourceDetails === detail
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm font-medium">{detail}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="sourceDetails" className="text-base font-medium">Source Details</Label>
                <Input
                  id="sourceDetails"
                  value={formData.sourceDetails}
                  onChange={(e) => setFormData({ ...formData, sourceDetails: e.target.value })}
                  placeholder="Specify the source..."
                  className="mt-2"
                />
              </div>
            )}

            {/* Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="questionsTarget" className="text-base font-medium">Target Questions</Label>
                <Input
                  id="questionsTarget"
                  type="number"
                  value={formData.questionsTarget}
                  onChange={(e) => setFormData({ ...formData, questionsTarget: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="questionsSolved" className="text-base font-medium">Questions Solved</Label>
                <Input
                  id="questionsSolved"
                  type="number"
                  value={formData.questionsSolved}
                  onChange={(e) => setFormData({ ...formData, questionsSolved: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Time and Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeSpent" className="text-base font-medium">Time Spent (minutes)</Label>
                <Input
                  id="timeSpent"
                  type="number"
                  value={formData.timeSpent}
                  onChange={(e) => setFormData({ ...formData, timeSpent: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-base font-medium">Difficulty Level</Label>
                <Select value={formData.difficultyLevel} onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value as any })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Accuracy */}
            <div>
              <Label htmlFor="accuracyPercentage" className="text-base font-medium">Accuracy (%)</Label>
              <Input
                id="accuracyPercentage"
                type="number"
                value={formData.accuracyPercentage || ''}
                onChange={(e) => setFormData({ ...formData, accuracyPercentage: Number(e.target.value) })}
                className="mt-2"
                min="0"
                max="100"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-base font-medium">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes or observations..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add Practice Session
            </h2>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-indigo-500 scale-110' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {renderStep()}
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 transition-all duration-200 hover:scale-[1.02]"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 transition-all duration-200 hover:scale-[1.02]"
            >
              Cancel
            </Button>
            {step < 5 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
                disabled={
                  (step === 1 && !formData.date) ||
                  (step === 2 && !formData.subject) ||
                  (step === 3 && !formData.chapter) ||
                  (step === 4 && !formData.source)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
              >
                {isSubmitting ? "Adding..." : "Add Session"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

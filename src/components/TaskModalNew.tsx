
import { useState } from "react";
import { X, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface TaskModalNewProps {
  onClose: () => void;
  onAddTask: (task: any) => void;
  selectedDate: Date;
}

const defaultQuickTags = [
  { value: 'lecture-complete', label: 'Lecture Complete', emoji: '🎓' },
  { value: 'lecture-hw', label: 'Lecture H.W [Modules/DPPs/Sheets]', emoji: '✍️' },
  { value: 'lecture-notes', label: 'Lecture Notes', emoji: '📝' },
  { value: 'chapter-reading', label: 'Chapter Reading', emoji: '📚' },
  { value: 'formula-practice', label: 'Formula Practice', emoji: '📊' },
  { value: 'notes-revision', label: 'Notes Revision', emoji: '🔄' },
  { value: 'concept-clarity', label: 'Concept Clarity', emoji: '💡' },
  { value: 'previous-year', label: 'Previous Year Questions', emoji: '📑' },
  { value: 'quick-review', label: 'Quick Review', emoji: '⚡' }
];

const defaultSubjectsWithChapters = {
  Maths: [
    'Basic of Mathematics',
    'Quadratic Equation',
    'Complex Number',
    'Permutation Combination',
    'Sequences and Series',
    'Binomial Theorem',
    'Trigonometric Ratios & Identities',
    'Straight Lines',
    'Circle',
    'Parabola',
    'Ellipse',
    'Hyperbola',
    'Limits',
    'Statistics',
    'Sets and Relations',
    'Matrices',
    'Determinants',
    'Inverse Trigonometric Functions',
    'Functions',
    'Continuity and Differentiability',
    'Differentiation',
    'Application of Derivatives',
    'Indefinite Integration',
    'Definite Integration',
    'Area Under Curves',
    'Differential Equations',
    'Vector Algebra',
    'Three Dimensional Geometry',
    'Probability'
  ],
  Chemistry: [
    'Some Basic Concepts of Chemistry',
    'Structure of Atom',
    'Classification of Elements and Periodicity in Properties',
    'Chemical Bonding and Molecular Structure',
    'Thermodynamics (C)',
    'Chemical Equilibrium',
    'Ionic Equilibrium',
    'Redox Reactions',
    'p Block Elements (Group 13 & 14)',
    'General Organic Chemistry',
    'Hydrocarbons',
    'Solutions',
    'Electrochemistry',
    'Chemical Kinetics',
    'p Block Elements (Group 15, 16, 17 & 18)',
    'd and f Block Elements',
    'Coordination Compounds',
    'Haloalkanes and Haloarenes',
    'Alcohols Phenols and Ethers',
    'Aldehydes and Ketones',
    'Carboxylic Acid Derivatives',
    'Amines',
    'Biomolecules',
    'Practical Chemistry'
  ],
  Physics: [
    'Mathematics in Physics',
    'Units and Dimensions',
    'Motion In One Dimension',
    'Motion In Two Dimensions',
    'Laws of Motion',
    'Work Power Energy',
    'Center of Mass Momentum and Collision',
    'Rotational Motion',
    'Gravitation',
    'Mechanical Properties of Solids',
    'Mechanical Properties of Fluids',
    'Thermal Properties of Matter',
    'Thermodynamics',
    'Kinetic Theory of Gases',
    'Oscillations',
    'Waves and Sound',
    'Electrostatics',
    'Capacitance',
    'Current Electricity',
    'Magnetic Properties of Matter',
    'Magnetic Effects of Current',
    'Electromagnetic Induction',
    'Alternating Current',
    'Electromagnetic Waves',
    'Ray Optics',
    'Wave Optics',
    'Dual Nature of Matter',
    'Atomic Physics',
    'Nuclear Physics',
    'Semiconductors',
    'Experimental Physics'
  ],
  Biology: [
    'The Living World',
    'Biological Classification',
    'Plant Kingdom',
    'Animal Kingdom',
    'Morphology of Flowering Plants',
    'Anatomy of Flowering Plants',
    'Structural Organisation in Animals',
    'Cell Cycle and Cell Division',
    'Cell - The Unit of Life',
    'Plant - Growth and Development',
    'Respiration in Plants',
    'Photosynthesis in Higher Plants',
    'Chemical Coordination and Integration',
    'Body Fluids and Circulation',
    'Neural Control and Coordination',
    'Excretory Products and their Elimination',
    'Breathing and Exchange of Gases',
    'Locomotion and Movement',
    'Reproductive Health',
    'Sexual Reproduction in Flowering Plants',
    'Human Reproduction',
    'Molecular Basis of Inheritance',
    'Principles of Inheritance and Variation',
    'Evolution',
    'Human Health and Diseases',
    'Biomolecules (B)',
    'Microbes in Human Welfare',
    'Biotechnology and Its Applications',
    'Biotechnology - Principles and Processes',
    'Organisms and Populations',
    'Biodiversity and its Conservation',
    'Ecosystem'
  ]
};

const durationPresets = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' }
];

export const TaskModalNew = ({ onClose, onAddTask, selectedDate }: TaskModalNewProps) => {
  const [step, setStep] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    title: '',
    description: '',
    priority: 'medium',
    duration: '',
    scheduled_date: selectedDate.toISOString().split('T')[0]
  });

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();

  const handleQuickTagSelect = (tag: any) => {
    setSelectedTag(tag.value);
    setFormData({ 
      ...formData, 
      title: `${tag.label}${formData.chapter ? ` - ${formData.chapter}` : ''}` 
    });
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData({ ...formData, subject, chapter: '' });
    setStep(2);
  };

  const handleChapterSelect = (chapter: string) => {
    setFormData({ 
      ...formData, 
      chapter,
      title: selectedTag ? `${defaultQuickTags.find(t => t.value === selectedTag)?.label} - ${chapter}` : chapter
    });
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setFormData({ ...formData, title: transcript });
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleDurationSelect = (duration: string) => {
    setFormData({ ...formData, duration });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject) return;
    
    const taskData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : null
    };
    
    onAddTask(taskData);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Subject</h3>
              <p className="text-sm text-gray-600">Select the subject you want to study</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(defaultSubjectsWithChapters).map(subject => (
                <button
                  key={subject}
                  onClick={() => handleSubjectSelect(subject)}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 hover:scale-[1.02] group"
                >
                  <div className="font-semibold text-gray-800 group-hover:text-indigo-700">{subject}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Actions</h3>
              <p className="text-sm text-gray-600">Choose what you want to do with {formData.subject}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {defaultQuickTags.map(tag => (
                <button
                  key={tag.value}
                  onClick={() => handleQuickTagSelect(tag)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    selectedTag === tag.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{tag.emoji}</div>
                    <div className="text-xs font-medium">{tag.label}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="chapter">Chapter (Optional)</Label>
                <Select value={formData.chapter} onValueChange={handleChapterSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {defaultSubjectsWithChapters[formData.subject]?.map(chapter => (
                      <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Task Title</Label>
                <div className="flex space-x-2">
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title or use voice..."
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleVoiceInput}
                    className={`${isListening ? 'bg-red-50 border-red-300 text-red-600' : ''}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                {isListening && (
                  <p className="text-sm text-red-600 mt-1">Listening... Speak now!</p>
                )}
                {transcript && (
                  <p className="text-sm text-gray-600 mt-1">Voice input: "{transcript}"</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Notes (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any notes or details..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {durationPresets.map(preset => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleDurationSelect(preset.value)}
                        className={`p-2 rounded-lg border text-sm transition-all duration-200 ${
                          formData.duration === preset.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Custom minutes"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 High</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="low">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add Study Task
            </h2>
            <div className="flex space-x-1">
              {[1, 2].map(i => (
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
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {renderStep()}
          
          <div className="flex space-x-3 pt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            {step < 2 ? (
              <Button
                onClick={() => setStep(2)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={!formData.subject}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={!formData.title.trim()}
              >
                Add Task
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

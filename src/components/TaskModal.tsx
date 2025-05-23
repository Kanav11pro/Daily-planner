
import { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TaskModalProps {
  onClose: () => void;
  onAddTask: (task: any) => void;
  selectedDate: Date;
}

const subjectsWithChapters = {
  Mathematics: [
    'Coordinate Geometry', 'Calculus', 'Algebra', 'Trigonometry', 
    'Probability', 'Statistics', 'Matrices', 'Vectors', 'Complex Numbers'
  ],
  Physics: [
    'Mechanics', 'Thermodynamics', 'Waves and Oscillations', 'Electrodynamics',
    'Modern Physics', 'Optics', 'Atomic Physics', 'Nuclear Physics'
  ],
  Chemistry: [
    'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry',
    'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Kinetics'
  ],
  English: [
    'Grammar', 'Comprehension', 'Writing Skills', 'Vocabulary'
  ],
  Biology: [
    'Cell Biology', 'Genetics', 'Evolution', 'Plant Physiology',
    'Human Physiology', 'Ecology', 'Biotechnology'
  ]
};

export const TaskModal = ({ onClose, onAddTask, selectedDate }: TaskModalProps) => {
  const [step, setStep] = useState(1);
  const [chapterSearch, setChapterSearch] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    title: '',
    description: '',
    priority: 'medium',
    duration: '',
    scheduledDate: selectedDate.toISOString()
  });

  const handleNext = () => {
    if (step === 1 && formData.subject) setStep(2);
    else if (step === 2 && formData.chapter) setStep(3);
    else if (step === 3 && formData.title) setStep(4);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject || !formData.chapter) return;
    
    onAddTask(formData);
    onClose();
  };

  const filteredChapters = subjectsWithChapters[formData.subject]?.filter(chapter =>
    chapter.toLowerCase().includes(chapterSearch.toLowerCase())
  ) || [];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Subject</h3>
              <p className="text-sm text-gray-600">Choose the subject you want to study</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(subjectsWithChapters).map(subject => (
                <button
                  key={subject}
                  onClick={() => {
                    setFormData({ ...formData, subject, chapter: '' });
                    setStep(2);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] ${
                    formData.subject === subject
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{subject}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Chapter</h3>
              <p className="text-sm text-gray-600">Choose the chapter for {formData.subject}</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search chapters..."
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {filteredChapters.map(chapter => (
                <button
                  key={chapter}
                  onClick={() => {
                    setFormData({ ...formData, chapter });
                    setStep(3);
                  }}
                  className={`p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
                    formData.chapter === chapter
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  {chapter}
                </button>
              ))}
              {filteredChapters.length === 0 && chapterSearch && (
                <div className="text-center py-4 text-gray-500">
                  No chapters found matching "{chapterSearch}"
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
              <p className="text-sm text-gray-600">{formData.subject} - {formData.chapter}</p>
            </div>
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Complete Exercise 5.1"
                required
                autoFocus
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any additional details..."
                rows={3}
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Final Details</h3>
              <p className="text-sm text-gray-600">Set priority and duration</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="transition-all duration-200 hover:scale-[1.01]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="60"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h4 className="font-medium text-gray-800 mb-2">Task Summary:</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{formData.subject}</span> - {formData.chapter}
              </p>
              <p className="text-sm text-gray-800 font-medium">{formData.title}</p>
              {formData.description && (
                <p className="text-xs text-gray-600 mt-1">{formData.description}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add Study Task
            </h2>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map(i => (
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
              onClick={onClose}
              className="flex-1 transition-all duration-200 hover:scale-[1.02]"
            >
              Cancel
            </Button>
            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
                disabled={
                  (step === 1 && !formData.subject) ||
                  (step === 2 && !formData.chapter) ||
                  (step === 3 && !formData.title)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
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

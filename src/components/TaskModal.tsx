import { useState } from "react";
import { X, Search, BookOpen, FileText, GraduationCap, RotateCcw, Package, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SubjectOption {
  name: string;
  icon: any;
}

interface PriorityOption {
  value: string;
  label: string;
  color: string;
}

interface DurationOption {
  value: string;
  label: string;
  description: string;
}

const subjectOptions: SubjectOption[] = [
  { name: 'Mathematics', icon: GraduationCap },
  { name: 'Science', icon: Package },
  { name: 'History', icon: BookOpen },
  { name: 'Literature', icon: FileText },
  { name: 'Language', icon: ClipboardList },
  { name: 'General', icon: RotateCcw },
];

const priorityOptions: PriorityOption[] = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-green-500' },
];

const durationOptions: DurationOption[] = [
  { value: '30', label: '30 mins', description: 'Quick study session' },
  { value: '60', label: '1 hour', description: 'Standard study block' },
  { value: '90', label: '1.5 hours', description: 'In-depth learning' },
  { value: '120', label: '2 hours', description: 'Extensive study session' },
];

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: any) => void;
  selectedDate: Date;
}

export const TaskModal = ({ isOpen, onClose, onAddTask, selectedDate }: TaskModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    title: '',
    description: '',
    priority: '',
    duration: '',
    scheduled_date: selectedDate.toISOString().split('T')[0]
  });

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedSubject('');
    setSearchQuery('');
    setChapters([]);
    setFormData({
      subject: '',
      chapter: '',
      title: '',
      description: '',
      priority: '',
      duration: '',
      scheduled_date: selectedDate.toISOString().split('T')[0]
    });
  };

  const handleSubjectSelect = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setFormData({...formData, subject: subjectName});
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.priority || !formData.duration) {
      alert('Please select a priority and duration.');
      return;
    }

    onAddTask(formData);
    onClose();
    resetForm();
  };

  const filteredSubjects = subjectOptions.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Select Subject <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              placeholder="Search subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredSubjects.map(subject => (
              <button
                key={subject.name}
                type="button"
                onClick={() => handleSubjectSelect(subject.name)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedSubject === subject.name
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <subject.icon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                  <span className="text-sm font-medium">{subject.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Enter Chapter <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              placeholder="Enter chapter..."
              value={formData.chapter}
              onChange={(e) => setFormData({...formData, chapter: e.target.value})}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Task Title <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Description</Label>
            <Textarea
              placeholder="Enter task description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Priority <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-3 gap-3">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({...formData, priority: option.value})}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.priority === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-3 h-3 mx-auto mb-2 rounded-full ${option.color}`}></div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Duration <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 gap-3">
              {durationOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({...formData, duration: option.value})}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.duration === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-lg font-semibold">{option.label}</span>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Confirm Your Task</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900">{formData.title}</h4>
              <p className="text-sm text-gray-600">{formData.subject} • {formData.chapter}</p>
              {formData.description && (
                <p className="text-xs text-gray-600 mt-1">{formData.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {formData.priority && (
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                    {priorityOptions.find(p => p.value === formData.priority)?.label} Priority
                  </span>
                )}
                {formData.duration && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {formData.duration} mins
                  </span>
                )}
              </div>
            </div>
            {(!formData.priority || !formData.duration) && (
              <p className="text-center text-sm text-red-500">
                Please select a priority and duration.
              </p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Task</h2>
          <Button onClick={onClose} variant="ghost">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        <div className="border-t p-4 flex gap-3 bg-gray-50">
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
          )}
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !selectedSubject) ||
                (currentStep === 2 && !formData.chapter) ||
                (currentStep === 3 && !formData.title.trim())
              }
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
              disabled={!formData.priority || !formData.duration}
            >
              Add Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

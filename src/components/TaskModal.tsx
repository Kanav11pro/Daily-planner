
import React, { useState } from "react";
import { X, Search, BookOpen, Flask, Calculator, Microscope, ClipboardCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SubjectOption {
  name: string;
  icon: any;
  chapters: string[];
}

interface QuickTag {
  name: string;
  color: string;
}

const subjectOptions: SubjectOption[] = [
  { 
    name: 'Mathematics', 
    icon: Calculator,
    chapters: ['Algebra', 'Geometry', 'Calculus', 'Trigonometry', 'Statistics', 'Probability', 'Number Theory', 'Linear Algebra']
  },
  { 
    name: 'Chemistry', 
    icon: Flask,
    chapters: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Environmental Chemistry']
  },
  { 
    name: 'Physics', 
    icon: Microscope,
    chapters: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Waves', 'Quantum Physics']
  },
  { 
    name: 'Biology', 
    icon: BookOpen,
    chapters: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Anatomy', 'Plant Biology', 'Molecular Biology']
  },
  { 
    name: 'Mock Test', 
    icon: ClipboardCheck,
    chapters: ['Full Length Test', 'Subject Wise Test', 'Chapter Wise Test', 'Previous Year Papers', 'Practice Sets']
  },
];

const quickTags: QuickTag[] = [
  { name: 'Homework', color: 'bg-blue-100 text-blue-800' },
  { name: 'Revision', color: 'bg-green-100 text-green-800' },
  { name: 'Practice', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Test Prep', color: 'bg-purple-100 text-purple-800' },
  { name: 'Notes', color: 'bg-pink-100 text-pink-800' },
  { name: 'Assignment', color: 'bg-indigo-100 text-indigo-800' },
];

const priorityOptions = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-green-500' },
];

const durationOptions = [
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
  const [selectedChapter, setSelectedChapter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customChapter, setCustomChapter] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    title: '',
    description: '',
    priority: '',
    duration: '',
    tags: [] as string[],
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
    setSelectedChapter('');
    setSearchQuery('');
    setChapterSearchQuery('');
    setSelectedTags([]);
    setCustomChapter('');
    setFormData({
      subject: '',
      chapter: '',
      title: '',
      description: '',
      priority: '',
      duration: '',
      tags: [],
      scheduled_date: selectedDate.toISOString().split('T')[0]
    });
  };

  const handleSubjectSelect = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setFormData({...formData, subject: subjectName});
  };

  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter);
    setFormData({...formData, chapter: chapter});
  };

  const handleTagToggle = (tagName: string) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter(tag => tag !== tagName)
      : [...selectedTags, tagName];
    setSelectedTags(newTags);
    setFormData({...formData, tags: newTags});
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

  const getChaptersForSelectedSubject = () => {
    const subject = subjectOptions.find(s => s.name === selectedSubject);
    return subject ? subject.chapters.filter(chapter =>
      chapter.toLowerCase().includes(chapterSearchQuery.toLowerCase())
    ) : [];
  };

  if (!isOpen) return null;

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Select Subject <span className="text-red-500">*</span></Label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredSubjects.map(subject => (
              <button
                key={subject.name}
                type="button"
                onClick={() => handleSubjectSelect(subject.name)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                  selectedSubject === subject.name
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <subject.icon className="w-6 h-6 text-gray-700" />
                <span className="text-sm font-medium">{subject.name}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      const chapters = getChaptersForSelectedSubject();
      
      return (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Select Chapter <span className="text-red-500">*</span></Label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search chapters..."
                value={chapterSearchQuery}
                onChange={(e) => setChapterSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {chapters.map(chapter => (
              <button
                key={chapter}
                type="button"
                onClick={() => handleChapterSelect(chapter)}
                className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                  selectedChapter === chapter
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium">{chapter}</span>
              </button>
            ))}
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Or add custom chapter</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter custom chapter..."
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (customChapter.trim()) {
                    handleChapterSelect(customChapter.trim());
                    setCustomChapter('');
                  }
                }}
                disabled={!customChapter.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
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
              rows={3}
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Quick Tags</Label>
            <div className="flex flex-wrap gap-2">
              {quickTags.map(tag => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => handleTagToggle(tag.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedTags.includes(tag.name)
                      ? 'ring-2 ring-indigo-500 ' + tag.color
                      : tag.color + ' hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
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
            <h3 className="text-lg font-semibold mb-4">Review Your Task</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">{formData.title}</h4>
                <p className="text-sm text-gray-600">{formData.subject} • {formData.chapter}</p>
              </div>
              
              {formData.description && (
                <p className="text-sm text-gray-600">{formData.description}</p>
              )}
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map(tag => {
                    const tagStyle = quickTags.find(t => t.name === tag);
                    return (
                      <span key={tag} className={`text-xs px-2 py-1 rounded-full ${tagStyle?.color}`}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
              
              <div className="flex items-center gap-2">
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
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-indigo-600 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
          </div>
          
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
                (currentStep === 2 && !selectedChapter) ||
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

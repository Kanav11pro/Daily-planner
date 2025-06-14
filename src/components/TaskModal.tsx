
import { useState } from "react";
import { X, Calendar, Clock, Flag, Target, BookOpen, Edit, GraduationCap, FileText, Users, BarChart3 } from "lucide-react";
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

const taskTags = [
  { id: 'hw', label: 'HW', icon: Edit, color: 'from-red-500 to-pink-500' },
  { id: 'notes', label: 'Notes', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'lecture', label: 'Lecture', icon: Users, color: 'from-green-500 to-emerald-500' },
  { id: 'revision', label: 'Revision', icon: BarChart3, color: 'from-yellow-500 to-orange-500' },
  { id: 'module', label: 'Module', icon: BookOpen, color: 'from-purple-500 to-violet-500' },
  { id: 'dpps', label: 'DPPs', icon: Target, color: 'from-indigo-500 to-blue-500' }
];

const priorityOptions = [
  { value: 'high', label: 'High Priority', color: 'bg-red-500 hover:bg-red-600', icon: '🔴' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-500 hover:bg-yellow-600', icon: '🟡' },
  { value: 'low', label: 'Low Priority', color: 'bg-green-500 hover:bg-green-600', icon: '🟢' }
];

const durationOptions = ['30', '45', '60', '90', '120'];

export const TaskModal = ({ onClose, onAddTask, selectedDate }: TaskModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    chapter: '',
    priority: 'medium',
    duration: '60',
    scheduledDate: selectedDate
  });

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      
      // Update title based on selected tags
      if (newTags.length > 0) {
        const tagLabels = newTags.map(id => taskTags.find(tag => tag.id === id)?.label).join(', ');
        setFormData(prev => ({ ...prev, title: tagLabels }));
      } else {
        setFormData(prev => ({ ...prev, title: '' }));
      }
      
      return newTags;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim()) return;
    
    onAddTask({
      ...formData,
      tags: selectedTags
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Add New Task
              </h2>
              <p className="text-sm text-gray-600">Step {step} of 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 1 && (
          <div className="p-6 space-y-6">
            {/* Quick Tags */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">Quick Task Types</Label>
              <div className="grid grid-cols-3 gap-3">
                {taskTags.map((tag) => {
                  const IconComponent = tag.icon;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedTags.includes(tag.id)
                          ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-lg'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25 hover:scale-105'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tag.color} flex items-center justify-center shadow-md`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{tag.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Task Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold text-gray-800">
                Task Title (Optional - auto-filled from tags)
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter custom task title..."
                className="h-12 text-base border-2 focus:border-indigo-500 hover:border-indigo-300 rounded-xl transition-all duration-200"
              />
            </div>

            {/* Subject and Chapter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-base font-semibold text-gray-800">Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger className="h-12 border-2 focus:border-indigo-500 rounded-xl">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="chapter" className="text-base font-semibold text-gray-800">Chapter (Optional)</Label>
                <Input
                  id="chapter"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  placeholder="e.g., Kinematics"
                  className="h-12 text-base border-2 focus:border-indigo-500 hover:border-indigo-300 rounded-xl transition-all duration-200"
                />
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.subject}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold text-gray-800">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any additional details..."
                rows={3}
                className="text-base border-2 focus:border-indigo-500 hover:border-indigo-300 rounded-xl transition-all duration-200"
              />
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-800">Priority Level</Label>
              <div className="flex space-x-3">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 text-white font-semibold ${
                      formData.priority === option.value
                        ? `${option.color} border-white scale-105 shadow-lg`
                        : `${option.color.split(' ')[0]} opacity-70 border-gray-200 hover:opacity-90 hover:scale-105`
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-800">Study Duration</Label>
              <div className="grid grid-cols-5 gap-3 mb-3">
                {durationOptions.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 font-semibold ${
                      formData.duration === duration
                        ? 'bg-indigo-500 text-white border-indigo-500 scale-105 shadow-lg'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{duration}</div>
                      <div className="text-xs">mins</div>
                    </div>
                  </button>
                ))}
              </div>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Custom duration"
                className="h-12 text-base border-2 focus:border-indigo-500 hover:border-indigo-300 rounded-xl transition-all duration-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                Create Task
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

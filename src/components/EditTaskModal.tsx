
import { useState } from "react";
import { X, Calendar, Clock, Flag, BookOpen, Edit3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditTaskModalProps {
  task: any;
  onClose: () => void;
  onSave: (updatedTask: any) => void;
}

export const EditTaskModal = ({ task, onClose, onSave }: EditTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    duration: task.duration || ''
  });

  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'bg-red-500 hover:bg-red-600', icon: '🔴' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-500 hover:bg-yellow-600', icon: '🟡' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-500 hover:bg-green-600', icon: '🟢' }
  ];

  const durationOptions = ['30', '45', '60', '90', '120'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSave({
      ...task,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Edit Task
              </h2>
              <p className="text-sm text-gray-600">Modify your study task details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="flex items-center text-base font-semibold text-gray-800">
              <Target className="h-5 w-5 mr-2 text-indigo-600" />
              Task Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Complete Exercise 5.1"
              required
              className="h-12 text-base border-2 focus:border-indigo-500 hover:border-indigo-300 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="flex items-center text-base font-semibold text-gray-800">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any additional details or notes..."
              rows={4}
              className="text-base border-2 focus:border-purple-500 hover:border-purple-300 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <Label className="flex items-center text-base font-semibold text-gray-800">
              <Flag className="h-5 w-5 mr-2 text-orange-600" />
              Priority Level
            </Label>
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

          {/* Duration Selection */}
          <div className="space-y-3">
            <Label className="flex items-center text-base font-semibold text-gray-800">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Study Duration
            </Label>
            <div className="grid grid-cols-5 gap-3">
              {durationOptions.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setFormData({ ...formData, duration })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 font-semibold ${
                    formData.duration === duration
                      ? 'bg-blue-500 text-white border-blue-500 scale-105 shadow-lg'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-105'
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
              className="h-12 text-base border-2 focus:border-blue-500 hover:border-blue-300 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base font-semibold border-2 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-105"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

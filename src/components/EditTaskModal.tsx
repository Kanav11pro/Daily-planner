
import { useState, useEffect } from "react";
import { X, Calendar, Clock, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface EditTaskModalProps {
  task: any;
  onClose: () => void;
  onSave: (updatedTask: any) => void;
}

const priorityOptions = [
  { value: 'high', label: 'High Priority', color: 'bg-red-100 border-red-300 text-red-700', emoji: '🔴' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 border-yellow-300 text-yellow-700', emoji: '🟡' },
  { value: 'low', label: 'Low Priority', color: 'bg-green-100 border-green-300 text-green-700', emoji: '🟢' }
];

const durationOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' }
];

export const EditTaskModal = ({ task, onClose, onSave }: EditTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    duration: task.duration?.toString() || '',
    subject: task.subject || '',
    chapter: task.chapter || '',
    scheduled_date: task.scheduled_date || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (formData.duration && (parseInt(formData.duration) < 5 || parseInt(formData.duration) > 480)) {
      newErrors.duration = 'Duration must be between 5 and 480 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedTask = {
        ...task,
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null
      };
      
      await onSave(updatedTask);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDurationSelect = (value: string) => {
    setFormData(prev => ({ ...prev, duration: value }));
    if (errors.duration) {
      setErrors(prev => ({ ...prev, duration: '' }));
    }
  };

  const currentPriority = priorityOptions.find(p => p.value === formData.priority);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Save className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Edit Task
              </h2>
              <p className="text-sm text-gray-600">{task.subject} - {task.chapter}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Task Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Complete Exercise 5.1"
                className={`transition-all duration-200 ${errors.title ? 'border-red-300 focus:border-red-500' : ''}`}
                autoFocus
              />
              {errors.title && (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.title}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add any additional details or notes..."
                rows={3}
                className="transition-all duration-200 resize-none"
              />
            </div>

            {/* Priority and Duration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Priority */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Priority Level</Label>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('priority', option.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                        formData.priority === option.value
                          ? `${option.color} border-opacity-70 shadow-md scale-105`
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{option.emoji}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Estimated Duration</Label>
                <div className="space-y-3">
                  <Select value={formData.duration} onValueChange={handleDurationSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="text-sm text-gray-500">Or enter custom duration:</div>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="Minutes"
                    min="5"
                    max="480"
                    className={`${errors.duration ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {errors.duration && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errors.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Task Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-xl border border-indigo-100">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                <span>📋</span>
                <span>Task Summary</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {formData.subject}
                  </Badge>
                  {formData.chapter && (
                    <Badge variant="outline" className="text-xs">
                      {formData.chapter}
                    </Badge>
                  )}
                </div>
                <p className="font-medium text-gray-800">{formData.title || 'Untitled Task'}</p>
                {formData.description && (
                  <p className="text-sm text-gray-600">{formData.description}</p>
                )}
                <div className="flex items-center space-x-3 pt-2 flex-wrap gap-2">
                  {currentPriority && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${currentPriority.color}`}>
                      {currentPriority.emoji} {currentPriority.label}
                    </div>
                  )}
                  {formData.duration && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      <span>{formData.duration} min</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 mr-3 transition-all duration-200 hover:scale-[1.02]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};


import { useState } from "react";
import { X, Calendar, Clock, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoveTaskModalProps {
  task: any;
  onClose: () => void;
  onMove: (taskId: string, newDate: string) => void;
}

export const MoveTaskModal = ({ task, onClose, onMove }: MoveTaskModalProps) => {
  const [selectedDate, setSelectedDate] = useState(task.scheduled_date);
  const [useQuickSelect, setUseQuickSelect] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    onMove(task.id, selectedDate);
    onClose();
  };

  const handleQuickSelect = (date: string) => {
    setSelectedDate(date);
    onMove(task.id, date);
    onClose();
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatDateLabel = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const quickOptions = [
    {
      label: "Today",
      date: formatDate(today),
      description: formatDateLabel(today),
      icon: "📅",
      color: "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
    },
    {
      label: "Tomorrow",
      date: formatDate(tomorrow),
      description: formatDateLabel(tomorrow),
      icon: "🌅",
      color: "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
    },
    {
      label: "Day After Tomorrow",
      date: formatDate(dayAfterTomorrow),
      description: formatDateLabel(dayAfterTomorrow),
      icon: "🌤️",
      color: "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200"
    },
    {
      label: "Next Week",
      date: formatDate(nextWeek),
      description: formatDateLabel(nextWeek),
      icon: "📆",
      color: "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
    },
    {
      label: "Next Month",
      date: formatDate(nextMonth),
      description: formatDateLabel(nextMonth),
      icon: "🗓️",
      color: "bg-indigo-100 border-indigo-300 text-indigo-700 hover:bg-indigo-200"
    }
  ];

  const currentDateLabel = new Date(task.scheduled_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Move Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Moving Task:</h3>
                <p className="text-gray-600 text-sm">{task.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Current date: {currentDateLabel}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Quick Options</h3>
              <button
                onClick={() => setUseQuickSelect(!useQuickSelect)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
              >
                <Zap className="h-4 w-4" />
                <span>{useQuickSelect ? 'Custom Date' : 'Quick Select'}</span>
              </button>
            </div>

            {useQuickSelect ? (
              <div className="grid grid-cols-1 gap-3">
                {quickOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleQuickSelect(option.date)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${option.color} text-left`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm opacity-80">{option.description}</div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-60" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="custom-date" className="text-sm font-medium text-gray-700">
                    Select Custom Date
                  </Label>
                  <Input
                    id="custom-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={formatDate(today)}
                    required
                    className="mt-2 transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Move Task
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

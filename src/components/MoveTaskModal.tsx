
import { useState } from "react";
import { X, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Task } from "@/hooks/useTasks";

interface MoveTaskModalProps {
  task: Task;
  onClose: () => void;
  onMove: (taskId: string, newDate: string) => void;
}

export const MoveTaskModal = ({ task, onClose, onMove }: MoveTaskModalProps) => {
  const [newDate, setNewDate] = useState(task.scheduled_date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDate && newDate !== task.scheduled_date) {
      onMove(task.id, newDate);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Task to Move:</h3>
            <p className="text-gray-700">{task.title}</p>
            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Currently scheduled for: {formatDate(task.scheduled_date)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newDate">Move to:</Label>
            <input
              id="newDate"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {newDate !== task.scheduled_date && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Moving to: {formatDate(newDate)}
                </span>
              </div>
            </div>
          )}

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
              disabled={newDate === task.scheduled_date}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

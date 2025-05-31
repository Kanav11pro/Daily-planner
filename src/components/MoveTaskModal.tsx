
import { useState } from "react";
import { X, Calendar, Copy, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoveTaskModalProps {
  task: any;
  onClose: () => void;
  onMove: (taskId: string, newDate: string) => void;
  onCopy?: (task: any, newDate: string) => void;
}

export const MoveTaskModal = ({ task, onClose, onMove, onCopy }: MoveTaskModalProps) => {
  const [selectedDate, setSelectedDate] = useState(task.scheduled_date);
  const [action, setAction] = useState<'move' | 'copy'>('move');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    if (action === 'copy' && onCopy) {
      onCopy(task, selectedDate);
    } else {
      onMove(task.id, selectedDate);
    }
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {action === 'move' ? 'Move' : 'Copy'} Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Task:</h3>
            <p className="text-gray-600">{task.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              Current date: {new Date(task.scheduled_date).toLocaleDateString()}
            </p>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label>Choose Action</Label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setAction('move')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  action === 'move'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Move className="h-4 w-4" />
                <span>Move Task</span>
              </button>
              <button
                type="button"
                onClick={() => setAction('copy')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  action === 'copy'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Copy className="h-4 w-4" />
                <span>Copy Task</span>
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {action === 'move' 
                ? 'Move will relocate the task to the new date' 
                : 'Copy will create a duplicate task on the new date'
              }
            </p>
          </div>

          <div>
            <Label htmlFor="new-date">Select {action === 'move' ? 'New' : 'Target'} Date</Label>
            <Input
              id="new-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              required
              autoFocus
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
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
              className={`flex-1 transition-all duration-200 hover:scale-[1.02] ${
                action === 'move'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {action === 'move' ? <Move className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {action === 'move' ? 'Move Task' : 'Copy Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

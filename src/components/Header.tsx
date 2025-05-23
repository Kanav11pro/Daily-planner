
import { Calendar, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddTask: () => void;
}

export const Header = ({ onAddTask }: HeaderProps) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ExamAce Planner
              </h1>
              <p className="text-gray-600 font-medium">Your JEE Success Journey</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span className="text-indigo-800 font-medium">{today}</span>
            </div>
            
            <Button
              onClick={onAddTask}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

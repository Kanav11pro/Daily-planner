
import { Calendar } from "lucide-react";

interface WeeklyViewProps {
  tasks: any[];
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export const WeeklyView = ({ tasks, onToggleTask, onDeleteTask }: WeeklyViewProps) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-6 w-6 text-indigo-600" />
        <h3 className="text-2xl font-bold text-gray-800">Weekly Study Plan</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 min-h-[200px]">
            <h4 className="font-semibold text-gray-700 mb-3 text-center">{day}</h4>
            <div className="space-y-2">
              {tasks
                .filter(task => task.scheduledDay === day)
                .map(task => (
                  <div
                    key={task.id}
                    className={`bg-white p-3 rounded-lg shadow-sm border ${
                      task.completed ? 'opacity-75 bg-green-50 border-green-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        className="text-indigo-600"
                      />
                      <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{task.subject}</div>
                  </div>
                ))}
              
              {tasks.filter(task => task.scheduledDay === day).length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-xs">No tasks scheduled</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

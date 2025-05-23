
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "./TaskList";
import { WeeklyView } from "./WeeklyView";
import { Calendar, List } from "lucide-react";

interface TaskDashboardProps {
  tasks: any[];
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: () => void;
}

export const TaskDashboard = ({ tasks, onToggleTask, onDeleteTask, onAddTask }: TaskDashboardProps) => {
  const [activeTab, setActiveTab] = useState("daily");

  const today = new Date().toDateString();
  const todayTasks = tasks.filter(task => 
    new Date(task.createdAt).toDateString() === today || task.type === 'daily'
  );

  const weeklyTasks = tasks.filter(task => task.type === 'weekly');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 m-4 rounded-xl">
          <TabsTrigger 
            value="daily" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            <List className="h-4 w-4" />
            <span>Daily Tasks</span>
          </TabsTrigger>
          <TabsTrigger 
            value="weekly"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            <Calendar className="h-4 w-4" />
            <span>Weekly View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="p-6 pt-0">
          <TaskList
            tasks={todayTasks}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
            title="Today's Study Plan"
          />
        </TabsContent>

        <TabsContent value="weekly" className="p-6 pt-0">
          <WeeklyView
            tasks={weeklyTasks}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Calendar as CalendarDatepicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { TaskList } from "./TaskList";
import { Header } from "./Header";
import { TaskModalNew } from "./TaskModalNew";
import { PersonalizationSettings } from "./PersonalizationSettings";

export const TaskDashboard = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTask, moveTask, refetch } = useTasks();
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filteredTasks = tasks?.filter(task => {
    const taskDate = new Date(task.scheduled_date);
    return (
      taskDate.getFullYear() === selectedDate.getFullYear() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getDate() === selectedDate.getDate()
    );
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setSelectedDate(date);
    }
  };

  const handleMoveTask = async (taskId: string, newDate: Date) => {
    const formattedDate = newDate.toISOString().split('T')[0];
    await moveTask(taskId, formattedDate);
  };

  const handleAddTask = async (taskData: any) => {
    await addTask(taskData);
    setShowNewModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header 
        onAddTask={() => setShowNewModal(true)} 
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Today's Tasks
          </h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? (
                  <span>
                    {date?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <CalendarDatepicker
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTask}
            onMoveTask={handleMoveTask}
          />
        )}
      </div>

      {showNewModal && (
        <TaskModalNew
          onClose={() => setShowNewModal(false)}
          onAddTask={handleAddTask}
          selectedDate={selectedDate}
        />
      )}

      {showSettings && (
        <PersonalizationSettings onClose={() => setShowSettings(false)} />
      )}

      {/* Edit Task Modal */}
    </div>
  );
};

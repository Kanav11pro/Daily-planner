
import { useState } from "react";
import { Calendar } from "lucide-react";
import { Calendar as CalendarDatepicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskList } from "./TaskList";
import { Header } from "./Header";
import { TaskModalNew } from "./TaskModalNew";
import { PersonalizationSettings } from "./PersonalizationSettings";

interface TaskDashboardProps {
  tasks: any[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: any) => void;
  onAddTask: () => void;
  selectedDate: Date;
}

export const TaskDashboard = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onEditTask, 
  onAddTask, 
  selectedDate 
}: TaskDashboardProps) => {
  const [date, setDate] = useState<Date>(selectedDate);
  const [showSettings, setShowSettings] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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

        <TaskList
          tasks={tasks}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onAddTask={onAddTask}
          title="Today's Tasks"
        />
      </div>

      {showSettings && (
        <PersonalizationSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

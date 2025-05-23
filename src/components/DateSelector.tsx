
import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddTask: () => void;
}

export const DateSelector = ({ selectedDate, onDateChange, onAddTask }: DateSelectorProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className={`${themeColors.card} rounded-2xl shadow-xl ${themeColors.border} border p-4 sm:p-6 mb-6`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousDay}
            className="h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 min-w-0 flex-1 sm:flex-initial sm:min-w-[200px]">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium truncate">{formatDate(selectedDate)}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date);
                    setShowCalendar(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextDay}
            className="h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {selectedDate.toDateString() !== new Date().toDateString() && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-xs px-2 sm:px-3 flex-shrink-0"
            >
              Today
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <div className="text-sm text-gray-500">Planning for</div>
            <div className="text-base sm:text-lg font-semibold text-gray-800">
              {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
          
          <Button
            onClick={onAddTask}
            className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto`}
            size="sm"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">Add Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

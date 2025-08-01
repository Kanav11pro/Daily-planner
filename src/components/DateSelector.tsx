
import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
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

  // Get week dates starting from Monday
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);
  const today = new Date();
  
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate().toString().padStart(2, '0');
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const goToPreviousWeek = () => {
    const previousWeek = new Date(selectedDate);
    previousWeek.setDate(selectedDate.getDate() - 7);
    onDateChange(previousWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(selectedDate.getDate() + 7);
    onDateChange(nextWeek);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className={`${themeColors.card} rounded-2xl shadow-xl ${themeColors.border} border p-4 sm:p-6 mb-6 transition-all duration-300 hover:shadow-2xl`}>
      {/* Header with Month/Year and Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {formatMonth(selectedDate)}
          </h2>
          {!isToday(selectedDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105"
            >
              Today
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            className="h-9 w-9 p-0 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 w-9 p-0 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
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
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
            className="h-9 w-9 p-0 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week View - Horizontally scrollable on mobile */}
      <div className="mb-6 overflow-hidden">
        <div className="flex space-x-2 sm:grid sm:grid-cols-7 sm:gap-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-hide">
          {weekDates.map((date, index) => {
            const isSelected = isSameDate(date, selectedDate);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={index}
                onClick={() => onDateChange(date)}
                className={`
                  relative flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer
                  transition-all duration-300 hover:scale-105 group min-w-[70px] sm:min-w-0
                  ${isSelected 
                    ? `bg-gradient-to-br ${themeColors.primary} text-white shadow-lg transform scale-105` 
                    : isTodayDate
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                {/* Day name */}
                <span className={`
                  text-xs font-medium mb-1 transition-colors duration-200
                  ${isSelected 
                    ? 'text-white/90' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }
                `}>
                  {formatDayName(date)}
                </span>
                
                {/* Day number */}
                <span className={`
                  text-lg sm:text-xl font-bold transition-colors duration-200
                  ${isSelected 
                    ? 'text-white' 
                    : isTodayDate
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'
                  }
                `}>
                  {formatDayNumber(date)}
                </span>
                
                {/* Today indicator */}
                {isTodayDate && !isSelected && (
                  <div className="absolute -bottom-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30 ring-offset-2 ring-offset-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom section with date info and add task button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">Planning for</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
        
        <Button
          onClick={onAddTask}
          className={`
            bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white 
            shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
            rounded-xl px-6 py-2 w-full sm:w-auto
          `}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

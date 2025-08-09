return (
  <div
    className={`${themeColors.card} rounded-2xl shadow-xl ${themeColors.border} border p-4 sm:p-6 mb-6 transition-all duration-300 hover:shadow-2xl`}
  >
    {/* Header: Month, navigation, today, calendar */}
    <div className="flex items-center justify-between mb-6 bg-white/50 dark:bg-black/10 rounded-xl px-3 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent dark:from-blue-300 dark:to-indigo-400">
          {formatMonth(selectedDate)}
        </h2>
        {!isToday(selectedDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs px-3 py-1 rounded-full font-semibold shadow hover:bg-blue-100 active:scale-95"
          >
            Today
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousWeek}
          className="h-9 w-9 p-0 rounded-full shadow transition hover:bg-blue-50 hover:scale-110"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-full shadow transition hover:bg-blue-50 hover:scale-110"
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
          className="h-9 w-9 p-0 rounded-full shadow transition hover:bg-blue-50 hover:scale-110"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* === Week View === */}
    <div
      className="
        flex gap-2 sm:gap-4 mb-6 overflow-x-auto scrollbar-hide
        sm:grid sm:grid-cols-7 sm:overflow-x-visible
      "
    >
      {weekDates.map((date, i) => {
        const isSelected = isSameDate(date, selectedDate);
        const isTodayDate = isToday(date);
        return (
          <div
            key={i}
            onClick={() => onDateChange(date)}
            className={`
              relative flex flex-col items-center py-2 px-1 min-w-[48px] sm:min-w-0 cursor-pointer select-none
              rounded-xl transition-all group
              hover:scale-105
              ${isSelected
                ? `bg-gradient-to-br ${themeColors.primary} text-white shadow-lg scale-105 border-2 border-white/70`
                : isTodayDate
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
            style={{
              boxShadow: isSelected
                ? '0 4px 16px 2px #4f8bfd33'
                : isTodayDate
                ? '0 1.5px 7px 0 #298cf633'
                : undefined,
              transition: 'all 0.16s cubic-bezier(.4,2,.4,1)'
            }}
          >
            <span
              className={`text-xs font-semibold mb-0.5 tracking-wide 
                ${isSelected ? 'text-white/90' : isTodayDate ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}
              `}
            >
              {formatDayName(date)}
            </span>
            <span
              className={`text-lg sm:text-xl font-extrabold
                ${isSelected
                  ? 'text-white'
                  : isTodayDate
                    ? 'text-blue-700 dark:text-blue-200'
                    : 'text-gray-800 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300'}
              `}
            >
              {formatDayNumber(date)}
            </span>
            {/* Glow for today if not selected */}
            {isTodayDate && !isSelected && (
              <div className="absolute -bottom-1 h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse shadow blur-[1px]"></div>
            )}
            {/* Outline for selection */}
            {isSelected && (
              <div className="absolute inset-0 rounded-xl ring-2 ring-white/50 ring-offset-2 pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>

    {/* === Bottom: Date info + Add Task === */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Planning for</span>
        <div className="mt-0.5 text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
      <Button
        onClick={onAddTask}
        className={`
          bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white 
          font-bold shadow-lg hover:shadow-xl hover:scale-105 transition
          rounded-xl px-6 py-2 min-w-[130px] flex items-center gap-2
        `}
      >
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  </div>
);

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { usePractice } from '@/hooks/usePractice';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target, Clock, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';

export const PracticeCalendar = () => {
  const { sessions } = usePractice();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const monthData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySessions = sessions.filter(s => s.date === dateStr);
      const totalQuestions = daySessions.reduce((sum, s) => sum + s.questions_solved, 0);
      const totalTime = daySessions.reduce((sum, s) => sum + s.time_spent, 0);
      
      let intensity = 0;
      if (totalQuestions > 0) {
        if (totalQuestions >= 100) intensity = 4;
        else if (totalQuestions >= 75) intensity = 3;
        else if (totalQuestions >= 50) intensity = 2;
        else intensity = 1;
      }

      return {
        date,
        dateStr,
        sessions: daySessions,
        totalQuestions,
        totalTime,
        intensity,
      };
    });
  }, [currentDate, sessions]);

  const selectedDateData = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return monthData.find(day => day.dateStr === dateStr);
  }, [selectedDate, monthData]);

  const monthStats = useMemo(() => {
    const monthSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return isSameMonth(sessionDate, currentDate);
    });

    const totalQuestions = monthSessions.reduce((sum, s) => sum + s.questions_solved, 0);
    const totalTime = monthSessions.reduce((sum, s) => sum + s.time_spent, 0);
    const activeDays = new Set(monthSessions.map(s => s.date)).size;
    const totalDaysInMonth = monthData.length;

    const subjectBreakdown = ['Physics', 'Chemistry', 'Mathematics'].map(subject => ({
      subject,
      questions: monthSessions.filter(s => s.subject === subject).reduce((sum, s) => sum + s.questions_solved, 0),
      sessions: monthSessions.filter(s => s.subject === subject).length,
    }));

    return {
      totalQuestions,
      totalTime,
      activeDays,
      totalDaysInMonth,
      consistency: Math.round((activeDays / totalDaysInMonth) * 100),
      avgQuestionsPerDay: activeDays > 0 ? Math.round(totalQuestions / activeDays) : 0,
      subjectBreakdown,
    };
  }, [currentDate, sessions, monthData]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-muted';
      case 1: return 'bg-green-200';
      case 2: return 'bg-green-400';
      case 3: return 'bg-green-600';
      case 4: return 'bg-green-800';
      default: return 'bg-muted';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Practice Calendar
          </h2>
          <p className="text-muted-foreground">Visual overview of your daily practice</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Month Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{monthStats.totalQuestions}</p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{Math.round(monthStats.totalTime / 60)}h</p>
                <p className="text-sm text-muted-foreground">Total Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{monthStats.consistency}%</p>
                <p className="text-sm text-muted-foreground">Consistency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{monthStats.activeDays}</p>
                <p className="text-sm text-muted-foreground">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Practice Heatmap</CardTitle>
              <CardDescription>Intensity based on questions solved per day</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="space-y-4">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2">{day}</div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Padding for first week */}
                  {Array.from({ length: monthData[0]?.date.getDay() || 0 }).map((_, index) => (
                    <div key={`padding-${index}`} className="aspect-square" />
                  ))}
                  
                  {/* Calendar days */}
                  {monthData.map(day => (
                    <button
                      key={day.dateStr}
                      className={`
                        aspect-square p-1 rounded-md text-sm font-medium transition-all
                        ${getIntensityColor(day.intensity)}
                        ${selectedDate && isSameDay(day.date, selectedDate) 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'hover:ring-1 hover:ring-primary/50'
                        }
                        ${day.intensity === 0 ? 'text-muted-foreground' : 'text-white'}
                      `}
                      onClick={() => setSelectedDate(day.date)}
                      title={`${format(day.date, 'MMM d')}: ${day.totalQuestions} questions`}
                    >
                      {format(day.date, 'd')}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map(intensity => (
                    <div
                      key={intensity}
                      className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateData ? (
                <div className="space-y-4">
                  {selectedDateData.sessions.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{selectedDateData.totalQuestions}</p>
                          <p className="text-xs text-muted-foreground">Questions</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {Math.floor(selectedDateData.totalTime / 60)}h {selectedDateData.totalTime % 60}m
                          </p>
                          <p className="text-xs text-muted-foreground">Time</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Sessions ({selectedDateData.sessions.length})</h4>
                        {selectedDateData.sessions.map(session => (
                          <div key={session.id} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline">{session.subject}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {session.time_spent}min
                              </span>
                            </div>
                            <p className="text-sm font-medium">{session.chapter}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">
                                {session.questions_solved} questions
                              </span>
                              {session.accuracy_percentage && (
                                <Badge variant="secondary" className="text-xs">
                                  {session.accuracy_percentage}% accuracy
                                </Badge>
                              )}
                            </div>
                            {session.source && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Source: {session.source}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No practice sessions on this day</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Click on a date to see details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subject Breakdown for Month */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subject Breakdown</CardTitle>
              <CardDescription>This month's distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthStats.subjectBreakdown.map(subject => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{subject.subject}</span>
                    <Badge variant="secondary">{subject.questions}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${monthStats.totalQuestions > 0 
                          ? (subject.questions / monthStats.totalQuestions) * 100 
                          : 0}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{subject.sessions} sessions</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { TrendingUp, Target, Calendar, Trophy, Clock, CheckCircle2, Circle, Flame, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { StudyDistribution } from "./StudyDistribution";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  scheduled_date: string;
  created_at: string;
  duration?: number;
  study_nature?: string;
}

interface ProgressOverviewProps {
  tasks: Task[];
  selectedDate?: Date;
}

export const ProgressOverview = ({
  tasks,
  selectedDate = new Date()
}: ProgressOverviewProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const IST_TIMEZONE = 'Asia/Kolkata';

  // Helper function to get current IST date
  const getCurrentISTDate = (): string => {
    return formatInTimeZone(new Date(), IST_TIMEZONE, 'yyyy-MM-dd');
  };

  // Helper function to format date consistently
  const formatDateForComparison = (date: Date | string): string => {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return formatInTimeZone(date, IST_TIMEZONE, 'yyyy-MM-dd');
  };

  const today = getCurrentISTDate();
  const currentTime = formatInTimeZone(new Date(), IST_TIMEZONE, 'hh:mm a');
  console.log('Today\'s IST date for progress:', today);

  const todayTasks = tasks.filter(task => {
    const taskDate = formatDateForComparison(task.scheduled_date);
    console.log('Comparing task date:', taskDate, 'with today:', today);
    return taskDate === today;
  });

  console.log('Today\'s tasks count:', todayTasks.length);
  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? completedToday / totalToday * 100 : 0;

  // Calculate total duration and completed duration
  const totalDuration = todayTasks.reduce((acc, task) => acc + (task.duration || 0), 0);
  const completedDuration = todayTasks.filter(task => task.completed).reduce((acc, task) => acc + (task.duration || 0), 0);

  // Get priority breakdown
  const priorityBreakdown = todayTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (progressPercentage === 100) return "🎉 Perfect day! You're on fire!";
    if (progressPercentage >= 75) return "🔥 Almost there! Keep pushing!";
    if (progressPercentage >= 50) return "💪 Great progress! You're doing amazing!";
    if (progressPercentage >= 25) return "🚀 Good start! Let's keep the momentum!";
    if (progressPercentage > 0) return "✨ Every step counts! You've got this!";
    return "🎯 Ready to conquer today? Let's start!";
  };

  return (
    <StudyDistribution tasks={tasks} selectedDate={selectedDate} />
  );
};


import { JEEAnalyticsDashboard } from "./JEEAnalyticsDashboard";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  created_at: string;
  scheduled_date: string;
  duration?: number;
  chapter?: string;
}

interface WeeklyAnalyticsProps {
  tasks: Task[];
  onClose: () => void;
}

export const WeeklyAnalytics = ({ tasks, onClose }: WeeklyAnalyticsProps) => {
  return <JEEAnalyticsDashboard tasks={tasks} onClose={onClose} />;
};

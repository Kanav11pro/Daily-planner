
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { formatInTimeZone } from 'date-fns-tz';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  chapter?: string;
  priority: 'low' | 'medium' | 'high';
  duration?: number;
  completed: boolean;
  scheduled_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  createdAt?: string;
}

const IST_TIMEZONE = 'Asia/Kolkata';

// Memoized helper function
const formatDateForDB = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  return formatInTimeZone(date, IST_TIMEZONE, 'yyyy-MM-dd');
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      
      // Transform data with memoization
      const transformedTasks = (data || []).map(task => ({
        ...task,
        createdAt: task.created_at,
        priority: task.priority as 'low' | 'medium' | 'high',
        scheduled_date: formatDateForDB(task.scheduled_date)
      }));
      
      setTasks(transformedTasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const formattedTaskData = {
        ...taskData,
        scheduled_date: formatDateForDB(taskData.scheduled_date),
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([formattedTaskData])
        .select()
        .single();

      if (error) throw error;
      
      const transformedTask = {
        ...data,
        createdAt: data.created_at,
        priority: data.priority as 'low' | 'medium' | 'high',
        scheduled_date: formatDateForDB(data.scheduled_date)
      };
      
      setTasks(prev => [...prev, transformedTask]);
      toast.success('Task added successfully!');
      return transformedTask;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  }, [user]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const { createdAt, ...cleanUpdates } = updates;
      
      if (cleanUpdates.scheduled_date) {
        cleanUpdates.scheduled_date = formatDateForDB(cleanUpdates.scheduled_date);
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedTask = {
        ...data,
        createdAt: data.created_at,
        priority: data.priority as 'low' | 'medium' | 'high',
        scheduled_date: formatDateForDB(data.scheduled_date)
      };
      
      setTasks(prev => prev.map(task => task.id === id ? transformedTask : task));
      toast.success('Task updated successfully!');
      return transformedTask;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  }, []);

  const moveTask = useCallback(async (id: string, newDate: string) => {
    try {
      const formattedDate = formatDateForDB(newDate);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ scheduled_date: formattedDate })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedTask = {
        ...data,
        createdAt: data.created_at,
        priority: data.priority as 'low' | 'medium' | 'high',
        scheduled_date: formatDateForDB(data.scheduled_date)
      };
      
      setTasks(prev => prev.map(task => task.id === id ? transformedTask : task));
      toast.success('Task moved successfully!');
      return transformedTask;
    } catch (error: any) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  }, [tasks, updateTask]);

  // Memoized return object
  const returnValue = useMemo(() => ({
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    moveTask,
    refetch: fetchTasks,
  }), [tasks, loading, addTask, updateTask, deleteTask, toggleTask, moveTask, fetchTasks]);

  return returnValue;
};

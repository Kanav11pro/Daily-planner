import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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
  // Add alias for compatibility with existing components
  createdAt?: string;
}

// Helper function to format date consistently
const formatDateForDB = (date: Date | string): string => {
  if (typeof date === 'string') {
    // If it's already a string, ensure it's in YYYY-MM-DD format
    return date.split('T')[0];
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      
      // Transform data to include createdAt alias for compatibility
      const transformedTasks = (data || []).map(task => ({
        ...task,
        createdAt: task.created_at,
        priority: task.priority as 'low' | 'medium' | 'high',
        scheduled_date: formatDateForDB(task.scheduled_date) // Ensure consistent date format
      }));
      
      setTasks(transformedTasks);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'createdAt'>) => {
    if (!user) return;

    try {
      // Ensure the scheduled_date is in the correct format
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
      toast.error('Failed to add task');
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Remove fields that don't exist in the database schema and format dates
      const { createdAt, ...cleanUpdates } = updates;
      
      // If scheduled_date is being updated, format it properly
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
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const moveTask = async (id: string, newDate: string) => {
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
      toast.error('Failed to move task');
      console.error('Error moving task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  };

  const copyTask = async (task: Task, newDate: string) => {
    if (!user) return;

    try {
      // Create a new task with the same data but different date and without id
      const { id, created_at, updated_at, user_id, createdAt, ...taskData } = task;
      const newTaskData = {
        ...taskData,
        scheduled_date: formatDateForDB(newDate),
        completed: false, // Reset completion status for copied task
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTaskData])
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
      toast.success('Task copied successfully!');
      return transformedTask;
    } catch (error: any) {
      toast.error('Failed to copy task');
      console.error('Error copying task:', error);
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    moveTask,
    copyTask,
    refetch: fetchTasks,
  };
};

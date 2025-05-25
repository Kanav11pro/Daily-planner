
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
}

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
      setTasks(data || []);
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

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [...prev, data]);
      toast.success('Task added successfully!');
      return data;
    } catch (error: any) {
      toast.error('Failed to add task');
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      toast.success('Task updated successfully!');
      return data;
    } catch (error: any) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
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

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refetch: fetchTasks,
  };
};

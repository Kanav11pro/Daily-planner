import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface QuickTag {
  id: string;
  user_id: string;
  name: string;
  icon?: string;
  study_nature: 'Theory' | 'Practice' | 'Revision';
  color_class: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useQuickTags = () => {
  const [tags, setTags] = useState<QuickTag[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchTags = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quick_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching tags:', error);
        return;
      }

      setTags(data?.map(tag => ({
        ...tag,
        study_nature: tag.study_nature as 'Theory' | 'Practice' | 'Revision'
      })) || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (tagData: Omit<QuickTag, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('quick_tags')
        .insert([{
          ...tagData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding tag:', error);
        return null;
      }

      setTags(prev => [...prev, {
        ...data,
        study_nature: data.study_nature as 'Theory' | 'Practice' | 'Revision'
      }]);
      return data;
    } catch (error) {
      console.error('Error adding tag:', error);
      return null;
    }
  };

  const updateTag = async (tagId: string, updates: Partial<QuickTag>) => {
    try {
      const { data, error } = await supabase
        .from('quick_tags')
        .update(updates)
        .eq('id', tagId)
        .select()
        .single();

      if (error) {
        console.error('Error updating tag:', error);
        return null;
      }

      setTags(prev => prev.map(tag => tag.id === tagId ? {
        ...data,
        study_nature: data.study_nature as 'Theory' | 'Practice' | 'Revision'
      } : tag));
      return data;
    } catch (error) {
      console.error('Error updating tag:', error);
      return null;
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('quick_tags')
        .delete()
        .eq('id', tagId);

      if (error) {
        console.error('Error deleting tag:', error);
        return false;
      }

      setTags(prev => prev.filter(tag => tag.id !== tagId));
      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTags();
  }, [user]);

  return {
    tags,
    loading,
    fetchTags,
    addTag,
    updateTag,
    deleteTag,
  };
};
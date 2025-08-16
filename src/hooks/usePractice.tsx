import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PracticeSession {
  id: string;
  user_id: string;
  date: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  chapter: string;
  source: 'Module' | 'PYQs' | 'CPPs' | 'Reference Books' | 'Custom';
  source_details?: string;
  questions_target: number;
  questions_solved: number;
  time_spent: number;
  difficulty_level?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  accuracy_percentage?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PracticeChapter {
  id: string;
  user_id: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  chapter_name: string;
  total_questions: number;
  total_time: number;
  last_practiced?: string;
  revision_priority: number;
  mastery_level: number;
  created_at: string;
  updated_at: string;
}

export interface PracticeTarget {
  id: string;
  user_id: string;
  target_type: 'Daily' | 'Weekly' | 'Monthly';
  subject: string;
  questions_target: number;
  time_target: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export const usePractice = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [chapters, setChapters] = useState<PracticeChapter[]>([]);
  const [targets, setTargets] = useState<PracticeTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(100); // Limit for better performance
      
      if (error) {
        console.error('Error fetching practice sessions:', error);
        return;
      }
      
      setSessions((data as PracticeSession[]) || []);
    } catch (error) {
      console.error('Unexpected error fetching sessions:', error);
    }
  }, [user?.id]);

  const fetchChapters = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('practice_chapters')
        .select('*')
        .eq('user_id', user.id)
        .order('subject', { ascending: true });
      
      if (error) {
        console.error('Error fetching practice chapters:', error);
        return;
      }
      
      setChapters((data as PracticeChapter[]) || []);
    } catch (error) {
      console.error('Unexpected error fetching chapters:', error);
    }
  }, [user?.id]);

  const fetchTargets = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('practice_targets')
        .select('*')
        .eq('user_id', user.id)
        .order('target_type', { ascending: true });
      
      if (error) {
        console.error('Error fetching practice targets:', error);
        return;
      }
      
      setTargets((data as PracticeTarget[]) || []);
    } catch (error) {
      console.error('Unexpected error fetching targets:', error);
    }
  }, [user?.id]);

  const addSession = async (sessionData: Omit<PracticeSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('practice_sessions')
      .insert([{ ...sessionData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding practice session:', error);
      throw error;
    }

    // Immediately update the sessions state for instant UI update
    setSessions(prev => [data as PracticeSession, ...prev]);
    
    // Update or create chapter record
    await updateChapterProgress(sessionData.subject, sessionData.chapter, sessionData.questions_solved, sessionData.time_spent);
    
    return data;
  };

  const updateChapterProgress = async (subject: string, chapterName: string, questions: number, time: number) => {
    if (!user) return;

    const existingChapter = chapters.find(
      c => c.subject === subject && c.chapter_name === chapterName
    );

    if (existingChapter) {
      const updatedChapter = {
        ...existingChapter,
        total_questions: existingChapter.total_questions + questions,
        total_time: existingChapter.total_time + time,
        last_practiced: new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('practice_chapters')
        .update({
          total_questions: updatedChapter.total_questions,
          total_time: updatedChapter.total_time,
          last_practiced: updatedChapter.last_practiced,
        })
        .eq('id', existingChapter.id)
        .select()
        .single();

      if (!error && data) {
        setChapters(prev => prev.map(c => c.id === existingChapter.id ? data as PracticeChapter : c));
      }
    } else {
      const { data, error } = await supabase
        .from('practice_chapters')
        .insert([{
          user_id: user.id,
          subject,
          chapter_name: chapterName,
          total_questions: questions,
          total_time: time,
          last_practiced: new Date().toISOString().split('T')[0],
        }])
        .select()
        .single();

      if (!error && data) {
        setChapters(prev => [...prev, data as PracticeChapter]);
      }
    }
  };

  const addTarget = async (targetData: Omit<PracticeTarget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('practice_targets')
      .insert([{ ...targetData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding practice target:', error);
      throw error;
    }

    // Immediately update targets state
    setTargets(prev => [...prev, data as PracticeTarget]);
    return data;
  };

  const updateTarget = async (id: string, updates: Partial<PracticeTarget>) => {
    const { data, error } = await supabase
      .from('practice_targets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating practice target:', error);
      throw error;
    }

    setTargets(prev => prev.map(t => t.id === id ? data as PracticeTarget : t));
    return data;
  };

  const deleteTarget = async (id: string) => {
    const { error } = await supabase
      .from('practice_targets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting practice target:', error);
      throw error;
    }

    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const updateSession = async (id: string, updates: Partial<PracticeSession>) => {
    const { data, error } = await supabase
      .from('practice_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating practice session:', error);
      throw error;
    }

    setSessions(prev => prev.map(s => s.id === id ? data as PracticeSession : s));
    return data;
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('practice_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting practice session:', error);
      throw error;
    }

    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Optimized data loading with parallel execution and caching
  useEffect(() => {
    if (user && !initialized) {
      const loadData = async () => {
        setLoading(true);
        try {
          // Load data in parallel for better performance
          await Promise.all([fetchSessions(), fetchChapters(), fetchTargets()]);
        } catch (error) {
          console.error('Error loading practice data:', error);
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      };
      loadData();
    } else if (!user) {
      setSessions([]);
      setChapters([]);
      setTargets([]);
      setInitialized(false);
      setLoading(false);
    }
  }, [user, initialized, fetchSessions, fetchChapters, fetchTargets]);

  const analytics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekStart = thisWeek.toISOString().split('T')[0];

    const todaySessions = sessions.filter(s => s.date === today);
    const weekSessions = sessions.filter(s => s.date >= weekStart);

    return {
      today: {
        questionsTotal: todaySessions.reduce((sum, s) => sum + s.questions_solved, 0),
        timeTotal: todaySessions.reduce((sum, s) => sum + s.time_spent, 0),
        sessionsCount: todaySessions.length,
      },
      week: {
        questionsTotal: weekSessions.reduce((sum, s) => sum + s.questions_solved, 0),
        timeTotal: weekSessions.reduce((sum, s) => sum + s.time_spent, 0),
        sessionsCount: weekSessions.length,
      },
      subjects: ['Physics', 'Chemistry', 'Mathematics'].map(subject => ({
        name: subject,
        questions: sessions.filter(s => s.subject === subject).reduce((sum, s) => sum + s.questions_solved, 0),
        time: sessions.filter(s => s.subject === subject).reduce((sum, s) => sum + s.time_spent, 0),
      })),
    };
  }, [sessions]);

  return useMemo(() => ({
    sessions,
    chapters,
    targets,
    loading,
    analytics,
    addSession,
    updateSession,
    deleteSession,
    addTarget,
    updateTarget,
    deleteTarget,
    fetchSessions,
    fetchChapters,
    fetchTargets,
  }), [sessions, chapters, targets, loading, analytics, user, fetchSessions, fetchChapters, fetchTargets]);
};

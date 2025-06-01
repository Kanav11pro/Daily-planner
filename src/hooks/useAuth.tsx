
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          onboarding_completed: false,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateUserMetadata = async (metadata: any) => {
    console.log('Updating user metadata with:', metadata);
    
    try {
      // Update auth metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (authError) {
        console.error('Auth metadata update error:', authError);
        return { data: authData, error: authError };
      }

      // Also update the profiles table if it exists
      if (user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || metadata.full_name,
            // Add onboarding data to profiles table
            exam: metadata.exam,
            exam_other: metadata.exam_other,
            institute: metadata.institute,
            institute_other: metadata.institute_other,
            study_hours: metadata.study_hours,
            challenge: metadata.challenge,
            onboarding_completed: metadata.onboarding_completed,
            updated_at: new Date().toISOString()
          })
          .select();

        if (profileError) {
          console.error('Profile update error:', profileError);
          // Don't return error here as auth update succeeded
        } else {
          console.log('Profile updated successfully:', profileData);
        }
      }

      console.log('User metadata updated successfully');
      return { data: authData, error: null };
    } catch (error) {
      console.error('Error updating user metadata:', error);
      return { data: null, error };
    }
  };

  const isOnboardingCompleted = () => {
    const completed = user?.user_metadata?.onboarding_completed === true;
    console.log('Checking onboarding completion:', completed, user?.user_metadata);
    return completed;
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserMetadata,
    isOnboardingCompleted,
  };
};

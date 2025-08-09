
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setUserMetadata(session?.user?.user_metadata ?? null);
        setLoading(false);
        
        // Secure logging for auth state changes
        secureLog.debug('Auth state change:', { event, userId: session?.user?.id });
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserMetadata(session?.user?.user_metadata ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Security improvement: Add emailRedirectTo for proper email confirmation
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            onboarding_completed: false,
          },
        },
      });
      
      if (error) {
        secureLog.error('Sign up error:', error);
        return { data, error };
      }
      
      secureLog.info('User signed up successfully');
      return { data, error };
    } catch (error) {
      secureLog.error('Unexpected sign up error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        secureLog.error('Sign in error:', error);
        return { data, error };
      }
      
      secureLog.info('User signed in successfully');
      return { data, error };
    } catch (error) {
      secureLog.error('Unexpected sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        secureLog.error('Sign out error:', error);
        return { error };
      }
      
      secureLog.info('User signed out successfully');
      return { error };
    } catch (error) {
      secureLog.error('Unexpected sign out error:', error);
      return { error };
    }
  };

  const updateUserMetadata = async (metadata: any) => {
    secureLog.debug('Updating user metadata');
    
    try {
      // Update auth metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (authError) {
        secureLog.error('Auth metadata update error:', authError);
        return { data: authData, error: authError };
      }

      // Update local state
      setUserMetadata(metadata);

      // Update the profiles table with onboarding data
      if (user?.id) {
        // Process the challenge array properly
        let challengeValue = '';
        if (Array.isArray(metadata.challenge)) {
          challengeValue = metadata.challenge.join(', ');
        } else if (typeof metadata.challenge === 'string') {
          challengeValue = metadata.challenge;
        }

        const profileUpdateData = {
          id: user.id,
          full_name: user.user_metadata?.full_name || metadata.full_name,
          exam: metadata.exam,
          exam_other: metadata.exam_other,
          institute: metadata.institute,
          institute_other: metadata.institute_other,
          study_hours: metadata.study_hours,
          challenge: challengeValue,
          onboarding_completed: metadata.onboarding_completed,
          updated_at: new Date().toISOString()
        };

        secureLog.debug('Updating profiles table');

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert(profileUpdateData)
          .select();

        if (profileError) {
          secureLog.error('Profile update error:', profileError);
          // Don't return error here as auth update succeeded
        } else {
          secureLog.info('Profile updated successfully');
        }
      }

      secureLog.info('User metadata updated successfully');
      return { data: authData, error: null };
    } catch (error) {
      secureLog.error('Error updating user metadata:', error);
      return { data: null, error };
    }
  };

  const isOnboardingCompleted = () => {
    const completed = user?.user_metadata?.onboarding_completed === true;
    secureLog.debug('Checking onboarding completion:', completed);
    return completed;
  };

  return {
    user,
    session,
    loading,
    userMetadata,
    signUp,
    signIn,
    signOut,
    updateUserMetadata,
    isOnboardingCompleted,
  };
};

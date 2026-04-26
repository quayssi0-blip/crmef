'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getSupabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error) {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithEmail = async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) return { error: { message: 'Supabase غير مهيأ' } };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error };
      }
      return { error: null, data };
    } catch (err) {
      return { error: { message: err.message || 'حدث خطأ في تسجيل الدخول' } };
    }
  };

  const signUpWithEmail = async (email, password, fullName) => {
    const supabase = getSupabase();
    if (!supabase) return { error: { message: 'Supabase غير مهيأ' } };
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) {
        return { error };
      }
      return { error: null, data };
    } catch (err) {
      return { error: { message: err.message || 'حدث خطأ في الاتصال بالخادم' } };
    }
  };

  const signInWithTaalimMa = async (taalimEmail, password) => {
    const supabase = getSupabase();
    if (!supabase) return { error: { message: 'Supabase غير مهيأ' } };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: taalimEmail,
        password,
      });
      if (error) {
        return { error };
      }
      return { error: null, data };
    } catch (err) {
      return { error: { message: err.message || 'حدث خطأ في تسجيل الدخول' } };
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return { error: { message: 'Supabase غير مهيأ' } };
    try {
      const { error } = await supabase.auth.signOut();
      setProfile(null);
      return { error };
    } catch (err) {
      return { error: { message: err.message || 'حدث خطأ في تسجيل الخروج' } };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithTaalimMa,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

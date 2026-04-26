  const signInWithEmail = async (email, password) => {
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
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithTaalimMa } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signInWithEmail(email, password);

    if (error) {
      const msg = error.message || String(error);
      if (msg.includes('Invalid login credentials') || msg.includes('Invalid password') || msg.includes('no user') || msg.includes('Email not found')) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (msg.includes('network') || msg.includes('Network') || msg.includes('Failed to fetch')) {
        setError('خطأ في الاتصال بالخادم، يرجى التأكد من اتصالك بالإنترنت');
      } else {
        setError('حدث خطأ في تسجيل الدخول: ' + msg);
      }
    } else {
      router.push('/');
    }

    setLoading(false);
  };

  const handleTaalimMaLogin = async () => {
    if (!email.endsWith('@taalim.ma')) {
      setError('يجب استخدام بريد taalim.ma');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signInWithTaalimMa(email, password);
    if (error) {
      const msg = error.message || String(error);
      if (msg.includes('Invalid login credentials') || msg.includes('Invalid password') || msg.includes('no user') || msg.includes('Email not found')) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (msg.includes('network') || msg.includes('Network')) {
        setError('خطأ في الاتصال بالخادم');
      } else {
        setError('فشل تسجيل الدخول: ' + msg);
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 flex items-center justify-center pt-16" dir="rtl">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">ر</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">الرئيس_CONNECT</h1>
          <p className="text-slate-600 mt-2">تسجيل الدخول إلى منصة التعلم بين الأقران</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                placeholder="example@taalim.ma"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Taalim.ma specific login */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-3 text-center">
              للعاملين في قطاع التعليم باستخدام حساب taalim.ma
            </p>
            <button
              onClick={handleTaalimMaLogin}
              disabled={loading}
              className="w-full py-3 bg-[#008751] text-white rounded-lg font-medium hover:bg-[#007a47] transition-colors disabled:opacity-50"
            >
              دخول عبر نظام taalim.ma
            </button>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-slate-600">
            ليس لديك حساب؟{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

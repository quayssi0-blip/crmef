'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createSupabaseBrowserClient();

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        // Handle specific auth errors
        if (error?.message?.includes('Invalid Refresh Token')) {
          // Token is invalid, clear it and redirect to login
          await supabase.auth.signOut({ scope: 'local' });
          router.push('/auth/login');
          return;
        }

        if (error) {
          setError(error.message);
          return;
        }

        const type = searchParams.get('type');
        if (type === 'signup') {
          setMessage('تم التحقق من بريدك الإلكتروني بنجاح!');
          setTimeout(() => router.push('/'), 2000);
        } else {
          router.push('/');
        }
      } catch (err) {
        // Network or unexpected error - let client-side auth handle it
        router.push('/');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">حدث خطأ</h2>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">جاري التحقق...</h2>
        <p className="text-slate-600">{message || 'يرجى الانتظار'}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">جاري التحميل...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
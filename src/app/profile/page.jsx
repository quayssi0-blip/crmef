'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  useEffect(() => {
    if (profile) {
      gsap.fromTo('.profile-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center pt-20" dir="rtl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pt-20" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-8">
          ← العودة للرئيسية
        </Link>

        {/* Profile Card */}
        <div className="profile-card bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-4xl">
                {(profile?.full_name || user.email || 'ع').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {profile?.full_name || 'معلم'}
              </h1>
              <p className="text-slate-600">{user.email}</p>
              {profile?.school_name && (
                <p className="text-slate-500 mt-1">{profile.school_name}</p>
              )}
              {profile?.specialization && (
                <p className="text-blue-600 mt-1">{profile.specialization}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600" id="videos-count">0</p>
              <p className="text-slate-600 text-sm">كبسولات</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600" id="likes-count">0</p>
              <p className="text-slate-600 text-sm">إعجابات</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600" id="comments-count">0</p>
              <p className="text-slate-600 text-sm">تعليقات</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-600" id="views-count">0</p>
              <p className="text-slate-600 text-sm">مشاهدات</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSignOut}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* User Content Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* My Videos */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">كبسلاتي</h2>
            <div id="user-videos" className="space-y-3">
              <p className="text-slate-500 text-center py-8">
                لا توجد كبسلات بعد
              </p>
            </div>
            <Link href="/capsules" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              عرض جميع الكبسولات →
            </Link>
          </div>

          {/* My Resources */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">مواردي</h2>
            <div id="user-resources" className="space-y-3">
              <p className="text-slate-500 text-center py-8">
                لا توجد موارد بعد
              </p>
            </div>
            <Link href="/resources" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              عرض جميع الموارد →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

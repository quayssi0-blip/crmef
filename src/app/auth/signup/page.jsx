'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    location: '',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    const { error } = await signUpWithEmail(
      formData.email,
      formData.password,
      formData.fullName
    );

    if (error) {
      if (error.message.includes('already registered')) {
        setError('هذا البريق الإلكتروني مسجل مسبقاً');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب');
      }
    } else {
      router.push('/auth/login?message=check-email');
    }

    setLoading(false);
  };

  const subjects = [
    { value: 'arabic', label: 'العربية' },
    { value: 'french', label: 'الفرنسية' },
    { value: 'math', label: 'الرياضيات' },
    { value: 'science', label: 'العلوم' },
    { value: 'islamic', label: 'التربية الإسلامية' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 flex items-center justify-center pt-16" dir="rtl">
      <div className="w-full max-w-2xl mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">ر</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">الرائد_CONNECT</h1>
          <p className="text-slate-600 mt-2">انضم إلى مجتمع المعلمين المبتكرين</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  كلمة المرور *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  تأكيد كلمة المرور *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                />
              </div>

              {/* School */}
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-slate-700 mb-2">
                  اسم المدرسة
                </label>
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  المدينة / المنطقة
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-zen"
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-slate-700 mb-2">
                تخصصك الرئيسي
              </label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">اختر تخصصك</option>
                {subjects.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-4 text-xs text-slate-500 text-center">
            بإنشاء الحساب، أنت توافق على{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              شروط الاستخدام
            </Link>{' '}
            و{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              سياسة الخصوصية
            </Link>
          </p>

          {/* Login link */}
          <p className="mt-6 text-center text-slate-600">
            لديك حساب مسبقاً؟{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              تسجيل الدخول
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
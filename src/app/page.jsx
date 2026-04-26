'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Home() {
  useEffect(() => {
    // Entrance animations
    gsap.fromTo('.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo('.hero-buttons',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
    );
    gsap.fromTo('.feature-card',
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15, delay: 0.8 }
    );
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6z" />
        </svg>
      ),
      title: 'كبسلات قصيرة',
      description: 'مقاطع فيديو 3-5 دقائق تركز على تقنيات تدريس محددة',
      color: 'from-blue-100 to-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      title: 'مجتمع متعاون',
      description: 'تواصل مع زملائك المعلمين وشارك الخبرات',
      color: 'from-green-100 to-green-200',
      iconColor: 'text-green-600',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      title: 'موارد جاهزة',
      description: 'ملفات LaTeX، عروض Beamer، وامتحانات قابلة للتخصيص',
      color: 'from-amber-100 to-amber-200',
      iconColor: 'text-amber-600',
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 5.751a2.51 2.51 0 010 1.152L9.75 7.949l3-1.5a1 1 0 000-1.84l-7-3z" />
          <path d="M11.07 15.247a1 1 0 00-.988 0l-5 2.5a1 1 0 000 1.598l5 2.5a1 1 0 00.988 0l5-2.5a1 1 0 000-1.598l-5-2.5z" />
        </svg>
      ),
      title: 'طرق تدريس مبتكرة',
      description: 'التعلم النشط (TaRL) والتدريس الصريح',
      color: 'from-purple-100 to-purple-200',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50" dir="rtl">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="hero-title">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              منصة<span className="text-blue-600"> الرائد</span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-light text-blue-700 mb-6">
              CONNECT
            </h2>
          </div>
          <p className="hero-subtitle text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            منصة التعلم بين الأقران للمعلمين المغاربة في المدارس الرائدة
          </p>
          <p className="hero-subtitle text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
            شارك كبسلات تعليمية قصيرة، تواصل مع زملائك، وطور مهاراتك التربوية
          </p>
          <div className="hero-buttons flex flex-wrap gap-4 justify-center">
            <Link
              href="/capsules"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              استكشف الكبسلات
            </Link>
            <Link
              href="/resources"
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl text-lg font-medium hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              تصفح الموارد
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 ${feature.iconColor}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Context */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">ضمن مشروع البحث التربوي</h2>
          <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
            &ldquo;تأثير التدريب twisty بين الأقران على الأداء التربوي للمعلمين في المدارس الرائدة&rdquo;
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm opacity-80">
            <span className="px-4 py-2 bg-white/20 rounded-full">التعلم النشط (TaRL)</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">التدريس الصريح</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">الممارسة الموجهة</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">التقويم التشخيصي</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            انضم إلى مجتمع التعلم
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            سجّل الآن وابدأ في مشاركة خبراتك واستفد من زملائك المعلمين
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl text-lg font-medium hover:border-blue-300 transition-all"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ر</span>
            </div>
            <span className="font-bold text-2xl text-white">الرائد_CONNECT</span>
          </div>
          <p className="mb-4">
            منصة التعلم بين الأقران للمعلمين المغاربة
          </p>
          <p className="text-sm opacity-60">
            © 2024 Ar-Ra&apos;id Connect. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
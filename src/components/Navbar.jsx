'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // GSAP animation for nav bar appearance
    if (isScrolled) {
      gsap.to('.navbar-bg', {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        duration: 0.3,
      });
    } else {
      gsap.to('.navbar-bg', {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        duration: 0.3,
      });
    }
  }, [isScrolled]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 navbar-bg backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ر</span>
            </div>
            <span className="font-bold text-xl text-slate-800">الرائد_CONNECT</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              الصفحة الرئيسية
            </a>
            <a href="#capsules" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              الكبسولات
            </a>
            <a href="#resources" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              الموارد
            </a>
            <a href="#forum" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              المنتدى
            </a>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">{profile?.full_name || user.email}</p>
                  <p className="text-xs text-slate-500">{profile?.school_name || 'معلم'}</p>
                </div>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <>
                <button className="px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors">
                  تسجيل الدخول
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  إنشاء حساب
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-3">
              <a href="#" className="text-slate-600 hover:text-blue-600 py-2">الصفحة الرئيسية</a>
              <a href="#capsules" className="text-slate-600 hover:text-blue-600 py-2">الكبسولات</a>
              <a href="#resources" className="text-slate-600 hover:text-blue-600 py-2">الموارد</a>
              <a href="#forum" className="text-slate-600 hover:text-blue-600 py-2">المنتدى</a>
              <div className="pt-3 border-t border-slate-200">
                {user ? (
                  <button onClick={signOut} className="w-full text-left py-2 text-slate-600">
                    تسجيل الخروج
                  </button>
                ) : (
                  <>
                    <button className="w-full text-left py-2 text-slate-600">تسجيل الدخول</button>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg mt-2">إنشاء حساب</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
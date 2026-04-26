'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'الصفحة الرئيسية' },
    { href: '/capsules', label: 'الكبسولات' },
    { href: '/resources', label: 'الموارد' },
  ];

  const authLinks = user ? [
    { href: '/profile', label: 'ملفي', requiresAuth: true },
  ] : [
    { href: '/auth/login', label: 'تسجيل الدخول' },
    { href: '/auth/signup', label: 'إنشاء حساب', className: 'bg-blue-600 text-white rounded-lg hover:bg-blue-700 px-6' },
  ];

  const NavLink = ({ href, label, className = 'text-slate-600 hover:text-blue-600 transition-colors font-medium' }) => (
    <Link
      href={href}
      className={className}
      onClick={() => setMobileMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 navbar-bg backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ر</span>
              </div>
            </Link>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-bold text-xl text-slate-800">
              الرائد_CONNECT
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{profile?.full_name || user.email}</p>
                  <p className="text-xs text-slate-500">{profile?.school_name || profile?.specialization || 'معلم'}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink href="/auth/login" />
                <NavLink href="/auth/signup" className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-6 py-2" />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
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
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} className="py-2" />
              ))}
              <div className="pt-3 border-t border-slate-200">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block py-2 text-slate-600 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ملفي الشخصي
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-right py-2 text-slate-600 hover:text-blue-600"
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink href="/auth/login" className="py-2" />
                    <NavLink href="/auth/signup" className="py-2 bg-blue-600 text-white rounded-lg text-center mt-2" />
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

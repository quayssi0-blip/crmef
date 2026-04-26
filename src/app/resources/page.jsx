'use client';

import { useState } from 'react';
import { useResources } from '@/hooks/useResources';
import ResourceCard from '@/components/ResourceCard';
import FilterBar from '@/components/FilterBar';
import gsap from 'gsap';

export default function ResourcesPage() {
  const { resources, loading, error, totalCount, filters, updateFilters, clearFilters } = useResources();

  // Animate cards
  useState(() => {
    if (!loading && resources.length > 0) {
      gsap.fromTo('.resource-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pt-20" dir="rtl">
      <div className="container-zen py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            مستودع الموارد
          </h1>
          <p className="text-lg text-slate-600">
            وثائق، عروض، وامتحانات جاهزة للاستخدام في صفك
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />

        {/* Stats */}
        {!loading && (
          <div className="mb-6 text-slate-600">
            <span className="font-medium">{totalCount}</span> مورد متاح
          </div>
        )}

        {/* Resources grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">حدث خطأ: {error}</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-medium text-slate-700 mb-2">لا توجد موارد</h3>
            <p className="text-slate-500">جرب تغيير معايير البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
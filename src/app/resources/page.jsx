'use client';

import { useState, useEffect } from 'react';
import { useResources } from '@/hooks/useResources';
import ResourceCard from '@/components/ResourceCard';
import FilterBar from '@/components/FilterBar';
import AddResourceModal from '@/components/modals/AddResourceModal';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';
import Link from 'next/link';

export default function ResourcesPage() {
  const { resources, loading, error, totalCount, filters, updateFilters, clearFilters } = useResources();
  const { user } = useAuth();
  const [addResourceOpen, setAddResourceOpen] = useState(false);

  // Animate cards
  useEffect(() => {
    if (!loading && resources.length > 0) {
      gsap.fromTo('.resource-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading, resources]);

  const handleResourceAdded = (newResource) => {
    // Optimistically add the new resource to the list
    setResources(prev => [newResource, ...prev]);
  };

  // Local state for optimistic updates
  const [localResources, setResources] = useState([]);
  useEffect(() => {
    setResources(resources);
  }, [resources]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pt-20" dir="rtl">
      <div className="container-zen py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                مستودع الموارد
              </h1>
              <p className="text-lg text-slate-600">
                وثائق، عروض، وامتحانات جاهزة للاستخدام في صفك
              </p>
            </div>
            {user && (
              <button
                onClick={() => setAddResourceOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إضافة مورد
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6 text-slate-600">
            <span className="font-medium">{totalCount}</span> مورد متاح
          </div>
        )}

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />

        {/* Resources grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">حدث خطأ: {error}</p>
          </div>
        ) : localResources.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-medium text-slate-700 mb-2">لا توجد موارد</h3>
            {user && (
              <p className="text-slate-500 mb-4">أضف موردك الأول للمساعدة في زملائك</p>
            )}
            {user && (
              <button
                onClick={() => setAddResourceOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                إضافة مورد
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {localResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={addResourceOpen}
        onClose={() => setAddResourceOpen(false)}
        onSuccess={handleResourceAdded}
      />
    </div>
  );
}

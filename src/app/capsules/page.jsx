'use client';

import { useState, useEffect } from 'react';
import { useVideos } from '@/hooks/useVideos';
import VideoCard from '@/components/VideoCard';
import FilterBar from '@/components/FilterBar';
import VideoModal from '@/components/modals/VideoModal';
import gsap from 'gsap';

export default function CapsulesPage() {
  const { videos, loading, error, totalCount, filters, updateFilters, clearFilters } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Animate cards on load
  useEffect(() => {
    if (!loading && videos.length > 0) {
      gsap.fromTo('.video-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading, videos]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    gsap.to('.modal-overlay', {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setModalOpen(false);
        setSelectedVideo(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pt-20" dir="rtl">
      <div className="container-zen py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            كبسلات تربوية
          </h1>
          <p className="text-lg text-slate-600">
            استكشف مكتبة الكبسلات القصيرة من معلمين متميزين في المدارس الرائدة
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
            <span className="font-medium">{totalCount}</span> كبسلة متاحة
          </div>
        )}

        {/* Videos grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">حدث خطأ: {error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-medium text-slate-700 mb-2">لا توجد كبسلات</h3>
            <p className="text-slate-500">جرب تغيير معايير البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onSelect={handleVideoSelect}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalCount > (filters.limit || 12) && (
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(totalCount / (filters.limit || 12)) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => updateFilters({ page })}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filters.page === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {modalOpen && selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
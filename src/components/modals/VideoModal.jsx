'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useVideoById } from '@/hooks/useVideos';
import CommentSection from '@/components/CommentSection';
import gsap from 'gsap';

export default function VideoModal({ video, onClose }) {
  const { user } = useAuth();
  const { video: videoData, loading } = useVideoById(video?.id);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    gsap.fromTo('.modal-content',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getApproachLabel = (approach) => {
    const labels = {
      tal: 'التعلم النشط',
      explicit_teaching: 'التدريس الصريح',
      other: 'أخرى',
    };
    return labels[approach] || approach;
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      arabic: 'العربية',
      french: 'الفرنسية',
      math: 'الرياضيات',
      science: 'العلوم',
      islamic: 'التربية الإسلامية',
      geography: 'الجغرافيا',
      history: 'التاريخ',
    };
    return labels[subject] || subject;
  };

  const getGradeLabel = (grade) => {
    const labels = {
      '1st': 'السنة الأولى',
      '2nd': 'السنة الثانية',
      '3rd': 'السنة الثالثة',
      '4th': 'السنة الرابعة',
      '5th': 'السنة الخامسة',
      '6th': 'السنة السادسة',
    };
    return labels[grade] || grade;
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal-content bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-4 left-4 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Video section */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="aspect-video flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : videoData?.video_url ? (
              <video
                key={video.id}
                className="w-full bg-black"
                controls
                autoPlay
                controlsList="nodownload"
              >
                <source src={videoData.video_url} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto text-blue-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <p className="text-slate-600">فيديو غير متاح</p>
                </div>
              </div>
            )}

            {/* Video info */}
            <div className="p-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {getApproachLabel(videoData?.pedagogical_approach)}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {getSubjectLabel(videoData?.subject)}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {getGradeLabel(videoData?.grade_level)}
                </span>
                {videoData?.tags?.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-800 mb-4">
                {videoData?.title}
              </h1>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed mb-6">
                {videoData?.description || 'لا يوجد وصف'}
              </p>

              {/* Author */}
              <div className="flex items-center justify-between py-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {videoData?.profiles?.avatar_url ? (
                    <img
                      src={videoData.profiles.avatar_url}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                      <span className="text-blue-600 text-xl font-bold">
                        {videoData?.profiles?.full_name?.charAt(0) || 'م'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800">
                      {videoData?.profiles?.full_name || 'مجهول'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {videoData?.profiles?.school_name || 'مدرسة'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => user && setIsLiked(!isLiked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{videoData?.like_count || 0}</span>
                  </button>

                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>{videoData?.view_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="lg:col-span-1 border-r border-slate-100">
            <div className="p-6">
              <CommentSection videoId={video.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
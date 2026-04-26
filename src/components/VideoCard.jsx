'use client';

import { useAuth } from '@/hooks/useAuth';
import { useVideoById } from '@/hooks/useVideos';
import gsap from 'gsap';

export default function VideoCard({ video, index = 0, onSelect }) {
  const { user, profile } = useAuth();

  const handleCardClick = () => {
    // GSAP animation on click
    gsap.to(`#video-card-${video.id}`, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
    onSelect?.(video);
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
      id={`video-card-${video.id}`}
      className="video-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
      onClick={handleCardClick}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-200">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration_seconds)}
        </div>

        {/* Approach badge */}
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {getApproachLabel(video.pedagogical_approach)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">
          {video.title}
        </h3>

        <p className="text-sm text-slate-500 mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* Meta tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
            {getSubjectLabel(video.subject)}
          </span>
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
            {getGradeLabel(video.grade_level)}
          </span>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            {video.profiles?.avatar_url ? (
              <img
                src={video.profiles.avatar_url}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">
                  {video.profiles?.full_name?.charAt(0) || 'م'}
                </span>
              </div>
            )}
            <span>{video.profiles?.full_name || 'مجهول'}</span>
          </div>
          <span>{video.view_count || 0} مشاهدة</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            {video.like_count || 0}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            {video.comment_count || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
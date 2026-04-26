'use client';

import gsap from 'gsap';

export default function ResourceCard({ resource, index = 0, onDownload }) {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'غير معروف';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} ميجابايت`;
  };

  const getResourceTypeLabel = (type) => {
    const labels = {
      latex: 'LaTeX',
      beamer: 'Beamer',
      exam: 'امتحان',
      worksheet: 'ورقة عمل',
    };
    return labels[type] || type;
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'latex':
        return (
          <svg className="w-12 h-12 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 2h20v20H2V2zm2 2v16h16V4H4zm2 2h12v12H6V6zm2 2v8h8V8H8z"/>
          </svg>
        );
      case 'beamer':
        return (
          <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 4v3h5v12h3V7h5V4H5zm9 2v12h3V6h-3z"/>
          </svg>
        );
      case 'exam':
        return (
          <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(resource);
    }
  };

  return (
    <div
      className="video-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100"
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
      }}
    >
      {/* File icon */}
      <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        {getResourceTypeIcon(resource.resource_type)}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            {getResourceTypeLabel(resource.resource_type)}
          </span>
          {resource.download_count > 0 && (
            <span className="text-xs text-slate-500">
              {resource.download_count} تحميل
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">
          {resource.title}
        </h3>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {resource.description || 'لا يوجد وصف'}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-400">
          <span className="px-2 py-1 bg-slate-100 rounded">
            {resource.subject === 'arabic' ? 'العربية' : resource.subject === 'french' ? 'الفرنسية' : 'الرياضيات'}
          </span>
          <span className="px-2 py-1 bg-slate-100 rounded">
            {resource.grade_level === '1st' ? '1' : resource.grade_level === '2nd' ? '2' : resource.grade_level === '3rd' ? '3' : resource.grade_level === '4th' ? '4' : resource.grade_level === '5th' ? '5' : '6'} سنة
          </span>
          <span className="px-2 py-1 bg-slate-100 rounded">
            {formatFileSize(resource.file_size)}
          </span>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {resource.profiles?.avatar_url ? (
              <img
                src={resource.profiles.avatar_url}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">
                  {resource.profiles?.full_name?.charAt(0) || 'م'}
                </span>
              </div>
            )}
            <span className="text-sm text-slate-600">
              {resource.profiles?.full_name || 'مجهول'}
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            تحميل
          </button>
        </div>
      </div>
    </div>
  );
}
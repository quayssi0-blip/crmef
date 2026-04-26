'use client';

export default function FilterBar({ filters, onFilterChange, onClearFilters }) {
  const subjects = [
    { value: 'arabic', label: 'العربية' },
    { value: 'french', label: 'الفرنسية' },
    { value: 'math', label: 'الرياضيات' },
    { value: 'science', label: 'العلوم' },
    { value: 'islamic', label: 'التربية الإسلامية' },
  ];

  const gradeLevels = [
    { value: '1st', label: 'السنة الأولى' },
    { value: '2nd', label: 'السنة الثانية' },
    { value: '3rd', label: 'السنة الثالثة' },
    { value: '4th', label: 'السنة الرابعة' },
    { value: '5th', label: 'السنة الخامسة' },
    { value: '6th', label: 'السنة السادسة' },
  ];

  const approaches = [
    { value: 'tal', label: 'التعلم النشط (TaRL)' },
    { value: 'explicit_teaching', label: 'التدريس الصريح' },
    { value: 'other', label: 'أخرى' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-slate-800">تصفية وبحث</h3>
        {(filters.subject || filters.grade_level || filters.pedagogical_approach || filters.search) && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            مسح الفلاتر
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-4 md:col-span-2">
          <div className="relative">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="ابحث عن كبسلة أو مورد..."
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">المادة</label>
          <select
            value={filters.subject || ''}
            onChange={(e) => onFilterChange({ subject: e.target.value || null })}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">كل المواد</option>
            {subjects.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Grade Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">المستوى</label>
          <select
            value={filters.grade_level || ''}
            onChange={(e) => onFilterChange({ grade_level: e.target.value || null })}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">كل المستويات</option>
            {gradeLevels.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* Approach Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">المنهجية</label>
          <select
            value={filters.pedagogical_approach || ''}
            onChange={(e) => onFilterChange({ pedagogical_approach: e.target.value || null })}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">كل المناهج</option>
            {approaches.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">الوسوم</label>
          <div className="flex flex-wrap gap-2">
            {['تقويم تشخيصي', 'ممارسة موجهة', 'مجموعات صغيرة', 'تغذية راجعة'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  const current = filters.tags || [];
                  const updated = current.includes(tag)
                    ? current.filter(t => t !== tag)
                    : [...current, tag];
                  onFilterChange({ tags: updated.length ? updated : null });
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filters.tags?.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filters summary */}
      {(filters.subject || filters.grade_level || filters.pedagogical_approach || (filters.tags?.length)) && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 mb-2">الفلاتر النشطة:</p>
          <div className="flex flex-wrap gap-2">
            {filters.subject && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {subjects.find(s => s.value === filters.subject)?.label}
                <button
                  onClick={() => onFilterChange({ subject: null })}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.grade_level && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {gradeLevels.find(g => g.value === filters.grade_level)?.label}
                <button
                  onClick={() => onFilterChange({ grade_level: null })}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.pedagogical_approach && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {approaches.find(a => a.value === filters.pedagogical_approach)?.label}
                <button
                  onClick={() => onFilterChange({ pedagogical_approach: null })}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.tags?.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {tag}
                <button
                  onClick={() => onFilterChange({ tags: filters.tags.filter(t => t !== tag) })}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
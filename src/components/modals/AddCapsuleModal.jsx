'use client';

import { useState, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import gsap from 'gsap';

export default function AddCapsuleModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pedagogical_approach: 'tal',
    subject: 'arabic',
    grade_level: '1st',
    tags: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        setError('حجم الفيديو يجب أن يكون أقل من 500 ميجابايت');
        return;
      }
      setVideoFile(file);
      setError('');
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);

    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase غير مهيأ');
      setLoading(false);
      return;
    }

    if (!videoFile) {
      setError('يرجى اختيار مقطع فيديو');
      setLoading(false);
      return;
    }

    try {
      const user = supabase.auth.getUser();
      if (!user?.data?.user) {
        setError('يجب تسجيل الدخول أولاً');
        setLoading(false);
        return;
      }

      // Generate unique filenames
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cap/${fileName}`;

      // Upload video to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cap')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) {
        throw new Error(`فشل رفع الفيديو: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cap')
        .getPublicUrl(filePath);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split('.').pop();
        const thumbName = `thumb-${Date.now()}-${Math.random().toString(36).substring(2)}.${thumbExt}`;
        const thumbPath = `cap/${thumbName}`;

        const { error: thumbError } = await supabase.storage
          .from('cap')
          .upload(thumbPath, thumbnailFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (thumbError) {
          console.warn('Thumbnail upload failed:', thumbError);
        } else {
          const { data: thumbData } = supabase.storage
            .from('cap')
            .getPublicUrl(thumbPath);
          thumbnailUrl = thumbData.publicUrl;
        }
      }

      // Parse tags
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

      // Insert video record
      const { data, error: insertError } = await supabase
        .from('videos')
        .insert([{
          user_id: user.data.user.id,
          title: formData.title,
          description: formData.description,
          video_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          duration_seconds: 0, // Can be updated later
          pedagogical_approach: formData.pedagogical_approach,
          subject: formData.subject,
          grade_level: formData.grade_level,
          tags: tags,
          is_published: true,
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(`فشل حفظ البيانات: ${insertError.message}`);
      }

      // Animate success
      gsap.fromTo('.success-message',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );

      onSuccess?.(data);
      handleClose();
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء رفع الكبسولة');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      pedagogical_approach: 'tal',
      subject: 'arabic',
      grade_level: '1st',
      tags: '',
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setError('');
    setUploadProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
            <h3 id="modal-title" className="text-xl font-bold text-white">
              إضافة كبسولة جديدة
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">عنوان الكبسولة *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="عنوان الكبسولة التعليمية"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">وصف الكبسولة</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="وصف مختصر لمحتوى الكبسولة..."
              ></textarea>
            </div>

            {/* Video File */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ملف الفيديو *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-2 text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-slate-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>اختر مقطع فيديو</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="video/*"
                        onChange={handleVideoSelect}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">MP4, WebM (حتى 500 ميجابايت)</p>
                  {videoFile && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {videoFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">صورة المصغرة (اختياري)</label>
              <div className="mt-1 flex justify-center px-6 pt-3 pb-4 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-2 text-center">
                  <svg className="mx-auto h-10 w-10 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M20 16l6 6m-6-6l6-6m-6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H12a2 2 0 00-2 2v20a2 2 0 002 2h12a2 2 0 002-2m-6-10l-6-6m0 0l-6 6m6-6v12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-slate-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>اختر صورة</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleThumbnailSelect}
                      />
                    </label>
                  </div>
                  {thumbnailFile && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {thumbnailFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>جاري الرفع...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Pedagogical Approach */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المنهج التربوي *</label>
              <select
                name="pedagogical_approach"
                value={formData.pedagogical_approach}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tal">التعلم النشط (TAL)</option>
                <option value="explicit_teaching">التدريس الصريح</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المادة *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="arabic">العربية</option>
                <option value="french">الفرنسية</option>
                <option value="math">الرياضيات</option>
                <option value="science">العلوم</option>
                <option value="islamic">التربية الإسلامية</option>
                <option value="geography">الجغرافيا</option>
                <option value="history">التاريخ</option>
              </select>
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">السنة الدراسية *</label>
              <select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1st">السنة الأولى</option>
                <option value="2nd">السنة الثانية</option>
                <option value="3rd">السنة الثالثة</option>
                <option value="4th">السنة الرابعة</option>
                <option value="5th">السنة الخامسة</option>
                <option value="6th">السنة السادسة</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">وسوم (مفصولة بفواصل)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: تقييم,مشاريع,مجموعات"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? `جاري الرفع... ${uploadProgress}%` : 'إضافة كبسولة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

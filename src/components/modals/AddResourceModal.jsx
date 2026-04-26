'use client';

import { useState, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import gsap from 'gsap';

export default function AddResourceModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'latex',
    subject: 'arabic',
    grade_level: '1st',
    tags: '',
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        setError('حجم الملف يجب أن يكون أقل من 50 ميجابايت');
        return;
      }
      setFile(selectedFile);
      setError('');
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

    if (!file) {
      setError('يرجى اختيار ملف');
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

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `res/${fileName}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('res')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) {
        throw new Error(`فشل رفع الملف: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('res')
        .getPublicUrl(filePath);

      // Parse tags
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

      // Insert resource record
      const { data, error: insertError } = await supabase
        .from('resources')
        .insert([{
          user_id: user.data.user.id,
          title: formData.title,
          description: formData.description,
          resource_type: formData.resource_type,
          subject: formData.subject,
          grade_level: formData.grade_level,
          file_url: publicUrl,
          file_size: file.size,
          tags: tags,
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
      setError(err.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      resource_type: 'latex',
      subject: 'arabic',
      grade_level: '1st',
      tags: '',
    });
    setFile(null);
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
              إضافة مورد جديد
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
              <label className="block text-sm font-medium text-slate-700 mb-2">عنوان المورد *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="عنوان المورد التعليمي"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">وصف المورد</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="وصف مختصر لمحتوى المورد..."
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ملف المورد *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-2 text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M20 16l6 6m-6-6l-6-6m12 18h12a2 2 0 002-2V8a2 2 0 00-2-2H12a2 2 0 00-2 2v20a2 2 0 002 2h12a2 2 0 002-2m0 0V26m0 10l6-6m-6 6l6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-slate-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>اختر ملف</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">PDF, DOC, ZIP (حتى 50 ميجابايت)</p>
                  {file && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {file.name}
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

            {/* Resource Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نوع المورد *</label>
              <select
                name="resource_type"
                value={formData.resource_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latex">LaTeX</option>
                <option value="beamer">Beamer (عرض تقديمي)</option>
                <option value="exam">امتحان</option>
                <option value="worksheet">ورقة عمل</option>
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
                placeholder="مثال: امتحان,نهائي,حلول"
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
                {loading ? `جاري الرفع... ${uploadProgress}%` : 'إضافة مورد'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import gsap from 'gsap';

export default function CommentSection({ videoId }) {
  const { user, profile } = useAuth();
  const { comments, loading, addComment, deleteComment, toggleCommentLike } = useComments(videoId);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const content = newComment.trim();
    setNewComment('');

    await addComment(user.id, content, replyTo);
    setReplyTo(null);
    setSubmitting(false);

    // GSAP success animation
    gsap.from('.comment-added', {
      scale: 1.05,
      duration: 0.3,
      yoyo: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'mr-12 mt-3' : ''}`}>
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.profiles?.avatar_url ? (
              <img
                src={comment.profiles.avatar_url}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {comment.profiles?.full_name?.charAt(0) || 'م'}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-slate-800">
                {comment.profiles?.full_name || 'مجهول'}
              </h4>
              <span className="text-xs text-slate-400">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => toggleCommentLike(comment.id, user?.id)}
                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span>{comment.like_count || 0}</span>
              </button>

              {!isReply && user && (
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-slate-500 hover:text-blue-600 transition-colors text-sm"
                >
                  رد
                </button>
              )}

              {user?.id === comment.user_id && (
                <button
                  onClick={() => deleteComment(comment.id, user.id)}
                  className="text-slate-500 hover:text-red-600 transition-colors text-sm"
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}

      {/* Reply form */}
      {replyTo === comment.id && (
        <div className="mt-3 mr-12">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="اكتب رداً..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              إرسال
            </button>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 text-slate-500 hover:text-slate-700"
            >
              إلغاء
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">التعليقات</h3>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'م'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="شارك ملاحظاتك أو سؤالك..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                {replyTo && (
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    إلغاء الرد
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 rounded-lg p-6 text-center mb-8">
          <p className="text-slate-600">سجل الدخول للمشاركة في النقاش</p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="comment-added">
              <CommentItem comment={comment} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
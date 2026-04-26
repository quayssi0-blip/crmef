'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

const supabase = getSupabase();

export function useComments(videoId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchComments = async () => {
      if (!supabase || !videoId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: true });

      if (error) {
        if (isMountedRef.current) {
          setError(error.message);
        }
      } else {
        if (isMountedRef.current) {
          const topLevel = data.filter(c => !c.parent_id);
          const replies = data.filter(c => c.parent_id);

          const organized = topLevel.map(comment => ({
            ...comment,
            replies: replies
              .filter(r => r.parent_id === comment.id)
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
          }));

          setComments(organized);
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      isMountedRef.current = false;
    };
  }, [videoId]);

  const addComment = useCallback(async (userId, content, parentId = null) => {
    if (!supabase || !videoId || !userId) return;

    const { data, error } = await supabase
      .from('comments')
      .insert({
        video_id: videoId,
        user_id: userId,
        content,
        parent_id: parentId,
      })
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .single();

    if (!error && isMountedRef.current) {
      if (parentId) {
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data],
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => [...prev, { ...data, replies: [] }]);
      }
    }

    return { error };
  }, [videoId]);

  const deleteComment = useCallback(async (commentId, userId) => {
    if (!supabase) return { error: { message: 'Supabase غير مهيأ' } };

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (!error && isMountedRef.current) {
      setComments(prev => prev
        .map(comment => {
          if (comment.id === commentId) {
            return null;
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.filter(r => r.id !== commentId),
            };
          }
          return comment;
        })
        .filter(Boolean)
      );
    }

    return { error };
  }, []);

  const toggleCommentLike = useCallback(async (commentId, userId) => {
    if (!supabase || !userId) return;

    const existingLike = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingLike.data) {
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: userId });
    }
  }, []);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    toggleCommentLike,
    refetch: () => {},
  };
}
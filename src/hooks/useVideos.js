import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useVideoById(videoId) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchVideo = async () => {
      if (!videoId) return;

      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url, school_name, bio),
          comments:comments(
            id,
            content,
            parent_id,
            like_count,
            created_at,
            profiles:user_id (full_name, avatar_url)
          )
        `)
        .eq('id', videoId)
        .eq('is_published', true)
        .single();

      if (isMountedRef.current) {
        if (error) {
          setError(error.message);
        } else {
          setVideo(data);
        }
        setLoading(false);
      }
    };

    fetchVideo();

    return () => {
      isMountedRef.current = false;
    };
  }, [videoId]);

  const incrementView = useCallback(async () => {
    if (!videoId) return;
    const { error } = await supabase.from('video_views').insert({
      video_id: videoId,
    });
    return error;
  }, [videoId]);

  const toggleLike = useCallback(async (userId) => {
    if (!videoId || !userId) return;

    const existingLike = await supabase
      .from('video_likes')
      .select('*')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .single();

    if (existingLike.data) {
      await supabase
        .from('video_likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('video_likes')
        .insert({ video_id: videoId, user_id: userId });
    }
  }, [videoId]);

  return {
    video,
    loading,
    error,
    incrementView,
    toggleLike,
  };
}
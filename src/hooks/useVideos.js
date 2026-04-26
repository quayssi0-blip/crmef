'use client';

import { useState, useEffect, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';

const supabase = getSupabase();

export function useVideos(initialFilters = {}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [totalCount, setTotalCount] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchVideos = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url, school_name)
        `, { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (filters.pedagogical_approach) {
        query = query.eq('pedagogical_approach', filters.pedagogical_approach);
      }
      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.grade_level) {
        query = query.eq('grade_level', filters.grade_level);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlap('tags', filters.tags);
      }
      if (filters.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error: err, count } = await query;

      if (!isMountedRef.current) return;

      if (err) {
        setError(err.message);
      } else {
        setVideos(data || []);
        setTotalCount(count || 0);
      }
      setLoading(false);
    };

    fetchVideos();

    return () => {
      isMountedRef.current = false;
    };
  }, [filters.pedagogical_approach, filters.subject, filters.grade_level, filters.search, filters.tags, filters.featured, filters.page, filters.limit]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return {
    videos,
    loading,
    error,
    totalCount,
    filters,
    updateFilters,
    clearFilters,
    refetch: () => {},
  };
}

export function useVideoById(videoId) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchVideo = async () => {
      if (!supabase || !videoId) return;

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

  const incrementView = async () => {
    if (!supabase || !videoId) return;
    await supabase.from('video_views').insert({
      video_id: videoId,
    });
  };

  const toggleLike = async (userId) => {
    if (!supabase || !videoId || !userId) return;

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
  };

  return {
    video,
    loading,
    error,
    incrementView,
    toggleLike,
  };
}
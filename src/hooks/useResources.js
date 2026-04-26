'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

const supabase = getSupabase();

export function useResources(initialFilters = {}) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [totalCount, setTotalCount] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchResources = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      let query = supabase
        .from('resources')
        .select(`
          *,
          profiles:user_id (full_name, school_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.grade_level) {
        query = query.eq('grade_level', filters.grade_level);
      }
      if (filters.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
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
        setResources(data || []);
        setTotalCount(count || 0);
      }
      setLoading(false);
    };

    fetchResources();

    return () => {
      isMountedRef.current = false;
    };
  }, [filters.subject, filters.grade_level, filters.resource_type, filters.search, filters.tags, filters.featured, filters.page, filters.limit]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const incrementDownload = useCallback(async (resourceId) => {
    if (!supabase) return;

    // Update local state optimistically
    setResources(prev => prev.map(r =>
      r.id === resourceId ? { ...r, download_count: (r.download_count || 0) + 1 } : r
    ));

    try {
      await supabase.rpc('increment_download', {
        resource_uuid: resourceId,
      });
    } catch (error) {
      // Revert on error
      setResources(prev => prev.map(r =>
        r.id === resourceId ? { ...r, download_count: Math.max(0, (r.download_count || 0) - 1) } : r
      ));
      console.error('Download increment failed:', error);
    }
  }, []);

  return {
    resources,
    loading,
    error,
    totalCount,
    filters,
    updateFilters,
    clearFilters,
    refetch: () => {},
    incrementDownload,
  };
}

export function useResourceById(resourceId) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchResource = async () => {
      if (!supabase || !resourceId) return;

      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url, school_name)
        `)
        .eq('id', resourceId)
        .single();

      if (isMountedRef.current) {
        if (error) {
          setError(error.message);
        } else {
          setResource(data);
        }
        setLoading(false);
      }
    };

    fetchResource();

    return () => {
      isMountedRef.current = false;
    };
  }, [resourceId]);

  return {
    resource,
    loading,
    error,
  };
}
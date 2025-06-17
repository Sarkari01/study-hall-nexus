
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  type: 'student' | 'merchant' | 'booking' | 'study_hall';
  title: string;
  subtitle?: string;
  url: string;
  relevance: number;
}

export const useGlobalSearch = (query: string, enabled: boolean = true) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchStudents = async (searchTerm: string): Promise<SearchResult[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('id, full_name, email, student_id')
      .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,student_id.ilike.%${searchTerm}%`)
      .limit(5);

    if (error || !data) return [];

    return data.map(student => ({
      id: student.id,
      type: 'student' as const,
      title: student.full_name,
      subtitle: student.email,
      url: `/admin/students/${student.id}`,
      relevance: student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0.5
    }));
  };

  const searchMerchants = async (searchTerm: string): Promise<SearchResult[]> => {
    const { data, error } = await supabase
      .from('merchant_profiles')
      .select('id, business_name, full_name, email')
      .or(`business_name.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(5);

    if (error || !data) return [];

    return data.map(merchant => ({
      id: merchant.id,
      type: 'merchant' as const,
      title: merchant.business_name,
      subtitle: merchant.full_name,
      url: `/admin/merchants/${merchant.id}`,
      relevance: merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0.5
    }));
  };

  const searchStudyHalls = async (searchTerm: string): Promise<SearchResult[]> => {
    const { data, error } = await supabase
      .from('study_halls')
      .select('id, name, location')
      .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      .limit(5);

    if (error || !data) return [];

    return data.map(hall => ({
      id: hall.id,
      type: 'study_hall' as const,
      title: hall.name,
      subtitle: hall.location,
      url: `/admin/study-halls/${hall.id}`,
      relevance: hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0.5
    }));
  };

  const searchBookings = async (searchTerm: string): Promise<SearchResult[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, 
        booking_reference, 
        booking_date,
        study_halls(name),
        students(full_name)
      `)
      .or(`booking_reference.ilike.%${searchTerm}%`)
      .limit(5);

    if (error || !data) return [];

    return data.map(booking => ({
      id: booking.id,
      type: 'booking' as const,
      title: booking.booking_reference,
      subtitle: `${booking.students?.full_name} - ${booking.study_halls?.name}`,
      url: `/admin/bookings/${booking.id}`,
      relevance: 0.8
    }));
  };

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim() || !enabled) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const [students, merchants, studyHalls, bookings] = await Promise.all([
        searchStudents(searchTerm),
        searchMerchants(searchTerm),
        searchStudyHalls(searchTerm),
        searchBookings(searchTerm)
      ]);

      const allResults = [...students, ...merchants, ...studyHalls, ...bookings];
      
      // Sort by relevance and limit total results
      const sortedResults = allResults
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 10);

      setResults(sortedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, enabled]);

  const groupedResults = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      if (!grouped[result.type]) {
        grouped[result.type] = [];
      }
      grouped[result.type].push(result);
    });
    return grouped;
  }, [results]);

  return {
    results,
    groupedResults,
    loading,
    performSearch
  };
};

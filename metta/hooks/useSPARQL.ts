// hooks/useSPARQL.ts
'use client';

import { useState, useEffect } from 'react';
import { query, construct, fetchEntity, SPARQLResponse, Triple } from '@/lib/sparql';

interface UseSPARQLResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for SELECT queries
 */
export function useSPARQLQuery(sparqlQuery: string): UseSPARQLResult<SPARQLResponse> {
  const [data, setData] = useState<SPARQLResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await query(sparqlQuery);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [sparqlQuery, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { data, loading, error, refetch };
}

/**
 * Hook for CONSTRUCT queries
 */
export function useSPARQLConstruct(sparqlQuery: string): UseSPARQLResult<Triple[]> {
  const [data, setData] = useState<Triple[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await construct(sparqlQuery);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [sparqlQuery, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { data, loading, error, refetch };
}

/**
 * Hook for fetching a specific entity
 */
export function useEntity(uri: string | null): UseSPARQLResult<Triple[]> {
  const [data, setData] = useState<Triple[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!uri) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchEntity(uri);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [uri, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { data, loading, error, refetch };
}
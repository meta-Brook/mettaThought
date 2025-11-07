'use client';

import { useState, useEffect } from 'react';
import { useSPARQLQuery } from '@/hooks/useSPARQL';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ArgumentList from '../components/ArguementList';

export default function ViewerPage() {
  const searchParams = useSearchParams();
  const uri = searchParams.get('uri');

  const query = uri ? `
    SELECT ?arg ?subject ?predicate ?object ?confidence WHERE {
      ?arg a <http://mettathought.com/Argument> ;
           <http://mettathought.com/subject> ?subject ;
           <http://mettathought.com/predicate> ?predicate ;
           <http://mettathought.com/object> ?object .
      OPTIONAL { ?arg <http://mettathought.com/confidence> ?confidence }
      FILTER(?subject = <${uri}> || ?object = <${uri}>)
    }
  ` : '';

  const { data, loading, error } = useSPARQLQuery(query);

  const extractLabel = (uri: string) => {
    return uri.split('/').pop()?.replace(/-/g, ' ') || uri;
  };

  if (!uri) {
    return (
      <div className="p-8">
        <p>No URI specified. Use the search to find concepts.</p>
      </div>
    );
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{extractLabel(uri)}</h1>
      <p className="text-sm text-gray-600 mb-8 break-all">{uri}</p>

      <h2 className="text-2xl font-semibold mb-4">
        Related Arguments ({data?.results.bindings.length || 0})
      </h2>

      {data?.results.bindings.length ? (
        <div className="space-y-4">
          {data.results.bindings.map((binding, idx) => (
            <div key={idx} className="border rounded p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/viewer?uri=${encodeURIComponent(binding.subject.value)}`}
                  className="text-blue-600 hover:underline"
                >
                  {extractLabel(binding.subject.value)}
                </Link>
                <span className="text-gray-500">
                  {extractLabel(binding.predicate.value)}
                </span>
                <Link
                  href={`/viewer?uri=${encodeURIComponent(binding.object.value)}`}
                  className="text-blue-600 hover:underline"
                >
                  {extractLabel(binding.object.value)}
                </Link>
              </div>
              {binding.confidence && (
                <p className="text-sm text-gray-600">
                  Confidence: {binding.confidence.value}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No arguments found for this concept.</p>
      )}
    </div>
  );
}
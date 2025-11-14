'use client';

import { useSPARQLQuery } from '@/hooks/useSPARQL';
import Link from 'next/link';

export default function SearchPageClient({ submittedTerm }: { submittedTerm: string }) {
  const conceptQuery = `
    SELECT DISTINCT ?concept WHERE {
      ?concept a <http://mettathought.com/Concept> .
      FILTER(CONTAINS(LCASE(STR(?concept)), LCASE("${submittedTerm}")))
    } LIMIT 20
  `;

  const { data: concepts, loading } = useSPARQLQuery(submittedTerm ? conceptQuery : '');

  if (!submittedTerm) {
    return <p className="p-8">Enter a term in the search bar above to get started.</p>;
  }

  if (loading) return <p className="p-8">Searching...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search results for "{submittedTerm}"</h1>
      {/* render results */}
    </div>
  );
}

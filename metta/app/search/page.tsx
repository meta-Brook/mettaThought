'use client';

import { useState } from 'react';
import { useSPARQLQuery } from '@/hooks/useSPARQL';
import Link from 'next/link';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const conceptQuery = `
    SELECT DISTINCT ?concept WHERE {
      ?concept a <http://mettathought.com/Concept> .
      FILTER(CONTAINS(LCASE(STR(?concept)), LCASE("${submittedTerm}")))
    } LIMIT 20
  `;

  const argumentQuery = `
    SELECT ?arg ?subject ?predicate ?object WHERE {
      ?arg a <http://mettathought.com/Argument> ;
           <http://mettathought.com/subject> ?subject ;
           <http://mettathought.com/predicate> ?predicate ;
           <http://mettathought.com/object> ?object .
      FILTER(
        CONTAINS(LCASE(STR(?subject)), LCASE("${submittedTerm}")) ||
        CONTAINS(LCASE(STR(?object)), LCASE("${submittedTerm}"))
      )
    } LIMIT 20
  `;

  const { data: concepts, loading: conceptsLoading } = useSPARQLQuery(
    hasSearched && submittedTerm ? conceptQuery : ''
  );

  const { data: args, loading: argumentsLoading } = useSPARQLQuery(
    hasSearched && submittedTerm ? argumentQuery : ''
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedTerm(searchTerm);
    setHasSearched(true);
  };

  const extractLabel = (uri: string) => {
    return uri.split('/').pop()?.replace(/-/g, ' ') || uri;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search concepts and arguments..."
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {hasSearched && (conceptsLoading || argumentsLoading) && (
        <p>Searching...</p>
      )}

      {hasSearched && !conceptsLoading && !argumentsLoading && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Concepts ({concepts?.results.bindings.length || 0})
            </h2>
            {concepts?.results.bindings.length ? (
              <div className="space-y-2">
                {concepts.results.bindings.map((binding, idx) => (
                  <Link
                    key={idx}
                    href={`/viewer?uri=${encodeURIComponent(binding.concept.value)}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                  >
                    {extractLabel(binding.concept.value)}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No concepts found</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Arguments ({args?.results.bindings.length || 0})
            </h2>
            {args?.results.bindings.length ? (
              <div className="space-y-2">
                {args.results.bindings.map((binding, idx) => (
                  <div key={idx} className="p-3 border rounded">
                    <Link
                      href={`/viewer?uri=${encodeURIComponent(binding.arg.value)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {extractLabel(binding.subject.value)} →{' '}
                      {extractLabel(binding.predicate.value)} →{' '}
                      {extractLabel(binding.object.value)}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No arguments found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
'use client';

import { connection } from 'next/server';
import { useSPARQLQuery } from '@/hooks/useSPARQL';
import { useSearchParams} from 'next/navigation';
import Link from 'next/link';

export default async function SearchPage() {
const searchParams = useSearchParams();
let submittedTerm = searchParams.get('term') || '';

  

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
    submittedTerm ? conceptQuery : ''
  );

  const { data: args, loading: argumentsLoading } = useSPARQLQuery(
    submittedTerm ? argumentQuery : ''
  );

if (!submittedTerm) {
  return <p className="p-8">Enter a term in the search bar above to get started.</p>;
}

  const extractLabel = (uri: string) => {
    return uri.split('/').pop()?.replace(/-/g, ' ') || uri;
  };

  await connection();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

     

      {(conceptsLoading || argumentsLoading) && (
        <p>Searching...</p>
      )}

      {!conceptsLoading && !argumentsLoading && (
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
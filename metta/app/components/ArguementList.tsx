'use client';
import { useSPARQLQuery } from '@/hooks/useSPARQL';

export default function ArgumentList({ uri }: { uri: string }) {
  const query = `
    SELECT ?subject ?predicate ?object WHERE {
      ?arg a <http://mettathought.com/Argument>;
           <http://mettathought.com/subject> ?subject;
      FILTER(?subject = <${uri}> || ?object = <${uri}>)
    }
  `;

  const { data, loading, error } = useSPARQLQuery(query);

  if (loading) return <p>Loading arguments...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="space-y-3">
      {data?.results.bindings.map((b, i) => (
        <div key={i} className="border rounded p-3">
          <p>{b.subject.value} → {b.predicate.value} → {b.object.value}</p>
        </div>
      ))}
    </div>
  );
}

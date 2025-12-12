'use client';

import { useEffect, useState } from 'react';

type Props = {
  label: string | null;
  relationship: string;
};

type ResultNode = {
  name?: string; // adjust depending on your node properties
  [key: string]: any;
};

export default function View({ label, relationship }: Props) {
  const [results, setResults] = useState<ResultNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

console.log(relationship);

  useEffect(() => {
    if (!label || !relationship) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      // Construct Cypher query to match nodes and their relationships
      const cypher = `
        MATCH (s:Concept {name:"${label}"})-[r:${relationship}]->(t)
        RETURN s, r, t
      `;

      try {
        const res = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cypher, params: {} }),
        });

        const data = await res.json();
        if (data.success) {
          setResults(data.result);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [label, relationship]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!results.length) return <p>No results found.</p>;

  return (
    <div className="border-2 .border-black flex-h">
      <h1 >{relationship}</h1>
    <ul className="flex-h list-disc pl-6">
      {results.map((r: any, index: number) => (
        <li className="list-disc flex" key={index}>
          
            {r.t.properties.name}
          
          
        </li>
      ))}
   </ul>
   </div>
  );
}

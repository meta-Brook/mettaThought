'use client'

import View from "@/app/components/View";
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { useParams } from "next/navigation";

type ResultNode = {
  name?: string; // adjust depending on your node properties
  [key: string]: any;
};

export default function Concept() {
  const { term } = useParams<{ term:string}>();
const [results, setResults] = useState<ResultNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    //do a search in the database where the term searched is the term in the url



useEffect(() =>{
    if(!term)return;

    const fetchData = async () => {
        setLoading(true);
        setError('');

        const cypher =`
        MATCH (s:Concept {name: $name })-[r]->(t)
        RETURN DISTINCT type(r) AS n 
        `;

        try {
        const res = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cypher, params: {name:term} }),
        });

        const data = await res.json();
        
        if (data.success) {
          setResults(data.result);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch(err){
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
      
    };

    fetchData();
    
},[term])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!results.length) return <p>No results found.</p>;

    return (
    <div className="flex ">
        {results.map((r:any, index: number) => (
           <div className="flex" key={index} >
            <View label={term} relationship={r.n}/>
             </div>
        ))}
        

      </div>
    );

}/*  */
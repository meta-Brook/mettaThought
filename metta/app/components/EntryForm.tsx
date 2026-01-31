'use client';

import { useState } from 'react';

type Props = {
  rel: string;
  val: string;
};

export default function EntryForm({rel,val}:Props) {
console.log("show the Entry form");

  const [name, setName] = useState('');

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage('');

  if (!name || !key || !value) {
    setMessage('All fields are required');
    return;
  }

  const relType = key.trim().toUpperCase();
  if (!/^[A-Z_][A-Z0-9_]*$/.test(relType)) {
    setMessage('Invalid relationship type');
    return;
  }



  const cypher = `
    MERGE (a:Concept {name: $source})
    ON CREATE SET a.uuid = randomUUID()
    MERGE (b:Concept {name: $target})
    ON CREATE SET b.uuit = randomUUID()
    MERGE (a)-[:${relType}]->(b)
    RETURN a, b
  `;

  try {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cypher,
        params: {
          source: name,
          target: value,
        },
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setMessage(data.error || 'Query failed');
      return;
    }

    setName('');
    setKey('');
    setValue('');
    setMessage('Relationship created');
  } catch (err) {
    console.error(err);
    setMessage('Error submitting form');
  }
};


  return (
    <form onSubmit={handleSubmit} className="border flex flex-col gap-2 w-sm">
      <input
        placeholder="Concept"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border m-3 p-1"
        required
      />

  

      <input
        placeholder="Relationship type"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="border m-3 p-1"
      />
      <input
        placeholder="Target node name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border m-3 p-1"
      />
      <button className="border" type="submit">Submit</button>
      <p>{message}</p>
    </form>
  );
}

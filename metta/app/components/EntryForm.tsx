'use client';

import { useState } from 'react';

export default function EntryForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'property' | 'relationship'>('property');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    let cypher = '';
    const params: Record<string, any> = { name, value };

    if (!name) {
      setMessage('Name is required');
      return;
    }

    // Always create the new Concept node first
    cypher = `MERGE (n:Concept {name: $name}) RETURN n`;
   
    try {
      // First create the Concept node
      const resNode = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cypher, params }),
      });
      const dataNode = await resNode.json();

      if (!dataNode.success) {
        setMessage(`Error creating node: ${dataNode.error}`);
        return;
      }

      // Then, if type is property or relationship, optionally create it
      if (type === 'property' && key && value) {
        const propCypher = `MATCH (n:Concept {name: $name}) SET n.${key} = $value RETURN n`;
        await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cypher: propCypher, params }),
        });
      } else if (type === 'relationship' && key && value) {
        // For simplicity, assume target node already exists
        const relCypher = `
          MATCH (a:Concept {name: $name})
          MERGE (b:Concept {name: $value})
          MERGE (a)-[:${key}]->(b)
          RETURN a, b
        `;
        await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cypher: relCypher, params }),
        });
      }

      // Clear form
      setName('');
      setKey('');
      setValue('');
      setMessage('Concept created successfully');
    } catch (err) {
      console.error(err);
      setMessage('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '300px' }}>
      <input
        placeholder="Concept name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div>
        <label>
          <input
            type="radio"
            name="type"
            value="property"
            checked={type === 'property'}
            onChange={() => setType('property')}
          />
          Property
        </label>
        <label style={{ marginLeft: '12px' }}>
          <input
            type="radio"
            name="type"
            value="relationship"
            checked={type === 'relationship'}
            onChange={() => setType('relationship')}
          />
          Relationship
        </label>
      </div>

      <input
        placeholder="Property key or relationship type"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <input
        placeholder="Property value or target node name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
      <p>{message}</p>
    </form>
  );
}

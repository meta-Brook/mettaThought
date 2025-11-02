// components/ArgumentForm.tsx
'use client';

import { useState } from 'react';
import { insert } from '@/lib/sparql';

const PREDICATES = [
  'supports',
  'contradicts',
  'causes',
  'improves',
  'requires',
  'examples'
];

export default function ArgumentForm() {
  const [subject, setSubject] = useState('');
  const [predicate, setPredicate] = useState('supports');
  const [object, setObject] = useState('');
  const [confidence, setConfidence] = useState(0.5);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const argumentId = `http://mettathought.com/argument/arg_${Date.now()}`;
      const predicateURI = `http://mettathought.com/predicate/${predicate}`;
      const subjectURI = `http://mettathought.com/concept/${subject.toLowerCase().replace(/\s+/g, '-')}`;
const objectURI = `http://mettathought.com/concept/${object.toLowerCase().replace(/\s+/g, '-')}`;

      const triples = `
        <${argumentId}> a <http://mettathought.com/Argument> .
        <${argumentId}> <http://mettathought.com/subject> <${subjectURI}> .
        <${argumentId}> <http://mettathought.com/predicate> <${predicateURI}> .
        <${argumentId}> <http://mettathought.com/object> <${objectURI}> .
        <${argumentId}> <http://mettathought.com/confidence> "${confidence}"^^<http://www.w3.org/2001/XMLSchema#decimal> .
        ${description ? `<${argumentId}> <http://mettathought.com/description> "${description}" .` : ''}
        <${subjectURI}> a <http://mettathought.com/Concept> .
        <${objectURI}> a <http://mettathought.com/Concept> .
      `;

      await insert(triples);
      setSuccess(true);
      
      // Reset form
      setSubject('');
      setObject('');
      setDescription('');
      setConfidence(0.5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create argument');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
 <div>
  <label className="block text-sm font-medium mb-1">Subject (What is this about?)</label>
  <input
    type="text"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    className="w-full border rounded px-3 py-2"
    placeholder="e.g., debate"
  />
</div>

      <div>
        <label className="block text-sm font-medium mb-1">Predicate (Relationship)</label>
        <select
          value={predicate}
          onChange={(e) => setPredicate(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {PREDICATES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

<div>
  <label className="block text-sm font-medium mb-1">Object (Related to...)</label>
  <input
    type="text"
    value={object}
    onChange={(e) => setObject(e.target.value)}
    className="w-full border rounded px-3 py-2"
    placeholder="e.g., critical thinking"
  />
</div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Confidence: {confidence}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={confidence}
          onChange={(e) => setConfidence(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded">
          Argument created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !subject || !object}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {submitting ? 'Creating...' : 'Create Argument'}
      </button>
    </form>
  );
}
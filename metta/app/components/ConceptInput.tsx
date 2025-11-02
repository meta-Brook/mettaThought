// components/ConceptInput.tsx 
// unused right now,  ConceptInput queries Blazegraph on every keystroke to show autocomplete suggestions of existing concepts, letting users either select an existing one or create a new one by typing.
'use client';

import { useState } from 'react';
import { useSPARQLQuery } from '@/hooks/useSPARQL';

interface ConceptInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function ConceptInput({ value, onChange, label }: ConceptInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Query existing concepts
  const query = `
    SELECT DISTINCT ?concept WHERE {
      ?concept a <http://mettathought.com/Concept> .
      FILTER(CONTAINS(LCASE(STR(?concept)), LCASE("${searchTerm}")))
    } LIMIT 10
  `;

  const { data } = useSPARQLQuery(searchTerm.length > 0 ? query : '');

  const suggestions = data?.results.bindings.map(b => b.concept.value) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setShowSuggestions(true);
    
    // Convert to slug format for URI
    const slug = val.toLowerCase().replace(/\s+/g, '-');
    onChange(`http://mettathought.com/concept/${slug}`);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="w-full border rounded px-3 py-2"
        placeholder="Type concept name..."
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
          {suggestions.map((concept, idx) => (
            <button
              key={idx}
              onClick={() => {
                const label = concept.split('/').pop() || '';
                setSearchTerm(label);
                onChange(concept);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              {concept.split('/').pop()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
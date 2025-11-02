// app/viewer/page.tsx
'use client';

import { useState } from 'react';
import { useEntity } from '@/hooks/useSPARQL';

export default function ViewerPage() {
  const [currentUri, setCurrentUri] = useState<string>('http://mettathought.com/person/alice');
  const { data, loading, error } = useEntity(currentUri);

  const handleLinkClick = (uri: string) => {
    setCurrentUri(uri);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Entity Viewer</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">Current URI:</p>
        <p className="font-mono text-sm break-all">{currentUri}</p>
      </div>

      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((triple, idx) => (
            <div key={idx} className="border rounded p-4">
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="font-semibold text-gray-700">
                  {triple.predicate.split('/').pop()?.split('#').pop()}
                </div>
                <div>
                  {triple.objectType === 'uri' ? (
                    <button
                      onClick={() => handleLinkClick(triple.object)}
                      className="text-blue-600 hover:underline break-all text-left"
                    >
                      {triple.object}
                    </button>
                  ) : (
                    <span className="break-all">{triple.object}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No data found for this entity.</p>
        )}
      </div>

      <div className="mt-8 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="space-x-2">
          <button
            onClick={() => handleLinkClick('http://example.org/person/alice')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Alice
          </button>
          <button
            onClick={() => handleLinkClick('http://example.org/person/bob')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Bob
          </button>
        </div>
      </div>
      <div className="mb-8">
        <a
          href="/editor"
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
        >
          Go to Editor
        </a>
      </div>
    </div>
  );
}
// app/editor/page.tsx
'use client';

import ArgumentForm from '@/app/components/ArgumentForm';

export default function EditorPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Argument Editor</h1>
      <p className="text-gray-600 mb-8">
        Create structured arguments about concepts and their relationships.
      </p>
      
      <ArgumentForm />
    </div>
  );
}
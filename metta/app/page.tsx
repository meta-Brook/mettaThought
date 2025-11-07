// app/viewer/page.tsx
'use client';

import { useState } from 'react';
import { useEntity } from '@/hooks/useSPARQL';


export default function HomePage() {
 

  const handleLinkClick = (uri: string) => {
    
  };



  return (
    <div>
<div className="min-h-screen flex flex-col bg-bg text-fg transition-colors duration-300">
  <h1 className="text-5xl font-bold mb-6 text-primary">Welcome to MettaThought</h1>
        <p className="max-w-2xl text-lg text-secondary mb-8">
          Explore ideas, arguments, and connections — discover meaning through structured thought.
        </p>
        <p>Please search for a starting term or start with <a href="/search?term=debate">debat</a></p>
</div>

    </div>
   
  );
}
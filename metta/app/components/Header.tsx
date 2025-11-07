'use client'

import {useRouter} from 'next/navigation';
import  Button  from '../components/ui/Button';
import {useState} from 'react';

export default function Header() {
  const router = useRouter();
const [term,setTerm] = useState('');

const handleSubmit =(e: React.FormEvent) => {
  e.preventDefault();
  if(!term.trim()) return;
  router.push(`/search?term=${encodeURIComponent(term)}`);
}

  return (
    <header className="flex items-center justify-between px-6 py-2 bg-sky-600 sticky w-full box-border min-h-min">
      
        <div className='text-white font-bold text-4xl'> MettaThought</div>
        <div>
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
          <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search..."
          className="bg-(--color-background) text-(--color-foreground) placeholder-color-foreground/70 border border-color-foreground/30 rounded px-3 py-1 focus:outline-none focus:border-(--color-foreground)/60"
          />
          <Button className='py-5 px-5' >Search</Button>
        </form>
</div>
      
    </header>
)
}
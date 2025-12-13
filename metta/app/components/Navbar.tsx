'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function Navbar() {
  const router = useRouter();
const [term,setTerm] = useState('');

const handleSubmit =(e: React.FormEvent) => {
  e.preventDefault();
  if(!term.trim()) return;
  router.push(`/concept/${encodeURIComponent(term)}`);
}

    return (
        <div className='flex flex-row justify-between bg-(--color-primary)'>
            <div className='p-4 flex text-(--color-foreground) text-3xl'>mettaThought</div>
            <div className='flex flex-row justify-evenly p-4'>
                <form onSubmit={handleSubmit} className='flex items-center gap-2'>
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Search..."
                        className="bg-(--color-background) text-(--color-foreground) placeholder-color-foreground/70 border border-color-foreground/30 rounded px-3 py-1 focus:outline-none focus:border-(--color-foreground)/60"
                    />
                    <button className='py-5 px-5' >Search</button>
                </form>
                <div className='p-4 flex'>button 1</div>
                <div className='p-4 flex'>button 2</div>
                <div className='p-4 flex'>button 3</div>
            </div>
        </div>
    )
}
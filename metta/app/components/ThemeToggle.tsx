'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');

useEffect(() => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'sepia' | null;
  if (saved) setTheme(saved);
}, []);

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);

  return (
    <div className="flex gap-2">
      <button onClick={() => setTheme('light')} className="border rounded p-2!">Light</button>
      <button onClick={() => setTheme('dark')} className="border rounded p-2!">Dark</button>
      <button onClick={() => setTheme('sepia')} className="border rounded p-2!">Sepia</button>
    </div>
  );
}

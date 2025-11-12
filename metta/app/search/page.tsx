import { Suspense } from 'react';
import SearchPageClient from '../components/SearchPageClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading search...</p>}>
      <SearchPageClient />
    </Suspense>
  );
}

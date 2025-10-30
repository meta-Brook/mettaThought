// app/test/page.tsx

export const dynamic = 'force-dynamic';



import { query } from '@/lib/sparql';

export default async function TestPage() {
  try {
    const result = await query(`
      SELECT * WHERE { 
        ?s ?p ?o 
      } LIMIT 10
    `);

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">SPARQL Test</h1>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found {result.results.bindings.length} results
          </p>
        </div>

        <div className="space-y-4">
          {result.results.bindings.map((binding, idx) => (
            <div key={idx} className="border p-4 rounded">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Subject:</span>
                  <p className="break-all">{binding.s?.value}</p>
                </div>
                <div>
                  <span className="font-semibold">Predicate:</span>
                  <p className="break-all">{binding.p?.value}</p>
                </div>
                <div>
                  <span className="font-semibold">Object:</span>
                  <p className="break-all">{binding.o?.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
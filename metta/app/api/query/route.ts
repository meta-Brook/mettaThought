// app/api/run-query/route.ts
import { runQuery } from '@/lib/neo4j';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { cypher, params } = await req.json();

  console.log("Received query:", cypher);
  console.log("Received params:", params);

  if (!cypher) {
    return new Response(JSON.stringify({ error: 'No query provided' }), { status: 400 });
  }

  try {
    const result = await runQuery(cypher, params || {});
    console.log("Query result:", result);
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (err) {
    console.error("Query failed!");
    console.error(err);
    return new Response(JSON.stringify({ error: 'Query failed', details: String(err) }), { status: 500 });
  }
}

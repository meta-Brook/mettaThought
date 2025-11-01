// app/api/sparql/route.ts

import { NextRequest, NextResponse } from 'next/server';

const SPARQL_ENDPOINT = process.env.NEXT_PUBLIC_SPARQL_ENDPOINT || '';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/sparql-results+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Blazegraph returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('SPARQL proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
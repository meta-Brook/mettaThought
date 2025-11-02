// app/api/sparql/insert/route.ts

import { NextRequest, NextResponse } from 'next/server';

const SPARQL_ENDPOINT = process.env.NEXT_PUBLIC_SPARQL_ENDPOINT || '';

export async function POST(request: NextRequest) {
  try {
    const { update } = await request.json();

    if (!update) {
      return NextResponse.json(
        { error: 'Update query is required' },
        { status: 400 }
      );
    }

    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-update',
      },
      body: update,
    });

    if (!response.ok) {
      throw new Error(`Blazegraph returned ${response.status}: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SPARQL insert error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
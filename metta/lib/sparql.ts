// lib/sparql.ts

const SPARQL_ENDPOINT = process.env.NEXT_PUBLIC_SPARQL_ENDPOINT || '';

export interface SPARQLBinding {
  [key: string]: {
    type: 'uri' | 'literal' | 'bnode';
    value: string;
    datatype?: string;
    'xml:lang'?: string;
  };
}

export interface SPARQLResponse {
  head: {
    vars: string[];
  };
  results: {
    bindings: SPARQLBinding[];
  };
}

export interface Triple {
  subject: string;
  predicate: string;
  object: string;
  objectType: 'uri' | 'literal';
}

/**
 * Execute a SPARQL SELECT query
 */
export async function query(sparqlQuery: string): Promise<SPARQLResponse> {
  // Use API proxy to avoid CORS issues
  const url = `/api/sparql?query=${encodeURIComponent(sparqlQuery)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`SPARQL query failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Execute a SPARQL CONSTRUCT query
 */
export async function construct(sparqlQuery: string): Promise<Triple[]> {
  const url = `/api/sparql?query=${encodeURIComponent(sparqlQuery)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/sparql-results+json',
    },
  });

  if (!response.ok) {
    throw new Error(`SPARQL construct failed: ${response.statusText}`);
  }

  const data: SPARQLResponse = await response.json();
  
  // Convert bindings to simpler triple format
  return data.results.bindings.map(binding => ({
    subject: binding.subject.value,
    predicate: binding.predicate.value,
    object: binding.object.value,
    objectType: binding.object.type as 'uri' | 'literal',
  }));
}

/**
 * Fetch all triples about a specific entity
 */
export async function fetchEntity(uri: string): Promise<Triple[]> {
  const sparqlQuery = `
    CONSTRUCT { <${uri}> ?p ?o }
    WHERE { <${uri}> ?p ?o }
  `;
  
  return construct(sparqlQuery);
}

/**
 * Helper to extract simple values from SPARQL bindings
 */
export function extractValue(binding: SPARQLBinding[string]): string {
  return binding.value;
}

/**
 * Helper to check if a value is a URI
 */
export function isURI(binding: SPARQLBinding[string]): boolean {
  return binding.type === 'uri';
}
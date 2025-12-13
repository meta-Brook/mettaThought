// lib/neo4j.ts
import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!driver) {
    const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;

    if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) {
      throw new Error('Missing Neo4j environment variables');
    }

    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
    );
  }

  return driver;
}

export async function runQuery<T = any>(
  cypher: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const session = getDriver().session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map(r => r.toObject()) as T[];
  } finally {
    await session.close();
  }
}

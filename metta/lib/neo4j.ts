// lib/neo4j.ts
import neo4j, { Driver } from 'neo4j-driver';

// Ensure driver is only created once in development (Next.js hot reload)
declare global {
  var _neo4jDriver: Driver | undefined;
}
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

console.log({
  uri: !!process.env.NEO4J_URI,
  user: !!process.env.NEO4J_USER,
  pass: !!process.env.NEO4J_PASSWORD,
});

if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) {
  throw new Error('Missing Neo4j environment variables: NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD');
}
// Create or reuse the driver
const driver: Driver = global._neo4jDriver || neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(
    process.env.NEO4J_USER!,
    process.env.NEO4J_PASSWORD!
  )
);

if (!global._neo4jDriver) {
  global._neo4jDriver = driver;
}

// Utility function to run queries
export async function runQuery<T = any>(
  cypher: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => record.toObject()) as T[];
  } finally {
    await session.close();
  }
}

// Optional: function to close driver when app stops (mostly useful in scripts)
export async function closeDriver() {
  await driver.close();
}

export { driver };

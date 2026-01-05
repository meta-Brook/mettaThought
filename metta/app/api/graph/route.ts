// app/api/graph/route.ts
import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function GET() {
  const rows = await runQuery<{
    a: any;
    b: any;
    r: any;
  }>(`
    MATCH (a)-[r]->(b)
    RETURN a, r, b
  `);

  const elements: any[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const a = row.a;
    const b = row.b;
    const r = row.r;

    const aId = a.identity.toString();
    const bId = b.identity.toString();
    const rId = r.identity.toString();

    if (!seen.has(aId)) {
      seen.add(aId);
      elements.push({
        data: {
          id: aId,
          label: a.properties.name || a.properties.text,
          ...a.properties
        }
      });
    }

    if (!seen.has(bId)) {
      seen.add(bId);
      elements.push({
        data: {
          id: bId,
          label: b.properties.name || b.properties.text,
          ...b.properties
        }
      });
    }

    elements.push({
      data: {
        id: rId,
        source: aId,
        target: bId,
        label: r.type,
        ...r.properties
      }
    });
  }

  return NextResponse.json(elements);
}

// app/api/graph/route.ts
import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j/queries";
import { GRAPH_QUERIES, GraphQueryKey } from "@/lib/graphQueries";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
  const view = (searchParams.get("view") ?? "default") as GraphQueryKey;

  const cypher = GRAPH_QUERIES[view];


  if (!cypher) {
    return NextResponse.json(
      { error: "Unknown graph view" },
      { status: 400 }
    );
  }
//note - I don't think that this is checking the right thing. maybe should be uuid here? Where is the thing that calls for this?
  const params: Record<string, any> = {};
  const name = searchParams.get("name");
  if (name) params.name = name; // this will replace $name in the query

  const elements = await runQuery(cypher,params);

  return NextResponse.json(elements); 
}

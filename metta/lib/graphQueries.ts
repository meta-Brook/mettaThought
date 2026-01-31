export type GraphQueryKey =
  | "default"
  | "people"
  | "concept"
  | "claim";

export const GRAPH_QUERIES: Record<GraphQueryKey, string> = {
  default: `
    MATCH (s)-[r]->(t)
    RETURN s, r, t
  `,

  people: `
    MATCH (s:Person{name:$name})-[r]->(t)
    RETURN s, r, t
  `,

  concept: `
    MATCH (s:Concept{text: $name})-[r]->(t)
    RETURN s, r, t
  `,

  claim:`
  MATCH (s:Claim{text: $name})-[r]->(t)
    RETURN s, r, t
   `
};

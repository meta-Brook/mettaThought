//normalizer
import { Record } from "neo4j-driver"
import { EdgeResult } from "./types"

export function normalize(record: Record): EdgeResult {
  const s = record.get("s")
  const r = record.get("r")
  const t = record.get("t")


  const result =  {
    source: {
      uuid: s.properties.uuid,
      kind: s.labels,
      label: s.properties.name ??
       s.properties.text ??
        "connector"
    },
    relationship: r,
    target: {
      uuid: t.properties.uuid,
      kind: t.labels,
      label: t.properties.name ??
       t.properties.text ??
        "connector"
    },
  }

if (!result.source.label) {
  console.log("Node without label:", result.source);
}

if (!result.target.label) {
  console.log("Node without label:", result.target);
}
  return result;
}

//single node type
export type CNode = {
  uuid: string
  kind: string
  label: string
}
//relationship type
export type EdgeResult = {
  source: CNode
  relationship: string
  target: CNode
}
               
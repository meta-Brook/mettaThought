// app/page.tsx
import { runQuery } from "@/lib/neo4j2";
import EntryForm from "./components/EntryForm"
import View from "./components/View"

export default async function HomePage() {
  // Run a simple query to fetch your Argument nodes
  const records = await runQuery(`
    MATCH (a:Argument)
    RETURN a
    LIMIT 10
  `);

  // Extract the properties from each record
  const argumentsList = records.map(record => record.get("a").properties);

  
  return (
    <div>
      <h1>Add new entry</h1>
      
    
      <div>
        <EntryForm rel='none' val='none' />
      </div>
    </div>
  );
}

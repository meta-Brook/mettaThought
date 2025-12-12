// app/page.tsx
import { runQuery } from "@/lib/neo4j";
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
      <h1>Arguments</h1>
      <ul>
        {argumentsList.map((arg, index) => (
          <li key={index}>
            <strong>{arg.name}</strong>: {arg.description}
          </li>
        ))}
      </ul>
      <div>
        <View label='test' relationship='PRO'/>
      </div>
      <div>
        <EntryForm />
      </div>
    </div>
  );
}

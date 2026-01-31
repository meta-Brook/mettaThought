// app/page.tsx

import EntryForm from "./components/EntryForm"
import GraphView from "./components/GraphView"

export default async function HomePage() {
  console.log("main page open");

  
  return (
    <div>
      <h1>Add new entry</h1>
      
    
      <div>
        <EntryForm rel='none' val='none' />
      <GraphView />
      </div>
    </div>
  );
}

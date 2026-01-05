// app/page.tsx

import EntryForm from "./components/EntryForm"
import GraphView from "./components/GraphView"

export default async function HomePage() {


  
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

// app/page.tsx

import EntryForm from "./components/EntryForm"


export default async function HomePage() {


  
  return (
    <div>
      <h1>Add new entry</h1>
      
    
      <div>
        <EntryForm rel='none' val='none' />
      </div>
    </div>
  );
}

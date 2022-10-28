import React from "react";
import PayloadCard from "./components/PayloadCard";
import data from './missions.json';

function App() {
  return (
    <div className="mx-10">
      <PayloadCard missions={data.data.missions}/>
    </div>
  );
}

export default App;

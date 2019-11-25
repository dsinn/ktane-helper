import React from 'react';
import './App.css';
import ButtonModule from "./components/ButtonModule";
import WiresModule from "./components/WiresModule";

function App() {
  return (
    <div className="App">
      <header>
         <h1>Keep Talking and Nobody Explodes</h1>
      </header>

      <WiresModule id="sectionWires" />
      <ButtonModule id="sectionButton" />
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import ButtonModule from "./components/ButtonModule";
import KeypadsModule from "./components/KeypadsModule";
import WiresModule from "./components/WiresModule";

function App() {
  return (
    <div className="App">
      <header>
         <h1>Keep Talking and Nobody Explodes</h1>
      </header>

      <WiresModule id="sectionWires" />
      <ButtonModule id="sectionButton" />
      <KeypadsModule id="sectionKeypads" />
    </div>
  );
}

export default App;

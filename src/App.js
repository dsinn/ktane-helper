import React from 'react';
import './App.css';
import WiresModule from "./components/WiresModule";

function App() {
  return (
    <div className="App">
      <header>
         <h1>Keep Talking and Nobody Explodes</h1>
      </header>

      <WiresModule id='sectionWires' />
    </div>
  );
}

export default App;

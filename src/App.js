import React from 'react';
import './App.css';
import ButtonModule from "./components/ButtonModule";
import KeypadsModule from "./components/KeypadsModule";
import SimonSaysModule from "./components/SimonSaysModule";
import WhosOnFirstModule from "./components/WhosOnFirstModule";
import WiresModule from "./components/WiresModule";
import MemoryModule from "./components/MemoryModule";
import MorseCodeModule from './components/MorseCodeModule';
import WireSequencesModule from './components/WireSequencesModule';
import ComplicatedWiresModule from './components/ComplicatedWiresModule';
import PasswordsModule from './components/PasswordsModule';

function App() {
  const modules = {
    sectionWires: WiresModule,
    sectionButton: ButtonModule,
    sectionKeypads: KeypadsModule,
    sectionSimon: SimonSaysModule,
    sectionWhosOnFirst: WhosOnFirstModule,
    sectionMemory: MemoryModule,
    sectionMorseCode: MorseCodeModule,
    sectionWireSequences: WireSequencesModule,
    sectionComplicatedWires: ComplicatedWiresModule,
    sectionPasswords: PasswordsModule
  };

  return (
    <div className="App">
      <nav>
        <ul id="navList">
          {
            Object.entries(modules).map(([id, component]) => {
              return (
                <li key={`nav-${id}`}>
                  <a href={`#${id}`}>{component.getTitle()}</a>
                </li>
              );
            })
          }
        </ul>
      </nav>

      <header>
         <h1>Keep Talking and Nobody Explodes</h1>
      </header>

      {
        Object.entries(modules).map(
          ([id, component]) => React.createElement(component, {id: id, key: id})
        )
      }
    </div>
  );
}

export default App;

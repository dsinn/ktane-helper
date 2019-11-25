import KtaneModule from "./KtaneModule";
import React from "react";
import "../css/WiresModule.css";

export default class WiresModule extends KtaneModule {

  constructor(props) {
    super(props);

    this.addWire = this.addWire.bind(this);
    this.deleteWires = this.deleteWires.bind(this);

    this.classNameEven = "even";
    this.classNameOdd = "odd";

    this.colourRed = "red";
    this.colourYellow = "yellow";
    this.colourBlue = "blue";
    this.colourWhite = "white";
    this.colourBlack = "black";

    this.allColours = [this.colourRed, this.colourYellow, this.colourBlue, this.colourWhite, this.colourBlack];
  }

  addWire(event) {
    const colour = event.target.dataset.colour;

    this.setState(state => {
      state.counts[colour]++;

      return {
        counts: state.counts,
        wires: this.computeWiresToCut(state.counts, [...state.wires, {
          colour,
          cutFlags: [],
          shouldCut: false
        }])
      };
    });
  }

  computeWiresToCut(counts, wires) {
    this.resetWiresToCut(wires);

    const lastColour = wires.slice(-1).colour;

    switch (wires.length) {
      case 3: {
        if (!counts.red) {
          this.flagWireForCutting(wires, 2);
        } else if (lastColour === this.colourWhite) {
          this.flagWireForCutting(wires, wires.length);
        } else if (counts.blue > 1) {
          this.flagWireForCutting(wires, this.getLastIndexOfColour(wires, this.colourBlue));
        } else {
          this.flagWireForCutting(wires, wires.length);
        }
        break;
      }
      case 4: {
        const isOddPossible = counts.red > 1;
        if (isOddPossible) {
          this.flagWireForCutting(wires, this.getLastIndexOfColour(wires, this.colourRed), this.classNameOdd);
        }

        if ((lastColour === this.colourYellow && counts.red) || counts.blue === 1) {
          this.flagWireForCutting(wires, 1, isOddPossible ? this.classNameEven : null);
        } else if (counts.yellow > 1) {
          this.flagWireForCutting(wires, wires.length, isOddPossible ? this.classNameEven : null);
        } else {
          this.flagWireForCutting(wires, 2, isOddPossible ? this.classNameEven : null);
        }
        break;
      }
      case 5: {
        const isOddPossible = lastColour === 'black';
        if (isOddPossible) {
          this.flagWireForCutting(wires, 4, this.classNameOdd);
        }

        if (counts.red === 1 && counts.yellow > 1) {
          this.flagWireForCutting(wires, 1, isOddPossible ? this.classNameEven : null);
        } else if (!counts.black) {
          this.flagWireForCutting(wires, 2, isOddPossible ? this.classNameEven : null);
        } else {
          this.flagWireForCutting(wires, 1, isOddPossible ? this.classNameEven : null);
        }
        break;
      }
      case 6: {
        const isOddPossible = !counts.yellow;
        if (isOddPossible) {
          this.flagWireForCutting(wires, 3, this.classNameOdd);
        }

        if (counts.yellow === 1 && counts.white > 1) {
          this.flagWireForCutting(wires, 4, isOddPossible ? this.classNameEven : null);
        } else if (!counts.red) {
          this.flagWireForCutting(wires, wires.length, isOddPossible ? this.classNameEven : null);
        } else {
          this.flagWireForCutting(wires, 4, isOddPossible ? this.classNameEven : null);
        }
        break;
      }
      default: {
        break;
      }
    }

    return wires;
  }

  deleteWires(event) {
    const wireIndex = parseInt(event.target.dataset.index, 10);

    this.setState(state => {
      state.wires.splice(wireIndex).forEach(wire => {
        state.counts[wire.colour]--;
      });

      return {
        counts: state.counts,
        wires: this.computeWiresToCut(state.counts, state.wires)
      };
    });
  }

  flagWireForCutting(wires, oneIndex, extraFlag) {
    const zeroIndex = oneIndex - 1;

    wires[zeroIndex].shouldCut = true;

    if (extraFlag) {
      wires[zeroIndex].cutFlags.push(extraFlag);
    }
  }

  getLastIndexOfColour(wires, colour) {
    for (let i = wires.length - 1; i >= 0; i--) {
      if (wires[i].colour === colour) {
        return i + 1;
      }
    }
    return -1;
  }

  getTitle() {
    return "Wires";
  }

  mainRender() {
    return (
      <>
        <ul>
          {
            this.allColours.map(colour => (
              <li key={`option_${colour}`}>
                <button className={`button ${colour}`} data-colour={colour} onClick={this.addWire} />
              </li>
            ))
          }
        </ul>

        <ul id="wireList">
          {
            this.state.wires.map((wire, index) => (
              <li className={`${wire.shouldCut ? "wireToCut" : ""} ${wire.cutFlags.join(" ")}`} key={index}>
                <button className={`button ${wire.colour}`} data-index={index} onClick={this.deleteWires} />
              </li>
            ))
          }
        </ul>
      </>
    )
  }

  resetState() {
    this.state = {
      // @TODO Convert this.allColours to a constant that is available here, i.e., before the constructor's super call
      counts: ["red", "yellow", "blue", "white", "black"].reduce((counts, colour) => {
        counts[colour] = 0;
        return counts;
      }, {}),
      wires: []
    };
  }

  resetWiresToCut(wires) {
    wires.forEach(wire => {
      wire.cutFlags = [];
      wire.shouldCut = false;
    });
  }
}

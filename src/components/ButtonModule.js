import ButtonModuleColourInput from "./ButtonModuleColourInput";
import ButtonModuleTextInput from "./ButtonModuleTextInput";
import KtaneModule from "./KtaneModule";
import React from "react";
import "../css/ButtonModule.css";

export default class ButtonModule extends KtaneModule {
  constructor(props) {
    super(props);

    this.colourBlue = "blue";
    this.colourWhite = "white";
    this.colourYellow = "yellow";
    this.colourRed = "red";
    this.allColours = [this.colourBlue, this.colourWhite, this.colourYellow, this.colourRed];

    this.textAbort = "Abort";
    this.textDetonate = "Detonate";
    this.textHold = "Hold";
    this.textPress = "Press";
    this.allText = [this.textAbort, this.textDetonate, this.textHold, this.textPress];

    this.setColour = this.setColour.bind(this);
    this.setText = this.setText.bind(this);
  }

  getInstruction() {
    if (this.state.text === this.textDetonate) {
      return <>If 2+ 🔋, press and release.<br />Otherwise, hold button.</>;
    } else if (this.state.colour === this.colourWhite) {
      return <>
        If <span className="litIndicator" title="Lit indicator">CAR</span>, hold button.<br />
        Otherwise, if 3+ 🔋 and <span className="litIndicator" title="Lit indicator">FRK</span>, press and release.<br />
        Otherwise, hold button.
      </>;
    } else if ((this.state.colour === this.colourBlue && this.state.text === this.textAbort) || this.state.colour === this.colourYellow) {
      return "Hold button.";
    } else if (this.state.colour === this.colourRed && this.state.text === this.textHold) {
      return "Press and release.";
    } else {
      return <>
        If 3+ 🔋 and <span className="litIndicator" title="Lit indicator">FRK</span>, press and release the button.
        <br />Otherwise, hold button.
      </>;
    }
  }

  getTitle() {
    return "Button";
  }

  mainRender() {
    return (
      <>
        <div>
          Colour:
          {
            this.allColours.map(colour => (
              <ButtonModuleColourInput
                key={colour}
                onChange={this.setColour}
                stateValue={this.state.colour}
                value={colour}
              />
            ))
          }
        </div>

        <div>
          Text:
          {
            this.allText.map(text => (
              <ButtonModuleTextInput
                key={text}
                onChange={this.setText}
                stateValue={this.state.text}
                value={text}
              />
            ))
          }
        </div>

        <div className="instruction">{this.getInstruction()}</div>

        <div>
          If holding button, release when the timer contains the digit that corresponds to the strip colour:
          <ul>
            <li><span className="button blue">Blue</span>: &nbsp; 4</li>
            <li><span className="button yellow">Yellow</span>: 5</li>
            <li><span className="button">Other</span>: &nbsp;1</li>
          </ul>
        </div>
      </>
    )
  }

  getInitialState() {
    // @TODO Put string literals into constants
    return {
      colour: "blue",
      text: "Abort"
    };
  }

  setColour(event) {
    this.setState({colour: event.target.value});
  }

  setText(event) {
    this.setState({text: event.target.value});
  }
}

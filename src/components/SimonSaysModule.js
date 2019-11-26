import KtaneModule from "./KtaneModule";
import React from "react";
import "../css/SimonSaysModule.css";

export default class SimonSaysModule extends KtaneModule {
  constructor(props) {
    super(props);

    this.arrowsWithoutVowel = [
      ["RB", "BY", "YR"],
      ["GY", "YG"],
      ["RY", "BG", "GB", "YR"],
    ];
    this.arrowsWithVowel = [
      ["RB", "BR", "GY", "YG"],
      ["RY", "BG", "GB", "YR"],
      ["RG", "BR", "GY", "YB"],
    ];

    this.setStrikes = this.setStrikes.bind(this);
    this.toggleVowel = this.toggleVowel.bind(this);
  }

  computeArrowsShown(state) {
    return (state.hasVowel ? this.arrowsWithVowel : this.arrowsWithoutVowel)[this.state.strikes];
  }

  getInitialState() {
    return {
      hasVowel: false,
      strikes: 0
    };
  }

  getTitle() {
    return "Simon Says";
  }

  mainRender() {
    return (
      <>
        <div id="simonInputs">
          <label>
            <input type="checkbox" onChange={this.toggleVowel} /> Vowel
          </label>

          <ul>
            {
              [...Array(3).keys()].map(i => (
                <li key={i}>
                  <label>
                    <input type="radio" checked={this.state.strikes === i} onChange={this.setStrikes} value={i} />
                    {i} strikes
                  </label>
                </li>
              ))
            }
          </ul>
        </div>

        <div id="simonBoard">
          <div className="simonRow">
            <div className="simonBlue">&nbsp;</div>
            <div className="simonYellow">&nbsp;</div>
          </div>
          <div className="simonRow">
            <div className="simonRed">&nbsp;</div>
            <div className="simonGreen">&nbsp;</div>
          </div>
          {
            this.computeArrowsShown(this.state).map(arrow => (
              <div className="arrow" id={`arrow${arrow}`} key={arrow} />
            ))
          }
        </div>
      </>
    )
  }

  setStrikes(event) {
    this.setState({strikes: parseInt(event.currentTarget.value, 10)})
  }

  toggleVowel(event) {
    this.setState(state => ({hasVowel: !state.hasVowel}));
  }
}

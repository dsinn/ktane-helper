import KtaneModule from "./KtaneModule";
import React from "react";
import "../css/WhosOnFirstModule.css";

export default class WhosOnFirstModule extends KtaneModule {
  static getTitle() {
    return "Who\u2019s On First?";
  }

  constructor(props) {
    super(props);

    const
      TL = "top-left",
      TR = "top-right",
      ML = "middle-left",
      MR = "middle-right",
      BL = "bottom-left",
      BR = "bottom-right";

    this.displays = {
      "\u00a0": BL,
      "BLANK": MR,
      "C": TR,
      "CEE": BR,
      "DISPLAY": BR,
      "FIRST": TR,
      "HOLD ON": BR,
      "LEAD": BR,
      "LED": ML,
      "LEED": BL,
      "NO": BR,
      "NOTHING": ML,
      "OKAY": TR,
      "READ": MR,
      "RED": MR,
      "REED": BL,
      "SAYS": BR,
      "SEE": BR,
      "U": TL,
      "UR": TL,
      "THEIR": MR,
      "THERE": BR,
      "THEY ARE": ML,
      "THEY'RE": BL,
      "YES": ML,
      "YOU": MR,
      "YOU ARE": BR,
      "YOUR": MR,
      "YOU'RE": MR
    };

    this.sequences = {
      "BLANK": "WAIT, RIGHT, OKAY, MIDDLE, BLANK",
      "DONE": "SURE, UH HUH, NEXT, WHAT?, YOUR, UR, YOU'RE, HOLD, LIKE, YOU, U, YOU ARE, UH UH, DONE",
      "FIRST": "LEFT, OKAY, YES, MIDDLE, NO, RIGHT, NOTHING, UHHH, WAIT, READY, BLANK, WHAT, PRESS, FIRST",
      "HOLD": "YOU ARE, U, DONE, UH UH, YOU, UR, SURE, WHAT?, YOU'RE, NEXT, HOLD",
      "LEFT": "RIGHT, LEFT",
      "LIKE": "YOU'RE, NEXT, U, UR, HOLD, DONE, UH UH, WHAT?, UH HUH, YOU, LIKE",
      "MIDDLE": "BLANK, READY, OKAY, WHAT, NOTHING, PRESS, NO, WAIT, LEFT, MIDDLE",
      "NEXT": "WHAT?, UH HUH, UH UH, YOUR, HOLD, SURE, NEXT",
      "NO": "BLANK, UHHH, WAIT, FIRST, WHAT, READY, RIGHT, YES, NOTHING, LEFT, PRESS, OKAY, NO",
      "NOTHING": "UHHH, RIGHT, OKAY, MIDDLE, YES, BLANK, NO, PRESS, LEFT, WHAT, WAIT, FIRST, NOTHING",
      "OKAY": "MIDDLE, NO, FIRST, YES, UHHH, NOTHING, WAIT, OKAY",
      "PRESS": "RIGHT, MIDDLE, YES, READY, PRESS",
      "READY": "YES, OKAY, WHAT, MIDDLE, LEFT, PRESS, RIGHT, BLANK, READY",
      "RIGHT": "YES, NOTHING, READY, PRESS, NO, WAIT, WHAT, RIGHT",
      "SURE": "YOU ARE, DONE, LIKE, YOU'RE, YOU, HOLD, UH HUH, UR, SURE",
      "U": "UH HUH, SURE, NEXT, WHAT?, YOU'RE, UR, UH UH, DONE, U",
      "UH HUH": "UH HUH",
      "UH UH": "UR, U, YOU ARE, YOU'RE, NEXT, UH UH",
      "UHHH": "READY, NOTHING, LEFT, WHAT, OKAY, YES, RIGHT, NO, PRESS, BLANK, UHHH",
      "UR": "DONE, U, UR",
      "WAIT": "UHHH, NO, BLANK, OKAY, YES, LEFT, FIRST, PRESS, WHAT, WAIT",
      "WHAT": "UHHH, WHAT",
      "WHAT?": "YOU, HOLD, YOU'RE, YOUR, U, DONE, UH UH, LIKE, YOU ARE, UH HUH, UR, NEXT, WHAT?",
      "YES": "OKAY, RIGHT, UHHH, MIDDLE, FIRST, WHAT, PRESS, READY, NOTHING, YES",
      "YOU ARE": "YOUR, NEXT, LIKE, UH HUH, WHAT?, DONE, UH UH, HOLD, YOU, U, YOU'RE, SURE, UR",
      "YOU": "SURE, YOU ARE, YOUR, YOU'RE, NEXT, UH HUH, UR, HOLD, WHAT?, YOU",
      "YOU'RE": "YOU, YOU'RE",
      "YOUR": "UH UH, YOU ARE, UH HUH, YOUR"
    };

    this.setSubstring = this.setSubstring.bind(this);
  }

  getInitialState() {
    return {
      substring: ""
    };
  }

  mainRender() {
    return (
      <>
        <div>
          <input
            aria-label={`${this.constructor.getTitle()} query`}
            onChange={this.setSubstring}
            type="text"
            value={this.state.substring}
          />
        </div>

        <dl>
          {
            Object.entries(this.displays).map(([display, position]) => {
              return <React.Fragment key={display}>
                <dt className={!this.state.substring || display.startsWith(this.state.substring) ? '' : 'inactive'}>
                  {display}
                </dt>
                <dd>{position}</dd>
              </React.Fragment>;
            })
          }
        </dl>

        <table>
          <tbody>
          {
            Object.entries(this.sequences).map(([button, sequence]) => {
              return <React.Fragment key={button}>
                <tr className={!this.state.substring || button.startsWith(this.state.substring) ? '' : 'inactive'}>
                  <th>"{button}":</th>
                  <td>{sequence}</td>
                </tr>
              </React.Fragment>;
            })
          }
          </tbody>
        </table>
      </>
    )
  }

  setSubstring(event) {
    this.setState({substring: event.currentTarget.value.toUpperCase()});
  }
}

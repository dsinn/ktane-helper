import KtaneModule from "./KtaneModule";
import React from "react";
import "../css/ComplicatedWiresModule.css";

export default class ComplicatedWiresModule extends KtaneModule {
  static get labels() {
    return {
      board: [
        'a serial number that ends in an even digit',
        'a parallel port',
        'more than one battery'
      ],
      wire: [
        'Red',
        'Blue',
        'Star',
        'LED'
      ]
    }
  }

  static getTitle() {
    return "Complicated Wires";
  }

  computeCutMap() {
    const S = 0;
    const P = 1;
    const B = 2;

    return [
      true,                 // Nothing
      this.state.board[S],  // Red
      this.state.board[S],  // Blue
      this.state.board[S],  // Blue & Red
      true,                 // Star
      true,                 // Star & Red
      false,                // Star & Blue
      this.state.board[P],  // Star & Blue & Red
      false,                // LED
      this.state.board[B],  // LED & Red
      this.state.board[P],  // LED & Blue
      this.state.board[S],  // LED & Blue & Red
      this.state.board[B],  // LED & Star
      this.state.board[B],  // LED & Star & Red
      this.state.board[P],  // LED & Star & Blue
      false                 // LED & Star & Blue & Red
    ];
  }

  constructor(props) {
    super(props);

    this.toggleState = this.toggleState.bind(this);
  }

  getInitialState() {
    return Object.fromEntries(
      Object.entries(this.constructor.labels).map(
        ([group, labels]) => [
          group,
          Array(labels.length).fill(false)
        ]
      )
    );
  }

  mainRender() {
    const wireFlags = this.state.wire.reduce((sum, checked, index) => sum + ((checked | 0) << index), 0);

    return <>
      {
        Object.entries({
          "The board has…": "board",
          "Wire properties (optional)": "wire"
        }).map(([heading, group]) => (
          <React.Fragment key={group}>
            <h3>{heading}</h3>
            <ul>
              {
                this.state[group].map((checked, index) => (
                  <li key={`${group}-${index}`}>
                    <label>
                      <input
                        checked={checked}
                        data-group={group}
                        data-index={index}
                        onChange={this.toggleState}
                        type="checkbox"
                      />
                      {this.constructor.labels[group][index]}
                    </label>
                  </li>
                ))
              }
            </ul>
          </React.Fragment>
        ))
      }

      {
        Object.entries({
          "Wires to cut": true,
          "Wires to <u>not</u> cut": false
        }).map(([heading, targetCut]) => (
          <React.Fragment key={heading}>
            <h3 dangerouslySetInnerHTML={{__html: `${heading}:`}} />
            <table>
              <tbody>
                {
                  this.computeCutMap().map((shouldCut, flags) => (
                    (targetCut === shouldCut) &&
                      <tr className={wireFlags === flags ? "marked" : ""} key={flags}>
                        <td className={flags & 1 ? "red" : ""}></td>
                        <td className={flags & 2 ? "blue" : ""}></td>
                        <td>{flags & 4 ? "⭐️" : ""}</td>
                        <td>{flags & 8 ? "💡" : ""}</td>
                      </tr>
                  ))
                }
              </tbody>
            </table>
          </React.Fragment>
        ))
      }
    </>
  }

  toggleState(event) {
    const elem = event.currentTarget;
    const group = elem.getAttribute('data-group');
    const index = parseInt(elem.getAttribute('data-index'), 10);

    this.setState(prevState => {
      const newFlags = [...prevState[group]];
      newFlags[index] = !newFlags[index];

      return {[group]: newFlags};
    });
  }
}

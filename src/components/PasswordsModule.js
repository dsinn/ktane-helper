import KtaneModule from "./KtaneModule";
import React from "react";
import ResetButton from "./ResetButton";

export default class PasswordsModule extends KtaneModule {
  static get words() {
    return [
      ["about", "after", "again", "below", "could"],
      ["every", "first", "found", "great", "house"],
      ["large", "learn", "never", "other", "place"],
      ["plant", "point", "right", "small", "sound"],
      ["spell", "still", "study", "their", "there"],
      ["these", "thing", "think", "three", "water"],
      ["where", "which", "world", "would", "write"]
    ];
  }

  static getTitle() {
    return "Passwords";
  }

  constructor(props) {
    super(props);

    this.listRef = React.createRef();
    this.resetState = this.resetState.bind(this);
    this.setColumn = this.setColumn.bind(this);
  }

  computeRegex() {
    return new RegExp(`^${this.state.columns.map(letters => letters ? `[${letters}]` : '.').join('')}\$`);
  }

  getInitialState() {
    return {columns: Array(5).fill('')};
  }

  getResetFocusElement() {
    return this.listRef.current.querySelector("input");
  }

  mainRender() {
    const regex = this.computeRegex();

    return (
      <>
        <ResetButton onClick={this.resetState} />

        <ul ref={this.listRef}>
          {
            this.state.columns.map((letters, index) => (
              <li key={index}>
                <input
                  aria-label={`Column ${index + 1} letters`}
                  data-index={index}
                  onChange={this.setColumn}
                  type="text"
                  value={letters}
                />
              </li>
            ))
          }
        </ul>

        <table>
          <tbody>
            {
              this.constructor.words.map((row, index) => (
                <tr key={index}>
                  {
                    row.map(word => (
                      <td className={regex.test(word) ? "" : "inactive"} key={word}>{word}</td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </>
    )
  }

  setColumn(event) {
    const elem = event.currentTarget;
    const index = elem.getAttribute("data-index");

    this.setState(prevState => {
      const columns = [...prevState.columns];
      columns[index] = elem.value.replace(/[^a-z]/i, '').toLowerCase();
      return {columns};
    });
  }
}

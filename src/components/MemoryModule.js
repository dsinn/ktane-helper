import KtaneModule from "./KtaneModule";
import React from "react";
import ResetButton from "./ResetButton";
import "../css/MemoryModule.css";

export default class MemoryModule extends KtaneModule {
  static getTitle() {
    return "Memory";
  }

  constructor(props) {
    super(props);

    const D = 'display';
    const L = 'label';
    const P = 'position';
    this.D = D;
    this.L = L;
    this.P = P;

    // {stage -> {display -> [column, value]} }
    this.displayMap = [
      {
          1: [P, 2],
          2: [P, 2],
          3: [P, 3],
          4: [P, 4]
      },
      {
          1: [L, 4],
          2: [P, stages => stages[0][P]],
          3: [P, 1],
          4: [P, stages => stages[0][P]]
      },
      {
          1: [L, stages => stages[1][L]],
          2: [L, stages => stages[0][P]],
          3: [P, 3],
          4: [L, 4]
      },
      {
          1: [P, stages => stages[0][P]],
          2: [P, 1],
          3: [P, stages => stages[1][P]],
          4: [P, stages => stages[1][P]]
      },
      {
          1: [L, stages => stages[0][L]],
          2: [L, stages => stages[1][L]],
          3: [L, stages => stages[3][L]],
          4: [L, stages => stages[2][L]]
      }
    ];

    this.tbodyRef = React.createRef();

    this.resetState = this.resetState.bind(this);
    this.setNumber = this.setNumber.bind(this);
  }

  getInitialState() {
    return {
      stages: [...Array(5).keys()].map(_ => ({display: '', position: '', label: ''}))
    };
  }

  getResetFocusElement() {
    return this.tbodyRef.current.querySelector(`tr[data-index="0"] input[data-column="${this.D}"]`);
  }

  mainRender() {
    return (
      <>
        <ResetButton onClick={this.resetState} />

        <table>
          <thead>
            <tr>
              <th>Stage</th>
              <th>Display</th>
              <th>Pos.</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody ref={this.tbodyRef}>
            {
              this.state.stages.map((values, index) => {
                return (
                  <tr data-index={index} key={`stage${index + 1}`}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        data-column={this.D}
                        maxLength="1"
                        onChange={this.setNumber}
                        type="text"
                        value={values.display}
                      />
                    </td>
                    <td>
                      <input
                        data-column={this.P}
                        maxLength="1"
                        onChange={this.setNumber}
                        type="text"
                        value={values.position}
                      />
                    </td>
                    <td>
                      <input
                        data-column={this.L}
                        maxLength="1"
                        onChange={this.setNumber}
                        type="text"
                        value={values.label}
                      />
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </>
    )
  }

  setNumber(event) {
    let value = event.currentTarget.value;
    if (!/^[1-4]*$/.test(value)) {
      return;
    }
    value = parseInt(value, 10);

    const row = event.currentTarget.closest('[data-index]');
    const index = row.getAttribute('data-index');
    const column = event.currentTarget.getAttribute('data-column');

    this.setState(prevState => {
      const newStages = [...prevState.stages];
      newStages[index][column] = value;

      if (column === this.D) {
        const [column2, value2] = this.displayMap[index][value];
        newStages[index][column2] = typeof value2 === 'function' ? value2(newStages) : value2;
        row.querySelector(`input[data-column="${column2 === this.P ? this.L : this.P}"]`).focus();
      } else if (row.nextSibling) {
        row.nextSibling.querySelector(`input[data-column="${this.D}"]`).focus();
      }

      return {stages: newStages};
    });
  }
}

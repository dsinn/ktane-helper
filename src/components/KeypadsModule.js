import KtaneModule from "./KtaneModule";
import React from "react";
import ResetButton from "./ResetButton";
import "../css/KeypadsModule.css";

export default class KeypadsModule extends KtaneModule {
  constructor(props) {
    super(props);

    this.resetState = this.resetState.bind(this);
    this.toggleHighlight = this.toggleHighlight.bind(this);
  }

  computeKeyColumnMap() {
    const map = {};

    this.state.columns.forEach((column, index) => {
      column.keys.forEach(key => {
        if (!map.hasOwnProperty(key)) {
          map[key] = [];
        }
        map[key].push(index);
      });
    });

    return map;
  }

  getInitialState() {
    return {
      columns: [
        {
          highlightCount: 0,
          keys: ["balloon", "at", "upsidedowny", "squigglyn", "squidknife", "hookn", "leftc"]
        },
        {
          highlightCount: 0,
          keys: ["euro", "balloon", "leftc", "cursive", "hollowstar", "hookn", "questionmark"]
        },
        {
          highlightCount: 0,
          keys: ["copyright", "pumpkin", "cursive", "doublek", "meltedthree", "upsidedowny", "hollowstar"]
        },
        {
          highlightCount: 0,
          keys: ["six", "paragraph", "bt", "squidknife", "doublek", "questionmark", "smileyface"]
        },
        {
          highlightCount: 0,
          keys: ["pitchfork", "smileyface", "bt", "rightc", "paragraph", "dragon", "filledstar"]
        },
        {
          highlightCount: 0,
          keys: ["six", "euro", "tracks", "ae", "pitchfork", "nwithhat", "omega"]
        }
      ],
      highlights: {
        ae: false,
        at: false,
        balloon: false,
        bt: false,
        copyright: false,
        cursive: false,
        doublek: false,
        dragon: false,
        euro: false,
        filledstar: false,
        hollowstar: false,
        hookn: false,
        leftc: false,
        meltedthree: false,
        paragraph: false,
        pumpkin: false,
        questionmark: false,
        rightc: false,
        six: false,
        smileyface: false,
        squidknife: false,
        squigglyn: false,
        upsidedowny: false
      }
    };
  }

  getTitle() {
    return "Keypads";
  }

  mainRender() {
    return (
      <>
        <ResetButton onClick={this.resetState} />
        {
          this.state.columns.map((column, index) => {
            return <ul className={column.highlightCount === 4 ? "matching" : ""} key={index}>
              {
                column.keys.map(key => {
                  return (
                    <li
                      className={this.state.highlights[key] ? "selected" : ""}
                      data-key={key}
                      key={key}
                      onClick={this.toggleHighlight}
                    >
                      <img alt={key} height="64" width="64" src={`keypads/${key}.png`}/>
                    </li>
                  );
                })
              }
            </ul>;
          })
        }
      </>
    )
  }

  toggleHighlight(event) {
    this.keyColumnMap = this.keyColumnMap || this.computeKeyColumnMap();

    const key = event.currentTarget.dataset.key;

    this.setState(state => {
      const step = state.highlights[key] ? -1 : 1;

      this.keyColumnMap[key].forEach(columnIndex => {
        state.columns[columnIndex].highlightCount += step;
      });

      state.highlights[key] = !state.highlights[key];
      return state;
    });
  }
}

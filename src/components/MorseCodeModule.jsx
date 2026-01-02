import KtaneModule from "./KtaneModule";
import React from "react";
import "../css/MorseCodeModule.css";

export default class MorseCodeModule extends KtaneModule {
  static getTitle() {
    return "Morse Code";
  }

  constructor(props) {
    super(props);

    this.freqs = {
      shell: '3.505',
      halls: '3.515',
      slick: '3.522',
      trick: '3.532',
      boxes: '3.535',
      leaks: '3.542',
      strobe: '3.545',
      bistro: '3.552',
      flick: '3.555',
      bombs: '3.565',
      'break': '3.572',
      brick: '3.575',
      steak: '3.582',
      sting: '3.592',
      vector: '3.595',
      beats: '3.600'
    };

    this.codes = {
      '.-':   'a',
      '-...': 'b',
      '-.-.': 'c',
      '.':    'e',
      '..-.': 'f',
      '--.':  'g',
      '....': 'h',
      '..':   'i',
      '-.-':  'k',
      '.-..': 'l',
      '--':   'm',
      '-.':   'n',
      '---':  'o',
      '.-.':  'r',
      '...':  's',
      '-':    't',
      '...-': 'v',
      '-..-': 'x'
    };
    this.codeRegex = new RegExp(
      ` *(?<![.-])(${Object.keys(this.codes).join('|').replace(/\./g, '\\.')})(?![.-]) *`,
      'g'
    );
    this.codeRegexReplacer = (_match, code) => this.codes[code];

    this.setInput = this.setInput.bind(this);
  }

  mainRender() {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Freq</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.entries(this.freqs).map(([word, freq]) => {
                return (
                  <tr className={this.state.regexes.every(regex => regex.test(word)) ? "" : "inactive"} key={word}>
                    <td>{word}</td>
                    <td>{freq}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        <div>
          <label>
            <div>Morse code substrings</div>
            <div><textarea id="morseInput" rows="7" cols="40" onChange={this.setInput}></textarea></div>
          </label>
        </div>
      </>
    )
  }

  getInitialState() {
    return {
      input: '',
      regexes: []
    };
  }

  setInput(event) {
    const lines = event.currentTarget.value.split('\n');
    const regexes = lines.filter(Boolean).map(
      line => {
        const transformedRegex = line.replace(this.codeRegex, this.codeRegexReplacer).replace(/ /g, '');
        try {
          return new RegExp(transformedRegex);
        } catch (error) {
          console.log(`Morse module line "${line}" was transformed to the invalid regex: ${transformedRegex}`);
          return null;
        }
      }
    );

    this.setState({input: event.currentTarget.value, regexes: regexes.filter(Boolean)});
  }
}

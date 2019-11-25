import PropTypes from 'prop-types';
import React, {Component} from "react";

export default class ButtonModuleColourInput extends Component {
  render() {
    return (
      <label>
        <input
          checked={this.props.stateColour === this.props.colour}
          name="buttonColour"
          onChange={this.props.onChange}
          type="radio"
          value={this.props.colour}
        />
        <span className={`button ${this.props.colour}`}>
          {this.props.colour.charAt(0).toUpperCase() + this.props.colour.slice(1)}
        </span>
      </label>
    )
  }

  shouldComponentUpdate(nextProps) {
    return this.props.stateColour !== nextProps.stateColour;
  }
}

ButtonModuleColourInput.propTypes = {
  colour: PropTypes.string,
  onChange: PropTypes.func,
  stateColour: PropTypes.string
};

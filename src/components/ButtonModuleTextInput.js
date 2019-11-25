import PropTypes from 'prop-types';
import React, {Component} from "react";

export default class ButtonModuleTextInput extends Component {
  render() {
    return (
      <label>
        <input
          checked={this.props.stateText === this.props.text}
          onChange={this.props.onChange}
          type="radio"
          value={this.props.text}
        />
        {this.props.text}
      </label>
    )
  }

  shouldComponentUpdate(nextProps) {
    return this.props.stateText !== nextProps.stateText;
  }
}

ButtonModuleTextInput.propTypes = {
  onChange: PropTypes.func,
  stateText: PropTypes.string,
  text: PropTypes.string
};

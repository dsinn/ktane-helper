import PropTypes from 'prop-types';
import React, {Component} from "react";

export default class ButtonModuleTextInput extends Component {
  getLabelContent() {
    return this.props.value;
  }

  render() {
    return (
      <label>
        <input
          checked={this.props.stateValue === this.props.value}
          onChange={this.props.onChange}
          type="radio"
          value={this.props.value}
        />
        {this.getLabelContent()}
      </label>
    )
  }

  shouldComponentUpdate(nextProps) {
    return this.props.stateValue !== nextProps.stateValue;
  }
}

ButtonModuleTextInput.propTypes = {
  onChange: PropTypes.func,
  stateValue: PropTypes.string,
  value: PropTypes.string
};

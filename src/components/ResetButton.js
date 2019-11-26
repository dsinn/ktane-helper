import PropTypes from "prop-types";
import React, {Component} from "react";
import "../css/ResetButton.css";

export default class ResetButton extends Component {
  render() {
    return <button className="jsResetSection" onClick={this.props.onClick}>Reset</button>;
  }
}

ResetButton.propTypes = {
  onClick: PropTypes.func
};

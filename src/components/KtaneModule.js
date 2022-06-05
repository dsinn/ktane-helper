import PropTypes from "prop-types";
import React, {Component} from "react";

class KtaneModule extends Component {
  static getTitle() {
    throw new Error("getTitle() not implemented.");
  }

  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.resetState = this.resetState.bind(this);
  }

  getInitialState() {
    throw new Error("getInitialState() not implemented.");
  }

  getResetFocusElement() {
    return null;
  }

  mainRender() {
    throw new Error("mainRender() not implemented.");
  }

  render() {
    return (
      <section id={this.props.id}>
        <h2>{this.constructor.getTitle()}</h2>

        {this.mainRender()}
      </section>
    );
  }

  resetState() {
    this.setState(this.getInitialState());
    this.getResetFocusElement()?.focus();
  }
}

KtaneModule.propTypes = {
  id: PropTypes.string
};

export default KtaneModule;

import PropTypes from "prop-types";
import React, {Component} from "react";

class KtaneModule extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.resetState = this.resetState.bind(this);
  }

  getInitialState() {
    throw new Error("getInitialState() not implemented.");
  }

  getTitle() {
    throw new Error("getTitle() not implemented.");
  }

  mainRender() {
    throw new Error("mainRender() not implemented.");
  }

  render() {
    return (
      <section id={this.props.id}>
        <h2>{this.getTitle()}</h2>

        {this.mainRender()}
      </section>
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }
}

KtaneModule.propTypes = {
  id: PropTypes.string
};

export default KtaneModule;

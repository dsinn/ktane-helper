import PropTypes from "prop-types";
import React, {Component} from "react";

class KtaneModule extends Component {
  constructor(props) {
    super(props);

    this.resetState();
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
    throw new Error("mainRender() not implemented.");
  }
}

KtaneModule.propTypes = {
  id: PropTypes.string
};

export default KtaneModule;

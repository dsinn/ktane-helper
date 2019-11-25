import React from "react";
import ButtonModuleTextInput from "./ButtonModuleTextInput";

export default class ButtonModuleColourInput extends ButtonModuleTextInput {
  getLabelContent() {
    return (
      <span className={`button ${this.props.value}`}>
        {this.props.value.charAt(0).toUpperCase() + this.props.value.slice(1)}
      </span>
    )
  }
}

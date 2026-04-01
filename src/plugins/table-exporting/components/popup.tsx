import { Component, jsx } from "#DCGView";
import { ExportOptions } from "../types";

export function renderPopup(eo: ExportOptions) {
  return <Popup eo={eo} />;
}

export class Popup extends Component<{ eo: ExportOptions }> {
  eo!: ExportOptions;

  init() {
    this.eo = this.props.eo();
  }

  template() {
    return <div class="dsm-export-box">Hallo</div>;
  }
}

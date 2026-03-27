import { Component, jsx } from "#DCGView";
import { DStaticMathquillView, MathQuillConfig } from "./desmosComponents.ts";

export class StaticMathQuillView extends Component<{
  latex: string;
  config?: MathQuillConfig;
}> {
  template() {
    return (
      <DStaticMathquillView
        latex={() => this.props.latex()}
        config={() => this.props.config?.() ?? {}}
      />
    );
  }
}

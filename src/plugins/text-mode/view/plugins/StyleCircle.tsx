import { Component, DCGView } from "#DCGView";
import { ExpressionIconView, ImageIconView } from "#components";
import { ItemModel } from "#globals";
import "./StyleCircle.less";

export default class StyleCircle extends Component<{
  id: string;
  model: ItemModel;
}> {
  template() {
    const model = this.props.model();
    const { type } = model;
    switch (type) {
      case "expression":
        return (
          <ExpressionIconView
            model={DCGView.const(model)}
            controller={DCGView.const(model.controller)}
          />
        );
      case "image":
        return (
          <ImageIconView
            model={DCGView.const(model)}
            controller={DCGView.const(model.controller)}
          />
        );
      default:
        return <div></div>;
    }
  }
}

import { DCGView, MountedComponent } from "#DCGView";
import { EditorView, Panel, showPanel } from "@codemirror/view";
import { FormatPanel } from "./FormatPanel.tsx";

function formatPanel(ev: EditorView): Panel {
  const dom = document.createElement("div");
  let mount: MountedComponent | undefined;
  return {
    dom,
    mount() {
      mount = DCGView.mountToNode(FormatPanel, dom, {
        ev: DCGView.const(ev),
        update: () => mount?.update(),
      });
    },
    update() {},
    destroy() {
      if (dom) DCGView.unmountFromNode(dom);
    },
    top: false,
  };
}

export function formatPanelPlugin() {
  return showPanel.of(formatPanel);
}

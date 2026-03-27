import { createElementWrapped } from "../../preload/replaceElement.ts";
import { Inserter, PluginController } from "../PluginController.ts";
import Tip from "./Tip.tsx";

function apiContainer() {
  return document.querySelector(".dcg-container");
}

export default class ShowTips extends PluginController {
  static id = "show-tips" as const;
  static enabledByDefault = true;

  override afterEnable() {
    apiContainer()?.classList.add("dsm-show-tips");
  }

  override afterDisable() {
    apiContainer()?.classList.remove("dsm-show-tips");
  }

  tipView(): Inserter {
    return () => createElementWrapped(Tip, { st: () => this });
  }
}

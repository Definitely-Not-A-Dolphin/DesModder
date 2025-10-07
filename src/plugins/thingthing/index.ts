import { PluginController } from "../PluginController";

export default class ThingThing extends PluginController {
  static id = "thing-thing" as const;
  static enabledByDefault = true;

  oldName = "";

  afterEnable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) return;
    const text = headerElement.innerText;
    if (text !== undefined) this.oldName = text;
    headerElement.innerText = "DesModder ♥";
  }

  afterDisable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) return;
    headerElement.innerText = this.oldName;
  }
}

function getHeaderElement(): HTMLElement | null {
  return document.querySelector(".header-account-name");
}

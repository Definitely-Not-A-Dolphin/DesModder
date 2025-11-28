import { PluginController } from "../PluginController";
import { configList } from "./config";

export default class ChangeUsername extends PluginController {
  static id = "change-username" as const;
  static enabledByDefault = false;
  static config = configList;

  name = "";

  afterEnable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) return;
    const text = headerElement.innerText;
    if (text !== undefined) this.name = text;
    headerElement.innerText = this.settings.name;
  }

  afterConfigChange() {
    const headerElement = getHeaderElement();
    if (headerElement === null) return;
    headerElement.innerText = this.settings.name;
  }

  afterDisable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) return;
    headerElement.innerText = this.name;
  }
}

function getHeaderElement(): HTMLElement | null {
  return document.querySelector(".dcg-header-bar__account-name");
}

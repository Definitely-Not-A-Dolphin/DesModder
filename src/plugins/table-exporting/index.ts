import { PluginController } from "../PluginController";

export default class TableExporting extends PluginController {
  static id = "table-exporting" as const;
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
  return document
    .getElementsByClassName("dcg-header-bar__account-name")
    .item(0) as HTMLElement | null;
}

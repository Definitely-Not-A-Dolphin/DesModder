import { PluginController } from "../PluginController.ts";
import { Config, configList } from "./config.ts";

export default class quakePro extends PluginController<Config> {
  static id = "quake-pro" as const;
  static enabledByDefault = false;
  static override config = configList;

  dollyMagnification = 1;
  scalarZoomed = 1;

  override afterEnable() {
    this.dollyMagnification = this.settings.dollyMagnification;
    this.scalarZoomed = this.settings.scalarZoomed;
    this.redrawAllLayers();
  }

  override afterConfigChange() {
    this.dollyMagnification = this.settings.dollyMagnification;
    this.scalarZoomed = this.settings.scalarZoomed;
    this.redrawAllLayers();
  }

  override afterDisable() {
    this.dollyMagnification = 1;
    this.scalarZoomed = 1;
    this.redrawAllLayers();
  }

  redrawAllLayers() {
    const { grapher3d } = this.cc;
    if (!grapher3d) return;
    grapher3d.redrawAllLayers();
  }
}

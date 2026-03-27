import {
  AllActions,
  DispatchedEvent,
  ExpressionModel,
  FolderModel,
} from "#globals";
import { Inserter, PluginController } from "../PluginController.ts";
import { Config, configList } from "./config.ts";
import { populateGolfStats } from "./golf-model.ts";
import { GolfStatsPanelFn } from "./GolfStatsPanel.tsx";

declare module "../../globals/extra-actions.ts" {
  interface AllActions {
    "code-golf": {
      type: "dsm-code-golf-enable-despite-length";
      id: string;
    };
  }
}

export default class CodeGolf extends PluginController<Config> {
  static id = "code-golf" as const;
  static enabledByDefault = false;
  static override config = configList;

  expressionItemCostPanel(model: ExpressionModel): Inserter {
    return () => GolfStatsPanelFn(this.cc, model);
  }

  folderCostPanel(model: FolderModel): Inserter {
    return () => GolfStatsPanelFn(this.cc, model);
  }

  override afterConfigChange(): void {}

  override afterEnable() {}

  override afterDisable() {}

  handleDispatchedAction(action: DispatchedEvent) {
    switch (action.type) {
      case "dsm-code-golf-enable-despite-length": {
        const item = this.cc.getItemModel(action.id);
        if (item) {
          item.dsmEnableGolfDespiteLength = true;
        }
        break;
      }
      default:
        action satisfies Exclude<DispatchedEvent, AllActions["code-golf"]>;
        break;
    }
    return undefined;
  }

  afterUpdateTheComputedWorld() {
    populateGolfStats(this);
  }
}

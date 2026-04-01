import { ActionButton } from "src/core-plugins/expr-action-buttons/index.ts";
import { PluginController } from "../PluginController.ts";
import { ItemModel } from "#globals";
import { renderPopup } from "./components/popup.tsx";
import { exportOptions } from "./types.ts";

export default class TableExporting extends PluginController {
  static id = "table-exporting" as const;
  static enabledByDefault = true;

  actionButtons: ActionButton[] = [
    {
      tooltip: "table-exporting-export",
      buttonClass: "dsm-export-table",
      iconClass: "dsm-icon-bookmark",
      onTap: () => renderPopup(exportOptions),
      predicate: (model) => model.type === "table",
    },
  ];

  exportTable(model: ItemModel) {
    if (model.type !== "table") return; // What?
    const almostGoodData: string[][] = [];

    for (const column of model.columns) {
      almostGoodData.push([column.latex ?? "", ...(column.values ?? [])]);
    }

    const tableData = rotate2DArray(almostGoodData);
    console.log(tableData);
  }
}

function rotate2DArray<T>(array2D: T[][]): T[][] {
  const width = array2D.length;
  let height: number = array2D[0].length;
  for (const array of array2D) {
    if (height < array.length) height = array.length;
  }

  const rotated = new Array<T[]>(height);
  for (let y = 0; y < height; y++) {
    rotated[y] = new Array<T>(width);
    for (let x = 0; x < width; x++) {
      rotated[y][x] = array2D[x][height - 1 - y];
    }
  }

  return rotated.reverse();
}

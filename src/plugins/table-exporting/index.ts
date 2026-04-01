import { TableModel } from "#globals";
import { ActionButton } from "src/core-plugins/expr-action-buttons/index.ts";
import { tex2typst } from "tex2typst";
import { PluginController } from "../PluginController.ts";
import { ExportOption } from "./types.ts";

export default class TableExporting extends PluginController {
  static id = "table-exporting" as const;
  static enabledByDefault = true;

  actionButtons: ActionButton[] = [
    {
      tooltip: "table-exporting-export",
      buttonClass: "dsm-export-table",
      iconClass: "dsm-icon-bookmark",
      onTap: (model) => this.exportTable(model as TableModel, "csv"),
      predicate: (model) => model.type === "table",
    },
  ];

  exportTable(model: TableModel, exportOption: ExportOption) {
    let rotatedTable: string[][] = [];

    for (const column of model.columns) {
      rotatedTable.push([column.latex ?? "", ...(column.values ?? [])]);
    }

    // Now rectanglify it
    rotatedTable = rectanglify2Darray(rotatedTable);

    console.log(rotatedTable);

    const adjustedTable = rotate2DArray(rotatedTable);
    void navigator.clipboard.writeText(adjustedTable.toString());

    switch (exportOption) {
      case "csv":
        return toCSV(adjustedTable);
      case "typst":
        return toTypst(adjustedTable);
    }
  }
}

export function toCSV(table: string[][]): string {
  let csvTable = "";
  for (const row of table) {
    for (const element of row) {
      csvTable += element + ",";
    }

    csvTable += "\n";
  }

  return csvTable;
}

export function toTypst(table: string[][]): string {
  let typstTable = `#table(\n\tcolumn: ${table[0].length}\n`;
  for (const row of table) {
    typstTable += "\t";
    let first = true;
    for (const element of row) {
      if (first) {
        typstTable += `[$${tex2typst(element)}$], `;
      }
      typstTable += `[$${element}$], `;
      first = false;
    }

    typstTable += "\n";
  }

  typstTable += "};";

  return typstTable;
}

export function rectanglify2Darray<T>(array2D: T[][]): T[][] {
  // First find the longest column
  let longestColumnLength = array2D[0].length;
  for (const column of array2D) {
    if (column.length > longestColumnLength)
      longestColumnLength = column.length;
  }

  // Then make every column the same size
  for (let column of array2D) {
    column = [...column, ...new Array(longestColumnLength - column.length)];
  }

  return array2D;
}

// Make sure that array2D is rectangular before calling
export function rotate2DArray<T>(array2D: T[][]): T[][] {
  const width = array2D.length;
  const height = array2D[0].length;

  const rotated = new Array<T[]>(height);
  for (let y = 0; y < height; y++) {
    rotated[y] = new Array<T>(width);

    for (let x = 0; x < width; x++) {
      rotated[y][x] = array2D[x][height - y - 1];
    }
  }

  return rotated.reverse();
}

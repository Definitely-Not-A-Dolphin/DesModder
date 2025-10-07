import { PluginController } from "../PluginController";
import { ActionButton } from "../../core-plugins/expr-action-buttons";
import { ItemModel } from "#globals";
import { List } from "#utils/depUtils.ts";
import { AllActions, DispatchedEvent } from "../../globals/extra-actions";

declare module "src/globals/extra-actions" {
  interface AllActions {
    "folder-tools": {
      type:
        | "dsm-folder-tools-folder-dump"
        | "dsm-folder-tools-folder-merge"
        | "dsm-folder-tools-note-enclose";
      index: number;
    };
  }
}

export default class FolderTools extends PluginController {
  static id = "folder-tools" as const;
  static enabledByDefault = true;

  actionButtons: ActionButton[] = [
    {
      tooltip: "folder-tools-enclose",
      buttonClass: "dsm-note-enclose-button",
      iconClass: "dsm-icon-folder-plus",
      onTap: (model) =>
        this.cc.dispatch({
          type: "dsm-folder-tools-note-enclose",
          index: model.index,
        }),
      predicate: (model) => model.type === "text",
    },
    {
      tooltip: "folder-tools-dump",
      buttonClass: "dsm-folder-dump-button",
      iconClass: "dsm-icon-folder-minus",
      onTap: (model) =>
        this.cc.dispatch({
          type: "dsm-folder-tools-folder-dump",
          index: model.index,
        }),
      predicate: (model) =>
        model.type === "folder" &&
        this.cc.getItemModelByIndex(model.index + 1)?.folderId === model.id,
    },
    {
      tooltip: "folder-tools-merge",
      buttonClass: "dsm-folder-merge-button",
      iconClass: "dsm-icon-folder-plus",
      onTap: (model) =>
        this.cc.dispatch({
          type: "dsm-folder-tools-folder-merge",
          index: model.index,
        }),
      predicate: (model) => model.type === "folder",
    },
  ];

  handleDispatchedAction(action: DispatchedEvent) {
    switch (action.type) {
      case "dsm-folder-tools-folder-dump":
        this.folderDump(action.index);
        break;
      case "dsm-folder-tools-folder-merge":
        this.folderMerge(action.index);
        break;
      case "dsm-folder-tools-note-enclose":
        this.noteEnclose(action.index);
        break;
      default:
        action satisfies Exclude<DispatchedEvent, AllActions["folder-tools"]>;
    }
    return undefined;
  }

  private folderDump(folderIndex: number) {
    const folderModel = this.cc.getItemModelByIndex(folderIndex);
    if (!folderModel || folderModel.type !== "folder") return;
    const folderId = folderModel.id;

    // Remove folderId on all of the contents of the folder
    for (
      let currIndex = folderIndex + 1,
        currExpr = this.cc.getItemModelByIndex(currIndex);
      currExpr && currExpr.type !== "folder" && currExpr.folderId === folderId;
      currIndex++, currExpr = this.cc.getItemModelByIndex(currIndex)
    ) {
      currExpr.folderId = undefined;
    }

    // Replace the folder with text that has the same title
    const T = this.cc.createItemModel({
      id: this.cc.generateId(),
      type: "text",
      text: folderModel.title,
    });
    this.cc._toplevelReplaceItemAt(folderIndex, T, true);
  }

  private folderMerge(folderIndex: number) {
    const folderModel = this.cc.getItemModelByIndex(folderIndex);
    const folderId = folderModel?.id;

    // type cast beacuse Desmos has not yet updated types for authorFeatures
    const skipAuthors = !(this.calc.settings as any).authorFeatures;

    let newIndex = folderIndex;
    let currIndex = folderIndex;
    let currExpr: ItemModel | undefined;
    // we might want to delete the folder heading immediately after this folder
    // at most one; keep track if we've seen any expressions since the end of
    // this folder, so we only delete a folder with no expressions in between
    let movedAny = false;
    // Keep track of if we've deleted a folder
    let toDeleteFolderID = "";
    // Place all expressions until the next folder into this folder
    while (true) {
      newIndex++;
      currIndex++;
      currExpr = this.cc.getItemModelByIndex(currIndex);
      if (currExpr === undefined) break;
      // If authorFeatures is disabled, skip secret folders
      if (skipAuthors) {
        while (currExpr?.type === "folder" && currExpr.secret) {
          const secretID: string = currExpr.id;
          do {
            currIndex++;
            currExpr = this.cc.getItemModelByIndex(currIndex);
          } while (
            currExpr &&
            currExpr.type !== "folder" &&
            currExpr.folderId === secretID
          );
        }
        if (currExpr === undefined) break;
      }
      if (currExpr.type === "folder") {
        if (!movedAny) {
          // This is a folder immediately after the end of our starting folder
          // Mark it to delete, and move on.
          newIndex--;
          movedAny = true;
          toDeleteFolderID = currExpr.id;
        } else break;
      } else if (currExpr.folderId !== folderId) {
        if (toDeleteFolderID && !currExpr.folderId) break;
        movedAny = true;
        // Actually move the item into place
        currExpr.folderId = folderId;
        List.moveItemsTo(this.cc.listModel, currIndex, newIndex, 1);
      }
    }
    if (toDeleteFolderID)
      List.removeItemById(this.cc.listModel, toDeleteFolderID);
  }

  private noteEnclose(noteIndex: number) {
    // Replace this note with a folder, then folderMerge
    const noteModel = this.cc.getItemModelByIndex(noteIndex);
    if (!noteModel || noteModel.type !== "text") return;

    const T = this.cc.createItemModel({
      id: this.cc.generateId(),
      type: "folder",
      title: noteModel.text,
    });
    this.cc._toplevelReplaceItemAt(noteIndex, T, true);
    this.folderMerge(noteIndex);
  }
}

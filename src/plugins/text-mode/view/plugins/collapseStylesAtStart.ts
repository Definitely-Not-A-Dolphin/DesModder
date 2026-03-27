import { foldEffect } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { analysisStateField } from "../../LanguageServer.ts";
import { statementsIntersecting } from "../statementIntersection.ts";

function collapsedRanges(state: EditorState) {
  const { program } = state.field(analysisStateField);
  const { from, to } = program.pos;
  const arr = [];
  for (const stmt of statementsIntersecting(program, from, to)) {
    if (stmt.style) {
      const { from, to } = stmt.style.pos;
      arr.push(foldEffect.of({ from, to }));
    }
  }
  return arr;
}

export function collapseStylesAtStart(state: EditorState) {
  return state.update({
    effects: collapsedRanges(state),
  });
}

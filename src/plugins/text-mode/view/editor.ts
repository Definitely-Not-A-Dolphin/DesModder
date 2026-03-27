import TextMode from "../index.ts";
import { analysisStateField, doLint, tmPlugin } from "../LanguageServer.ts";
// Language extension
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { linter } from "@codemirror/lint";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { textMode } from "../lezer/index.ts";
import "./editor.less";
import { checkboxPlugin } from "./plugins/checkboxWidget.ts";
import { collapseStylesAtStart } from "./plugins/collapseStylesAtStart.ts";
import { footerPlugin } from "./plugins/footerWidget.ts";
import { formatPanelPlugin } from "./plugins/formatPanelPlugin.ts";
import { activeStmtGutterHighlighter } from "./plugins/highlightActiveStmtGutter.ts";
import { stmtNumbers } from "./plugins/stmtNumbers.ts";
import { styleCircles } from "./plugins/styleCircles.ts";
import { styleMappingPlugin } from "./plugins/styleMappingWidgets/index.ts";
// Basic editor extensions
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  keymap,
} from "@codemirror/view";

const scrollTheme = EditorView.theme({
  "&": {
    height: "100%",
  },
  ".cm-scroller": {
    overflow: "auto",
  },
});

export function startState(tm: TextMode, text: string) {
  let state = EditorState.create({
    doc: text,
    extensions: [
      analysisStateField,
      EditorView.updateListener.of(tm.onEditorUpdate.bind(tm)),
      // linter, showing errors
      linter(doLint, { delay: 0 }),
      // line numbers and gutter
      stmtNumbers(),
      styleCircles(),
      activeStmtGutterHighlighter,
      // undo/redo history
      history(),
      // fold using arrow in the gutter
      foldGutter(),
      // use custom DOM to support multiple selection ranges
      drawSelection(),
      // allow multiple selection ranges
      EditorState.allowMultipleSelections.of(true),
      // draw cursor at drop position when something is dragged
      // TODO: override vanilla image drop to support dropping images as text
      dropCursor(),
      // reindent (dedent) based on languageData.indentOnInput
      // specifically, it reindents after },),]
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      // show matching brackets
      // TODO: add empty content parse node to support proper matching on (())
      //  It may also help with partial expressions
      bracketMatching(),
      // enable automatic close brackets
      closeBrackets(),
      autocompletion(),
      // highlight the active line
      highlightActiveLine(),
      // highlight text that matches the selection
      highlightSelectionMatches(),
      keymap.of([
        // delete both brackets in the pair if the first gets backspaced on
        ...closeBracketsKeymap,
        // standard keybindings
        // includes comment using Ctrl+/.
        ...defaultKeymap,
        // Ctrl+F to search, and more
        ...searchKeymap,
        // Ctrl+Z to undo, etc.
        ...historyKeymap,
        // fold using keybind Ctrl-Shift-[ and similar
        ...foldKeymap,
        // Ctrl+Space to start completion
        ...completionKeymap,
      ]),
      scrollTheme,
      // syntax highlighting
      textMode(tm),
      // Text mode plugins
      checkboxPlugin,
      styleMappingPlugin,
      footerPlugin(),
      formatPanelPlugin(),
      // Expose the tm plugin to functions that only have a state.
      tmPlugin.of(tm),
    ],
  });
  ({ state } = state.update(collapseStylesAtStart(state)));
  return state;
}

export function initView(tm: TextMode, text: string) {
  return new EditorView({
    state: startState(tm, text),
    parent: document.body,
  });
}

import { Tooltip } from "#components";
import { format } from "#i18n";
import TextMode from "../index.ts";

export function TextModeToggle(tm: TextMode) {
  return (
    <Tooltip
      tooltip={() => format("text-mode-toggle")}
      gravity={() => (tm.cc.isNarrow() ? "n" : "s")}
    >
      <span
        class="dcg-icon-btn dsm-text-mode-toggle"
        handleEvent="true"
        role="button"
        tabindex="0"
        onTap={() => tm.cc.dispatch({ type: "dsm-text-mode-toggle" })}
      >
        <i class="dcg-icon-title" />
      </span>
    </Tooltip>
  );
}
